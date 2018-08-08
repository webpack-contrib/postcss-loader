## Modules

<dl>
<dt><a href="#module_postcss-loader">postcss-loader</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#SyntaxError">SyntaxError</a> ⇐ <code>Error</code></dt>
<dd></dd>
<dt><a href="#Warning">Warning</a> ⇐ <code>Error</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#loader">loader(css, map)</a> ⇒ <code>cb</code></dt>
<dd><p><strong>PostCSS Loader</strong></p>
<p>Loads &amp;&amp; processes CSS with <a href="https://github.com/postcss/postcss">PostCSS</a></p>
</dd>
<dt><a href="#parseOptions">parseOptions(exec, parser, syntax, stringifier, plugins)</a> ⇒ <code>Promise</code></dt>
<dd><p><strong>PostCSS Options Parser</strong></p>
<p>Transforms the loader options into a valid postcss config <code>{Object}</code></p>
</dd>
</dl>

<a name="module_postcss-loader"></a>

## postcss-loader
**Requires**: <code>module:path</code>, <code>module:loader-utils</code>, <code>module:schema-utils</code>, <code>module:postcss</code>, <code>module:postcss-load-config</code>, <code>module:./options.js</code>, <code>module:./Warning.js</code>, <code>module:./SyntaxError.js</code>  
**Version**: 3.0.0  
**Author**: Andrey Sitnik (@ai) <andrey@sitnik.ru>  
**License**: MIT  
<a name="SyntaxError"></a>

## SyntaxError ⇐ <code>Error</code>
**Kind**: global class  
**Extends**: <code>Error</code>  
<a name="new_SyntaxError_new"></a>

### new SyntaxError(err)
**PostCSS Syntax Error**

Loader wrapper for postcss syntax errors


| Param | Type | Description |
| --- | --- | --- |
| err | <code>Object</code> | CssSyntaxError |

<a name="Warning"></a>

## Warning ⇐ <code>Error</code>
**Kind**: global class  
**Extends**: <code>Error</code>  
<a name="new_Warning_new"></a>

### new Warning(warning)
**PostCSS Plugin Warning**

Loader wrapper for postcss plugin warnings (`root.messages`)


| Param | Type | Description |
| --- | --- | --- |
| warning | <code>Object</code> | PostCSS Warning |

<a name="loader"></a>

## loader(css, map) ⇒ <code>cb</code>
**PostCSS Loader**

Loads && processes CSS with [PostCSS](https://github.com/postcss/postcss)

**Kind**: global function  
**Returns**: <code>cb</code> - cb Result  

| Param | Type | Description |
| --- | --- | --- |
| css | <code>String</code> | Source |
| map | <code>Object</code> | Source Map |


* [loader(css, map)](#loader) ⇒ <code>cb</code>
    * [.cb](#loader.cb) : <code>function</code>
    * [.cb](#loader.cb) : <code>function</code>

<a name="loader.cb"></a>

### loader.cb : <code>function</code>
**Kind**: static typedef of [<code>loader</code>](#loader)  

| Param | Type | Description |
| --- | --- | --- |
| null | <code>Object</code> | Error |
| css | <code>String</code> | Result (JS Module) |
| map | <code>Object</code> | Source Map |

<a name="loader.cb"></a>

### loader.cb : <code>function</code>
**Kind**: static typedef of [<code>loader</code>](#loader)  

| Param | Type | Description |
| --- | --- | --- |
| null | <code>Object</code> | Error |
| css | <code>String</code> | Result (Raw Module) |
| map | <code>Object</code> | Source Map |

<a name="parseOptions"></a>

## parseOptions(exec, parser, syntax, stringifier, plugins) ⇒ <code>Promise</code>
**PostCSS Options Parser**

Transforms the loader options into a valid postcss config `{Object}`

**Kind**: global function  
**Returns**: <code>Promise</code> - PostCSS Config  

| Param | Type | Description |
| --- | --- | --- |
| exec | <code>Boolean</code> | Execute CSS-in-JS |
| parser | <code>String</code> \| <code>Object</code> | PostCSS Parser |
| syntax | <code>String</code> \| <code>Object</code> | PostCSS Syntax |
| stringifier | <code>String</code> \| <code>Object</code> | PostCSS Stringifier |
| plugins | <code>Array</code> \| <code>Object</code> \| <code>function</code> | PostCSS Plugins |

