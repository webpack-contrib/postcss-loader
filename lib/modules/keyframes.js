/* eslint-env node */
import postcss from "postcss";
import valueParser from "postcss-value-parser";
import { extractICSS, createICSSRules } from "icss-utils";

const plugin = "postcss-icss-keyframes";

const reserved = [
  "none",
  "inherited",
  "initial",
  "unset",
  /* single-timing-function */
  "linear",
  "ease",
  "ease-in",
  "ease-in-out",
  "ease-out",
  "step-start",
  "step-end",
  "start",
  "end",
  /* single-animation-iteration-count */
  "infinite",
  /* single-animation-direction */
  "normal",
  "reverse",
  "alternate",
  "alternate-reverse",
  /* single-animation-fill-mode */
  "forwards",
  "backwards",
  "both",
  /* single-animation-play-state */
  "running",
  "paused"
];

const badNamePattern = /^[0-9]/;

const defaultGenerator = (name, path) => {
  const sanitized = path
    .replace(/^.*[\/\\]/, "")
    .replace(/[\W_]+/g, "_")
    .replace(/^_|_$/g, "");
  return `__${sanitized}__${name}`;
};

const includes = (array, item) => array.indexOf(item) !== -1;

module.exports = postcss.plugin(plugin, (options = {}) => (css, result) => {
  const generateScopedName = options.generateScopedName || defaultGenerator;
  const { icssImports, icssExports } = extractICSS(css);
  const keyframesExports = Object.create(null);

  css.walkAtRules(/keyframes$/, atrule => {
    const name = atrule.params;
    if (includes(reserved, name)) {
      return result.warn(`Unable to use reserve '${name}' animation name`, {
        node: atrule
      });
    }
    if (badNamePattern.test(name)) {
      return result.warn(`Invalid animation name identifier '${name}'`, {
        node: atrule
      });
    }
    if (icssExports[name]) {
      result.warn(
        `'${name}' identifier is already declared and will be override`,
        { node: atrule }
      );
    }
    const alias =
      keyframesExports[name] ||
      generateScopedName(name, css.source.input.from, css.source.input.css);
    keyframesExports[name] = alias;
    atrule.params = alias;
  });

  css.walkDecls(/animation$|animation-name$/, decl => {
    const parsed = valueParser(decl.value);
    parsed.nodes.forEach(node => {
      const alias = keyframesExports[node.value];
      if (node.type === "word" && Boolean(alias)) {
        node.value = alias;
      }
    });
    decl.value = parsed.toString();
  });

  const exports = Object.assign(icssExports, keyframesExports);
  const messages = Object.keys(exports).map(name => ({
    plugin,
    type: "icss-scoped",
    name,
    value: icssExports[name]
  }));
  css.prepend(createICSSRules(icssImports, exports));
  result.messages.push(...messages);
});
