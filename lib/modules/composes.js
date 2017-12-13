/* eslint-env node */
import postcss from "postcss";
import Tokenizer from "css-selector-tokenizer";
import valueParser from "postcss-value-parser";
import { extractICSS, createICSSRules } from "icss-utils";

const plugin = "postcss-icss-composes";

const flatten = outer => outer.reduce((acc, inner) => [...acc, ...inner], []);

const includes = (array, value) => array.indexOf(value) !== -1;

const isSingular = node => node.nodes.length === 1;

const isLocal = node =>
  node.type === "nested-pseudo-class" && node.name === "local";

const isClass = node => node.type === "class";

const getSelectorIdentifier = selector => {
  if (!isSingular(selector)) {
    return null;
  }
  const [node] = selector.nodes;
  if (isLocal(node)) {
    const local = node.nodes[0];
    if (isSingular(local) && isClass(local.nodes[0])) {
      return local.nodes[0].name;
    }
    return null;
  }
  if (isClass(node)) {
    return node.name;
  }
  return null;
};

const getIdentifiers = (rule, result) => {
  const selectors = Tokenizer.parse(rule.selector).nodes;
  return selectors
    .map(selector => {
      const identifier = getSelectorIdentifier(selector);
      if (identifier === null) {
        result.warn(
          `composition is only allowed in single class selector, not in '${Tokenizer.stringify(selector)}'`,
          { node: rule }
        );
      }
      return identifier;
    })
    .filter(identifier => identifier !== null);
};

const isComposes = node =>
  node.type === "decl" &&
  (node.prop === "composes" || node.prop === "compose-with");

const walkRules = (css, callback) =>
  css.walkRules(rule => {
    if (rule.some(node => isComposes(node))) {
      callback(rule);
    }
  });

const walkDecls = (rule, callback) =>
  rule.each(node => {
    if (isComposes(node)) {
      callback(node);
    }
  });

const isMedia = node =>
  (node.type === "atrule" && node.name === "media") ||
  (node.parent && isMedia(node.parent));

const splitBy = (array, cond) =>
  array.reduce(
    (acc, item) =>
      cond(item)
        ? [...acc, []]
        : [...acc.slice(0, -1), [...acc[acc.length - 1], item]],
    [[]]
  );

const parseComposes = value => {
  const parsed = valueParser(value);
  const [names, path] = splitBy(
    parsed.nodes,
    node => node.type === "word" && node.value === "from"
  );
  return {
    names: names.filter(node => node.type === "word").map(node => node.value),
    path: path &&
      path.filter(node => node.type === "string").map(node => node.value)[0]
  };
};

const combineIntoMessages = (classes, composed) =>
  flatten(
    classes.map(name =>
      composed.map(value => ({
        plugin,
        type: "icss-composed",
        name,
        value
      }))
    )
  );

const invertObject = obj =>
  Object.keys(obj).reduce(
    (acc, key) => Object.assign({}, acc, { [obj[key]]: key }),
    {}
  );

const combineImports = (icss, composed) =>
  Object.keys(composed).reduce(
    (acc, path) =>
      Object.assign({}, acc, {
        [`'${path}'`]: Object.assign(
          {},
          acc[`'${path}'`],
          invertObject(composed[path])
        )
      }),
    Object.assign({}, icss)
  );

const convertMessagesToExports = (messages, aliases) =>
  messages
    .map(msg => msg.name)
    .reduce((acc, name) => (includes(acc, name) ? acc : [...acc, name]), [])
    .reduce(
      (acc, name) =>
        Object.assign({}, acc, {
          [name]: [
            aliases[name] || name,
            ...messages
              .filter(msg => msg.name === name)
              .map(msg => aliases[msg.value] || msg.value)
          ].join(" ")
        }),
      {}
    );

const getScopedClasses = messages =>
  messages
    .filter(msg => msg.type === "icss-scoped")
    .reduce(
      (acc, msg) => Object.assign({}, acc, { [msg.name]: msg.value }),
      {}
    );

module.exports = postcss.plugin(plugin, () => (css, result) => {
  const scopedClasses = getScopedClasses(result.messages);
  const composedMessages = [];
  const composedImports = {};

  let importedIndex = 0;
  const getImportedName = (path, name) => {
    if (!composedImports[path]) {
      composedImports[path] = {};
    }
    if (composedImports[path][name]) {
      return composedImports[path][name];
    }
    const importedName = `__composed__${name}__${importedIndex}`;
    composedImports[path][name] = importedName;
    importedIndex += 1;
    return importedName;
  };

  const { icssImports, icssExports } = extractICSS(css);

  walkRules(css, rule => {
    const classes = getIdentifiers(rule, result);
    if (isMedia(rule)) {
      result.warn(
        "composition cannot be conditional and is not allowed in media queries",
        { node: rule }
      );
    }
    walkDecls(rule, decl => {
      const { names, path } = parseComposes(decl.value);
      const composed = path
        ? names.map(name => getImportedName(path, name))
        : names;
      composedMessages.push(...combineIntoMessages(classes, composed));
      decl.remove();
    });
  });

  const composedExports = convertMessagesToExports(
    composedMessages,
    scopedClasses
  );
  const exports = Object.assign({}, icssExports, composedExports);
  const imports = combineImports(icssImports, composedImports);
  css.prepend(createICSSRules(imports, exports));
  result.messages.push(...composedMessages);
});
