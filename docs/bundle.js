/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(9);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Template {
  constructor(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    this.fragment = template.content;
  }

  clone() {
    return this.fragment.cloneNode(true);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Template;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(24);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"sourceMap":true,"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./slide.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./slide.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__picture_html__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__picture_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__picture_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Template__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_cloudinary__ = __webpack_require__(26);




const template = new __WEBPACK_IMPORTED_MODULE_1__Template__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__picture_html___default.a);

class Picture {
  constructor(cloudinaryObj) {
    this.cloudinaryObj = cloudinaryObj;
  }

  create(cloudinaryObj) {
    let pictureHTML = '';

    for(let i=0; i < cloudinaryObj.aspectRatios.length; i++) {
      
      // regualr image
      const imgOptions = `${cloudinaryObj.options},ar_${cloudinaryObj.aspectRatios[i]},w_${cloudinaryObj.breakpoints[i]}`;
      const imgUrl = Object(__WEBPACK_IMPORTED_MODULE_2__services_cloudinary__["a" /* getUrl */])(cloudinaryObj.fileName, imgOptions);
      
      // 2x image
      const retinaOptions = `${cloudinaryObj.options},ar_${cloudinaryObj.aspectRatios[i]},w_${cloudinaryObj.breakpoints[i] * 2}`;
      const retinaUrl = Object(__WEBPACK_IMPORTED_MODULE_2__services_cloudinary__["a" /* getUrl */])(cloudinaryObj.fileName, retinaOptions);

      if(i < cloudinaryObj.aspectRatios.length - 1) {
        
        // if this is NOT the last image in the array, output the <source> element
        pictureHTML += `<source media="(min-width: ${cloudinaryObj.breakpoints[(i + 1)]}px)" srcset=${imgUrl}, ${retinaUrl} 2x">`;
      } else {

        // if this IS the last image, output the <img> element
        pictureHTML += `<img srcset="${imgUrl}, ${retinaUrl} 2x" alt="${cloudinaryObj.alt}"><figcaption>${cloudinaryObj.alt}</figcaption>`;
      }
    }
    return pictureHTML;
  }

  render() {
    const dom = template.clone();
  
    dom.querySelector('picture').innerHTML = this.create(this.cloudinaryObj);

    return dom;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Picture;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(29);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"sourceMap":true,"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./portland.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./portland.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__reset_css__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__reset_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__reset_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__main_css__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__main_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__main_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_app_App__ = __webpack_require__(12);





const root = document.getElementById('root');
const app = new __WEBPACK_IMPORTED_MODULE_2__components_app_App__["a" /* default */]();
root.appendChild(app.render());

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(8);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"sourceMap":true,"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js??ref--1-1!../node_modules/postcss-loader/lib/index.js??ref--1-2!./reset.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js??ref--1-1!../node_modules/postcss-loader/lib/index.js??ref--1-2!./reset.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\nhtml, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, img, ins, kbd, q, s, samp, small, strike, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {\n\tmargin: 0;\n\tpadding: 0;\n\tborder: 0;\n\tfont-size: 100%;\n\tfont: inherit;\n\tvertical-align: baseline;\n}\n\n/* HTML5 display-role reset for older browsers */\n\narticle, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {\n\tdisplay: block;\n}\n\nbody {\n\tline-height: 1;\n}\n\nnav ol, nav ul {\n\tlist-style: none;\n}\n\nblockquote, q {\n\tquotes: none;\n}\n\nblockquote:before, blockquote:after, q:before, q:after {\n\tcontent: '';\n\tcontent: none;\n}\n\ntable {\n\tborder-collapse: collapse;\n\tborder-spacing: 0;\n}", "", {"version":3,"sources":["/Users/ivanlimongan/Documents/401/art-gallery/reset.css"],"names":[],"mappings":"AAAA;;;EAGE;;AAEF;CAaC,UAAU;CACV,WAAW;CACX,UAAU;CACV,gBAAgB;CAChB,cAAc;CACd,yBAAyB;CACzB;;AACD,iDAAiD;;AACjD;CAEC,eAAe;CACf;;AACD;CACC,eAAe;CACf;;AACD;CACC,iBAAiB;CACjB;;AACD;CACC,aAAa;CACb;;AACD;CAEC,YAAY;CACZ,cAAc;CACd;;AACD;CACC,0BAA0B;CAC1B,kBAAkB;CAClB","file":"reset.css","sourcesContent":["/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\nhtml, body, div, span, applet, object, iframe,\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\na, abbr, acronym, address, big, cite, code,\ndel, dfn, img, ins, kbd, q, s, samp,\nsmall, strike, sub, sup, tt, var,\nb, u, i, center,\ndl, dt, dd, ol, ul, li,\nfieldset, form, label, legend,\ntable, caption, tbody, tfoot, thead, tr, th, td,\narticle, aside, canvas, details, embed, \nfigure, figcaption, footer, header, hgroup, \nmenu, nav, output, ruby, section, summary,\ntime, mark, audio, video {\n\tmargin: 0;\n\tpadding: 0;\n\tborder: 0;\n\tfont-size: 100%;\n\tfont: inherit;\n\tvertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure, \nfooter, header, hgroup, menu, nav, section {\n\tdisplay: block;\n}\nbody {\n\tline-height: 1;\n}\nnav ol, nav ul {\n\tlist-style: none;\n}\nblockquote, q {\n\tquotes: none;\n}\nblockquote:before, blockquote:after,\nq:before, q:after {\n\tcontent: '';\n\tcontent: none;\n}\ntable {\n\tborder-collapse: collapse;\n\tborder-spacing: 0;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 9 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"sourceMap":true,"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js??ref--1-1!../node_modules/postcss-loader/lib/index.js??ref--1-2!./main.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js??ref--1-1!../node_modules/postcss-loader/lib/index.js??ref--1-2!./main.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "section {\n  color: #c95151;\n}\nhtml {height: 100%;}\nbody {\n  /* font-family: 'Work Sans', sans-serif; */\n  font-family: 'Inconsolata', monospace;\n  font-weight: 400;\n  color: #000000;\n  min-height: 100%;\n}\np {\n  margin-bottom: 1.3em;\n  line-height: 1.7;\n}\n/* Font sizing from http://type-scale.com/ */\nh1, h2, h3, h4 {\n  /* margin: 1em 0 0.5em; */\n  line-height: 1.1;\n  letter-spacing: 2px;\n  text-transform: uppercase;\n  padding: 0 0 1rem 0;\n  color: #000000;\n  font-weight: 700;\n  font-family: 'Work Sans', sans-serif;\n}\nh1 {\n  margin-top: 0;\n  font-size: 3.598em;\n}\nh2 {font-size: 2.827em;}\nh3 {font-size: 1.999em;}\nh4 {font-size: 1.414em;}\nfigcaption, small, .font_small {font-size: 0.8em; padding: 0 0 2rem; font-weight: 500;}\n/* hide screen-reader only text. https://webaim.org/techniques/css/invisiblecontent/ */\n.clip {\n  position: absolute !important;\n  clip: rect(1px 1px 1px 1px); /* IE6, IE7 */\n  clip: rect(1px, 1px, 1px, 1px);\n}\nimg {\n  display: block;\n  width: 100%;\n  height: auto;\n}\na {\n  text-decoration: none;\n  color: #0d415f;\n  -webkit-transition: 0.3s ease all;\n  transition: 0.3s ease all;\n  padding: 0 0 3px;\n  border-bottom: 3px solid #ffffff;\n}\na:hover {\n  color: #0d415f;\n  border-bottom: 3px solid #0d415f;\n}\n/*  -------- Media Queries ------- */\n/* Mobile */\n@media only screen and (min-width: 320px) and (max-width: 480px) {\n  h1 {\n    margin-top: 0;\n    font-size: 2.074em;\n  }\n  \n  h2 {\n    font-size: 1.728em;\n  }\n  \n  h3 {\n    font-size: 1.44em;\n  }\n  \n  h4 {\n    font-size: 1.2em;\n  }\n}\n/* Tablet */\n@media only screen and (min-width: 480px) and (max-width: 800px) {\n  h1 {\n      font-size: 2.957em;\n  }\n\n  h2 {\n      font-size: 2.369em;\n  }\n\n  h3 {\n      font-size: 1.777em;\n  }\n\n  h4 {\n      font-size: 1.333em;\n  }\n}", "", {"version":3,"sources":["/Users/ivanlimongan/Documents/401/art-gallery/components/variables.css","/Users/ivanlimongan/Documents/401/art-gallery/main.css"],"names":[],"mappings":"AAYA;EACE,eAAe;CAChB;ACZD,MAAM,aAAa,CAAC;AAEpB;EACE,2CAA2C;EAC3C,sCAAsC;EACtC,iBAAiB;EACjB,eAAc;EACd,iBAAiB;CAClB;AAED;EACE,qBAAqB;EACrB,iBAAiB;CAClB;AAED,6CAA6C;AAC7C;EACE,0BAA0B;EAC1B,iBAAiB;EACjB,oBAAoB;EACpB,0BAA0B;EAC1B,oBAAoB;EACpB,eAAc;EACd,iBAAiB;EACjB,qCAAqC;CACtC;AAED;EACE,cAAc;EACd,mBAAmB;CACpB;AAED,IAAI,mBAAmB,CAAC;AAExB,IAAI,mBAAmB,CAAC;AAExB,IAAI,mBAAmB,CAAC;AAExB,gCAAgC,iBAAiB,CAAC,kBAAkB,CAAC,iBAAiB,CAAC;AAEvF,uFAAuF;AACvF;EACE,8BAA8B;EAC9B,4BAA4B,CAAC,cAAc;EAC3C,+BAA+B;CAChC;AAED;EACE,eAAe;EACf,YAAY;EACZ,aAAa;CACd;AAED;EACE,sBAAsB;EACtB,eAAa;EACb,kCAA0B;EAA1B,0BAA0B;EAC1B,iBAAiB;EACjB,iCAAgC;CACjC;AAED;EACE,eAAa;EACb,iCAA+B;CAChC;AAED,qCAAqC;AAErC,YAAY;AACZ;EACE;IACE,cAAc;IACd,mBAAmB;GACpB;;EAED;IACE,mBAAmB;GACpB;;EAED;IACE,kBAAkB;GACnB;;EAED;IACE,iBAAiB;GAClB;CACF;AAED,YAAY;AACZ;EACE;MACI,mBAAmB;GACtB;;EAED;MACI,mBAAmB;GACtB;;EAED;MACI,mBAAmB;GACtB;;EAED;MACI,mBAAmB;GACtB;CACF","file":"main.css","sourcesContent":["$accent: #c95151;\n$link: #0d415f;\n$darklink: #007BC2;\n$lightgray: #eeeeee;\n$darkgray: #444140;\n$white: #ffffff;\n$gray: #E0E0E0;\n$black: #000000;\n\n$maxViewportSize: 1280px;\n$padding: 2rem;\n\nsection {\n  color: #c95151;\n}","@import './components/variables.css';\n\nhtml {height: 100%;}\n\nbody {\n  /* font-family: 'Work Sans', sans-serif; */\n  font-family: 'Inconsolata', monospace;\n  font-weight: 400;\n  color: $black;\n  min-height: 100%;\n}\n\np {\n  margin-bottom: 1.3em;\n  line-height: 1.7;\n}\n\n/* Font sizing from http://type-scale.com/ */\nh1, h2, h3, h4 {\n  /* margin: 1em 0 0.5em; */\n  line-height: 1.1;\n  letter-spacing: 2px;\n  text-transform: uppercase;\n  padding: 0 0 1rem 0;\n  color: $black;\n  font-weight: 700;\n  font-family: 'Work Sans', sans-serif;\n}\n\nh1 {\n  margin-top: 0;\n  font-size: 3.598em;\n}\n\nh2 {font-size: 2.827em;}\n\nh3 {font-size: 1.999em;}\n\nh4 {font-size: 1.414em;}\n\nfigcaption, small, .font_small {font-size: 0.8em; padding: 0 0 2rem; font-weight: 500;}\n\n/* hide screen-reader only text. https://webaim.org/techniques/css/invisiblecontent/ */\n.clip {\n  position: absolute !important;\n  clip: rect(1px 1px 1px 1px); /* IE6, IE7 */\n  clip: rect(1px, 1px, 1px, 1px);\n}\n\nimg {\n  display: block;\n  width: 100%;\n  height: auto;\n}\n\na {\n  text-decoration: none;\n  color: $link;\n  transition: 0.3s ease all;\n  padding: 0 0 3px;\n  border-bottom: 3px solid $white;\n}\n\na:hover {\n  color: $link;\n  border-bottom: 3px solid $link;\n}\n\n/*  -------- Media Queries ------- */\n\n/* Mobile */\n@media only screen and (min-width: 320px) and (max-width: 480px) {\n  h1 {\n    margin-top: 0;\n    font-size: 2.074em;\n  }\n  \n  h2 {\n    font-size: 1.728em;\n  }\n  \n  h3 {\n    font-size: 1.44em;\n  }\n  \n  h4 {\n    font-size: 1.2em;\n  }\n}\n\n/* Tablet */\n@media only screen and (min-width: 480px) and (max-width: 800px) {\n  h1 {\n      font-size: 2.957em;\n  }\n\n  h2 {\n      font-size: 2.369em;\n  }\n\n  h3 {\n      font-size: 1.777em;\n  }\n\n  h4 {\n      font-size: 1.333em;\n  }\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Template__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_html__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__app_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_css__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__app_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__header_Header__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__home_Home__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__portland_Portland__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__brooklyn_Brooklyn__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__footer_Footer_js__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__dom__ = __webpack_require__(36);










const template = new __WEBPACK_IMPORTED_MODULE_0__Template__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__app_html___default.a);

// Hash Navigation
const map = new Map();
map.set('#portland', __WEBPACK_IMPORTED_MODULE_5__portland_Portland__["a" /* default */]);
map.set('#brooklyn', __WEBPACK_IMPORTED_MODULE_6__brooklyn_Brooklyn__["a" /* default */]);

class App {

  constructor() {
    this.hashChange = () => this.setPage();
    window.addEventListener('hashchange', this.hashChange);
  }
  
  setPage() {
    const routes = window.location.hash.split('/');
    const page = routes[0];
    if(page === this.page) return;

    // if(this.pageComponent) this.pageComponent.unrender();
    this.page = page;
    const Component = map.get(this.page) || __WEBPACK_IMPORTED_MODULE_4__home_Home__["a" /* default */];
    this.pageComponent = new Component();
    Object(__WEBPACK_IMPORTED_MODULE_8__dom__["a" /* removeChildren */])(this.main);
    this.main.appendChild(this.pageComponent.render());
  }

  render() {
    const dom = template.clone();   
      
    dom.querySelector('header').appendChild(new __WEBPACK_IMPORTED_MODULE_3__header_Header__["a" /* default */]().render());
    dom.querySelector('footer').appendChild(new __WEBPACK_IMPORTED_MODULE_7__footer_Footer_js__["a" /* default */]().render());

    this.main = dom.querySelector('main');
    this.setPage();

    return dom;
  }

  unrender() {
    window.removeEventListener('hashchange', this.hashChange);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = App;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "<header role=\"banner\" id=\"header\"></header>\n\n<main role=\"main\" id=\"main\" class=\"content\"></main>\n\n<footer role=\"contentinfo\" id=\"footer\"></footer>";

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(15);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"sourceMap":true,"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./app.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./app.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "section {\n  color: #c95151;\n}\n#root {\n  min-height: 100vh;\n  display: grid;\n  grid-template-areas:\n  \"header\"\n  \"content\"\n  \"footer\";\n  grid-template-rows: auto 1fr auto;\n}\n.maxwidth-wrap {\n  /* width: 100%; */\n  max-width: 1280px;\n  margin: 0 auto;\n}\n#header {\n  grid-area: header;\n  /* background: $white; */\n  /* color: $black; */\n  padding: 2rem;\n  text-align: center;\n}\n#main {\n  grid-area: content;\n  /* background: $black; */\n}\n#footer {\n  grid-area: footer;\n  text-align: center;\n  padding: 2rem 2rem 1rem;\n  /* background: $black; */\n}", "", {"version":3,"sources":["/Users/ivanlimongan/Documents/401/variables.css","/Users/ivanlimongan/Documents/401/art-gallery/app.css"],"names":[],"mappings":"AAYA;EACE,eAAe;CAChB;ACZD;EACE,kBAAkB;EAClB,cAAc;EACd;;;WAGS;EACT,kCAAkC;CACnC;AAED;EACE,kBAAkB;EAClB,kBAA4B;EAC5B,eAAe;CAChB;AAED;EACE,kBAAkB;EAClB,yBAAyB;EACzB,oBAAoB;EACpB,cAAkB;EAClB,mBAAmB;CACpB;AAED;EACE,mBAAmB;EACnB,yBAAyB;CAC1B;AAED;EACE,kBAAkB;EAClB,mBAAmB;EACnB,wBAAwB;EACxB,yBAAyB;CAC1B","file":"app.css","sourcesContent":["$accent: #c95151;\n$link: #0d415f;\n$darklink: #007BC2;\n$lightgray: #eeeeee;\n$darkgray: #444140;\n$white: #ffffff;\n$gray: #E0E0E0;\n$black: #000000;\n\n$maxViewportSize: 1280px;\n$padding: 2rem;\n\nsection {\n  color: #c95151;\n}","@import '../variables.css';\n\n#root {\n  min-height: 100vh;\n  display: grid;\n  grid-template-areas:\n  \"header\"\n  \"content\"\n  \"footer\";\n  grid-template-rows: auto 1fr auto;\n}\n\n.maxwidth-wrap {\n  /* width: 100%; */\n  max-width: $maxViewportSize;\n  margin: 0 auto;\n}\n\n#header {\n  grid-area: header;\n  /* background: $white; */\n  /* color: $black; */\n  padding: $padding;\n  text-align: center;\n}\n\n#main {\n  grid-area: content;\n  /* background: $black; */\n}\n\n#footer {\n  grid-area: footer;\n  text-align: center;\n  padding: 2rem 2rem 1rem;\n  /* background: $black; */\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__header_html__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__header_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__header_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__header_css__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__header_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__header_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Template__ = __webpack_require__(2);




const template = new __WEBPACK_IMPORTED_MODULE_2__Template__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__header_html___default.a);

class Header {

  render() {
    const dom = template.clone();

    return dom;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Header;


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = "<section class=\"maxwidth-wrap header-flex\">\n  <div>\n    <a href=\"#home\" class=\"logo-text\" alt=\"Go to Home page\">Mural — Collective</a>\n  </div>\n  <nav role=\"navigation\">\n    <ul class=\"ulist\">\n      <li><a href=\"#home\" alt=\"Go to  page\">00 - MAIN</a></li>\n      <li><a href=\"#portland\" alt=\"Go to portland page\">01 - PDX</a></li>\n      <li><a href=\"#brooklyn\" alt=\"Go to brooklyn page\">02 - BKYLN</a></li>\n    </ul>\n  </nav>\n</section>";

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(19);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"sourceMap":true,"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js??ref--1-1!../../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./header.css", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js??ref--1-1!../../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./header.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "section {\n  color: #c95151;\n}\n.header-flex {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n.logo {\n  max-width: 21rem;\n}\n.logo-text {\n  font-size: 1.5rem;\n  color: #c95151;\n  font-weight: 700;\n  text-transform: uppercase;\n  font-family: 'Work Sans', sans-serif;\n}\n.ulist {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  margin: 0;\n}\n.ulist li {\n    padding: 0 1rem;\n  }\n.ulist li a {\n      color: #000000;\n      border-bottom: 3px solid #ffffff;\n      -webkit-transition: 0.3s ease all;\n      transition: 0.3s ease all;\n    }\n.ulist li a:hover {\n      border-bottom-color: #0d415f;\n    }\nnav {\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n}\n/*  -------- Media Queries ------- */\n/* Mobile */\n@media only screen and (min-width: 320px) and (max-width: 640px) {\n  .header-flex {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n  }\n\n  .ulist {\n    margin: 1.1rem 0 0;\n  }\n}", "", {"version":3,"sources":["/Users/ivanlimongan/Documents/variables.css","/Users/ivanlimongan/Documents/401/art-gallery/header.css"],"names":[],"mappings":"AAYA;EACE,eAAe;CAChB;ACZD;EACE,qBAAc;EAAd,qBAAc;EAAd,cAAc;EACd,0BAA+B;MAA/B,uBAA+B;UAA/B,+BAA+B;EAC/B,0BAAoB;MAApB,uBAAoB;UAApB,oBAAoB;CACrB;AAED;EACE,iBAAiB;CAClB;AAED;EACE,kBAAkB;EAClB,eAAe;EACf,iBAAiB;EACjB,0BAA0B;EAC1B,qCAAqC;CACtC;AAED;EACE,qBAAc;EAAd,qBAAc;EAAd,cAAc;EACd,yBAAwB;MAAxB,sBAAwB;UAAxB,wBAAwB;EACxB,UAAU;CAYX;AAXC;IACE,gBAAgB;GASjB;AARC;MACE,eAAc;MACd,iCAAgC;MAChC,kCAA0B;MAA1B,0BAA0B;KAC3B;AACD;MACE,6BAA2B;KAC5B;AAIL;EACE,sBAA0B;MAA1B,mBAA0B;UAA1B,0BAA0B;CAC3B;AAED,qCAAqC;AAErC,YAAY;AACZ;EACE;IACE,6BAAuB;IAAvB,8BAAuB;QAAvB,2BAAuB;YAAvB,uBAAuB;GACxB;;EAED;IACE,mBAAmB;GACpB;CACF","file":"header.css","sourcesContent":["$accent: #c95151;\n$link: #0d415f;\n$darklink: #007BC2;\n$lightgray: #eeeeee;\n$darkgray: #444140;\n$white: #ffffff;\n$gray: #E0E0E0;\n$black: #000000;\n\n$maxViewportSize: 1280px;\n$padding: 2rem;\n\nsection {\n  color: #c95151;\n}","@import '../../variables.css';\n\n.header-flex {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.logo {\n  max-width: 21rem;\n}\n\n.logo-text {\n  font-size: 1.5rem;\n  color: $accent;\n  font-weight: 700;\n  text-transform: uppercase;\n  font-family: 'Work Sans', sans-serif;\n}\n\n.ulist {\n  display: flex;\n  justify-content: center;\n  margin: 0;\n  li {\n    padding: 0 1rem;\n    a {\n      color: $black;\n      border-bottom: 3px solid $white;\n      transition: 0.3s ease all;\n    }\n    a:hover {\n      border-bottom-color: $link;\n    }\n  }\n}\n\nnav {\n  justify-content: flex-end;\n}\n\n/*  -------- Media Queries ------- */\n\n/* Mobile */\n@media only screen and (min-width: 320px) and (max-width: 640px) {\n  .header-flex {\n    flex-direction: column;\n  }\n\n  .ulist {\n    margin: 1.1rem 0 0;\n  }\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__home_html__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__home_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__home_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__home_css__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__home_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__home_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__slide_css__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__slide_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__slide_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__picture_Picture__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Template__ = __webpack_require__(2);






const template = new __WEBPACK_IMPORTED_MODULE_4__Template__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__home_html___default.a);

class Home {

  render() {
    const dom = template.clone();

    const hero = new __WEBPACK_IMPORTED_MODULE_3__picture_Picture__["a" /* default */]({
      aspectRatios: ['3:1', '2:1', '1:1'],
      breakpoints: [1100, 900, 500],
      options: 'c_fill,g_auto,q_auto,g_face,f_auto',
      fileName: 'toa-heftiba-417510_cs53kn.jpg',
      alt: 'Bear Mural by Tao Heftiba via Unsplash.com'
    });
    const heroDom = hero.render();


    dom.querySelector('#hero').appendChild(heroDom);

    return dom;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Home;


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = "<article class=\"maxwidth-wrap content-grid\">\n\n  <div id=\"hero\">\n    <div class=\"layer\"><h1>mural — collective</h1></div>\n  </div>\n\n  <section class=\"home-grid\">\n    <div>\n      <h2>Building creative communities one mural at a time.</h2>\n    </div>\n\n    <div>\n      <p><span class=\"sup\">01</span><br>murals in<a href=\"#portland\" alt=\"Go to portland page\"><br>portland</a></p>\n    </div>\n\n    <div>\n      <p><span class=\"sup\">02</span><br>murals in<a href=\"#brooklyn\" alt=\"Go to brooklyn page\"><br>brooklyn</a></p>\n    </div>\n\n  </section>\n\n  <div class=\"cry\">\n    <h2>\"I cry every time I see a mural\" <br><span class=\"cry-sub\">-random bystander</span></h2>\n  </div>\n</article>";

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(23);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"sourceMap":true,"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./home.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js??ref--1-1!../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./home.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "section {\n  color: #c95151;\n}\n#hero {\n  position: relative;\n}\n#hero .layer {\n    position: absolute;\n    opacity: 0;\n  }\n#hero picture figcaption {\n  display: none;\n}\n.home-grid h2 {\n  color: #c95151;\n  z-index: 5;\n  padding: 2rem;\n  font-size: 2rem;\n  -webkit-transition: 0.3s ease all;\n  transition: 0.3s ease all;\n}\n.home-grid h2:hover {\n  color: #ffffff;\n}\n.cry {\n  color: #c95151;\n  z-index: 5;\n  padding: 4rem;\n  /* font-size: 2rem; */\n  -webkit-transition: 0.3s ease all;\n  transition: 0.3s ease all;\n  background-color: #c95151;\n}\n.cry-sub {\n  font-size: 1rem;\n}\n.cry:hover {\n  color: #ffffff;\n  padding: 4rem 4rem 4rem 5rem;\n}\n.sup {\n  font-size: 3rem;\n  font-weight: 400;\n}\n.content-grid {\n  padding: 0px;\n}\n.home-grid {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n}\n.home-grid > div:nth-child(1) {\n  -webkit-box-ordinal-group: 2;\n      -ms-flex-order: 1;\n          order: 1;\n  background-color: #E0E0E0;\n  padding: 2.5rem;\n  -webkit-transition: 0.3s ease all;\n  transition: 0.3s ease all\n}\n.home-grid > div:nth-child(1):hover {\n  background-color: #c95151;\n}\n.home-grid > div:nth-child(2) {\n  -webkit-box-ordinal-group: 3;\n      -ms-flex-order: 2;\n          order: 2;\n  background-color: #000000;\n  padding: 2rem;\n  -webkit-transition: 0.3s ease all;\n  transition: 0.3s ease all;\n  color: #ffffff;\n  text-align:center\n}\n.home-grid > div:nth-child(2):hover {\n  background-color: #c95151;\n}\n.home-grid > div:nth-child(2) a {\n    color: #ffffff;\n}\n.home-grid > div:nth-child(2) a:hover {\n  /* font-size: 1.5rem; */\n}\n.home-grid > div:nth-child(3) {\n  -webkit-box-ordinal-group: 4;\n      -ms-flex-order: 3;\n          order: 3;\n  background-color: #000000;\n  padding: 2rem;\n  -webkit-transition: 0.3s ease all;\n  transition: 0.3s ease all;\n  color: #ffffff;\n  text-align:center\n}\n.home-grid > div:nth-child(3):hover {\n  background-color: #c95151;\n}\n.home-grid > div:nth-child(3) a {\n    color: #ffffff;\n}\n.home-grid > div:nth-child(3) a:hover {\n  /* font-size: 1.5rem; */\n}\n/* .home-grid > div:nth-child(4) {\n  order: 4;\n  background-color: $black;\n  padding: 2.5rem;\n  transition: 0.3s ease all;\n  color: $white;\n  text-align:center;\n  height: 61%;\n  &:hover {\n    background-color: $darkgray;\n  }\n  a {\n    color: $white;\n  }\n} */\n/* ------ Media Queries ------- */\n@media screen and (min-width: 900px) {\n  /* .home-grid > div:nth-child(1) {grid-area: a; }\n  .home-grid > div:nth-child(2) {grid-area: b; }\n  .home-grid > div:nth-child(3) {grid-area: c; } */\n  /* .home-grid > div:nth-child(4) {grid-area: d; } */\n  \n  /* .home-grid {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    grid-auto-rows: 1fr;\n    grid-template-areas:\n    \"a b c\"\n    \"a b c\";\n    align-items: flex-start;\n  } */\n  \n  .home-grid {\n    -webkit-box-orient: horizontal;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: row;\n            flex-direction: row;\n    /* flex: 1 0 30%; */\n  }\n\n  .home-grid > div {\n    width: 30%;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n  }\n    .home-grid > div p {\n      font-size: 1.3rem;\n    }\n\n  #hero {\n    position: relative;\n  }\n    #hero .layer {\n      position: absolute;\n      /* background-color: rgba(0,0,0,0.1); */\n      width: 100%;\n      height: 100%;\n      -webkit-transition: 0.3s ease all;\n      transition: 0.3s ease all;\n      opacity: 1\n    }\n    #hero .layer:hover {\n    background-color: rgba(241, 119, 119, 0.8);\n    opacity: 1;\n  }\n    #hero .layer h1 {\n        display: -webkit-box;\n        display: -ms-flexbox;\n        display: flex;\n        -webkit-box-align: center;\n            -ms-flex-align: center;\n                align-items: center;\n        -webkit-box-pack: center;\n            -ms-flex-pack: center;\n                justify-content: center;\n        color: #ffffff;\n        position: absolute;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n  }\n  \n  /* .home-grid > div:nth-child(1) {max-width: 50%; } */\n  /* .home-grid > div:nth-child(2) {padding: 0 5rem; }\n  .home-grid > div:nth-child(3) {padding: 0 5rem; } */\n}", "", {"version":3,"sources":["/Users/ivanlimongan/Documents/401/variables.css","/Users/ivanlimongan/Documents/401/art-gallery/home.css"],"names":[],"mappings":"AAYA;EACE,eAAe;CAChB;ACZD;EACE,mBAAmB;CAKpB;AAJC;IACE,mBAAmB;IACnB,WAAW;GACZ;AAGH;EACE,cAAc;CACf;AAED;EACE,eAAe;EACf,WAAW;EACX,cAAc;EACd,gBAAgB;EAChB,kCAA0B;EAA1B,0BAA0B;CAC3B;AAED;EACE,eAAc;CACf;AAED;EACE,eAAe;EACf,WAAW;EACX,cAAc;EACd,sBAAsB;EACtB,kCAA0B;EAA1B,0BAA0B;EAC1B,0BAA0B;CAC3B;AAED;EACE,gBAAgB;CACjB;AAED;EACE,eAAc;EACd,6BAA6B;CAC9B;AAED;EACE,gBAAgB;EAChB,iBAAiB;CAClB;AAED;EACE,aAAa;CACd;AAED;EACE,qBAAc;EAAd,qBAAc;EAAd,cAAc;EACd,6BAAuB;EAAvB,8BAAuB;MAAvB,2BAAuB;UAAvB,uBAAuB;CACxB;AAED;EACE,6BAAS;MAAT,kBAAS;UAAT,SAAS;EACT,0BAAwB;EACxB,gBAAgB;EAChB,kCAA0B;EAA1B,yBAA0B;CAI3B;AAHC;EACE,0BAA0B;CAC3B;AAGH;EACE,6BAAS;MAAT,kBAAS;UAAT,SAAS;EACT,0BAAyB;EACzB,cAAc;EACd,kCAA0B;EAA1B,0BAA0B;EAC1B,eAAc;EACd,iBAAkB;CAUnB;AATC;EACE,0BAA0B;CAC3B;AACD;IACE,eAAc;CAIf;AAHC;EACE,wBAAwB;CACzB;AAIL;EACE,6BAAS;MAAT,kBAAS;UAAT,SAAS;EACT,0BAAyB;EACzB,cAAc;EACd,kCAA0B;EAA1B,0BAA0B;EAC1B,eAAc;EACd,iBAAkB;CAUnB;AATC;EACE,0BAA0B;CAC3B;AACD;IACE,eAAc;CAIf;AAHC;EACA,wBAAwB;CACvB;AAIL;;;;;;;;;;;;;;IAcI;AAKJ,kCAAkC;AAElC;EACE;;mDAEiD;EACjD,oDAAoD;;EAEpD;;;;;;;;MAQI;;EAEJ;IACE,+BAAoB;IAApB,8BAAoB;QAApB,wBAAoB;YAApB,oBAAoB;IACpB,oBAAoB;GACrB;;EAED;IACE,WAAW;IACX,qBAAc;IAAd,qBAAc;IAAd,cAAc;IACd,0BAAoB;QAApB,uBAAoB;YAApB,oBAAoB;IACpB,yBAAwB;QAAxB,sBAAwB;YAAxB,wBAAwB;GAIzB;IAHC;MACE,kBAAkB;KACnB;;EAGH;IACE,mBAAmB;GAwBpB;IAvBC;MACE,mBAAmB;MACnB,wCAAwC;MACxC,YAAY;MACZ,aAAa;MACb,kCAA0B;MAA1B,0BAA0B;MAC1B,UAAW;KAgBZ;IAfC;IACE,2CAA2C;IAC3C,WAAW;GACZ;IACD;QACE,qBAAc;QAAd,qBAAc;QAAd,cAAc;QACd,0BAAoB;YAApB,uBAAoB;gBAApB,oBAAoB;QACpB,yBAAwB;YAAxB,sBAAwB;gBAAxB,wBAAwB;QACxB,eAAc;QACd,mBAAmB;QACnB,OAAO;QACP,QAAQ;QACR,YAAY;QACZ,aAAa;GACd;;EAIL,sDAAsD;EACtD;sDACoD;CACrD","file":"home.css","sourcesContent":["$accent: #c95151;\n$link: #0d415f;\n$darklink: #007BC2;\n$lightgray: #eeeeee;\n$darkgray: #444140;\n$white: #ffffff;\n$gray: #E0E0E0;\n$black: #000000;\n\n$maxViewportSize: 1280px;\n$padding: 2rem;\n\nsection {\n  color: #c95151;\n}","@import '../variables.css';\n\n#hero {\n  position: relative;\n  .layer {\n    position: absolute;\n    opacity: 0;\n  }\n}\n\n#hero picture figcaption {\n  display: none;\n}\n\n.home-grid h2 {\n  color: $accent;\n  z-index: 5;\n  padding: 2rem;\n  font-size: 2rem;\n  transition: 0.3s ease all;\n}\n\n.home-grid h2:hover {\n  color: $white;\n}\n\n.cry {\n  color: $accent;\n  z-index: 5;\n  padding: 4rem;\n  /* font-size: 2rem; */\n  transition: 0.3s ease all;\n  background-color: $accent;\n}\n\n.cry-sub {\n  font-size: 1rem;\n}\n\n.cry:hover {\n  color: $white;\n  padding: 4rem 4rem 4rem 5rem;\n}\n\n.sup {\n  font-size: 3rem;\n  font-weight: 400;\n}\n\n.content-grid {\n  padding: 0px;\n}\n\n.home-grid {\n  display: flex;\n  flex-direction: column;\n}\n\n.home-grid > div:nth-child(1) {\n  order: 1;\n  background-color: $gray;\n  padding: 2.5rem;\n  transition: 0.3s ease all;\n  &:hover {\n    background-color: $accent;\n  }\n}\n\n.home-grid > div:nth-child(2) {\n  order: 2;\n  background-color: $black;\n  padding: 2rem;\n  transition: 0.3s ease all;\n  color: $white;\n  text-align:center;\n  &:hover {\n    background-color: $accent;\n  }\n  a {\n    color: $white;\n    &:hover {\n      /* font-size: 1.5rem; */\n    }\n  }\n}\n\n.home-grid > div:nth-child(3) {\n  order: 3;\n  background-color: $black;\n  padding: 2rem;\n  transition: 0.3s ease all;\n  color: $white;\n  text-align:center;\n  &:hover {\n    background-color: $accent;\n  }\n  a {\n    color: $white;\n    &:hover {\n    /* font-size: 1.5rem; */\n    }\n  }\n}\n\n/* .home-grid > div:nth-child(4) {\n  order: 4;\n  background-color: $black;\n  padding: 2.5rem;\n  transition: 0.3s ease all;\n  color: $white;\n  text-align:center;\n  height: 61%;\n  &:hover {\n    background-color: $darkgray;\n  }\n  a {\n    color: $white;\n  }\n} */\n\n\n\n\n/* ------ Media Queries ------- */\n\n@media screen and (min-width: 900px) {\n  /* .home-grid > div:nth-child(1) {grid-area: a; }\n  .home-grid > div:nth-child(2) {grid-area: b; }\n  .home-grid > div:nth-child(3) {grid-area: c; } */\n  /* .home-grid > div:nth-child(4) {grid-area: d; } */\n  \n  /* .home-grid {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    grid-auto-rows: 1fr;\n    grid-template-areas:\n    \"a b c\"\n    \"a b c\";\n    align-items: flex-start;\n  } */\n  \n  .home-grid {\n    flex-direction: row;\n    /* flex: 1 0 30%; */\n  }\n\n  .home-grid > div {\n    width: 30%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    p {\n      font-size: 1.3rem;\n    }\n  }\n\n  #hero {\n    position: relative;\n    .layer {\n      position: absolute;\n      /* background-color: rgba(0,0,0,0.1); */\n      width: 100%;\n      height: 100%;\n      transition: 0.3s ease all;\n      opacity: 1;\n      &:hover {\n        background-color: rgba(241, 119, 119, 0.8);\n        opacity: 1;\n      }\n      h1 {\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        color: $white;\n        position: absolute;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n      }\n    }\n  }\n  \n  /* .home-grid > div:nth-child(1) {max-width: 50%; } */\n  /* .home-grid > div:nth-child(2) {padding: 0 5rem; }\n  .home-grid > div:nth-child(3) {padding: 0 5rem; } */\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "section {\n  color: #c95151;\n}\n@-webkit-keyframes pageSlide {\n  /* 0% {\n    opacity: .0;\n    transform: translate(0, 100%);\n  } */\n  0% {\n    opacity: 0;\n    -webkit-transform: translate(0, 10%);\n            transform: translate(0, 10%);\n  }\n  100% {\n    opacity: 1;\n    -webkit-transform: translate(0, 0%);\n            transform: translate(0, 0%);\n  }\n}\n@keyframes pageSlide {\n  /* 0% {\n    opacity: .0;\n    transform: translate(0, 100%);\n  } */\n  0% {\n    opacity: 0;\n    -webkit-transform: translate(0, 10%);\n            transform: translate(0, 10%);\n  }\n  100% {\n    opacity: 1;\n    -webkit-transform: translate(0, 0%);\n            transform: translate(0, 0%);\n  }\n}\nmain article {\n    -webkit-animation: pageSlide 1s ease-out;\n            animation: pageSlide 1s ease-out;\n  }", "", {"version":3,"sources":["/Users/ivanlimongan/Documents/401/variables.css","/Users/ivanlimongan/Documents/401/art-gallery/slide.css"],"names":[],"mappings":"AAYA;EACE,eAAe;CAChB;ACZD;EACE;;;MAGI;EACJ;IACE,WAAW;IACX,qCAA6B;YAA7B,6BAA6B;GAC9B;EACD;IACE,WAAW;IACX,oCAA4B;YAA5B,4BAA4B;GAC7B;CACF;AAbD;EACE;;;MAGI;EACJ;IACE,WAAW;IACX,qCAA6B;YAA7B,6BAA6B;GAC9B;EACD;IACE,WAAW;IACX,oCAA4B;YAA5B,4BAA4B;GAC7B;CACF;AAGC;IACE,yCAAiC;YAAjC,iCAAiC;GAClC","file":"slide.css","sourcesContent":["$accent: #c95151;\n$link: #0d415f;\n$darklink: #007BC2;\n$lightgray: #eeeeee;\n$darkgray: #444140;\n$white: #ffffff;\n$gray: #E0E0E0;\n$black: #000000;\n\n$maxViewportSize: 1280px;\n$padding: 2rem;\n\nsection {\n  color: #c95151;\n}","@import '../variables.css';\n\n@keyframes pageSlide {\n  /* 0% {\n    opacity: .0;\n    transform: translate(0, 100%);\n  } */\n  0% {\n    opacity: 0;\n    transform: translate(0, 10%);\n  }\n  100% {\n    opacity: 1;\n    transform: translate(0, 0%);\n  }\n}\n\nmain {\n  article {\n    animation: pageSlide 1s ease-out;\n  }\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = "<picture></picture>";

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const cUser = 'dph3nw8ym';
const FETCH_URL = `https://res.cloudinary.com/${cUser}/image/upload`;

const getUrl = (fileName, options = '') => {
  return `${FETCH_URL}/${options}/${fileName}`;
};
/* harmony export (immutable) */ __webpack_exports__["a"] = getUrl;


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__portland_html__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__portland_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__portland_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__portland_css__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__portland_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__portland_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__home_slide_css__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__home_slide_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__home_slide_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__picture_Picture__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Template__ = __webpack_require__(2);






const template = new __WEBPACK_IMPORTED_MODULE_4__Template__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__portland_html___default.a);

class Portland {

  render() {
    const dom = template.clone();

    const pdxImg = ['wes-carr-377398_vhdjwo.jpg', 'meric-dagli-487825_krjhna.jpg', 'jordan-andrews-317311_fj2pjx.jpg', 'jon-tyson-228428_iqlxfa.jpg', 'henrik-donnestad-469641_nx9zdr.jpg'];
    const pdxAlt = ['Photo by Wes Carr via Unsplash', 'Photo by Meric Dagli via Unsplash', 'Photo by Jordan Andrews via Unsplash', 'Photo by John Tyson via Unsplash', 'Photo by Henrik Donnestad via Unsplash'];

    for(let i = 0; i < pdxImg.length; i++) {
      const portland = new __WEBPACK_IMPORTED_MODULE_3__picture_Picture__["a" /* default */]({
        aspectRatios: ['1:1', '2:1', '2:1'],
        breakpoints: [1200, 900, 500],
        options: 'c_fill,g_auto,q_auto,g_face,f_auto',
        fileName: pdxImg[i],
        alt: pdxAlt[i]
      });
      const portlandDom = portland.render();
      dom.querySelector('#portland').appendChild(portlandDom);
    }

    return dom;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Portland;


/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = "<article class=\"maxwidth-wrap resource-grid\">\n  <h2>portland</h2>\n  <div id=\"portland\"></div>\n</article>";

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "section {\n  color: #c95151;\n}\n.resource-grid {\n  padding: 2rem;\n  display: grid;\n  grid-gap: 2rem;\n}\n#portland, #brooklyn {\n  display: grid;\n  grid-gap: 2rem 0; \n}\n#portland img, #brooklyn img {\n    padding: 0 0 0.7rem;\n  }\n@media screen and (min-width: 900px) {\n  #portland, #brooklyn {\n    display: grid;\n    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n    grid-gap: 2rem;\n  }\n}", "", {"version":3,"sources":["/Users/ivanlimongan/Documents/401/variables.css","/Users/ivanlimongan/Documents/401/art-gallery/portland.css"],"names":[],"mappings":"AAYA;EACE,eAAe;CAChB;ACZD;EACE,cAAkB;EAClB,cAAc;EACd,eAAe;CAChB;AAED;EACE,cAAc;EACd,iBAAiB;CAIlB;AAHC;IACE,oBAAoB;GACrB;AAGH;EACE;IACE,cAAc;IACd,6DAA6D;IAC7D,eAAe;GAChB;CACF","file":"portland.css","sourcesContent":["$accent: #c95151;\n$link: #0d415f;\n$darklink: #007BC2;\n$lightgray: #eeeeee;\n$darkgray: #444140;\n$white: #ffffff;\n$gray: #E0E0E0;\n$black: #000000;\n\n$maxViewportSize: 1280px;\n$padding: 2rem;\n\nsection {\n  color: #c95151;\n}","@import '../variables.css';\n\n.resource-grid {\n  padding: $padding;\n  display: grid;\n  grid-gap: 2rem;\n}\n\n#portland, #brooklyn {\n  display: grid;\n  grid-gap: 2rem 0;\n  img {\n    padding: 0 0 0.7rem;\n  } \n}\n\n@media screen and (min-width: 900px) {\n  #portland, #brooklyn {\n    display: grid;\n    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n    grid-gap: 2rem;\n  }\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__brooklyn_html__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__brooklyn_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__brooklyn_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__portland_portland_css__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__portland_portland_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__portland_portland_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__home_slide_css__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__home_slide_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__home_slide_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__picture_Picture__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Template__ = __webpack_require__(2);






const template = new __WEBPACK_IMPORTED_MODULE_4__Template__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__brooklyn_html___default.a);

class Brooklyn {

  render() {
    const dom = template.clone();

    const bkyImg = ['chris-barbalis-349279_husxn2.jpg', 'chris-barbalis-340798_xvmole.jpg', 'chris-barbalis-229357_gsxmot.jpg', 'chris-barbalis-108774_hbqgdd.jpg', 'annie-spratt-253797_m4mkwl.jpg'];
    const bkyAlt = ['Photo by Chris Barbalis via Unsplash', 'Photo by Chris Barbalis via Unsplash', 'Photo by Chris Barbalis via Unsplash', 'Photo by Chris Barbalis via Unsplash', 'Photo by Annie Spratt via Unsplash'];

    for(let i = 0; i < bkyImg.length; i++) {
      const brooklyn = new __WEBPACK_IMPORTED_MODULE_3__picture_Picture__["a" /* default */]({
        aspectRatios: ['1:1', '2:1', '2:1'],
        breakpoints: [1200, 900, 500],
        options: 'c_fill,g_auto,q_auto,g_face,f_auto',
        fileName: bkyImg[i],
        alt: bkyAlt[i]
      });
      const brooklynDom = brooklyn.render();
      dom.querySelector('#brooklyn').appendChild(brooklynDom);
    }

    return dom;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Brooklyn;


/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = "<article class=\"maxwidth-wrap resource-grid\">\n    <h2>brooklyn</h2>\n    <div id=\"brooklyn\"></div>\n</article>";

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__footer_html__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__footer_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__footer_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__footer_css__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__footer_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__footer_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Template__ = __webpack_require__(2);




const template = new __WEBPACK_IMPORTED_MODULE_2__Template__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__footer_html___default.a);

class Footer {

  render() {
    const dom = template.clone();

    return dom;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Footer;


/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = "<p>(c) Mural Collective — <a href=\"https://github.com/limongoo/art-gallery\" target=\"_blank\" rel\"author noopener noreferrer\">Ivan Limongan</a></p>\n";

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(35);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"sourceMap":true,"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js??ref--1-1!../../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./footer.css", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js??ref--1-1!../../../../node_modules/postcss-loader/lib/index.js??ref--1-2!./footer.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "section {\n  color: #c95151;\n}", "", {"version":3,"sources":["/Users/ivanlimongan/Documents/variables.css"],"names":[],"mappings":"AAYA;EACE,eAAe;CAChB","file":"footer.css","sourcesContent":["$accent: #c95151;\n$link: #0d415f;\n$darklink: #007BC2;\n$lightgray: #eeeeee;\n$darkgray: #444140;\n$white: #ffffff;\n$gray: #E0E0E0;\n$black: #000000;\n\n$maxViewportSize: 1280px;\n$padding: 2rem;\n\nsection {\n  color: #c95151;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const removeChildren = node => {
  while(node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = removeChildren;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODVkZTg5MTZiOWZlYTRiMjUwMTkiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9UZW1wbGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9ob21lL3NsaWRlLmNzcz81Yjc0Iiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3BpY3R1cmUvUGljdHVyZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9wb3J0bGFuZC9wb3J0bGFuZC5jc3M/ZmNlZSIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVzZXQuY3NzPzZkMmIiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Jlc2V0LmNzcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi91cmxzLmpzIiwid2VicGFjazovLy8uL3NyYy9tYWluLmNzcz9jMWNiIiwid2VicGFjazovLy8uL3NyYy9tYWluLmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9hcHAvQXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FwcC9hcHAuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9hcHAvYXBwLmNzcz9hZmI2Iiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FwcC9hcHAuY3NzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FwcC9oZWFkZXIvSGVhZGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FwcC9oZWFkZXIvaGVhZGVyLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvYXBwL2hlYWRlci9oZWFkZXIuY3NzPzc3NzIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvYXBwL2hlYWRlci9oZWFkZXIuY3NzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2hvbWUvSG9tZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9ob21lL2hvbWUuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9ob21lL2hvbWUuY3NzPzdmMWYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvaG9tZS9ob21lLmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9ob21lL3NsaWRlLmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9waWN0dXJlL3BpY3R1cmUuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvc2VydmljZXMvY2xvdWRpbmFyeS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9wb3J0bGFuZC9Qb3J0bGFuZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9wb3J0bGFuZC9wb3J0bGFuZC5odG1sIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3BvcnRsYW5kL3BvcnRsYW5kLmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9icm9va2x5bi9Ccm9va2x5bi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9icm9va2x5bi9icm9va2x5bi5odG1sIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FwcC9mb290ZXIvRm9vdGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2FwcC9mb290ZXIvZm9vdGVyLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvYXBwL2Zvb3Rlci9mb290ZXIuY3NzPzAxYTciLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvYXBwL2Zvb3Rlci9mb290ZXIuY3NzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2Rv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QUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEOztBQUVBLDZCQUE2QixtQkFBbUI7O0FBRWhEOztBQUVBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDN1dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7OztBQ1ZBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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VSxFQUFFO0FBQzVDLEM7Ozs7OztBQ3pCQTtBQUNBOzs7QUFHQTtBQUNBLGtDQUFtQyxtQkFBbUIsR0FBRyxRQUFRLGtHQUFrRyxVQUFVLCtEQUErRCxpQkFBaUIscUJBQXFCLHNCQUFzQixxQkFBcUIsa0JBQWtCLGlCQUFpQixrQkFBa0IsNkJBQTZCLGlCQUFpQixhQUFhLG1CQUFtQixHQUFHLG1CQUFtQjs7QUFFdGQ7Ozs7Ozs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDYpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDg1ZGU4OTE2YjlmZWE0YjI1MDE5IiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgbGlzdCA9IFtdO1xuXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0dmFyIGNvbnRlbnQgPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCk7XG5cdFx0XHRpZihpdGVtWzJdKSB7XG5cdFx0XHRcdHJldHVybiBcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGNvbnRlbnQgKyBcIn1cIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBjb250ZW50O1xuXHRcdFx0fVxuXHRcdH0pLmpvaW4oXCJcIik7XG5cdH07XG5cblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3Rcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcblx0XHR9XG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRyZXR1cm4gbGlzdDtcbn07XG5cbmZ1bmN0aW9uIGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKSB7XG5cdHZhciBjb250ZW50ID0gaXRlbVsxXSB8fCAnJztcblx0dmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuXHRpZiAoIWNzc01hcHBpbmcpIHtcblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxuXG5cdGlmICh1c2VTb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcblx0XHR2YXIgc291cmNlTWFwcGluZyA9IHRvQ29tbWVudChjc3NNYXBwaW5nKTtcblx0XHR2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuXHRcdFx0cmV0dXJuICcvKiMgc291cmNlVVJMPScgKyBjc3NNYXBwaW5nLnNvdXJjZVJvb3QgKyBzb3VyY2UgKyAnICovJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbignXFxuJyk7XG5cdH1cblxuXHRyZXR1cm4gW2NvbnRlbnRdLmpvaW4oJ1xcbicpO1xufVxuXG4vLyBBZGFwdGVkIGZyb20gY29udmVydC1zb3VyY2UtbWFwIChNSVQpXG5mdW5jdGlvbiB0b0NvbW1lbnQoc291cmNlTWFwKSB7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuXHR2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKTtcblx0dmFyIGRhdGEgPSAnc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJyArIGJhc2U2NDtcblxuXHRyZXR1cm4gJy8qIyAnICsgZGF0YSArICcgKi8nO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cblxudmFyIHN0eWxlc0luRG9tID0ge307XG5cbnZhclx0bWVtb2l6ZSA9IGZ1bmN0aW9uIChmbikge1xuXHR2YXIgbWVtbztcblxuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0eXBlb2YgbWVtbyA9PT0gXCJ1bmRlZmluZWRcIikgbWVtbyA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0cmV0dXJuIG1lbW87XG5cdH07XG59O1xuXG52YXIgaXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24gKCkge1xuXHQvLyBUZXN0IGZvciBJRSA8PSA5IGFzIHByb3Bvc2VkIGJ5IEJyb3dzZXJoYWNrc1xuXHQvLyBAc2VlIGh0dHA6Ly9icm93c2VyaGFja3MuY29tLyNoYWNrLWU3MWQ4NjkyZjY1MzM0MTczZmVlNzE1YzIyMmNiODA1XG5cdC8vIFRlc3RzIGZvciBleGlzdGVuY2Ugb2Ygc3RhbmRhcmQgZ2xvYmFscyBpcyB0byBhbGxvdyBzdHlsZS1sb2FkZXJcblx0Ly8gdG8gb3BlcmF0ZSBjb3JyZWN0bHkgaW50byBub24tc3RhbmRhcmQgZW52aXJvbm1lbnRzXG5cdC8vIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2stY29udHJpYi9zdHlsZS1sb2FkZXIvaXNzdWVzLzE3N1xuXHRyZXR1cm4gd2luZG93ICYmIGRvY3VtZW50ICYmIGRvY3VtZW50LmFsbCAmJiAhd2luZG93LmF0b2I7XG59KTtcblxudmFyIGdldEVsZW1lbnQgPSAoZnVuY3Rpb24gKGZuKSB7XG5cdHZhciBtZW1vID0ge307XG5cblx0cmV0dXJuIGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0aWYgKHR5cGVvZiBtZW1vW3NlbGVjdG9yXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0dmFyIHN0eWxlVGFyZ2V0ID0gZm4uY2FsbCh0aGlzLCBzZWxlY3Rvcik7XG5cdFx0XHQvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuXHRcdFx0aWYgKHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Ly8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcblx0XHRcdFx0XHQvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuXHRcdFx0XHRcdHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG5cdFx0XHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0XHRcdHN0eWxlVGFyZ2V0ID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0bWVtb1tzZWxlY3Rvcl0gPSBzdHlsZVRhcmdldDtcblx0XHR9XG5cdFx0cmV0dXJuIG1lbW9bc2VsZWN0b3JdXG5cdH07XG59KShmdW5jdGlvbiAodGFyZ2V0KSB7XG5cdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldClcbn0pO1xuXG52YXIgc2luZ2xldG9uID0gbnVsbDtcbnZhclx0c2luZ2xldG9uQ291bnRlciA9IDA7XG52YXJcdHN0eWxlc0luc2VydGVkQXRUb3AgPSBbXTtcblxudmFyXHRmaXhVcmxzID0gcmVxdWlyZShcIi4vdXJsc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XG5cdGlmICh0eXBlb2YgREVCVUcgIT09IFwidW5kZWZpbmVkXCIgJiYgREVCVUcpIHtcblx0XHRpZiAodHlwZW9mIGRvY3VtZW50ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3R5bGUtbG9hZGVyIGNhbm5vdCBiZSB1c2VkIGluIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XG5cdH1cblxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRvcHRpb25zLmF0dHJzID0gdHlwZW9mIG9wdGlvbnMuYXR0cnMgPT09IFwib2JqZWN0XCIgPyBvcHRpb25zLmF0dHJzIDoge307XG5cblx0Ly8gRm9yY2Ugc2luZ2xlLXRhZyBzb2x1dGlvbiBvbiBJRTYtOSwgd2hpY2ggaGFzIGEgaGFyZCBsaW1pdCBvbiB0aGUgIyBvZiA8c3R5bGU+XG5cdC8vIHRhZ3MgaXQgd2lsbCBhbGxvdyBvbiBhIHBhZ2Vcblx0aWYgKCFvcHRpb25zLnNpbmdsZXRvbiAmJiB0eXBlb2Ygb3B0aW9ucy5zaW5nbGV0b24gIT09IFwiYm9vbGVhblwiKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSA8aGVhZD4gZWxlbWVudFxuXHRpZiAoIW9wdGlvbnMuaW5zZXJ0SW50bykgb3B0aW9ucy5pbnNlcnRJbnRvID0gXCJoZWFkXCI7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIHRoZSB0YXJnZXRcblx0aWYgKCFvcHRpb25zLmluc2VydEF0KSBvcHRpb25zLmluc2VydEF0ID0gXCJib3R0b21cIjtcblxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QsIG9wdGlvbnMpO1xuXG5cdGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucyk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZSAobmV3TGlzdCkge1xuXHRcdHZhciBtYXlSZW1vdmUgPSBbXTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXG5cdFx0XHRkb21TdHlsZS5yZWZzLS07XG5cdFx0XHRtYXlSZW1vdmUucHVzaChkb21TdHlsZSk7XG5cdFx0fVxuXG5cdFx0aWYobmV3TGlzdCkge1xuXHRcdFx0dmFyIG5ld1N0eWxlcyA9IGxpc3RUb1N0eWxlcyhuZXdMaXN0LCBvcHRpb25zKTtcblx0XHRcdGFkZFN0eWxlc1RvRG9tKG5ld1N0eWxlcywgb3B0aW9ucyk7XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtYXlSZW1vdmUubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBkb21TdHlsZSA9IG1heVJlbW92ZVtpXTtcblxuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xuXHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSBkb21TdHlsZS5wYXJ0c1tqXSgpO1xuXG5cdFx0XHRcdGRlbGV0ZSBzdHlsZXNJbkRvbVtkb21TdHlsZS5pZF07XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcblxuZnVuY3Rpb24gYWRkU3R5bGVzVG9Eb20gKHN0eWxlcywgb3B0aW9ucykge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXG5cdFx0aWYoZG9tU3R5bGUpIHtcblx0XHRcdGRvbVN0eWxlLnJlZnMrKztcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKGl0ZW0ucGFydHNbal0pO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IoOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHBhcnRzID0gW107XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdHBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXG5cdFx0XHRzdHlsZXNJbkRvbVtpdGVtLmlkXSA9IHtpZDogaXRlbS5pZCwgcmVmczogMSwgcGFydHM6IHBhcnRzfTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbGlzdFRvU3R5bGVzIChsaXN0LCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZXMgPSBbXTtcblx0dmFyIG5ld1N0eWxlcyA9IHt9O1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gbGlzdFtpXTtcblx0XHR2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcblx0XHR2YXIgY3NzID0gaXRlbVsxXTtcblx0XHR2YXIgbWVkaWEgPSBpdGVtWzJdO1xuXHRcdHZhciBzb3VyY2VNYXAgPSBpdGVtWzNdO1xuXHRcdHZhciBwYXJ0ID0ge2NzczogY3NzLCBtZWRpYTogbWVkaWEsIHNvdXJjZU1hcDogc291cmNlTWFwfTtcblxuXHRcdGlmKCFuZXdTdHlsZXNbaWRdKSBzdHlsZXMucHVzaChuZXdTdHlsZXNbaWRdID0ge2lkOiBpZCwgcGFydHM6IFtwYXJ0XX0pO1xuXHRcdGVsc2UgbmV3U3R5bGVzW2lkXS5wYXJ0cy5wdXNoKHBhcnQpO1xuXHR9XG5cblx0cmV0dXJuIHN0eWxlcztcbn1cblxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50IChvcHRpb25zLCBzdHlsZSkge1xuXHR2YXIgdGFyZ2V0ID0gZ2V0RWxlbWVudChvcHRpb25zLmluc2VydEludG8pXG5cblx0aWYgKCF0YXJnZXQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydEludG8nIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcblx0fVxuXG5cdHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlc0luc2VydGVkQXRUb3Bbc3R5bGVzSW5zZXJ0ZWRBdFRvcC5sZW5ndGggLSAxXTtcblxuXHRpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ0b3BcIikge1xuXHRcdGlmICghbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3ApIHtcblx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIHRhcmdldC5maXJzdENoaWxkKTtcblx0XHR9IGVsc2UgaWYgKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XG5cdFx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG5cdFx0fVxuXHRcdHN0eWxlc0luc2VydGVkQXRUb3AucHVzaChzdHlsZSk7XG5cdH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJib3R0b21cIikge1xuXHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG5cdH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwib2JqZWN0XCIgJiYgb3B0aW9ucy5pbnNlcnRBdC5iZWZvcmUpIHtcblx0XHR2YXIgbmV4dFNpYmxpbmcgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50byArIFwiIFwiICsgb3B0aW9ucy5pbnNlcnRBdC5iZWZvcmUpO1xuXHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIG5leHRTaWJsaW5nKTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJbU3R5bGUgTG9hZGVyXVxcblxcbiBJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0JyAoJ29wdGlvbnMuaW5zZXJ0QXQnKSBmb3VuZC5cXG4gTXVzdCBiZSAndG9wJywgJ2JvdHRvbScsIG9yIE9iamVjdC5cXG4gKGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyI2luc2VydGF0KVxcblwiKTtcblx0fVxufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQgKHN0eWxlKSB7XG5cdGlmIChzdHlsZS5wYXJlbnROb2RlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdHN0eWxlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGUpO1xuXG5cdHZhciBpZHggPSBzdHlsZXNJbnNlcnRlZEF0VG9wLmluZGV4T2Yoc3R5bGUpO1xuXHRpZihpZHggPj0gMCkge1xuXHRcdHN0eWxlc0luc2VydGVkQXRUb3Auc3BsaWNlKGlkeCwgMSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU3R5bGVFbGVtZW50IChvcHRpb25zKSB7XG5cdHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcblxuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cblx0YWRkQXR0cnMoc3R5bGUsIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGUpO1xuXG5cdHJldHVybiBzdHlsZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTGlua0VsZW1lbnQgKG9wdGlvbnMpIHtcblx0dmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcblxuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cdG9wdGlvbnMuYXR0cnMucmVsID0gXCJzdHlsZXNoZWV0XCI7XG5cblx0YWRkQXR0cnMobGluaywgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBsaW5rKTtcblxuXHRyZXR1cm4gbGluaztcbn1cblxuZnVuY3Rpb24gYWRkQXR0cnMgKGVsLCBhdHRycykge1xuXHRPYmplY3Qua2V5cyhhdHRycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ZWwuc2V0QXR0cmlidXRlKGtleSwgYXR0cnNba2V5XSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBhZGRTdHlsZSAob2JqLCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZSwgdXBkYXRlLCByZW1vdmUsIHJlc3VsdDtcblxuXHQvLyBJZiBhIHRyYW5zZm9ybSBmdW5jdGlvbiB3YXMgZGVmaW5lZCwgcnVuIGl0IG9uIHRoZSBjc3Ncblx0aWYgKG9wdGlvbnMudHJhbnNmb3JtICYmIG9iai5jc3MpIHtcblx0ICAgIHJlc3VsdCA9IG9wdGlvbnMudHJhbnNmb3JtKG9iai5jc3MpO1xuXG5cdCAgICBpZiAocmVzdWx0KSB7XG5cdCAgICBcdC8vIElmIHRyYW5zZm9ybSByZXR1cm5zIGEgdmFsdWUsIHVzZSB0aGF0IGluc3RlYWQgb2YgdGhlIG9yaWdpbmFsIGNzcy5cblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgcnVubmluZyBydW50aW1lIHRyYW5zZm9ybWF0aW9ucyBvbiB0aGUgY3NzLlxuXHQgICAgXHRvYmouY3NzID0gcmVzdWx0O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgIFx0Ly8gSWYgdGhlIHRyYW5zZm9ybSBmdW5jdGlvbiByZXR1cm5zIGEgZmFsc3kgdmFsdWUsIGRvbid0IGFkZCB0aGlzIGNzcy5cblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgY29uZGl0aW9uYWwgbG9hZGluZyBvZiBjc3Ncblx0ICAgIFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgXHRcdC8vIG5vb3Bcblx0ICAgIFx0fTtcblx0ICAgIH1cblx0fVxuXG5cdGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xuXHRcdHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xuXG5cdFx0c3R5bGUgPSBzaW5nbGV0b24gfHwgKHNpbmdsZXRvbiA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XG5cblx0XHR1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIGZhbHNlKTtcblx0XHRyZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIHRydWUpO1xuXG5cdH0gZWxzZSBpZiAoXG5cdFx0b2JqLnNvdXJjZU1hcCAmJlxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwuY3JlYXRlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCJcblx0KSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGUsIG9wdGlvbnMpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG5cblx0XHRcdGlmKHN0eWxlLmhyZWYpIFVSTC5yZXZva2VPYmplY3RVUkwoc3R5bGUuaHJlZik7XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRzdHlsZSA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGUpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG5cdFx0fTtcblx0fVxuXG5cdHVwZGF0ZShvYmopO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZSAobmV3T2JqKSB7XG5cdFx0aWYgKG5ld09iaikge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRuZXdPYmouY3NzID09PSBvYmouY3NzICYmXG5cdFx0XHRcdG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmXG5cdFx0XHRcdG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXBcblx0XHRcdCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHVwZGF0ZShvYmogPSBuZXdPYmopO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZW1vdmUoKTtcblx0XHR9XG5cdH07XG59XG5cbnZhciByZXBsYWNlVGV4dCA9IChmdW5jdGlvbiAoKSB7XG5cdHZhciB0ZXh0U3RvcmUgPSBbXTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlbWVudCkge1xuXHRcdHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcblxuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xuXHR9O1xufSkoKTtcblxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyAoc3R5bGUsIGluZGV4LCByZW1vdmUsIG9iaikge1xuXHR2YXIgY3NzID0gcmVtb3ZlID8gXCJcIiA6IG9iai5jc3M7XG5cblx0aWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XG5cdFx0dmFyIGNoaWxkTm9kZXMgPSBzdHlsZS5jaGlsZE5vZGVzO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZS5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XG5cblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcblx0XHRcdHN0eWxlLmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0eWxlLmFwcGVuZENoaWxkKGNzc05vZGUpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBhcHBseVRvVGFnIChzdHlsZSwgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgbWVkaWEgPSBvYmoubWVkaWE7XG5cblx0aWYobWVkaWEpIHtcblx0XHRzdHlsZS5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSlcblx0fVxuXG5cdGlmKHN0eWxlLnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG5cdH0gZWxzZSB7XG5cdFx0d2hpbGUoc3R5bGUuZmlyc3RDaGlsZCkge1xuXHRcdFx0c3R5bGUucmVtb3ZlQ2hpbGQoc3R5bGUuZmlyc3RDaGlsZCk7XG5cdFx0fVxuXG5cdFx0c3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTGluayAobGluaywgb3B0aW9ucywgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuXHQvKlxuXHRcdElmIGNvbnZlcnRUb0Fic29sdXRlVXJscyBpc24ndCBkZWZpbmVkLCBidXQgc291cmNlbWFwcyBhcmUgZW5hYmxlZFxuXHRcdGFuZCB0aGVyZSBpcyBubyBwdWJsaWNQYXRoIGRlZmluZWQgdGhlbiBsZXRzIHR1cm4gY29udmVydFRvQWJzb2x1dGVVcmxzXG5cdFx0b24gYnkgZGVmYXVsdC4gIE90aGVyd2lzZSBkZWZhdWx0IHRvIHRoZSBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgb3B0aW9uXG5cdFx0ZGlyZWN0bHlcblx0Ki9cblx0dmFyIGF1dG9GaXhVcmxzID0gb3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgPT09IHVuZGVmaW5lZCAmJiBzb3VyY2VNYXA7XG5cblx0aWYgKG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzIHx8IGF1dG9GaXhVcmxzKSB7XG5cdFx0Y3NzID0gZml4VXJscyhjc3MpO1xuXHR9XG5cblx0aWYgKHNvdXJjZU1hcCkge1xuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xuXHR9XG5cblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XG5cblx0dmFyIG9sZFNyYyA9IGxpbmsuaHJlZjtcblxuXHRsaW5rLmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG5cdGlmKG9sZFNyYykgVVJMLnJldm9rZU9iamVjdFVSTChvbGRTcmMpO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVtcGxhdGUge1xuICBjb25zdHJ1Y3RvcihodG1sKSB7XG4gICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWw7XG4gICAgdGhpcy5mcmFnbWVudCA9IHRlbXBsYXRlLmNvbnRlbnQ7XG4gIH1cblxuICBjbG9uZSgpIHtcbiAgICByZXR1cm4gdGhpcy5mcmFnbWVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gIH1cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21wb25lbnRzL1RlbXBsYXRlLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9zbGlkZS5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge1wic291cmNlTWFwXCI6dHJ1ZSxcImhtclwiOnRydWV9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9zbGlkZS5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMiEuL3NsaWRlLmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy9ob21lL3NsaWRlLmNzc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgaHRtbCBmcm9tICcuL3BpY3R1cmUuaHRtbCc7XG5pbXBvcnQgVGVtcGxhdGUgZnJvbSAnLi4vVGVtcGxhdGUnO1xuaW1wb3J0IHsgZ2V0VXJsIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2xvdWRpbmFyeSc7XG5cbmNvbnN0IHRlbXBsYXRlID0gbmV3IFRlbXBsYXRlKGh0bWwpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQaWN0dXJlIHtcbiAgY29uc3RydWN0b3IoY2xvdWRpbmFyeU9iaikge1xuICAgIHRoaXMuY2xvdWRpbmFyeU9iaiA9IGNsb3VkaW5hcnlPYmo7XG4gIH1cblxuICBjcmVhdGUoY2xvdWRpbmFyeU9iaikge1xuICAgIGxldCBwaWN0dXJlSFRNTCA9ICcnO1xuXG4gICAgZm9yKGxldCBpPTA7IGkgPCBjbG91ZGluYXJ5T2JqLmFzcGVjdFJhdGlvcy5sZW5ndGg7IGkrKykge1xuICAgICAgXG4gICAgICAvLyByZWd1YWxyIGltYWdlXG4gICAgICBjb25zdCBpbWdPcHRpb25zID0gYCR7Y2xvdWRpbmFyeU9iai5vcHRpb25zfSxhcl8ke2Nsb3VkaW5hcnlPYmouYXNwZWN0UmF0aW9zW2ldfSx3XyR7Y2xvdWRpbmFyeU9iai5icmVha3BvaW50c1tpXX1gO1xuICAgICAgY29uc3QgaW1nVXJsID0gZ2V0VXJsKGNsb3VkaW5hcnlPYmouZmlsZU5hbWUsIGltZ09wdGlvbnMpO1xuICAgICAgXG4gICAgICAvLyAyeCBpbWFnZVxuICAgICAgY29uc3QgcmV0aW5hT3B0aW9ucyA9IGAke2Nsb3VkaW5hcnlPYmoub3B0aW9uc30sYXJfJHtjbG91ZGluYXJ5T2JqLmFzcGVjdFJhdGlvc1tpXX0sd18ke2Nsb3VkaW5hcnlPYmouYnJlYWtwb2ludHNbaV0gKiAyfWA7XG4gICAgICBjb25zdCByZXRpbmFVcmwgPSBnZXRVcmwoY2xvdWRpbmFyeU9iai5maWxlTmFtZSwgcmV0aW5hT3B0aW9ucyk7XG5cbiAgICAgIGlmKGkgPCBjbG91ZGluYXJ5T2JqLmFzcGVjdFJhdGlvcy5sZW5ndGggLSAxKSB7XG4gICAgICAgIFxuICAgICAgICAvLyBpZiB0aGlzIGlzIE5PVCB0aGUgbGFzdCBpbWFnZSBpbiB0aGUgYXJyYXksIG91dHB1dCB0aGUgPHNvdXJjZT4gZWxlbWVudFxuICAgICAgICBwaWN0dXJlSFRNTCArPSBgPHNvdXJjZSBtZWRpYT1cIihtaW4td2lkdGg6ICR7Y2xvdWRpbmFyeU9iai5icmVha3BvaW50c1soaSArIDEpXX1weClcIiBzcmNzZXQ9JHtpbWdVcmx9LCAke3JldGluYVVybH0gMnhcIj5gO1xuICAgICAgfSBlbHNlIHtcblxuICAgICAgICAvLyBpZiB0aGlzIElTIHRoZSBsYXN0IGltYWdlLCBvdXRwdXQgdGhlIDxpbWc+IGVsZW1lbnRcbiAgICAgICAgcGljdHVyZUhUTUwgKz0gYDxpbWcgc3Jjc2V0PVwiJHtpbWdVcmx9LCAke3JldGluYVVybH0gMnhcIiBhbHQ9XCIke2Nsb3VkaW5hcnlPYmouYWx0fVwiPjxmaWdjYXB0aW9uPiR7Y2xvdWRpbmFyeU9iai5hbHR9PC9maWdjYXB0aW9uPmA7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwaWN0dXJlSFRNTDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkb20gPSB0ZW1wbGF0ZS5jbG9uZSgpO1xuICBcbiAgICBkb20ucXVlcnlTZWxlY3RvcigncGljdHVyZScpLmlubmVySFRNTCA9IHRoaXMuY3JlYXRlKHRoaXMuY2xvdWRpbmFyeU9iaik7XG5cbiAgICByZXR1cm4gZG9tO1xuICB9XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy9waWN0dXJlL1BpY3R1cmUuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMiEuL3BvcnRsYW5kLmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7XCJzb3VyY2VNYXBcIjp0cnVlLFwiaG1yXCI6dHJ1ZX1cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMiEuL3BvcnRsYW5kLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vcG9ydGxhbmQuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21wb25lbnRzL3BvcnRsYW5kL3BvcnRsYW5kLmNzc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgJy4vcmVzZXQuY3NzJztcbmltcG9ydCAnLi9tYWluLmNzcyc7XG5cbmltcG9ydCBBcHAgZnJvbSAnLi9jb21wb25lbnRzL2FwcC9BcHAnO1xuXG5jb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKTtcbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbnJvb3QuYXBwZW5kQ2hpbGQoYXBwLnJlbmRlcigpKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9tYWluLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9yZXNldC5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge1wic291cmNlTWFwXCI6dHJ1ZSxcImhtclwiOnRydWV9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9yZXNldC5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMiEuL3Jlc2V0LmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcmVzZXQuY3NzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodHJ1ZSk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIvKiBodHRwOi8vbWV5ZXJ3ZWIuY29tL2VyaWMvdG9vbHMvY3NzL3Jlc2V0LyBcXG4gICB2Mi4wIHwgMjAxMTAxMjZcXG4gICBMaWNlbnNlOiBub25lIChwdWJsaWMgZG9tYWluKVxcbiovXFxuXFxuaHRtbCwgYm9keSwgZGl2LCBzcGFuLCBhcHBsZXQsIG9iamVjdCwgaWZyYW1lLCBoMSwgaDIsIGgzLCBoNCwgaDUsIGg2LCBwLCBibG9ja3F1b3RlLCBwcmUsIGEsIGFiYnIsIGFjcm9ueW0sIGFkZHJlc3MsIGJpZywgY2l0ZSwgY29kZSwgZGVsLCBkZm4sIGltZywgaW5zLCBrYmQsIHEsIHMsIHNhbXAsIHNtYWxsLCBzdHJpa2UsIHN1Yiwgc3VwLCB0dCwgdmFyLCBiLCB1LCBpLCBjZW50ZXIsIGRsLCBkdCwgZGQsIG9sLCB1bCwgbGksIGZpZWxkc2V0LCBmb3JtLCBsYWJlbCwgbGVnZW5kLCB0YWJsZSwgY2FwdGlvbiwgdGJvZHksIHRmb290LCB0aGVhZCwgdHIsIHRoLCB0ZCwgYXJ0aWNsZSwgYXNpZGUsIGNhbnZhcywgZGV0YWlscywgZW1iZWQsIGZpZ3VyZSwgZmlnY2FwdGlvbiwgZm9vdGVyLCBoZWFkZXIsIGhncm91cCwgbWVudSwgbmF2LCBvdXRwdXQsIHJ1YnksIHNlY3Rpb24sIHN1bW1hcnksIHRpbWUsIG1hcmssIGF1ZGlvLCB2aWRlbyB7XFxuXFx0bWFyZ2luOiAwO1xcblxcdHBhZGRpbmc6IDA7XFxuXFx0Ym9yZGVyOiAwO1xcblxcdGZvbnQtc2l6ZTogMTAwJTtcXG5cXHRmb250OiBpbmhlcml0O1xcblxcdHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuXFxuLyogSFRNTDUgZGlzcGxheS1yb2xlIHJlc2V0IGZvciBvbGRlciBicm93c2VycyAqL1xcblxcbmFydGljbGUsIGFzaWRlLCBkZXRhaWxzLCBmaWdjYXB0aW9uLCBmaWd1cmUsIGZvb3RlciwgaGVhZGVyLCBoZ3JvdXAsIG1lbnUsIG5hdiwgc2VjdGlvbiB7XFxuXFx0ZGlzcGxheTogYmxvY2s7XFxufVxcblxcbmJvZHkge1xcblxcdGxpbmUtaGVpZ2h0OiAxO1xcbn1cXG5cXG5uYXYgb2wsIG5hdiB1bCB7XFxuXFx0bGlzdC1zdHlsZTogbm9uZTtcXG59XFxuXFxuYmxvY2txdW90ZSwgcSB7XFxuXFx0cXVvdGVzOiBub25lO1xcbn1cXG5cXG5ibG9ja3F1b3RlOmJlZm9yZSwgYmxvY2txdW90ZTphZnRlciwgcTpiZWZvcmUsIHE6YWZ0ZXIge1xcblxcdGNvbnRlbnQ6ICcnO1xcblxcdGNvbnRlbnQ6IG5vbmU7XFxufVxcblxcbnRhYmxlIHtcXG5cXHRib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xcblxcdGJvcmRlci1zcGFjaW5nOiAwO1xcbn1cIiwgXCJcIiwge1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiL1VzZXJzL2l2YW5saW1vbmdhbi9Eb2N1bWVudHMvNDAxL2FydC1nYWxsZXJ5L3Jlc2V0LmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTs7O0VBR0U7O0FBRUY7Q0FhQyxVQUFVO0NBQ1YsV0FBVztDQUNYLFVBQVU7Q0FDVixnQkFBZ0I7Q0FDaEIsY0FBYztDQUNkLHlCQUF5QjtDQUN6Qjs7QUFDRCxpREFBaUQ7O0FBQ2pEO0NBRUMsZUFBZTtDQUNmOztBQUNEO0NBQ0MsZUFBZTtDQUNmOztBQUNEO0NBQ0MsaUJBQWlCO0NBQ2pCOztBQUNEO0NBQ0MsYUFBYTtDQUNiOztBQUNEO0NBRUMsWUFBWTtDQUNaLGNBQWM7Q0FDZDs7QUFDRDtDQUNDLDBCQUEwQjtDQUMxQixrQkFBa0I7Q0FDbEJcIixcImZpbGVcIjpcInJlc2V0LmNzc1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiBodHRwOi8vbWV5ZXJ3ZWIuY29tL2VyaWMvdG9vbHMvY3NzL3Jlc2V0LyBcXG4gICB2Mi4wIHwgMjAxMTAxMjZcXG4gICBMaWNlbnNlOiBub25lIChwdWJsaWMgZG9tYWluKVxcbiovXFxuXFxuaHRtbCwgYm9keSwgZGl2LCBzcGFuLCBhcHBsZXQsIG9iamVjdCwgaWZyYW1lLFxcbmgxLCBoMiwgaDMsIGg0LCBoNSwgaDYsIHAsIGJsb2NrcXVvdGUsIHByZSxcXG5hLCBhYmJyLCBhY3JvbnltLCBhZGRyZXNzLCBiaWcsIGNpdGUsIGNvZGUsXFxuZGVsLCBkZm4sIGltZywgaW5zLCBrYmQsIHEsIHMsIHNhbXAsXFxuc21hbGwsIHN0cmlrZSwgc3ViLCBzdXAsIHR0LCB2YXIsXFxuYiwgdSwgaSwgY2VudGVyLFxcbmRsLCBkdCwgZGQsIG9sLCB1bCwgbGksXFxuZmllbGRzZXQsIGZvcm0sIGxhYmVsLCBsZWdlbmQsXFxudGFibGUsIGNhcHRpb24sIHRib2R5LCB0Zm9vdCwgdGhlYWQsIHRyLCB0aCwgdGQsXFxuYXJ0aWNsZSwgYXNpZGUsIGNhbnZhcywgZGV0YWlscywgZW1iZWQsIFxcbmZpZ3VyZSwgZmlnY2FwdGlvbiwgZm9vdGVyLCBoZWFkZXIsIGhncm91cCwgXFxubWVudSwgbmF2LCBvdXRwdXQsIHJ1YnksIHNlY3Rpb24sIHN1bW1hcnksXFxudGltZSwgbWFyaywgYXVkaW8sIHZpZGVvIHtcXG5cXHRtYXJnaW46IDA7XFxuXFx0cGFkZGluZzogMDtcXG5cXHRib3JkZXI6IDA7XFxuXFx0Zm9udC1zaXplOiAxMDAlO1xcblxcdGZvbnQ6IGluaGVyaXQ7XFxuXFx0dmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG4vKiBIVE1MNSBkaXNwbGF5LXJvbGUgcmVzZXQgZm9yIG9sZGVyIGJyb3dzZXJzICovXFxuYXJ0aWNsZSwgYXNpZGUsIGRldGFpbHMsIGZpZ2NhcHRpb24sIGZpZ3VyZSwgXFxuZm9vdGVyLCBoZWFkZXIsIGhncm91cCwgbWVudSwgbmF2LCBzZWN0aW9uIHtcXG5cXHRkaXNwbGF5OiBibG9jaztcXG59XFxuYm9keSB7XFxuXFx0bGluZS1oZWlnaHQ6IDE7XFxufVxcbm5hdiBvbCwgbmF2IHVsIHtcXG5cXHRsaXN0LXN0eWxlOiBub25lO1xcbn1cXG5ibG9ja3F1b3RlLCBxIHtcXG5cXHRxdW90ZXM6IG5vbmU7XFxufVxcbmJsb2NrcXVvdGU6YmVmb3JlLCBibG9ja3F1b3RlOmFmdGVyLFxcbnE6YmVmb3JlLCBxOmFmdGVyIHtcXG5cXHRjb250ZW50OiAnJztcXG5cXHRjb250ZW50OiBub25lO1xcbn1cXG50YWJsZSB7XFxuXFx0Ym9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcXG5cXHRib3JkZXItc3BhY2luZzogMDtcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/e1wiaW1wb3J0TG9hZGVyc1wiOjEsXCJzb3VyY2VNYXBcIjp0cnVlfSEuL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWI/e1wic291cmNlTWFwXCI6dHJ1ZX0hLi9zcmMvcmVzZXQuY3NzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlxuLyoqXG4gKiBXaGVuIHNvdXJjZSBtYXBzIGFyZSBlbmFibGVkLCBgc3R5bGUtbG9hZGVyYCB1c2VzIGEgbGluayBlbGVtZW50IHdpdGggYSBkYXRhLXVyaSB0b1xuICogZW1iZWQgdGhlIGNzcyBvbiB0aGUgcGFnZS4gVGhpcyBicmVha3MgYWxsIHJlbGF0aXZlIHVybHMgYmVjYXVzZSBub3cgdGhleSBhcmUgcmVsYXRpdmUgdG8gYVxuICogYnVuZGxlIGluc3RlYWQgb2YgdGhlIGN1cnJlbnQgcGFnZS5cbiAqXG4gKiBPbmUgc29sdXRpb24gaXMgdG8gb25seSB1c2UgZnVsbCB1cmxzLCBidXQgdGhhdCBtYXkgYmUgaW1wb3NzaWJsZS5cbiAqXG4gKiBJbnN0ZWFkLCB0aGlzIGZ1bmN0aW9uIFwiZml4ZXNcIiB0aGUgcmVsYXRpdmUgdXJscyB0byBiZSBhYnNvbHV0ZSBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgcGFnZSBsb2NhdGlvbi5cbiAqXG4gKiBBIHJ1ZGltZW50YXJ5IHRlc3Qgc3VpdGUgaXMgbG9jYXRlZCBhdCBgdGVzdC9maXhVcmxzLmpzYCBhbmQgY2FuIGJlIHJ1biB2aWEgdGhlIGBucG0gdGVzdGAgY29tbWFuZC5cbiAqXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzKSB7XG4gIC8vIGdldCBjdXJyZW50IGxvY2F0aW9uXG4gIHZhciBsb2NhdGlvbiA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmxvY2F0aW9uO1xuXG4gIGlmICghbG9jYXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJmaXhVcmxzIHJlcXVpcmVzIHdpbmRvdy5sb2NhdGlvblwiKTtcbiAgfVxuXG5cdC8vIGJsYW5rIG9yIG51bGw/XG5cdGlmICghY3NzIHx8IHR5cGVvZiBjc3MgIT09IFwic3RyaW5nXCIpIHtcblx0ICByZXR1cm4gY3NzO1xuICB9XG5cbiAgdmFyIGJhc2VVcmwgPSBsb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIGxvY2F0aW9uLmhvc3Q7XG4gIHZhciBjdXJyZW50RGlyID0gYmFzZVVybCArIGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcL1teXFwvXSokLywgXCIvXCIpO1xuXG5cdC8vIGNvbnZlcnQgZWFjaCB1cmwoLi4uKVxuXHQvKlxuXHRUaGlzIHJlZ3VsYXIgZXhwcmVzc2lvbiBpcyBqdXN0IGEgd2F5IHRvIHJlY3Vyc2l2ZWx5IG1hdGNoIGJyYWNrZXRzIHdpdGhpblxuXHRhIHN0cmluZy5cblxuXHQgL3VybFxccypcXCggID0gTWF0Y2ggb24gdGhlIHdvcmQgXCJ1cmxcIiB3aXRoIGFueSB3aGl0ZXNwYWNlIGFmdGVyIGl0IGFuZCB0aGVuIGEgcGFyZW5zXG5cdCAgICggID0gU3RhcnQgYSBjYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAoPzogID0gU3RhcnQgYSBub24tY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgICAgIFteKShdICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAoPzogID0gU3RhcnQgYW5vdGhlciBub24tY2FwdHVyaW5nIGdyb3Vwc1xuXHQgICAgICAgICAgICAgICAgIFteKShdKyAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICAgICAgW14pKF0qICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIFxcKSAgPSBNYXRjaCBhIGVuZCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKSAgPSBFbmQgR3JvdXBcbiAgICAgICAgICAgICAgKlxcKSA9IE1hdGNoIGFueXRoaW5nIGFuZCB0aGVuIGEgY2xvc2UgcGFyZW5zXG4gICAgICAgICAgKSAgPSBDbG9zZSBub24tY2FwdHVyaW5nIGdyb3VwXG4gICAgICAgICAgKiAgPSBNYXRjaCBhbnl0aGluZ1xuICAgICAgICkgID0gQ2xvc2UgY2FwdHVyaW5nIGdyb3VwXG5cdCBcXCkgID0gTWF0Y2ggYSBjbG9zZSBwYXJlbnNcblxuXHQgL2dpICA9IEdldCBhbGwgbWF0Y2hlcywgbm90IHRoZSBmaXJzdC4gIEJlIGNhc2UgaW5zZW5zaXRpdmUuXG5cdCAqL1xuXHR2YXIgZml4ZWRDc3MgPSBjc3MucmVwbGFjZSgvdXJsXFxzKlxcKCgoPzpbXikoXXxcXCgoPzpbXikoXSt8XFwoW14pKF0qXFwpKSpcXCkpKilcXCkvZ2ksIGZ1bmN0aW9uKGZ1bGxNYXRjaCwgb3JpZ1VybCkge1xuXHRcdC8vIHN0cmlwIHF1b3RlcyAoaWYgdGhleSBleGlzdClcblx0XHR2YXIgdW5xdW90ZWRPcmlnVXJsID0gb3JpZ1VybFxuXHRcdFx0LnRyaW0oKVxuXHRcdFx0LnJlcGxhY2UoL15cIiguKilcIiQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSlcblx0XHRcdC5yZXBsYWNlKC9eJyguKiknJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KTtcblxuXHRcdC8vIGFscmVhZHkgYSBmdWxsIHVybD8gbm8gY2hhbmdlXG5cdFx0aWYgKC9eKCN8ZGF0YTp8aHR0cDpcXC9cXC98aHR0cHM6XFwvXFwvfGZpbGU6XFwvXFwvXFwvKS9pLnRlc3QodW5xdW90ZWRPcmlnVXJsKSkge1xuXHRcdCAgcmV0dXJuIGZ1bGxNYXRjaDtcblx0XHR9XG5cblx0XHQvLyBjb252ZXJ0IHRoZSB1cmwgdG8gYSBmdWxsIHVybFxuXHRcdHZhciBuZXdVcmw7XG5cblx0XHRpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvL1wiKSA9PT0gMCkge1xuXHRcdCAgXHQvL1RPRE86IHNob3VsZCB3ZSBhZGQgcHJvdG9jb2w/XG5cdFx0XHRuZXdVcmwgPSB1bnF1b3RlZE9yaWdVcmw7XG5cdFx0fSBlbHNlIGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi9cIikgPT09IDApIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSBiYXNlIHVybFxuXHRcdFx0bmV3VXJsID0gYmFzZVVybCArIHVucXVvdGVkT3JpZ1VybDsgLy8gYWxyZWFkeSBzdGFydHMgd2l0aCAnLydcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gY3VycmVudCBkaXJlY3Rvcnlcblx0XHRcdG5ld1VybCA9IGN1cnJlbnREaXIgKyB1bnF1b3RlZE9yaWdVcmwucmVwbGFjZSgvXlxcLlxcLy8sIFwiXCIpOyAvLyBTdHJpcCBsZWFkaW5nICcuLydcblx0XHR9XG5cblx0XHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIHVybCguLi4pXG5cdFx0cmV0dXJuIFwidXJsKFwiICsgSlNPTi5zdHJpbmdpZnkobmV3VXJsKSArIFwiKVwiO1xuXHR9KTtcblxuXHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIGNzc1xuXHRyZXR1cm4gZml4ZWRDc3M7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi91cmxzLmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9tYWluLmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7XCJzb3VyY2VNYXBcIjp0cnVlLFwiaG1yXCI6dHJ1ZX1cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMiEuL21haW4uY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9tYWluLmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvbWFpbi5jc3Ncbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodHJ1ZSk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJzZWN0aW9uIHtcXG4gIGNvbG9yOiAjYzk1MTUxO1xcbn1cXG5odG1sIHtoZWlnaHQ6IDEwMCU7fVxcbmJvZHkge1xcbiAgLyogZm9udC1mYW1pbHk6ICdXb3JrIFNhbnMnLCBzYW5zLXNlcmlmOyAqL1xcbiAgZm9udC1mYW1pbHk6ICdJbmNvbnNvbGF0YScsIG1vbm9zcGFjZTtcXG4gIGZvbnQtd2VpZ2h0OiA0MDA7XFxuICBjb2xvcjogIzAwMDAwMDtcXG4gIG1pbi1oZWlnaHQ6IDEwMCU7XFxufVxcbnAge1xcbiAgbWFyZ2luLWJvdHRvbTogMS4zZW07XFxuICBsaW5lLWhlaWdodDogMS43O1xcbn1cXG4vKiBGb250IHNpemluZyBmcm9tIGh0dHA6Ly90eXBlLXNjYWxlLmNvbS8gKi9cXG5oMSwgaDIsIGgzLCBoNCB7XFxuICAvKiBtYXJnaW46IDFlbSAwIDAuNWVtOyAqL1xcbiAgbGluZS1oZWlnaHQ6IDEuMTtcXG4gIGxldHRlci1zcGFjaW5nOiAycHg7XFxuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xcbiAgcGFkZGluZzogMCAwIDFyZW0gMDtcXG4gIGNvbG9yOiAjMDAwMDAwO1xcbiAgZm9udC13ZWlnaHQ6IDcwMDtcXG4gIGZvbnQtZmFtaWx5OiAnV29yayBTYW5zJywgc2Fucy1zZXJpZjtcXG59XFxuaDEge1xcbiAgbWFyZ2luLXRvcDogMDtcXG4gIGZvbnQtc2l6ZTogMy41OThlbTtcXG59XFxuaDIge2ZvbnQtc2l6ZTogMi44MjdlbTt9XFxuaDMge2ZvbnQtc2l6ZTogMS45OTllbTt9XFxuaDQge2ZvbnQtc2l6ZTogMS40MTRlbTt9XFxuZmlnY2FwdGlvbiwgc21hbGwsIC5mb250X3NtYWxsIHtmb250LXNpemU6IDAuOGVtOyBwYWRkaW5nOiAwIDAgMnJlbTsgZm9udC13ZWlnaHQ6IDUwMDt9XFxuLyogaGlkZSBzY3JlZW4tcmVhZGVyIG9ubHkgdGV4dC4gaHR0cHM6Ly93ZWJhaW0ub3JnL3RlY2huaXF1ZXMvY3NzL2ludmlzaWJsZWNvbnRlbnQvICovXFxuLmNsaXAge1xcbiAgcG9zaXRpb246IGFic29sdXRlICFpbXBvcnRhbnQ7XFxuICBjbGlwOiByZWN0KDFweCAxcHggMXB4IDFweCk7IC8qIElFNiwgSUU3ICovXFxuICBjbGlwOiByZWN0KDFweCwgMXB4LCAxcHgsIDFweCk7XFxufVxcbmltZyB7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiBhdXRvO1xcbn1cXG5hIHtcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG4gIGNvbG9yOiAjMGQ0MTVmO1xcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiAwLjNzIGVhc2UgYWxsO1xcbiAgdHJhbnNpdGlvbjogMC4zcyBlYXNlIGFsbDtcXG4gIHBhZGRpbmc6IDAgMCAzcHg7XFxuICBib3JkZXItYm90dG9tOiAzcHggc29saWQgI2ZmZmZmZjtcXG59XFxuYTpob3ZlciB7XFxuICBjb2xvcjogIzBkNDE1ZjtcXG4gIGJvcmRlci1ib3R0b206IDNweCBzb2xpZCAjMGQ0MTVmO1xcbn1cXG4vKiAgLS0tLS0tLS0gTWVkaWEgUXVlcmllcyAtLS0tLS0tICovXFxuLyogTW9iaWxlICovXFxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWluLXdpZHRoOiAzMjBweCkgYW5kIChtYXgtd2lkdGg6IDQ4MHB4KSB7XFxuICBoMSB7XFxuICAgIG1hcmdpbi10b3A6IDA7XFxuICAgIGZvbnQtc2l6ZTogMi4wNzRlbTtcXG4gIH1cXG4gIFxcbiAgaDIge1xcbiAgICBmb250LXNpemU6IDEuNzI4ZW07XFxuICB9XFxuICBcXG4gIGgzIHtcXG4gICAgZm9udC1zaXplOiAxLjQ0ZW07XFxuICB9XFxuICBcXG4gIGg0IHtcXG4gICAgZm9udC1zaXplOiAxLjJlbTtcXG4gIH1cXG59XFxuLyogVGFibGV0ICovXFxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWluLXdpZHRoOiA0ODBweCkgYW5kIChtYXgtd2lkdGg6IDgwMHB4KSB7XFxuICBoMSB7XFxuICAgICAgZm9udC1zaXplOiAyLjk1N2VtO1xcbiAgfVxcblxcbiAgaDIge1xcbiAgICAgIGZvbnQtc2l6ZTogMi4zNjllbTtcXG4gIH1cXG5cXG4gIGgzIHtcXG4gICAgICBmb250LXNpemU6IDEuNzc3ZW07XFxuICB9XFxuXFxuICBoNCB7XFxuICAgICAgZm9udC1zaXplOiAxLjMzM2VtO1xcbiAgfVxcbn1cIiwgXCJcIiwge1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiL1VzZXJzL2l2YW5saW1vbmdhbi9Eb2N1bWVudHMvNDAxL2FydC1nYWxsZXJ5L2NvbXBvbmVudHMvdmFyaWFibGVzLmNzc1wiLFwiL1VzZXJzL2l2YW5saW1vbmdhbi9Eb2N1bWVudHMvNDAxL2FydC1nYWxsZXJ5L21haW4uY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQVlBO0VBQ0UsZUFBZTtDQUNoQjtBQ1pELE1BQU0sYUFBYSxDQUFDO0FBRXBCO0VBQ0UsMkNBQTJDO0VBQzNDLHNDQUFzQztFQUN0QyxpQkFBaUI7RUFDakIsZUFBYztFQUNkLGlCQUFpQjtDQUNsQjtBQUVEO0VBQ0UscUJBQXFCO0VBQ3JCLGlCQUFpQjtDQUNsQjtBQUVELDZDQUE2QztBQUM3QztFQUNFLDBCQUEwQjtFQUMxQixpQkFBaUI7RUFDakIsb0JBQW9CO0VBQ3BCLDBCQUEwQjtFQUMxQixvQkFBb0I7RUFDcEIsZUFBYztFQUNkLGlCQUFpQjtFQUNqQixxQ0FBcUM7Q0FDdEM7QUFFRDtFQUNFLGNBQWM7RUFDZCxtQkFBbUI7Q0FDcEI7QUFFRCxJQUFJLG1CQUFtQixDQUFDO0FBRXhCLElBQUksbUJBQW1CLENBQUM7QUFFeEIsSUFBSSxtQkFBbUIsQ0FBQztBQUV4QixnQ0FBZ0MsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCLENBQUM7QUFFdkYsdUZBQXVGO0FBQ3ZGO0VBQ0UsOEJBQThCO0VBQzlCLDRCQUE0QixDQUFDLGNBQWM7RUFDM0MsK0JBQStCO0NBQ2hDO0FBRUQ7RUFDRSxlQUFlO0VBQ2YsWUFBWTtFQUNaLGFBQWE7Q0FDZDtBQUVEO0VBQ0Usc0JBQXNCO0VBQ3RCLGVBQWE7RUFDYixrQ0FBMEI7RUFBMUIsMEJBQTBCO0VBQzFCLGlCQUFpQjtFQUNqQixpQ0FBZ0M7Q0FDakM7QUFFRDtFQUNFLGVBQWE7RUFDYixpQ0FBK0I7Q0FDaEM7QUFFRCxxQ0FBcUM7QUFFckMsWUFBWTtBQUNaO0VBQ0U7SUFDRSxjQUFjO0lBQ2QsbUJBQW1CO0dBQ3BCOztFQUVEO0lBQ0UsbUJBQW1CO0dBQ3BCOztFQUVEO0lBQ0Usa0JBQWtCO0dBQ25COztFQUVEO0lBQ0UsaUJBQWlCO0dBQ2xCO0NBQ0Y7QUFFRCxZQUFZO0FBQ1o7RUFDRTtNQUNJLG1CQUFtQjtHQUN0Qjs7RUFFRDtNQUNJLG1CQUFtQjtHQUN0Qjs7RUFFRDtNQUNJLG1CQUFtQjtHQUN0Qjs7RUFFRDtNQUNJLG1CQUFtQjtHQUN0QjtDQUNGXCIsXCJmaWxlXCI6XCJtYWluLmNzc1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCIkYWNjZW50OiAjYzk1MTUxO1xcbiRsaW5rOiAjMGQ0MTVmO1xcbiRkYXJrbGluazogIzAwN0JDMjtcXG4kbGlnaHRncmF5OiAjZWVlZWVlO1xcbiRkYXJrZ3JheTogIzQ0NDE0MDtcXG4kd2hpdGU6ICNmZmZmZmY7XFxuJGdyYXk6ICNFMEUwRTA7XFxuJGJsYWNrOiAjMDAwMDAwO1xcblxcbiRtYXhWaWV3cG9ydFNpemU6IDEyODBweDtcXG4kcGFkZGluZzogMnJlbTtcXG5cXG5zZWN0aW9uIHtcXG4gIGNvbG9yOiAjYzk1MTUxO1xcbn1cIixcIkBpbXBvcnQgJy4vY29tcG9uZW50cy92YXJpYWJsZXMuY3NzJztcXG5cXG5odG1sIHtoZWlnaHQ6IDEwMCU7fVxcblxcbmJvZHkge1xcbiAgLyogZm9udC1mYW1pbHk6ICdXb3JrIFNhbnMnLCBzYW5zLXNlcmlmOyAqL1xcbiAgZm9udC1mYW1pbHk6ICdJbmNvbnNvbGF0YScsIG1vbm9zcGFjZTtcXG4gIGZvbnQtd2VpZ2h0OiA0MDA7XFxuICBjb2xvcjogJGJsYWNrO1xcbiAgbWluLWhlaWdodDogMTAwJTtcXG59XFxuXFxucCB7XFxuICBtYXJnaW4tYm90dG9tOiAxLjNlbTtcXG4gIGxpbmUtaGVpZ2h0OiAxLjc7XFxufVxcblxcbi8qIEZvbnQgc2l6aW5nIGZyb20gaHR0cDovL3R5cGUtc2NhbGUuY29tLyAqL1xcbmgxLCBoMiwgaDMsIGg0IHtcXG4gIC8qIG1hcmdpbjogMWVtIDAgMC41ZW07ICovXFxuICBsaW5lLWhlaWdodDogMS4xO1xcbiAgbGV0dGVyLXNwYWNpbmc6IDJweDtcXG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XFxuICBwYWRkaW5nOiAwIDAgMXJlbSAwO1xcbiAgY29sb3I6ICRibGFjaztcXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XFxuICBmb250LWZhbWlseTogJ1dvcmsgU2FucycsIHNhbnMtc2VyaWY7XFxufVxcblxcbmgxIHtcXG4gIG1hcmdpbi10b3A6IDA7XFxuICBmb250LXNpemU6IDMuNTk4ZW07XFxufVxcblxcbmgyIHtmb250LXNpemU6IDIuODI3ZW07fVxcblxcbmgzIHtmb250LXNpemU6IDEuOTk5ZW07fVxcblxcbmg0IHtmb250LXNpemU6IDEuNDE0ZW07fVxcblxcbmZpZ2NhcHRpb24sIHNtYWxsLCAuZm9udF9zbWFsbCB7Zm9udC1zaXplOiAwLjhlbTsgcGFkZGluZzogMCAwIDJyZW07IGZvbnQtd2VpZ2h0OiA1MDA7fVxcblxcbi8qIGhpZGUgc2NyZWVuLXJlYWRlciBvbmx5IHRleHQuIGh0dHBzOi8vd2ViYWltLm9yZy90ZWNobmlxdWVzL2Nzcy9pbnZpc2libGVjb250ZW50LyAqL1xcbi5jbGlwIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZSAhaW1wb3J0YW50O1xcbiAgY2xpcDogcmVjdCgxcHggMXB4IDFweCAxcHgpOyAvKiBJRTYsIElFNyAqL1xcbiAgY2xpcDogcmVjdCgxcHgsIDFweCwgMXB4LCAxcHgpO1xcbn1cXG5cXG5pbWcge1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogYXV0bztcXG59XFxuXFxuYSB7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICBjb2xvcjogJGxpbms7XFxuICB0cmFuc2l0aW9uOiAwLjNzIGVhc2UgYWxsO1xcbiAgcGFkZGluZzogMCAwIDNweDtcXG4gIGJvcmRlci1ib3R0b206IDNweCBzb2xpZCAkd2hpdGU7XFxufVxcblxcbmE6aG92ZXIge1xcbiAgY29sb3I6ICRsaW5rO1xcbiAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkICRsaW5rO1xcbn1cXG5cXG4vKiAgLS0tLS0tLS0gTWVkaWEgUXVlcmllcyAtLS0tLS0tICovXFxuXFxuLyogTW9iaWxlICovXFxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWluLXdpZHRoOiAzMjBweCkgYW5kIChtYXgtd2lkdGg6IDQ4MHB4KSB7XFxuICBoMSB7XFxuICAgIG1hcmdpbi10b3A6IDA7XFxuICAgIGZvbnQtc2l6ZTogMi4wNzRlbTtcXG4gIH1cXG4gIFxcbiAgaDIge1xcbiAgICBmb250LXNpemU6IDEuNzI4ZW07XFxuICB9XFxuICBcXG4gIGgzIHtcXG4gICAgZm9udC1zaXplOiAxLjQ0ZW07XFxuICB9XFxuICBcXG4gIGg0IHtcXG4gICAgZm9udC1zaXplOiAxLjJlbTtcXG4gIH1cXG59XFxuXFxuLyogVGFibGV0ICovXFxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWluLXdpZHRoOiA0ODBweCkgYW5kIChtYXgtd2lkdGg6IDgwMHB4KSB7XFxuICBoMSB7XFxuICAgICAgZm9udC1zaXplOiAyLjk1N2VtO1xcbiAgfVxcblxcbiAgaDIge1xcbiAgICAgIGZvbnQtc2l6ZTogMi4zNjllbTtcXG4gIH1cXG5cXG4gIGgzIHtcXG4gICAgICBmb250LXNpemU6IDEuNzc3ZW07XFxuICB9XFxuXFxuICBoNCB7XFxuICAgICAgZm9udC1zaXplOiAxLjMzM2VtO1xcbiAgfVxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlcj97XCJpbXBvcnRMb2FkZXJzXCI6MSxcInNvdXJjZU1hcFwiOnRydWV9IS4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYj97XCJzb3VyY2VNYXBcIjp0cnVlfSEuL3NyYy9tYWluLmNzc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFRlbXBsYXRlIGZyb20gJy4uL1RlbXBsYXRlJztcbmltcG9ydCBodG1sIGZyb20gJy4vYXBwLmh0bWwnO1xuaW1wb3J0ICcuL2FwcC5jc3MnO1xuaW1wb3J0IEhlYWRlciBmcm9tICcuL2hlYWRlci9IZWFkZXInO1xuaW1wb3J0IEhvbWUgZnJvbSAnLi4vaG9tZS9Ib21lJztcbmltcG9ydCBQb3J0bGFuZCBmcm9tICcuLi9wb3J0bGFuZC9Qb3J0bGFuZCc7XG5pbXBvcnQgQnJvb2tseW4gZnJvbSAnLi4vYnJvb2tseW4vQnJvb2tseW4nO1xuaW1wb3J0IEZvb3RlciBmcm9tICcuL2Zvb3Rlci9Gb290ZXIuanMnO1xuaW1wb3J0IHsgcmVtb3ZlQ2hpbGRyZW4gfSBmcm9tICcuLi9kb20nO1xuXG5jb25zdCB0ZW1wbGF0ZSA9IG5ldyBUZW1wbGF0ZShodG1sKTtcblxuLy8gSGFzaCBOYXZpZ2F0aW9uXG5jb25zdCBtYXAgPSBuZXcgTWFwKCk7XG5tYXAuc2V0KCcjcG9ydGxhbmQnLCBQb3J0bGFuZCk7XG5tYXAuc2V0KCcjYnJvb2tseW4nLCBCcm9va2x5bik7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcCB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5oYXNoQ2hhbmdlID0gKCkgPT4gdGhpcy5zZXRQYWdlKCk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLmhhc2hDaGFuZ2UpO1xuICB9XG4gIFxuICBzZXRQYWdlKCkge1xuICAgIGNvbnN0IHJvdXRlcyA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNwbGl0KCcvJyk7XG4gICAgY29uc3QgcGFnZSA9IHJvdXRlc1swXTtcbiAgICBpZihwYWdlID09PSB0aGlzLnBhZ2UpIHJldHVybjtcblxuICAgIC8vIGlmKHRoaXMucGFnZUNvbXBvbmVudCkgdGhpcy5wYWdlQ29tcG9uZW50LnVucmVuZGVyKCk7XG4gICAgdGhpcy5wYWdlID0gcGFnZTtcbiAgICBjb25zdCBDb21wb25lbnQgPSBtYXAuZ2V0KHRoaXMucGFnZSkgfHwgSG9tZTtcbiAgICB0aGlzLnBhZ2VDb21wb25lbnQgPSBuZXcgQ29tcG9uZW50KCk7XG4gICAgcmVtb3ZlQ2hpbGRyZW4odGhpcy5tYWluKTtcbiAgICB0aGlzLm1haW4uYXBwZW5kQ2hpbGQodGhpcy5wYWdlQ29tcG9uZW50LnJlbmRlcigpKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkb20gPSB0ZW1wbGF0ZS5jbG9uZSgpOyAgIFxuICAgICAgXG4gICAgZG9tLnF1ZXJ5U2VsZWN0b3IoJ2hlYWRlcicpLmFwcGVuZENoaWxkKG5ldyBIZWFkZXIoKS5yZW5kZXIoKSk7XG4gICAgZG9tLnF1ZXJ5U2VsZWN0b3IoJ2Zvb3RlcicpLmFwcGVuZENoaWxkKG5ldyBGb290ZXIoKS5yZW5kZXIoKSk7XG5cbiAgICB0aGlzLm1haW4gPSBkb20ucXVlcnlTZWxlY3RvcignbWFpbicpO1xuICAgIHRoaXMuc2V0UGFnZSgpO1xuXG4gICAgcmV0dXJuIGRvbTtcbiAgfVxuXG4gIHVucmVuZGVyKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgdGhpcy5oYXNoQ2hhbmdlKTtcbiAgfVxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvYXBwL0FwcC5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxoZWFkZXIgcm9sZT1cXFwiYmFubmVyXFxcIiBpZD1cXFwiaGVhZGVyXFxcIj48L2hlYWRlcj5cXG5cXG48bWFpbiByb2xlPVxcXCJtYWluXFxcIiBpZD1cXFwibWFpblxcXCIgY2xhc3M9XFxcImNvbnRlbnRcXFwiPjwvbWFpbj5cXG5cXG48Zm9vdGVyIHJvbGU9XFxcImNvbnRlbnRpbmZvXFxcIiBpZD1cXFwiZm9vdGVyXFxcIj48L2Zvb3Rlcj5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21wb25lbnRzL2FwcC9hcHAuaHRtbFxuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMiEuL2FwcC5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge1wic291cmNlTWFwXCI6dHJ1ZSxcImhtclwiOnRydWV9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9hcHAuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9hcHAuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21wb25lbnRzL2FwcC9hcHAuY3NzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHRydWUpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwic2VjdGlvbiB7XFxuICBjb2xvcjogI2M5NTE1MTtcXG59XFxuI3Jvb3Qge1xcbiAgbWluLWhlaWdodDogMTAwdmg7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1hcmVhczpcXG4gIFxcXCJoZWFkZXJcXFwiXFxuICBcXFwiY29udGVudFxcXCJcXG4gIFxcXCJmb290ZXJcXFwiO1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiBhdXRvIDFmciBhdXRvO1xcbn1cXG4ubWF4d2lkdGgtd3JhcCB7XFxuICAvKiB3aWR0aDogMTAwJTsgKi9cXG4gIG1heC13aWR0aDogMTI4MHB4O1xcbiAgbWFyZ2luOiAwIGF1dG87XFxufVxcbiNoZWFkZXIge1xcbiAgZ3JpZC1hcmVhOiBoZWFkZXI7XFxuICAvKiBiYWNrZ3JvdW5kOiAkd2hpdGU7ICovXFxuICAvKiBjb2xvcjogJGJsYWNrOyAqL1xcbiAgcGFkZGluZzogMnJlbTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuI21haW4ge1xcbiAgZ3JpZC1hcmVhOiBjb250ZW50O1xcbiAgLyogYmFja2dyb3VuZDogJGJsYWNrOyAqL1xcbn1cXG4jZm9vdGVyIHtcXG4gIGdyaWQtYXJlYTogZm9vdGVyO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgcGFkZGluZzogMnJlbSAycmVtIDFyZW07XFxuICAvKiBiYWNrZ3JvdW5kOiAkYmxhY2s7ICovXFxufVwiLCBcIlwiLCB7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCIvVXNlcnMvaXZhbmxpbW9uZ2FuL0RvY3VtZW50cy80MDEvdmFyaWFibGVzLmNzc1wiLFwiL1VzZXJzL2l2YW5saW1vbmdhbi9Eb2N1bWVudHMvNDAxL2FydC1nYWxsZXJ5L2FwcC5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBWUE7RUFDRSxlQUFlO0NBQ2hCO0FDWkQ7RUFDRSxrQkFBa0I7RUFDbEIsY0FBYztFQUNkOzs7V0FHUztFQUNULGtDQUFrQztDQUNuQztBQUVEO0VBQ0Usa0JBQWtCO0VBQ2xCLGtCQUE0QjtFQUM1QixlQUFlO0NBQ2hCO0FBRUQ7RUFDRSxrQkFBa0I7RUFDbEIseUJBQXlCO0VBQ3pCLG9CQUFvQjtFQUNwQixjQUFrQjtFQUNsQixtQkFBbUI7Q0FDcEI7QUFFRDtFQUNFLG1CQUFtQjtFQUNuQix5QkFBeUI7Q0FDMUI7QUFFRDtFQUNFLGtCQUFrQjtFQUNsQixtQkFBbUI7RUFDbkIsd0JBQXdCO0VBQ3hCLHlCQUF5QjtDQUMxQlwiLFwiZmlsZVwiOlwiYXBwLmNzc1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCIkYWNjZW50OiAjYzk1MTUxO1xcbiRsaW5rOiAjMGQ0MTVmO1xcbiRkYXJrbGluazogIzAwN0JDMjtcXG4kbGlnaHRncmF5OiAjZWVlZWVlO1xcbiRkYXJrZ3JheTogIzQ0NDE0MDtcXG4kd2hpdGU6ICNmZmZmZmY7XFxuJGdyYXk6ICNFMEUwRTA7XFxuJGJsYWNrOiAjMDAwMDAwO1xcblxcbiRtYXhWaWV3cG9ydFNpemU6IDEyODBweDtcXG4kcGFkZGluZzogMnJlbTtcXG5cXG5zZWN0aW9uIHtcXG4gIGNvbG9yOiAjYzk1MTUxO1xcbn1cIixcIkBpbXBvcnQgJy4uL3ZhcmlhYmxlcy5jc3MnO1xcblxcbiNyb290IHtcXG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGUtYXJlYXM6XFxuICBcXFwiaGVhZGVyXFxcIlxcbiAgXFxcImNvbnRlbnRcXFwiXFxuICBcXFwiZm9vdGVyXFxcIjtcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogYXV0byAxZnIgYXV0bztcXG59XFxuXFxuLm1heHdpZHRoLXdyYXAge1xcbiAgLyogd2lkdGg6IDEwMCU7ICovXFxuICBtYXgtd2lkdGg6ICRtYXhWaWV3cG9ydFNpemU7XFxuICBtYXJnaW46IDAgYXV0bztcXG59XFxuXFxuI2hlYWRlciB7XFxuICBncmlkLWFyZWE6IGhlYWRlcjtcXG4gIC8qIGJhY2tncm91bmQ6ICR3aGl0ZTsgKi9cXG4gIC8qIGNvbG9yOiAkYmxhY2s7ICovXFxuICBwYWRkaW5nOiAkcGFkZGluZztcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuXFxuI21haW4ge1xcbiAgZ3JpZC1hcmVhOiBjb250ZW50O1xcbiAgLyogYmFja2dyb3VuZDogJGJsYWNrOyAqL1xcbn1cXG5cXG4jZm9vdGVyIHtcXG4gIGdyaWQtYXJlYTogZm9vdGVyO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgcGFkZGluZzogMnJlbSAycmVtIDFyZW07XFxuICAvKiBiYWNrZ3JvdW5kOiAkYmxhY2s7ICovXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyP3tcImltcG9ydExvYWRlcnNcIjoxLFwic291cmNlTWFwXCI6dHJ1ZX0hLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliP3tcInNvdXJjZU1hcFwiOnRydWV9IS4vc3JjL2NvbXBvbmVudHMvYXBwL2FwcC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBodG1sIGZyb20gJy4vaGVhZGVyLmh0bWwnO1xuaW1wb3J0ICcuL2hlYWRlci5jc3MnO1xuaW1wb3J0IFRlbXBsYXRlIGZyb20gJy4uLy4uL1RlbXBsYXRlJztcblxuY29uc3QgdGVtcGxhdGUgPSBuZXcgVGVtcGxhdGUoaHRtbCk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlYWRlciB7XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGRvbSA9IHRlbXBsYXRlLmNsb25lKCk7XG5cbiAgICByZXR1cm4gZG9tO1xuICB9XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy9hcHAvaGVhZGVyL0hlYWRlci5qc1xuLy8gbW9kdWxlIGlkID0gMTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxzZWN0aW9uIGNsYXNzPVxcXCJtYXh3aWR0aC13cmFwIGhlYWRlci1mbGV4XFxcIj5cXG4gIDxkaXY+XFxuICAgIDxhIGhyZWY9XFxcIiNob21lXFxcIiBjbGFzcz1cXFwibG9nby10ZXh0XFxcIiBhbHQ9XFxcIkdvIHRvIEhvbWUgcGFnZVxcXCI+TXVyYWwg4oCUIENvbGxlY3RpdmU8L2E+XFxuICA8L2Rpdj5cXG4gIDxuYXYgcm9sZT1cXFwibmF2aWdhdGlvblxcXCI+XFxuICAgIDx1bCBjbGFzcz1cXFwidWxpc3RcXFwiPlxcbiAgICAgIDxsaT48YSBocmVmPVxcXCIjaG9tZVxcXCIgYWx0PVxcXCJHbyB0byAgcGFnZVxcXCI+MDAgLSBNQUlOPC9hPjwvbGk+XFxuICAgICAgPGxpPjxhIGhyZWY9XFxcIiNwb3J0bGFuZFxcXCIgYWx0PVxcXCJHbyB0byBwb3J0bGFuZCBwYWdlXFxcIj4wMSAtIFBEWDwvYT48L2xpPlxcbiAgICAgIDxsaT48YSBocmVmPVxcXCIjYnJvb2tseW5cXFwiIGFsdD1cXFwiR28gdG8gYnJvb2tseW4gcGFnZVxcXCI+MDIgLSBCS1lMTjwvYT48L2xpPlxcbiAgICA8L3VsPlxcbiAgPC9uYXY+XFxuPC9zZWN0aW9uPlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvYXBwL2hlYWRlci9oZWFkZXIuaHRtbFxuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzPz9yZWYtLTEtMSEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTEtMiEuL2hlYWRlci5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge1wic291cmNlTWFwXCI6dHJ1ZSxcImhtclwiOnRydWV9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9oZWFkZXIuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9oZWFkZXIuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21wb25lbnRzL2FwcC9oZWFkZXIvaGVhZGVyLmNzc1xuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh0cnVlKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcInNlY3Rpb24ge1xcbiAgY29sb3I6ICNjOTUxNTE7XFxufVxcbi5oZWFkZXItZmxleCB7XFxuICBkaXNwbGF5OiAtd2Via2l0LWJveDtcXG4gIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIC13ZWJraXQtYm94LXBhY2s6IGp1c3RpZnk7XFxuICAgICAgLW1zLWZsZXgtcGFjazoganVzdGlmeTtcXG4gICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcbiAgLXdlYmtpdC1ib3gtYWxpZ246IGNlbnRlcjtcXG4gICAgICAtbXMtZmxleC1hbGlnbjogY2VudGVyO1xcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG4ubG9nbyB7XFxuICBtYXgtd2lkdGg6IDIxcmVtO1xcbn1cXG4ubG9nby10ZXh0IHtcXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgY29sb3I6ICNjOTUxNTE7XFxuICBmb250LXdlaWdodDogNzAwO1xcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcXG4gIGZvbnQtZmFtaWx5OiAnV29yayBTYW5zJywgc2Fucy1zZXJpZjtcXG59XFxuLnVsaXN0IHtcXG4gIGRpc3BsYXk6IC13ZWJraXQtYm94O1xcbiAgZGlzcGxheTogLW1zLWZsZXhib3g7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgLXdlYmtpdC1ib3gtcGFjazogY2VudGVyO1xcbiAgICAgIC1tcy1mbGV4LXBhY2s6IGNlbnRlcjtcXG4gICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBtYXJnaW46IDA7XFxufVxcbi51bGlzdCBsaSB7XFxuICAgIHBhZGRpbmc6IDAgMXJlbTtcXG4gIH1cXG4udWxpc3QgbGkgYSB7XFxuICAgICAgY29sb3I6ICMwMDAwMDA7XFxuICAgICAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkICNmZmZmZmY7XFxuICAgICAgLXdlYmtpdC10cmFuc2l0aW9uOiAwLjNzIGVhc2UgYWxsO1xcbiAgICAgIHRyYW5zaXRpb246IDAuM3MgZWFzZSBhbGw7XFxuICAgIH1cXG4udWxpc3QgbGkgYTpob3ZlciB7XFxuICAgICAgYm9yZGVyLWJvdHRvbS1jb2xvcjogIzBkNDE1ZjtcXG4gICAgfVxcbm5hdiB7XFxuICAtd2Via2l0LWJveC1wYWNrOiBlbmQ7XFxuICAgICAgLW1zLWZsZXgtcGFjazogZW5kO1xcbiAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xcbn1cXG4vKiAgLS0tLS0tLS0gTWVkaWEgUXVlcmllcyAtLS0tLS0tICovXFxuLyogTW9iaWxlICovXFxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWluLXdpZHRoOiAzMjBweCkgYW5kIChtYXgtd2lkdGg6IDY0MHB4KSB7XFxuICAuaGVhZGVyLWZsZXgge1xcbiAgICAtd2Via2l0LWJveC1vcmllbnQ6IHZlcnRpY2FsO1xcbiAgICAtd2Via2l0LWJveC1kaXJlY3Rpb246IG5vcm1hbDtcXG4gICAgICAgIC1tcy1mbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICB9XFxuXFxuICAudWxpc3Qge1xcbiAgICBtYXJnaW46IDEuMXJlbSAwIDA7XFxuICB9XFxufVwiLCBcIlwiLCB7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCIvVXNlcnMvaXZhbmxpbW9uZ2FuL0RvY3VtZW50cy92YXJpYWJsZXMuY3NzXCIsXCIvVXNlcnMvaXZhbmxpbW9uZ2FuL0RvY3VtZW50cy80MDEvYXJ0LWdhbGxlcnkvaGVhZGVyLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFZQTtFQUNFLGVBQWU7Q0FDaEI7QUNaRDtFQUNFLHFCQUFjO0VBQWQscUJBQWM7RUFBZCxjQUFjO0VBQ2QsMEJBQStCO01BQS9CLHVCQUErQjtVQUEvQiwrQkFBK0I7RUFDL0IsMEJBQW9CO01BQXBCLHVCQUFvQjtVQUFwQixvQkFBb0I7Q0FDckI7QUFFRDtFQUNFLGlCQUFpQjtDQUNsQjtBQUVEO0VBQ0Usa0JBQWtCO0VBQ2xCLGVBQWU7RUFDZixpQkFBaUI7RUFDakIsMEJBQTBCO0VBQzFCLHFDQUFxQztDQUN0QztBQUVEO0VBQ0UscUJBQWM7RUFBZCxxQkFBYztFQUFkLGNBQWM7RUFDZCx5QkFBd0I7TUFBeEIsc0JBQXdCO1VBQXhCLHdCQUF3QjtFQUN4QixVQUFVO0NBWVg7QUFYQztJQUNFLGdCQUFnQjtHQVNqQjtBQVJDO01BQ0UsZUFBYztNQUNkLGlDQUFnQztNQUNoQyxrQ0FBMEI7TUFBMUIsMEJBQTBCO0tBQzNCO0FBQ0Q7TUFDRSw2QkFBMkI7S0FDNUI7QUFJTDtFQUNFLHNCQUEwQjtNQUExQixtQkFBMEI7VUFBMUIsMEJBQTBCO0NBQzNCO0FBRUQscUNBQXFDO0FBRXJDLFlBQVk7QUFDWjtFQUNFO0lBQ0UsNkJBQXVCO0lBQXZCLDhCQUF1QjtRQUF2QiwyQkFBdUI7WUFBdkIsdUJBQXVCO0dBQ3hCOztFQUVEO0lBQ0UsbUJBQW1CO0dBQ3BCO0NBQ0ZcIixcImZpbGVcIjpcImhlYWRlci5jc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiJGFjY2VudDogI2M5NTE1MTtcXG4kbGluazogIzBkNDE1ZjtcXG4kZGFya2xpbms6ICMwMDdCQzI7XFxuJGxpZ2h0Z3JheTogI2VlZWVlZTtcXG4kZGFya2dyYXk6ICM0NDQxNDA7XFxuJHdoaXRlOiAjZmZmZmZmO1xcbiRncmF5OiAjRTBFMEUwO1xcbiRibGFjazogIzAwMDAwMDtcXG5cXG4kbWF4Vmlld3BvcnRTaXplOiAxMjgwcHg7XFxuJHBhZGRpbmc6IDJyZW07XFxuXFxuc2VjdGlvbiB7XFxuICBjb2xvcjogI2M5NTE1MTtcXG59XCIsXCJAaW1wb3J0ICcuLi8uLi92YXJpYWJsZXMuY3NzJztcXG5cXG4uaGVhZGVyLWZsZXgge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5sb2dvIHtcXG4gIG1heC13aWR0aDogMjFyZW07XFxufVxcblxcbi5sb2dvLXRleHQge1xcbiAgZm9udC1zaXplOiAxLjVyZW07XFxuICBjb2xvcjogJGFjY2VudDtcXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XFxuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xcbiAgZm9udC1mYW1pbHk6ICdXb3JrIFNhbnMnLCBzYW5zLXNlcmlmO1xcbn1cXG5cXG4udWxpc3Qge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgbWFyZ2luOiAwO1xcbiAgbGkge1xcbiAgICBwYWRkaW5nOiAwIDFyZW07XFxuICAgIGEge1xcbiAgICAgIGNvbG9yOiAkYmxhY2s7XFxuICAgICAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkICR3aGl0ZTtcXG4gICAgICB0cmFuc2l0aW9uOiAwLjNzIGVhc2UgYWxsO1xcbiAgICB9XFxuICAgIGE6aG92ZXIge1xcbiAgICAgIGJvcmRlci1ib3R0b20tY29sb3I6ICRsaW5rO1xcbiAgICB9XFxuICB9XFxufVxcblxcbm5hdiB7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xcbn1cXG5cXG4vKiAgLS0tLS0tLS0gTWVkaWEgUXVlcmllcyAtLS0tLS0tICovXFxuXFxuLyogTW9iaWxlICovXFxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWluLXdpZHRoOiAzMjBweCkgYW5kIChtYXgtd2lkdGg6IDY0MHB4KSB7XFxuICAuaGVhZGVyLWZsZXgge1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgfVxcblxcbiAgLnVsaXN0IHtcXG4gICAgbWFyZ2luOiAxLjFyZW0gMCAwO1xcbiAgfVxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlcj97XCJpbXBvcnRMb2FkZXJzXCI6MSxcInNvdXJjZU1hcFwiOnRydWV9IS4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYj97XCJzb3VyY2VNYXBcIjp0cnVlfSEuL3NyYy9jb21wb25lbnRzL2FwcC9oZWFkZXIvaGVhZGVyLmNzc1xuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGh0bWwgZnJvbSAnLi9ob21lLmh0bWwnO1xuaW1wb3J0ICcuL2hvbWUuY3NzJztcbmltcG9ydCAnLi9zbGlkZS5jc3MnO1xuaW1wb3J0IFBpY3R1cmUgZnJvbSAnLi4vcGljdHVyZS9QaWN0dXJlJztcbmltcG9ydCBUZW1wbGF0ZSBmcm9tICcuLi9UZW1wbGF0ZSc7XG5cbmNvbnN0IHRlbXBsYXRlID0gbmV3IFRlbXBsYXRlKGh0bWwpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIb21lIHtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgZG9tID0gdGVtcGxhdGUuY2xvbmUoKTtcblxuICAgIGNvbnN0IGhlcm8gPSBuZXcgUGljdHVyZSh7XG4gICAgICBhc3BlY3RSYXRpb3M6IFsnMzoxJywgJzI6MScsICcxOjEnXSxcbiAgICAgIGJyZWFrcG9pbnRzOiBbMTEwMCwgOTAwLCA1MDBdLFxuICAgICAgb3B0aW9uczogJ2NfZmlsbCxnX2F1dG8scV9hdXRvLGdfZmFjZSxmX2F1dG8nLFxuICAgICAgZmlsZU5hbWU6ICd0b2EtaGVmdGliYS00MTc1MTBfY3M1M2tuLmpwZycsXG4gICAgICBhbHQ6ICdCZWFyIE11cmFsIGJ5IFRhbyBIZWZ0aWJhIHZpYSBVbnNwbGFzaC5jb20nXG4gICAgfSk7XG4gICAgY29uc3QgaGVyb0RvbSA9IGhlcm8ucmVuZGVyKCk7XG5cblxuICAgIGRvbS5xdWVyeVNlbGVjdG9yKCcjaGVybycpLmFwcGVuZENoaWxkKGhlcm9Eb20pO1xuXG4gICAgcmV0dXJuIGRvbTtcbiAgfVxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvaG9tZS9Ib21lLmpzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGFydGljbGUgY2xhc3M9XFxcIm1heHdpZHRoLXdyYXAgY29udGVudC1ncmlkXFxcIj5cXG5cXG4gIDxkaXYgaWQ9XFxcImhlcm9cXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJsYXllclxcXCI+PGgxPm11cmFsIOKAlCBjb2xsZWN0aXZlPC9oMT48L2Rpdj5cXG4gIDwvZGl2PlxcblxcbiAgPHNlY3Rpb24gY2xhc3M9XFxcImhvbWUtZ3JpZFxcXCI+XFxuICAgIDxkaXY+XFxuICAgICAgPGgyPkJ1aWxkaW5nIGNyZWF0aXZlIGNvbW11bml0aWVzIG9uZSBtdXJhbCBhdCBhIHRpbWUuPC9oMj5cXG4gICAgPC9kaXY+XFxuXFxuICAgIDxkaXY+XFxuICAgICAgPHA+PHNwYW4gY2xhc3M9XFxcInN1cFxcXCI+MDE8L3NwYW4+PGJyPm11cmFscyBpbjxhIGhyZWY9XFxcIiNwb3J0bGFuZFxcXCIgYWx0PVxcXCJHbyB0byBwb3J0bGFuZCBwYWdlXFxcIj48YnI+cG9ydGxhbmQ8L2E+PC9wPlxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPGRpdj5cXG4gICAgICA8cD48c3BhbiBjbGFzcz1cXFwic3VwXFxcIj4wMjwvc3Bhbj48YnI+bXVyYWxzIGluPGEgaHJlZj1cXFwiI2Jyb29rbHluXFxcIiBhbHQ9XFxcIkdvIHRvIGJyb29rbHluIHBhZ2VcXFwiPjxicj5icm9va2x5bjwvYT48L3A+XFxuICAgIDwvZGl2PlxcblxcbiAgPC9zZWN0aW9uPlxcblxcbiAgPGRpdiBjbGFzcz1cXFwiY3J5XFxcIj5cXG4gICAgPGgyPlxcXCJJIGNyeSBldmVyeSB0aW1lIEkgc2VlIGEgbXVyYWxcXFwiIDxicj48c3BhbiBjbGFzcz1cXFwiY3J5LXN1YlxcXCI+LXJhbmRvbSBieXN0YW5kZXI8L3NwYW4+PC9oMj5cXG4gIDwvZGl2PlxcbjwvYXJ0aWNsZT5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21wb25lbnRzL2hvbWUvaG9tZS5odG1sXG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vaG9tZS5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge1wic291cmNlTWFwXCI6dHJ1ZSxcImhtclwiOnRydWV9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9ob21lLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vaG9tZS5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvaG9tZS9ob21lLmNzc1xuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh0cnVlKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcInNlY3Rpb24ge1xcbiAgY29sb3I6ICNjOTUxNTE7XFxufVxcbiNoZXJvIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG59XFxuI2hlcm8gLmxheWVyIHtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgfVxcbiNoZXJvIHBpY3R1cmUgZmlnY2FwdGlvbiB7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG4uaG9tZS1ncmlkIGgyIHtcXG4gIGNvbG9yOiAjYzk1MTUxO1xcbiAgei1pbmRleDogNTtcXG4gIHBhZGRpbmc6IDJyZW07XFxuICBmb250LXNpemU6IDJyZW07XFxuICAtd2Via2l0LXRyYW5zaXRpb246IDAuM3MgZWFzZSBhbGw7XFxuICB0cmFuc2l0aW9uOiAwLjNzIGVhc2UgYWxsO1xcbn1cXG4uaG9tZS1ncmlkIGgyOmhvdmVyIHtcXG4gIGNvbG9yOiAjZmZmZmZmO1xcbn1cXG4uY3J5IHtcXG4gIGNvbG9yOiAjYzk1MTUxO1xcbiAgei1pbmRleDogNTtcXG4gIHBhZGRpbmc6IDRyZW07XFxuICAvKiBmb250LXNpemU6IDJyZW07ICovXFxuICAtd2Via2l0LXRyYW5zaXRpb246IDAuM3MgZWFzZSBhbGw7XFxuICB0cmFuc2l0aW9uOiAwLjNzIGVhc2UgYWxsO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2M5NTE1MTtcXG59XFxuLmNyeS1zdWIge1xcbiAgZm9udC1zaXplOiAxcmVtO1xcbn1cXG4uY3J5OmhvdmVyIHtcXG4gIGNvbG9yOiAjZmZmZmZmO1xcbiAgcGFkZGluZzogNHJlbSA0cmVtIDRyZW0gNXJlbTtcXG59XFxuLnN1cCB7XFxuICBmb250LXNpemU6IDNyZW07XFxuICBmb250LXdlaWdodDogNDAwO1xcbn1cXG4uY29udGVudC1ncmlkIHtcXG4gIHBhZGRpbmc6IDBweDtcXG59XFxuLmhvbWUtZ3JpZCB7XFxuICBkaXNwbGF5OiAtd2Via2l0LWJveDtcXG4gIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIC13ZWJraXQtYm94LW9yaWVudDogdmVydGljYWw7XFxuICAtd2Via2l0LWJveC1kaXJlY3Rpb246IG5vcm1hbDtcXG4gICAgICAtbXMtZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuLmhvbWUtZ3JpZCA+IGRpdjpudGgtY2hpbGQoMSkge1xcbiAgLXdlYmtpdC1ib3gtb3JkaW5hbC1ncm91cDogMjtcXG4gICAgICAtbXMtZmxleC1vcmRlcjogMTtcXG4gICAgICAgICAgb3JkZXI6IDE7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjRTBFMEUwO1xcbiAgcGFkZGluZzogMi41cmVtO1xcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiAwLjNzIGVhc2UgYWxsO1xcbiAgdHJhbnNpdGlvbjogMC4zcyBlYXNlIGFsbFxcbn1cXG4uaG9tZS1ncmlkID4gZGl2Om50aC1jaGlsZCgxKTpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYzk1MTUxO1xcbn1cXG4uaG9tZS1ncmlkID4gZGl2Om50aC1jaGlsZCgyKSB7XFxuICAtd2Via2l0LWJveC1vcmRpbmFsLWdyb3VwOiAzO1xcbiAgICAgIC1tcy1mbGV4LW9yZGVyOiAyO1xcbiAgICAgICAgICBvcmRlcjogMjtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7XFxuICBwYWRkaW5nOiAycmVtO1xcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiAwLjNzIGVhc2UgYWxsO1xcbiAgdHJhbnNpdGlvbjogMC4zcyBlYXNlIGFsbDtcXG4gIGNvbG9yOiAjZmZmZmZmO1xcbiAgdGV4dC1hbGlnbjpjZW50ZXJcXG59XFxuLmhvbWUtZ3JpZCA+IGRpdjpudGgtY2hpbGQoMik6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2M5NTE1MTtcXG59XFxuLmhvbWUtZ3JpZCA+IGRpdjpudGgtY2hpbGQoMikgYSB7XFxuICAgIGNvbG9yOiAjZmZmZmZmO1xcbn1cXG4uaG9tZS1ncmlkID4gZGl2Om50aC1jaGlsZCgyKSBhOmhvdmVyIHtcXG4gIC8qIGZvbnQtc2l6ZTogMS41cmVtOyAqL1xcbn1cXG4uaG9tZS1ncmlkID4gZGl2Om50aC1jaGlsZCgzKSB7XFxuICAtd2Via2l0LWJveC1vcmRpbmFsLWdyb3VwOiA0O1xcbiAgICAgIC1tcy1mbGV4LW9yZGVyOiAzO1xcbiAgICAgICAgICBvcmRlcjogMztcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7XFxuICBwYWRkaW5nOiAycmVtO1xcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiAwLjNzIGVhc2UgYWxsO1xcbiAgdHJhbnNpdGlvbjogMC4zcyBlYXNlIGFsbDtcXG4gIGNvbG9yOiAjZmZmZmZmO1xcbiAgdGV4dC1hbGlnbjpjZW50ZXJcXG59XFxuLmhvbWUtZ3JpZCA+IGRpdjpudGgtY2hpbGQoMyk6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2M5NTE1MTtcXG59XFxuLmhvbWUtZ3JpZCA+IGRpdjpudGgtY2hpbGQoMykgYSB7XFxuICAgIGNvbG9yOiAjZmZmZmZmO1xcbn1cXG4uaG9tZS1ncmlkID4gZGl2Om50aC1jaGlsZCgzKSBhOmhvdmVyIHtcXG4gIC8qIGZvbnQtc2l6ZTogMS41cmVtOyAqL1xcbn1cXG4vKiAuaG9tZS1ncmlkID4gZGl2Om50aC1jaGlsZCg0KSB7XFxuICBvcmRlcjogNDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICRibGFjaztcXG4gIHBhZGRpbmc6IDIuNXJlbTtcXG4gIHRyYW5zaXRpb246IDAuM3MgZWFzZSBhbGw7XFxuICBjb2xvcjogJHdoaXRlO1xcbiAgdGV4dC1hbGlnbjpjZW50ZXI7XFxuICBoZWlnaHQ6IDYxJTtcXG4gICY6aG92ZXIge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkZGFya2dyYXk7XFxuICB9XFxuICBhIHtcXG4gICAgY29sb3I6ICR3aGl0ZTtcXG4gIH1cXG59ICovXFxuLyogLS0tLS0tIE1lZGlhIFF1ZXJpZXMgLS0tLS0tLSAqL1xcbkBtZWRpYSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDkwMHB4KSB7XFxuICAvKiAuaG9tZS1ncmlkID4gZGl2Om50aC1jaGlsZCgxKSB7Z3JpZC1hcmVhOiBhOyB9XFxuICAuaG9tZS1ncmlkID4gZGl2Om50aC1jaGlsZCgyKSB7Z3JpZC1hcmVhOiBiOyB9XFxuICAuaG9tZS1ncmlkID4gZGl2Om50aC1jaGlsZCgzKSB7Z3JpZC1hcmVhOiBjOyB9ICovXFxuICAvKiAuaG9tZS1ncmlkID4gZGl2Om50aC1jaGlsZCg0KSB7Z3JpZC1hcmVhOiBkOyB9ICovXFxuICBcXG4gIC8qIC5ob21lLWdyaWQge1xcbiAgICBkaXNwbGF5OiBncmlkO1xcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgzLCAxZnIpO1xcbiAgICBncmlkLWF1dG8tcm93czogMWZyO1xcbiAgICBncmlkLXRlbXBsYXRlLWFyZWFzOlxcbiAgICBcXFwiYSBiIGNcXFwiXFxuICAgIFxcXCJhIGIgY1xcXCI7XFxuICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xcbiAgfSAqL1xcbiAgXFxuICAuaG9tZS1ncmlkIHtcXG4gICAgLXdlYmtpdC1ib3gtb3JpZW50OiBob3Jpem9udGFsO1xcbiAgICAtd2Via2l0LWJveC1kaXJlY3Rpb246IG5vcm1hbDtcXG4gICAgICAgIC1tcy1mbGV4LWRpcmVjdGlvbjogcm93O1xcbiAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxuICAgIC8qIGZsZXg6IDEgMCAzMCU7ICovXFxuICB9XFxuXFxuICAuaG9tZS1ncmlkID4gZGl2IHtcXG4gICAgd2lkdGg6IDMwJTtcXG4gICAgZGlzcGxheTogLXdlYmtpdC1ib3g7XFxuICAgIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICAtd2Via2l0LWJveC1hbGlnbjogY2VudGVyO1xcbiAgICAgICAgLW1zLWZsZXgtYWxpZ246IGNlbnRlcjtcXG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICAtd2Via2l0LWJveC1wYWNrOiBjZW50ZXI7XFxuICAgICAgICAtbXMtZmxleC1wYWNrOiBjZW50ZXI7XFxuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICB9XFxuICAgIC5ob21lLWdyaWQgPiBkaXYgcCB7XFxuICAgICAgZm9udC1zaXplOiAxLjNyZW07XFxuICAgIH1cXG5cXG4gICNoZXJvIHtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgfVxcbiAgICAjaGVybyAubGF5ZXIge1xcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgICAvKiBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsMCwwLDAuMSk7ICovXFxuICAgICAgd2lkdGg6IDEwMCU7XFxuICAgICAgaGVpZ2h0OiAxMDAlO1xcbiAgICAgIC13ZWJraXQtdHJhbnNpdGlvbjogMC4zcyBlYXNlIGFsbDtcXG4gICAgICB0cmFuc2l0aW9uOiAwLjNzIGVhc2UgYWxsO1xcbiAgICAgIG9wYWNpdHk6IDFcXG4gICAgfVxcbiAgICAjaGVybyAubGF5ZXI6aG92ZXIge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI0MSwgMTE5LCAxMTksIDAuOCk7XFxuICAgIG9wYWNpdHk6IDE7XFxuICB9XFxuICAgICNoZXJvIC5sYXllciBoMSB7XFxuICAgICAgICBkaXNwbGF5OiAtd2Via2l0LWJveDtcXG4gICAgICAgIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xcbiAgICAgICAgZGlzcGxheTogZmxleDtcXG4gICAgICAgIC13ZWJraXQtYm94LWFsaWduOiBjZW50ZXI7XFxuICAgICAgICAgICAgLW1zLWZsZXgtYWxpZ246IGNlbnRlcjtcXG4gICAgICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgICAgIC13ZWJraXQtYm94LXBhY2s6IGNlbnRlcjtcXG4gICAgICAgICAgICAtbXMtZmxleC1wYWNrOiBjZW50ZXI7XFxuICAgICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgICAgICAgY29sb3I6ICNmZmZmZmY7XFxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgICAgICB0b3A6IDA7XFxuICAgICAgICBsZWZ0OiAwO1xcbiAgICAgICAgd2lkdGg6IDEwMCU7XFxuICAgICAgICBoZWlnaHQ6IDEwMCU7XFxuICB9XFxuICBcXG4gIC8qIC5ob21lLWdyaWQgPiBkaXY6bnRoLWNoaWxkKDEpIHttYXgtd2lkdGg6IDUwJTsgfSAqL1xcbiAgLyogLmhvbWUtZ3JpZCA+IGRpdjpudGgtY2hpbGQoMikge3BhZGRpbmc6IDAgNXJlbTsgfVxcbiAgLmhvbWUtZ3JpZCA+IGRpdjpudGgtY2hpbGQoMykge3BhZGRpbmc6IDAgNXJlbTsgfSAqL1xcbn1cIiwgXCJcIiwge1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiL1VzZXJzL2l2YW5saW1vbmdhbi9Eb2N1bWVudHMvNDAxL3ZhcmlhYmxlcy5jc3NcIixcIi9Vc2Vycy9pdmFubGltb25nYW4vRG9jdW1lbnRzLzQwMS9hcnQtZ2FsbGVyeS9ob21lLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFZQTtFQUNFLGVBQWU7Q0FDaEI7QUNaRDtFQUNFLG1CQUFtQjtDQUtwQjtBQUpDO0lBQ0UsbUJBQW1CO0lBQ25CLFdBQVc7R0FDWjtBQUdIO0VBQ0UsY0FBYztDQUNmO0FBRUQ7RUFDRSxlQUFlO0VBQ2YsV0FBVztFQUNYLGNBQWM7RUFDZCxnQkFBZ0I7RUFDaEIsa0NBQTBCO0VBQTFCLDBCQUEwQjtDQUMzQjtBQUVEO0VBQ0UsZUFBYztDQUNmO0FBRUQ7RUFDRSxlQUFlO0VBQ2YsV0FBVztFQUNYLGNBQWM7RUFDZCxzQkFBc0I7RUFDdEIsa0NBQTBCO0VBQTFCLDBCQUEwQjtFQUMxQiwwQkFBMEI7Q0FDM0I7QUFFRDtFQUNFLGdCQUFnQjtDQUNqQjtBQUVEO0VBQ0UsZUFBYztFQUNkLDZCQUE2QjtDQUM5QjtBQUVEO0VBQ0UsZ0JBQWdCO0VBQ2hCLGlCQUFpQjtDQUNsQjtBQUVEO0VBQ0UsYUFBYTtDQUNkO0FBRUQ7RUFDRSxxQkFBYztFQUFkLHFCQUFjO0VBQWQsY0FBYztFQUNkLDZCQUF1QjtFQUF2Qiw4QkFBdUI7TUFBdkIsMkJBQXVCO1VBQXZCLHVCQUF1QjtDQUN4QjtBQUVEO0VBQ0UsNkJBQVM7TUFBVCxrQkFBUztVQUFULFNBQVM7RUFDVCwwQkFBd0I7RUFDeEIsZ0JBQWdCO0VBQ2hCLGtDQUEwQjtFQUExQix5QkFBMEI7Q0FJM0I7QUFIQztFQUNFLDBCQUEwQjtDQUMzQjtBQUdIO0VBQ0UsNkJBQVM7TUFBVCxrQkFBUztVQUFULFNBQVM7RUFDVCwwQkFBeUI7RUFDekIsY0FBYztFQUNkLGtDQUEwQjtFQUExQiwwQkFBMEI7RUFDMUIsZUFBYztFQUNkLGlCQUFrQjtDQVVuQjtBQVRDO0VBQ0UsMEJBQTBCO0NBQzNCO0FBQ0Q7SUFDRSxlQUFjO0NBSWY7QUFIQztFQUNFLHdCQUF3QjtDQUN6QjtBQUlMO0VBQ0UsNkJBQVM7TUFBVCxrQkFBUztVQUFULFNBQVM7RUFDVCwwQkFBeUI7RUFDekIsY0FBYztFQUNkLGtDQUEwQjtFQUExQiwwQkFBMEI7RUFDMUIsZUFBYztFQUNkLGlCQUFrQjtDQVVuQjtBQVRDO0VBQ0UsMEJBQTBCO0NBQzNCO0FBQ0Q7SUFDRSxlQUFjO0NBSWY7QUFIQztFQUNBLHdCQUF3QjtDQUN2QjtBQUlMOzs7Ozs7Ozs7Ozs7OztJQWNJO0FBS0osa0NBQWtDO0FBRWxDO0VBQ0U7O21EQUVpRDtFQUNqRCxvREFBb0Q7O0VBRXBEOzs7Ozs7OztNQVFJOztFQUVKO0lBQ0UsK0JBQW9CO0lBQXBCLDhCQUFvQjtRQUFwQix3QkFBb0I7WUFBcEIsb0JBQW9CO0lBQ3BCLG9CQUFvQjtHQUNyQjs7RUFFRDtJQUNFLFdBQVc7SUFDWCxxQkFBYztJQUFkLHFCQUFjO0lBQWQsY0FBYztJQUNkLDBCQUFvQjtRQUFwQix1QkFBb0I7WUFBcEIsb0JBQW9CO0lBQ3BCLHlCQUF3QjtRQUF4QixzQkFBd0I7WUFBeEIsd0JBQXdCO0dBSXpCO0lBSEM7TUFDRSxrQkFBa0I7S0FDbkI7O0VBR0g7SUFDRSxtQkFBbUI7R0F3QnBCO0lBdkJDO01BQ0UsbUJBQW1CO01BQ25CLHdDQUF3QztNQUN4QyxZQUFZO01BQ1osYUFBYTtNQUNiLGtDQUEwQjtNQUExQiwwQkFBMEI7TUFDMUIsVUFBVztLQWdCWjtJQWZDO0lBQ0UsMkNBQTJDO0lBQzNDLFdBQVc7R0FDWjtJQUNEO1FBQ0UscUJBQWM7UUFBZCxxQkFBYztRQUFkLGNBQWM7UUFDZCwwQkFBb0I7WUFBcEIsdUJBQW9CO2dCQUFwQixvQkFBb0I7UUFDcEIseUJBQXdCO1lBQXhCLHNCQUF3QjtnQkFBeEIsd0JBQXdCO1FBQ3hCLGVBQWM7UUFDZCxtQkFBbUI7UUFDbkIsT0FBTztRQUNQLFFBQVE7UUFDUixZQUFZO1FBQ1osYUFBYTtHQUNkOztFQUlMLHNEQUFzRDtFQUN0RDtzREFDb0Q7Q0FDckRcIixcImZpbGVcIjpcImhvbWUuY3NzXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIiRhY2NlbnQ6ICNjOTUxNTE7XFxuJGxpbms6ICMwZDQxNWY7XFxuJGRhcmtsaW5rOiAjMDA3QkMyO1xcbiRsaWdodGdyYXk6ICNlZWVlZWU7XFxuJGRhcmtncmF5OiAjNDQ0MTQwO1xcbiR3aGl0ZTogI2ZmZmZmZjtcXG4kZ3JheTogI0UwRTBFMDtcXG4kYmxhY2s6ICMwMDAwMDA7XFxuXFxuJG1heFZpZXdwb3J0U2l6ZTogMTI4MHB4O1xcbiRwYWRkaW5nOiAycmVtO1xcblxcbnNlY3Rpb24ge1xcbiAgY29sb3I6ICNjOTUxNTE7XFxufVwiLFwiQGltcG9ydCAnLi4vdmFyaWFibGVzLmNzcyc7XFxuXFxuI2hlcm8ge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgLmxheWVyIHtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgfVxcbn1cXG5cXG4jaGVybyBwaWN0dXJlIGZpZ2NhcHRpb24ge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLmhvbWUtZ3JpZCBoMiB7XFxuICBjb2xvcjogJGFjY2VudDtcXG4gIHotaW5kZXg6IDU7XFxuICBwYWRkaW5nOiAycmVtO1xcbiAgZm9udC1zaXplOiAycmVtO1xcbiAgdHJhbnNpdGlvbjogMC4zcyBlYXNlIGFsbDtcXG59XFxuXFxuLmhvbWUtZ3JpZCBoMjpob3ZlciB7XFxuICBjb2xvcjogJHdoaXRlO1xcbn1cXG5cXG4uY3J5IHtcXG4gIGNvbG9yOiAkYWNjZW50O1xcbiAgei1pbmRleDogNTtcXG4gIHBhZGRpbmc6IDRyZW07XFxuICAvKiBmb250LXNpemU6IDJyZW07ICovXFxuICB0cmFuc2l0aW9uOiAwLjNzIGVhc2UgYWxsO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogJGFjY2VudDtcXG59XFxuXFxuLmNyeS1zdWIge1xcbiAgZm9udC1zaXplOiAxcmVtO1xcbn1cXG5cXG4uY3J5OmhvdmVyIHtcXG4gIGNvbG9yOiAkd2hpdGU7XFxuICBwYWRkaW5nOiA0cmVtIDRyZW0gNHJlbSA1cmVtO1xcbn1cXG5cXG4uc3VwIHtcXG4gIGZvbnQtc2l6ZTogM3JlbTtcXG4gIGZvbnQtd2VpZ2h0OiA0MDA7XFxufVxcblxcbi5jb250ZW50LWdyaWQge1xcbiAgcGFkZGluZzogMHB4O1xcbn1cXG5cXG4uaG9tZS1ncmlkIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbn1cXG5cXG4uaG9tZS1ncmlkID4gZGl2Om50aC1jaGlsZCgxKSB7XFxuICBvcmRlcjogMTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICRncmF5O1xcbiAgcGFkZGluZzogMi41cmVtO1xcbiAgdHJhbnNpdGlvbjogMC4zcyBlYXNlIGFsbDtcXG4gICY6aG92ZXIge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYWNjZW50O1xcbiAgfVxcbn1cXG5cXG4uaG9tZS1ncmlkID4gZGl2Om50aC1jaGlsZCgyKSB7XFxuICBvcmRlcjogMjtcXG4gIGJhY2tncm91bmQtY29sb3I6ICRibGFjaztcXG4gIHBhZGRpbmc6IDJyZW07XFxuICB0cmFuc2l0aW9uOiAwLjNzIGVhc2UgYWxsO1xcbiAgY29sb3I6ICR3aGl0ZTtcXG4gIHRleHQtYWxpZ246Y2VudGVyO1xcbiAgJjpob3ZlciB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICRhY2NlbnQ7XFxuICB9XFxuICBhIHtcXG4gICAgY29sb3I6ICR3aGl0ZTtcXG4gICAgJjpob3ZlciB7XFxuICAgICAgLyogZm9udC1zaXplOiAxLjVyZW07ICovXFxuICAgIH1cXG4gIH1cXG59XFxuXFxuLmhvbWUtZ3JpZCA+IGRpdjpudGgtY2hpbGQoMykge1xcbiAgb3JkZXI6IDM7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAkYmxhY2s7XFxuICBwYWRkaW5nOiAycmVtO1xcbiAgdHJhbnNpdGlvbjogMC4zcyBlYXNlIGFsbDtcXG4gIGNvbG9yOiAkd2hpdGU7XFxuICB0ZXh0LWFsaWduOmNlbnRlcjtcXG4gICY6aG92ZXIge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYWNjZW50O1xcbiAgfVxcbiAgYSB7XFxuICAgIGNvbG9yOiAkd2hpdGU7XFxuICAgICY6aG92ZXIge1xcbiAgICAvKiBmb250LXNpemU6IDEuNXJlbTsgKi9cXG4gICAgfVxcbiAgfVxcbn1cXG5cXG4vKiAuaG9tZS1ncmlkID4gZGl2Om50aC1jaGlsZCg0KSB7XFxuICBvcmRlcjogNDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICRibGFjaztcXG4gIHBhZGRpbmc6IDIuNXJlbTtcXG4gIHRyYW5zaXRpb246IDAuM3MgZWFzZSBhbGw7XFxuICBjb2xvcjogJHdoaXRlO1xcbiAgdGV4dC1hbGlnbjpjZW50ZXI7XFxuICBoZWlnaHQ6IDYxJTtcXG4gICY6aG92ZXIge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkZGFya2dyYXk7XFxuICB9XFxuICBhIHtcXG4gICAgY29sb3I6ICR3aGl0ZTtcXG4gIH1cXG59ICovXFxuXFxuXFxuXFxuXFxuLyogLS0tLS0tIE1lZGlhIFF1ZXJpZXMgLS0tLS0tLSAqL1xcblxcbkBtZWRpYSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDkwMHB4KSB7XFxuICAvKiAuaG9tZS1ncmlkID4gZGl2Om50aC1jaGlsZCgxKSB7Z3JpZC1hcmVhOiBhOyB9XFxuICAuaG9tZS1ncmlkID4gZGl2Om50aC1jaGlsZCgyKSB7Z3JpZC1hcmVhOiBiOyB9XFxuICAuaG9tZS1ncmlkID4gZGl2Om50aC1jaGlsZCgzKSB7Z3JpZC1hcmVhOiBjOyB9ICovXFxuICAvKiAuaG9tZS1ncmlkID4gZGl2Om50aC1jaGlsZCg0KSB7Z3JpZC1hcmVhOiBkOyB9ICovXFxuICBcXG4gIC8qIC5ob21lLWdyaWQge1xcbiAgICBkaXNwbGF5OiBncmlkO1xcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgzLCAxZnIpO1xcbiAgICBncmlkLWF1dG8tcm93czogMWZyO1xcbiAgICBncmlkLXRlbXBsYXRlLWFyZWFzOlxcbiAgICBcXFwiYSBiIGNcXFwiXFxuICAgIFxcXCJhIGIgY1xcXCI7XFxuICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xcbiAgfSAqL1xcbiAgXFxuICAuaG9tZS1ncmlkIHtcXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcXG4gICAgLyogZmxleDogMSAwIDMwJTsgKi9cXG4gIH1cXG5cXG4gIC5ob21lLWdyaWQgPiBkaXYge1xcbiAgICB3aWR0aDogMzAlO1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICAgcCB7XFxuICAgICAgZm9udC1zaXplOiAxLjNyZW07XFxuICAgIH1cXG4gIH1cXG5cXG4gICNoZXJvIHtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICAubGF5ZXIge1xcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgICAvKiBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsMCwwLDAuMSk7ICovXFxuICAgICAgd2lkdGg6IDEwMCU7XFxuICAgICAgaGVpZ2h0OiAxMDAlO1xcbiAgICAgIHRyYW5zaXRpb246IDAuM3MgZWFzZSBhbGw7XFxuICAgICAgb3BhY2l0eTogMTtcXG4gICAgICAmOmhvdmVyIHtcXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjQxLCAxMTksIDExOSwgMC44KTtcXG4gICAgICAgIG9wYWNpdHk6IDE7XFxuICAgICAgfVxcbiAgICAgIGgxIHtcXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgICAgICBjb2xvcjogJHdoaXRlO1xcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICAgICAgdG9wOiAwO1xcbiAgICAgICAgbGVmdDogMDtcXG4gICAgICAgIHdpZHRoOiAxMDAlO1xcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xcbiAgICAgIH1cXG4gICAgfVxcbiAgfVxcbiAgXFxuICAvKiAuaG9tZS1ncmlkID4gZGl2Om50aC1jaGlsZCgxKSB7bWF4LXdpZHRoOiA1MCU7IH0gKi9cXG4gIC8qIC5ob21lLWdyaWQgPiBkaXY6bnRoLWNoaWxkKDIpIHtwYWRkaW5nOiAwIDVyZW07IH1cXG4gIC5ob21lLWdyaWQgPiBkaXY6bnRoLWNoaWxkKDMpIHtwYWRkaW5nOiAwIDVyZW07IH0gKi9cXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/e1wiaW1wb3J0TG9hZGVyc1wiOjEsXCJzb3VyY2VNYXBcIjp0cnVlfSEuL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWI/e1wic291cmNlTWFwXCI6dHJ1ZX0hLi9zcmMvY29tcG9uZW50cy9ob21lL2hvbWUuY3NzXG4vLyBtb2R1bGUgaWQgPSAyM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHRydWUpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwic2VjdGlvbiB7XFxuICBjb2xvcjogI2M5NTE1MTtcXG59XFxuQC13ZWJraXQta2V5ZnJhbWVzIHBhZ2VTbGlkZSB7XFxuICAvKiAwJSB7XFxuICAgIG9wYWNpdHk6IC4wO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAxMDAlKTtcXG4gIH0gKi9cXG4gIDAlIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAxMCUpO1xcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsIDEwJSk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAwJSk7XFxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwgMCUpO1xcbiAgfVxcbn1cXG5Aa2V5ZnJhbWVzIHBhZ2VTbGlkZSB7XFxuICAvKiAwJSB7XFxuICAgIG9wYWNpdHk6IC4wO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAxMDAlKTtcXG4gIH0gKi9cXG4gIDAlIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAxMCUpO1xcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsIDEwJSk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAwJSk7XFxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMCwgMCUpO1xcbiAgfVxcbn1cXG5tYWluIGFydGljbGUge1xcbiAgICAtd2Via2l0LWFuaW1hdGlvbjogcGFnZVNsaWRlIDFzIGVhc2Utb3V0O1xcbiAgICAgICAgICAgIGFuaW1hdGlvbjogcGFnZVNsaWRlIDFzIGVhc2Utb3V0O1xcbiAgfVwiLCBcIlwiLCB7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCIvVXNlcnMvaXZhbmxpbW9uZ2FuL0RvY3VtZW50cy80MDEvdmFyaWFibGVzLmNzc1wiLFwiL1VzZXJzL2l2YW5saW1vbmdhbi9Eb2N1bWVudHMvNDAxL2FydC1nYWxsZXJ5L3NsaWRlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFZQTtFQUNFLGVBQWU7Q0FDaEI7QUNaRDtFQUNFOzs7TUFHSTtFQUNKO0lBQ0UsV0FBVztJQUNYLHFDQUE2QjtZQUE3Qiw2QkFBNkI7R0FDOUI7RUFDRDtJQUNFLFdBQVc7SUFDWCxvQ0FBNEI7WUFBNUIsNEJBQTRCO0dBQzdCO0NBQ0Y7QUFiRDtFQUNFOzs7TUFHSTtFQUNKO0lBQ0UsV0FBVztJQUNYLHFDQUE2QjtZQUE3Qiw2QkFBNkI7R0FDOUI7RUFDRDtJQUNFLFdBQVc7SUFDWCxvQ0FBNEI7WUFBNUIsNEJBQTRCO0dBQzdCO0NBQ0Y7QUFHQztJQUNFLHlDQUFpQztZQUFqQyxpQ0FBaUM7R0FDbENcIixcImZpbGVcIjpcInNsaWRlLmNzc1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCIkYWNjZW50OiAjYzk1MTUxO1xcbiRsaW5rOiAjMGQ0MTVmO1xcbiRkYXJrbGluazogIzAwN0JDMjtcXG4kbGlnaHRncmF5OiAjZWVlZWVlO1xcbiRkYXJrZ3JheTogIzQ0NDE0MDtcXG4kd2hpdGU6ICNmZmZmZmY7XFxuJGdyYXk6ICNFMEUwRTA7XFxuJGJsYWNrOiAjMDAwMDAwO1xcblxcbiRtYXhWaWV3cG9ydFNpemU6IDEyODBweDtcXG4kcGFkZGluZzogMnJlbTtcXG5cXG5zZWN0aW9uIHtcXG4gIGNvbG9yOiAjYzk1MTUxO1xcbn1cIixcIkBpbXBvcnQgJy4uL3ZhcmlhYmxlcy5jc3MnO1xcblxcbkBrZXlmcmFtZXMgcGFnZVNsaWRlIHtcXG4gIC8qIDAlIHtcXG4gICAgb3BhY2l0eTogLjA7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsIDEwMCUpO1xcbiAgfSAqL1xcbiAgMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLCAxMCUpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAsIDAlKTtcXG4gIH1cXG59XFxuXFxubWFpbiB7XFxuICBhcnRpY2xlIHtcXG4gICAgYW5pbWF0aW9uOiBwYWdlU2xpZGUgMXMgZWFzZS1vdXQ7XFxuICB9XFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyP3tcImltcG9ydExvYWRlcnNcIjoxLFwic291cmNlTWFwXCI6dHJ1ZX0hLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliP3tcInNvdXJjZU1hcFwiOnRydWV9IS4vc3JjL2NvbXBvbmVudHMvaG9tZS9zbGlkZS5jc3Ncbi8vIG1vZHVsZSBpZCA9IDI0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8cGljdHVyZT48L3BpY3R1cmU+XCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy9waWN0dXJlL3BpY3R1cmUuaHRtbFxuLy8gbW9kdWxlIGlkID0gMjVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgY1VzZXIgPSAnZHBoM253OHltJztcbmNvbnN0IEZFVENIX1VSTCA9IGBodHRwczovL3Jlcy5jbG91ZGluYXJ5LmNvbS8ke2NVc2VyfS9pbWFnZS91cGxvYWRgO1xuXG5leHBvcnQgY29uc3QgZ2V0VXJsID0gKGZpbGVOYW1lLCBvcHRpb25zID0gJycpID0+IHtcbiAgcmV0dXJuIGAke0ZFVENIX1VSTH0vJHtvcHRpb25zfS8ke2ZpbGVOYW1lfWA7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3NlcnZpY2VzL2Nsb3VkaW5hcnkuanNcbi8vIG1vZHVsZSBpZCA9IDI2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBodG1sIGZyb20gJy4vcG9ydGxhbmQuaHRtbCc7XG5pbXBvcnQgJy4vcG9ydGxhbmQuY3NzJztcbmltcG9ydCAnLi4vaG9tZS9zbGlkZS5jc3MnO1xuaW1wb3J0IFBpY3R1cmUgZnJvbSAnLi4vcGljdHVyZS9QaWN0dXJlJztcbmltcG9ydCBUZW1wbGF0ZSBmcm9tICcuLi9UZW1wbGF0ZSc7XG5cbmNvbnN0IHRlbXBsYXRlID0gbmV3IFRlbXBsYXRlKGh0bWwpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb3J0bGFuZCB7XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGRvbSA9IHRlbXBsYXRlLmNsb25lKCk7XG5cbiAgICBjb25zdCBwZHhJbWcgPSBbJ3dlcy1jYXJyLTM3NzM5OF92aGRqd28uanBnJywgJ21lcmljLWRhZ2xpLTQ4NzgyNV9rcmpobmEuanBnJywgJ2pvcmRhbi1hbmRyZXdzLTMxNzMxMV9majJwanguanBnJywgJ2pvbi10eXNvbi0yMjg0MjhfaXFseGZhLmpwZycsICdoZW5yaWstZG9ubmVzdGFkLTQ2OTY0MV9ueDl6ZHIuanBnJ107XG4gICAgY29uc3QgcGR4QWx0ID0gWydQaG90byBieSBXZXMgQ2FyciB2aWEgVW5zcGxhc2gnLCAnUGhvdG8gYnkgTWVyaWMgRGFnbGkgdmlhIFVuc3BsYXNoJywgJ1Bob3RvIGJ5IEpvcmRhbiBBbmRyZXdzIHZpYSBVbnNwbGFzaCcsICdQaG90byBieSBKb2huIFR5c29uIHZpYSBVbnNwbGFzaCcsICdQaG90byBieSBIZW5yaWsgRG9ubmVzdGFkIHZpYSBVbnNwbGFzaCddO1xuXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHBkeEltZy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgcG9ydGxhbmQgPSBuZXcgUGljdHVyZSh7XG4gICAgICAgIGFzcGVjdFJhdGlvczogWycxOjEnLCAnMjoxJywgJzI6MSddLFxuICAgICAgICBicmVha3BvaW50czogWzEyMDAsIDkwMCwgNTAwXSxcbiAgICAgICAgb3B0aW9uczogJ2NfZmlsbCxnX2F1dG8scV9hdXRvLGdfZmFjZSxmX2F1dG8nLFxuICAgICAgICBmaWxlTmFtZTogcGR4SW1nW2ldLFxuICAgICAgICBhbHQ6IHBkeEFsdFtpXVxuICAgICAgfSk7XG4gICAgICBjb25zdCBwb3J0bGFuZERvbSA9IHBvcnRsYW5kLnJlbmRlcigpO1xuICAgICAgZG9tLnF1ZXJ5U2VsZWN0b3IoJyNwb3J0bGFuZCcpLmFwcGVuZENoaWxkKHBvcnRsYW5kRG9tKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZG9tO1xuICB9XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy9wb3J0bGFuZC9Qb3J0bGFuZC5qc1xuLy8gbW9kdWxlIGlkID0gMjdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxhcnRpY2xlIGNsYXNzPVxcXCJtYXh3aWR0aC13cmFwIHJlc291cmNlLWdyaWRcXFwiPlxcbiAgPGgyPnBvcnRsYW5kPC9oMj5cXG4gIDxkaXYgaWQ9XFxcInBvcnRsYW5kXFxcIj48L2Rpdj5cXG48L2FydGljbGU+XCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy9wb3J0bGFuZC9wb3J0bGFuZC5odG1sXG4vLyBtb2R1bGUgaWQgPSAyOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHRydWUpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwic2VjdGlvbiB7XFxuICBjb2xvcjogI2M5NTE1MTtcXG59XFxuLnJlc291cmNlLWdyaWQge1xcbiAgcGFkZGluZzogMnJlbTtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLWdhcDogMnJlbTtcXG59XFxuI3BvcnRsYW5kLCAjYnJvb2tseW4ge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtZ2FwOiAycmVtIDA7IFxcbn1cXG4jcG9ydGxhbmQgaW1nLCAjYnJvb2tseW4gaW1nIHtcXG4gICAgcGFkZGluZzogMCAwIDAuN3JlbTtcXG4gIH1cXG5AbWVkaWEgc2NyZWVuIGFuZCAobWluLXdpZHRoOiA5MDBweCkge1xcbiAgI3BvcnRsYW5kLCAjYnJvb2tseW4ge1xcbiAgICBkaXNwbGF5OiBncmlkO1xcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdChhdXRvLWZpbGwsIG1pbm1heCgzMDBweCwgMWZyKSk7XFxuICAgIGdyaWQtZ2FwOiAycmVtO1xcbiAgfVxcbn1cIiwgXCJcIiwge1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiL1VzZXJzL2l2YW5saW1vbmdhbi9Eb2N1bWVudHMvNDAxL3ZhcmlhYmxlcy5jc3NcIixcIi9Vc2Vycy9pdmFubGltb25nYW4vRG9jdW1lbnRzLzQwMS9hcnQtZ2FsbGVyeS9wb3J0bGFuZC5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBWUE7RUFDRSxlQUFlO0NBQ2hCO0FDWkQ7RUFDRSxjQUFrQjtFQUNsQixjQUFjO0VBQ2QsZUFBZTtDQUNoQjtBQUVEO0VBQ0UsY0FBYztFQUNkLGlCQUFpQjtDQUlsQjtBQUhDO0lBQ0Usb0JBQW9CO0dBQ3JCO0FBR0g7RUFDRTtJQUNFLGNBQWM7SUFDZCw2REFBNkQ7SUFDN0QsZUFBZTtHQUNoQjtDQUNGXCIsXCJmaWxlXCI6XCJwb3J0bGFuZC5jc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiJGFjY2VudDogI2M5NTE1MTtcXG4kbGluazogIzBkNDE1ZjtcXG4kZGFya2xpbms6ICMwMDdCQzI7XFxuJGxpZ2h0Z3JheTogI2VlZWVlZTtcXG4kZGFya2dyYXk6ICM0NDQxNDA7XFxuJHdoaXRlOiAjZmZmZmZmO1xcbiRncmF5OiAjRTBFMEUwO1xcbiRibGFjazogIzAwMDAwMDtcXG5cXG4kbWF4Vmlld3BvcnRTaXplOiAxMjgwcHg7XFxuJHBhZGRpbmc6IDJyZW07XFxuXFxuc2VjdGlvbiB7XFxuICBjb2xvcjogI2M5NTE1MTtcXG59XCIsXCJAaW1wb3J0ICcuLi92YXJpYWJsZXMuY3NzJztcXG5cXG4ucmVzb3VyY2UtZ3JpZCB7XFxuICBwYWRkaW5nOiAkcGFkZGluZztcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLWdhcDogMnJlbTtcXG59XFxuXFxuI3BvcnRsYW5kLCAjYnJvb2tseW4ge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtZ2FwOiAycmVtIDA7XFxuICBpbWcge1xcbiAgICBwYWRkaW5nOiAwIDAgMC43cmVtO1xcbiAgfSBcXG59XFxuXFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi13aWR0aDogOTAwcHgpIHtcXG4gICNwb3J0bGFuZCwgI2Jyb29rbHluIHtcXG4gICAgZGlzcGxheTogZ3JpZDtcXG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMzAwcHgsIDFmcikpO1xcbiAgICBncmlkLWdhcDogMnJlbTtcXG4gIH1cXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/e1wiaW1wb3J0TG9hZGVyc1wiOjEsXCJzb3VyY2VNYXBcIjp0cnVlfSEuL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWI/e1wic291cmNlTWFwXCI6dHJ1ZX0hLi9zcmMvY29tcG9uZW50cy9wb3J0bGFuZC9wb3J0bGFuZC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDI5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBodG1sIGZyb20gJy4vYnJvb2tseW4uaHRtbCc7XG5pbXBvcnQgJy4uL3BvcnRsYW5kL3BvcnRsYW5kLmNzcyc7XG5pbXBvcnQgJy4uL2hvbWUvc2xpZGUuY3NzJztcbmltcG9ydCBQaWN0dXJlIGZyb20gJy4uL3BpY3R1cmUvUGljdHVyZSc7XG5pbXBvcnQgVGVtcGxhdGUgZnJvbSAnLi4vVGVtcGxhdGUnO1xuXG5jb25zdCB0ZW1wbGF0ZSA9IG5ldyBUZW1wbGF0ZShodG1sKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnJvb2tseW4ge1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkb20gPSB0ZW1wbGF0ZS5jbG9uZSgpO1xuXG4gICAgY29uc3QgYmt5SW1nID0gWydjaHJpcy1iYXJiYWxpcy0zNDkyNzlfaHVzeG4yLmpwZycsICdjaHJpcy1iYXJiYWxpcy0zNDA3OThfeHZtb2xlLmpwZycsICdjaHJpcy1iYXJiYWxpcy0yMjkzNTdfZ3N4bW90LmpwZycsICdjaHJpcy1iYXJiYWxpcy0xMDg3NzRfaGJxZ2RkLmpwZycsICdhbm5pZS1zcHJhdHQtMjUzNzk3X200bWt3bC5qcGcnXTtcbiAgICBjb25zdCBia3lBbHQgPSBbJ1Bob3RvIGJ5IENocmlzIEJhcmJhbGlzIHZpYSBVbnNwbGFzaCcsICdQaG90byBieSBDaHJpcyBCYXJiYWxpcyB2aWEgVW5zcGxhc2gnLCAnUGhvdG8gYnkgQ2hyaXMgQmFyYmFsaXMgdmlhIFVuc3BsYXNoJywgJ1Bob3RvIGJ5IENocmlzIEJhcmJhbGlzIHZpYSBVbnNwbGFzaCcsICdQaG90byBieSBBbm5pZSBTcHJhdHQgdmlhIFVuc3BsYXNoJ107XG5cbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYmt5SW1nLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBicm9va2x5biA9IG5ldyBQaWN0dXJlKHtcbiAgICAgICAgYXNwZWN0UmF0aW9zOiBbJzE6MScsICcyOjEnLCAnMjoxJ10sXG4gICAgICAgIGJyZWFrcG9pbnRzOiBbMTIwMCwgOTAwLCA1MDBdLFxuICAgICAgICBvcHRpb25zOiAnY19maWxsLGdfYXV0byxxX2F1dG8sZ19mYWNlLGZfYXV0bycsXG4gICAgICAgIGZpbGVOYW1lOiBia3lJbWdbaV0sXG4gICAgICAgIGFsdDogYmt5QWx0W2ldXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGJyb29rbHluRG9tID0gYnJvb2tseW4ucmVuZGVyKCk7XG4gICAgICBkb20ucXVlcnlTZWxlY3RvcignI2Jyb29rbHluJykuYXBwZW5kQ2hpbGQoYnJvb2tseW5Eb20pO1xuICAgIH1cblxuICAgIHJldHVybiBkb207XG4gIH1cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21wb25lbnRzL2Jyb29rbHluL0Jyb29rbHluLmpzXG4vLyBtb2R1bGUgaWQgPSAzMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGFydGljbGUgY2xhc3M9XFxcIm1heHdpZHRoLXdyYXAgcmVzb3VyY2UtZ3JpZFxcXCI+XFxuICAgIDxoMj5icm9va2x5bjwvaDI+XFxuICAgIDxkaXYgaWQ9XFxcImJyb29rbHluXFxcIj48L2Rpdj5cXG48L2FydGljbGU+XCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy9icm9va2x5bi9icm9va2x5bi5odG1sXG4vLyBtb2R1bGUgaWQgPSAzMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgaHRtbCBmcm9tICcuL2Zvb3Rlci5odG1sJztcbmltcG9ydCAnLi9mb290ZXIuY3NzJztcbmltcG9ydCBUZW1wbGF0ZSBmcm9tICcuLi8uLi9UZW1wbGF0ZSc7XG5cbmNvbnN0IHRlbXBsYXRlID0gbmV3IFRlbXBsYXRlKGh0bWwpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGb290ZXIge1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkb20gPSB0ZW1wbGF0ZS5jbG9uZSgpO1xuXG4gICAgcmV0dXJuIGRvbTtcbiAgfVxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvYXBwL2Zvb3Rlci9Gb290ZXIuanNcbi8vIG1vZHVsZSBpZCA9IDMyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8cD4oYykgTXVyYWwgQ29sbGVjdGl2ZSDigJQgPGEgaHJlZj1cXFwiaHR0cHM6Ly9naXRodWIuY29tL2xpbW9uZ29vL2FydC1nYWxsZXJ5XFxcIiB0YXJnZXQ9XFxcIl9ibGFua1xcXCIgcmVsXFxcImF1dGhvciBub29wZW5lciBub3JlZmVycmVyXFxcIj5JdmFuIExpbW9uZ2FuPC9hPjwvcD5cXG5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21wb25lbnRzL2FwcC9mb290ZXIvZm9vdGVyLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDMzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz8/cmVmLS0xLTEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0xLTIhLi9mb290ZXIuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHtcInNvdXJjZU1hcFwiOnRydWUsXCJobXJcIjp0cnVlfVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vZm9vdGVyLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMS0xIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tMS0yIS4vZm9vdGVyLmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy9hcHAvZm9vdGVyL2Zvb3Rlci5jc3Ncbi8vIG1vZHVsZSBpZCA9IDM0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodHJ1ZSk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJzZWN0aW9uIHtcXG4gIGNvbG9yOiAjYzk1MTUxO1xcbn1cIiwgXCJcIiwge1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiL1VzZXJzL2l2YW5saW1vbmdhbi9Eb2N1bWVudHMvdmFyaWFibGVzLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFZQTtFQUNFLGVBQWU7Q0FDaEJcIixcImZpbGVcIjpcImZvb3Rlci5jc3NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiJGFjY2VudDogI2M5NTE1MTtcXG4kbGluazogIzBkNDE1ZjtcXG4kZGFya2xpbms6ICMwMDdCQzI7XFxuJGxpZ2h0Z3JheTogI2VlZWVlZTtcXG4kZGFya2dyYXk6ICM0NDQxNDA7XFxuJHdoaXRlOiAjZmZmZmZmO1xcbiRncmF5OiAjRTBFMEUwO1xcbiRibGFjazogIzAwMDAwMDtcXG5cXG4kbWF4Vmlld3BvcnRTaXplOiAxMjgwcHg7XFxuJHBhZGRpbmc6IDJyZW07XFxuXFxuc2VjdGlvbiB7XFxuICBjb2xvcjogI2M5NTE1MTtcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/e1wiaW1wb3J0TG9hZGVyc1wiOjEsXCJzb3VyY2VNYXBcIjp0cnVlfSEuL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWI/e1wic291cmNlTWFwXCI6dHJ1ZX0hLi9zcmMvY29tcG9uZW50cy9hcHAvZm9vdGVyL2Zvb3Rlci5jc3Ncbi8vIG1vZHVsZSBpZCA9IDM1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBjb25zdCByZW1vdmVDaGlsZHJlbiA9IG5vZGUgPT4ge1xuICB3aGlsZShub2RlLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgIG5vZGUucmVtb3ZlQ2hpbGQobm9kZS5sYXN0Q2hpbGQpO1xuICB9XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvZG9tLmpzXG4vLyBtb2R1bGUgaWQgPSAzNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9