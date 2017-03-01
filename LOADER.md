<a name="loader"></a>

## loader(css, map) ⇒ <code>cb</code>
PostCSS Loader

> Loads && processes CSS with [PostCSS](https://github.com/postcss/postcss)

**Kind**: global function  
**Returns**: <code>cb</code> - cb      Result  
**Requires**: <code>module:path</code>, <code>module:loader-utils</code>, <code>module:schema-utils</code>, <code>module:postcss</code>, <code>module:postcss-load-config</code>, <code>module:Error</code>  
**Version**: 2.0.0  
**Author**: Andrey Sitnik (@ai) <andrey@sitnik.ru>  
**License**: MIT  

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
| result | <code>String</code> | Result (JS Module) |
| map | <code>Object</code> | Source Map |

<a name="loader.cb"></a>

### loader.cb : <code>function</code>
**Kind**: static typedef of [<code>loader</code>](#loader)  

| Param | Type | Description |
| --- | --- | --- |
| null | <code>Object</code> | Error |
| css | <code>String</code> | Result (Raw Module) |
| map | <code>Object</code> | Source Map |

