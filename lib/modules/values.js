/* eslint-env node */
import postcss from "postcss";
import valueParser from "postcss-value-parser";
import {
  replaceSymbols,
  replaceValueSymbols,
  extractICSS,
  createICSSRules
} from "icss-utils";
import findLastIndex from "lodash/findLastIndex";
import dropWhile from "lodash/dropWhile";
import dropRightWhile from "lodash/dropRightWhile";
import fromPairs from "lodash/fromPairs";

const plugin = "postcss-modules-values";

const chunkBy = (collection, iteratee) =>
  collection.reduce(
    (acc, item) =>
      iteratee(item)
        ? [...acc, []]
        : [...acc.slice(0, -1), [...acc[acc.length - 1], item]],
    [[]]
  );

const isWord = node => node.type === "word";

const isDiv = node => node.type === "div";

const isSpace = node => node.type === "space";

const isNotSpace = node => !isSpace(node);

const isFromWord = node => isWord(node) && node.value === "from";

const isAsWord = node => isWord(node) && node.value === "as";

const isComma = node => isDiv(node) && node.value === ",";

const isColon = node => isDiv(node) && node.value === ":";

const isInitializer = node => isColon(node) || isSpace(node);

const trimNodes = nodes => dropWhile(dropRightWhile(nodes, isSpace), isSpace);

const getPathValue = nodes =>
  nodes.length === 1 && nodes[0].type === "string" ? nodes[0].value : null;

const expandValuesParentheses = nodes =>
  nodes.length === 1 && nodes[0].type === "function" && nodes[0].value === ""
    ? nodes[0].nodes
    : nodes;

const getAliasesPairs = valuesNodes =>
  chunkBy(expandValuesParentheses(valuesNodes), isComma).map(pairNodes => {
    const nodes = pairNodes.filter(isNotSpace);
    if (nodes.length === 1 && isWord(nodes[0])) {
      return [nodes[0].value, nodes[0].value];
    }
    if (
      nodes.length === 3 &&
      isWord(nodes[0]) &&
      isAsWord(nodes[1]) &&
      isWord(nodes[2])
    ) {
      return [nodes[0].value, nodes[2].value];
    }
    return null;
  });

const parse = value => {
  const parsed = valueParser(value).nodes;
  const fromIndex = findLastIndex(parsed, isFromWord);
  if (fromIndex === -1) {
    if (parsed.length > 2 && isWord(parsed[0]) && isInitializer(parsed[1])) {
      return {
        type: "value",
        name: parsed[0].value,
        value: valueParser.stringify(trimNodes(parsed.slice(2)))
      };
    }
    return null;
  }
  const pairs = getAliasesPairs(trimNodes(parsed.slice(0, fromIndex)));
  const path = getPathValue(trimNodes(parsed.slice(fromIndex + 1)));
  if (pairs.every(Boolean) && path) {
    return {
      type: "import",
      pairs,
      path
    };
  }
  return null;
};

const isForbidden = name => name.includes(".") || name.includes("#");

const createGenerator = (i = 0) => name =>
  `__value__${name.replace(/\W/g, "_")}__${i++}`;

const getScopedAliases = (messages, values) =>
  fromPairs(
    messages
      .filter(msg => msg.type === "icss-scoped")
      .map(msg => [msg.value, values[msg.name]])
  );

const getMessages = exports =>
  Object.keys(exports).map(name => ({
    plugin: "postcss-icss-values",
    type: "icss-value",
    name,
    value: exports[name]
  }));

module.exports = postcss.plugin(plugin, () => (css, result) => {
  const { icssImports, icssExports } = extractICSS(css);
  const valuesExports = {};
  const getAliasName = createGenerator();
  const addExports = (node, name, value) => {
    if (isForbidden(name)) {
      result.warn(`Dot and hash symbols are not allowed in value "${name}"`, {
        node
      });
    }
    if (valuesExports[name]) {
      result.warn(`"${name}" value already declared`, { node });
    }
    valuesExports[name] = replaceValueSymbols(value, valuesExports);
  };

  css.walkAtRules("value", atrule => {
    if (atrule.params.indexOf("@value") !== -1) {
      result.warn(`Invalid value definition "${atrule.params}"`, {
        node: atrule
      });
    } else {
      const parsed = parse(atrule.params);
      if (parsed) {
        if (parsed.type === "value") {
          const { name, value } = parsed;
          addExports(atrule, name, value);
        }
        if (parsed.type === "import") {
          const pairs = parsed.pairs.map(([imported, local]) => {
            const alias = getAliasName(local);
            addExports(atrule, local, alias);
            return [alias, imported];
          });
          const aliases = fromPairs(pairs);
          icssImports[parsed.path] = Object.assign(
            {},
            icssImports[parsed.path],
            aliases
          );
        }
      } else {
        result.warn(`Invalid value definition "${atrule.params}"`, {
          node: atrule
        });
      }
    }
    atrule.remove();
  });

  const scopedAliases = getScopedAliases(result.messages, valuesExports);

  replaceSymbols(css, Object.assign({}, valuesExports, scopedAliases));

  Object.keys(icssExports).forEach(key => {
    icssExports[key] = replaceValueSymbols(icssExports[key], scopedAliases);
  });

  css.prepend(
    createICSSRules(icssImports, Object.assign({}, icssExports, valuesExports))
  );

  result.messages.push(...getMessages(valuesExports));
});
