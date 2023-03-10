(function() { /*! Zepto 1.2.0 - zepto event ajax form ie deferred callbacks touch - zeptojs.com/license */
	var Zepto = function() {
		var undefined, key, $, classList, emptyArray = [],
			concat = emptyArray.concat,
			filter = emptyArray.filter,
			slice = emptyArray.slice,
			document = window.document,
			elementDisplay = {},
			classCache = {},
			cssNumber = {
				"column-count": 1,
				columns: 1,
				"font-weight": 1,
				"line-height": 1,
				opacity: 1,
				"z-index": 1,
				zoom: 1
			},
			fragmentRE = /^\s*<(\w+|!)[^>]*>/,
			singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
			tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
			rootNodeRE = /^(?:body|html)$/i,
			capitalRE = /([A-Z])/g,
			methodAttributes = ["val", "css", "html", "text", "data", "width", "height", "offset"],
			adjacencyOperators = ["after", "prepend", "before", "append"],
			table = document.createElement("table"),
			tableRow = document.createElement("tr"),
			containers = {
				tr: document.createElement("tbody"),
				tbody: table,
				thead: table,
				tfoot: table,
				td: tableRow,
				th: tableRow,
				"*": document.createElement("div")
			},
			readyRE = /complete|loaded|interactive/,
			simpleSelectorRE = /^[\w-]*$/,
			class2type = {},
			toString = class2type.toString,
			zepto = {},
			camelize, uniq, tempParent = document.createElement("div"),
			propMap = {
				tabindex: "tabIndex",
				readonly: "readOnly",
				for: "htmlFor",
				class: "className",
				maxlength: "maxLength",
				cellspacing: "cellSpacing",
				cellpadding: "cellPadding",
				rowspan: "rowSpan",
				colspan: "colSpan",
				usemap: "useMap",
				frameborder: "frameBorder",
				contenteditable: "contentEditable"
			},
			isArray = Array.isArray || function(object) {
				return object instanceof Array;
			};
		zepto.matches = function(element, selector) {
			if (!selector || !element || element.nodeType !== 1) return false;
			var matchesSelector = element.matches || element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
			if (matchesSelector) return matchesSelector.call(element, selector);
			var match, parent = element.parentNode,
				temp = !parent;
			if (temp)(parent = tempParent).appendChild(element);
			match = ~zepto.qsa(parent, selector).indexOf(element);
			temp && tempParent.removeChild(element);
			return match;
		};

		function type(obj) {
			return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
		}

		function isFunction(value) {
			return type(value) == "function";
		}

		function isWindow(obj) {
			return obj != null && obj == obj.window;
		}

		function isDocument(obj) {
			return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
		}

		function isObject(obj) {
			return type(obj) == "object";
		}

		function isPlainObject(obj) {
			return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
		}

		function likeArray(obj) {
			var length = !!obj && "length" in obj && obj.length,
				type = $.type(obj);
			return "function" != type && !isWindow(obj) && ("array" == type || length === 0 || typeof length == "number" && length > 0 && length - 1 in obj);
		}

		function compact(array) {
			return filter.call(array, function(item) {
				return item != null;
			});
		}

		function flatten(array) {
			return array.length > 0 ? $.fn.concat.apply([], array) : array;
		}
		camelize = function(str) {
			return str.replace(/-+(.)?/g, function(match, chr) {
				return chr ? chr.toUpperCase() : "";
			});
		};

		function dasherize(str) {
			return str.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase();
		}
		uniq = function(array) {
			return filter.call(array, function(item, idx) {
				return array.indexOf(item) == idx;
			});
		};

		function classRE(name) {
			return name in classCache ? classCache[name] : classCache[name] = new RegExp("(^|\\s)" + name + "(\\s|$)");
		}

		function maybeAddPx(name, value) {
			return typeof value == "number" && !cssNumber[dasherize(name)] ? value + "px" : value;
		}

		function defaultDisplay(nodeName) {
			var element, display;
			if (!elementDisplay[nodeName]) {
				element = document.createElement(nodeName);
				document.body.appendChild(element);
				display = getComputedStyle(element, "").getPropertyValue("display");
				element.parentNode.removeChild(element);
				display == "none" && (display = "block");
				elementDisplay[nodeName] = display;
			}
			return elementDisplay[nodeName];
		}

		function children(element) {
			return "children" in element ? slice.call(element.children) : $.map(element.childNodes, function(node) {
				if (node.nodeType == 1) return node;
			});
		}

		function Z(dom, selector) {
			var i, len = dom ? dom.length : 0;
			for (i = 0; i < len; i++) this[i] = dom[i];
			this.length = len;
			this.selector = selector || "";
		}
		zepto.fragment = function(html, name, properties) {
			var dom, nodes, container;
			if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1));
			if (!dom) {
				if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>");
				if (name === undefined) name = fragmentRE.test(html) && RegExp.$1;
				if (!(name in containers)) name = "*";
				container = containers[name];
				container.innerHTML = "" + html;
				dom = $.each(slice.call(container.childNodes), function() {
					container.removeChild(this);
				});
			}
			if (isPlainObject(properties)) {
				nodes = $(dom);
				$.each(properties, function(key, value) {
					if (methodAttributes.indexOf(key) > -1) nodes[key](value);
					else nodes.attr(key, value);
				});
			}
			return dom;
		};
		zepto.Z = function(dom, selector) {
			return new Z(dom, selector);
		};
		zepto.isZ = function(object) {
			return object instanceof zepto.Z;
		};
		zepto.init = function(selector, context) {
			var dom;
			if (!selector) return zepto.Z();
			else if (typeof selector == "string") {
				selector = selector.trim();
				if (selector[0] == "<" && fragmentRE.test(selector)) dom = zepto.fragment(selector, RegExp.$1, context), selector = null;
				else if (context !== undefined) return $(context).find(selector);
				else dom = zepto.qsa(document, selector);
			} else if (isFunction(selector)) return $(document).ready(selector);
			else if (zepto.isZ(selector)) return selector;
			else {
				if (isArray(selector)) dom = compact(selector);
				else if (isObject(selector)) dom = [selector], selector = null;
				else if (fragmentRE.test(selector)) dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null;
				else if (context !== undefined) return $(context).find(selector);
				else dom = zepto.qsa(document, selector);
			}
			return zepto.Z(dom, selector);
		};
		$ = function(selector, context) {
			return zepto.init(selector, context);
		};

		function extend(target, source, deep) {
			for (key in source)
				if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
					if (isPlainObject(source[key]) && !isPlainObject(target[key])) target[key] = {};
					if (isArray(source[key]) && !isArray(target[key])) target[key] = [];
					extend(target[key], source[key], deep);
				} else if (source[key] !== undefined) target[key] = source[key];
		}
		$.extend = function(target) {
			var deep, args = slice.call(arguments, 1);
			if (typeof target == "boolean") {
				deep = target;
				target = args.shift();
			}
			args.forEach(function(arg) {
				extend(target, arg, deep);
			});
			return target;
		};
		zepto.qsa = function(element, selector) {
			var found, maybeID = selector[0] == "#",
				maybeClass = !maybeID && selector[0] == ".",
				nameOnly = maybeID || maybeClass ? selector.slice(1) : selector,
				isSimple = simpleSelectorRE.test(nameOnly);
			return element.getElementById && isSimple && maybeID ? (found = element.getElementById(nameOnly)) ? [found] : [] : element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11 ? [] : slice.call(isSimple && !maybeID && element.getElementsByClassName ? maybeClass ? element.getElementsByClassName(nameOnly) : element.getElementsByTagName(selector) : element.querySelectorAll(selector));
		};

		function filtered(nodes, selector) {
			return selector == null ? $(nodes) : $(nodes).filter(selector);
		}
		$.contains = document.documentElement.contains ? function(parent, node) {
			return parent !== node && parent.contains(node);
		} : function(parent, node) {
			while (node && (node = node.parentNode))
				if (node === parent) return true;
			return false;
		};

		function funcArg(context, arg, idx, payload) {
			return isFunction(arg) ? arg.call(context, idx, payload) : arg;
		}

		function setAttribute(node, name, value) {
			value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
		}

		function className(node, value) {
			var klass = node.className || "",
				svg = klass && klass.baseVal !== undefined;
			if (value === undefined) return svg ? klass.baseVal : klass;
			svg ? klass.baseVal = value : node.className = value;
		}

		function deserializeValue(value) {
			try {
				return value ? value == "true" || (value == "false" ? false : value == "null" ? null : +value + "" == value ? +value : /^[\[\{]/.test(value) ? $.parseJSON(value) : value) : value;
			} catch (e) {
				return value;
			}
		}
		$.type = type;
		$.isFunction = isFunction;
		$.isWindow = isWindow;
		$.isArray = isArray;
		$.isPlainObject = isPlainObject;
		$.isEmptyObject = function(obj) {
			var name;
			for (name in obj) return false;
			return true;
		};
		$.isNumeric = function(val) {
			var num = Number(val),
				type = typeof val;
			return val != null && type != "boolean" && (type != "string" || val.length) && !isNaN(num) && isFinite(num) || false;
		};
		$.inArray = function(elem, array, i) {
			return emptyArray.indexOf.call(array, elem, i);
		};
		$.camelCase = camelize;
		$.trim = function(str) {
			return str == null ? "" : String.prototype.trim.call(str);
		};
		$.uuid = 0;
		$.support = {};
		$.expr = {};
		$.noop = function() {};
		$.map = function(elements, callback) {
			var value, values = [],
				i, key;
			if (likeArray(elements))
				for (i = 0; i < elements.length; i++) {
					value = callback(elements[i], i);
					if (value != null) values.push(value);
				} else
					for (key in elements) {
						value = callback(elements[key], key);
						if (value != null) values.push(value);
					}
			return flatten(values);
		};
		$.each = function(elements, callback) {
			var i, key;
			if (likeArray(elements)) {
				for (i = 0; i < elements.length; i++)
					if (callback.call(elements[i], i, elements[i]) === false) return elements;
			} else {
				for (key in elements)
					if (callback.call(elements[key], key, elements[key]) === false) return elements;
			}
			return elements;
		};
		$.grep = function(elements, callback) {
			return filter.call(elements, callback);
		};
		if (window.JSON) $.parseJSON = JSON.parse;
		$.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
			class2type["[object " + name + "]"] = name.toLowerCase();
		});
		$.fn = {
			constructor: zepto.Z,
			length: 0,
			forEach: emptyArray.forEach,
			reduce: emptyArray.reduce,
			push: emptyArray.push,
			sort: emptyArray.sort,
			splice: emptyArray.splice,
			indexOf: emptyArray.indexOf,
			concat: function() {
				var i, value, args = [];
				for (i = 0; i < arguments.length; i++) {
					value = arguments[i];
					args[i] = zepto.isZ(value) ? value.toArray() : value;
				}
				return concat.apply(zepto.isZ(this) ? this.toArray() : this, args);
			},
			map: function(fn) {
				return $($.map(this, function(el, i) {
					return fn.call(el, i, el);
				}));
			},
			slice: function() {
				return $(slice.apply(this, arguments));
			},
			ready: function(callback) {
				if (readyRE.test(document.readyState) && document.body) callback($);
				else document.addEventListener("DOMContentLoaded", function() {
					callback($);
				}, false);
				return this;
			},
			get: function(idx) {
				return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length];
			},
			toArray: function() {
				return this.get();
			},
			size: function() {
				return this.length;
			},
			remove: function() {
				return this.each(function() {
					if (this.parentNode != null) this.parentNode.removeChild(this);
				});
			},
			each: function(callback) {
				emptyArray.every.call(this, function(el, idx) {
					return callback.call(el, idx, el) !== false;
				});
				return this;
			},
			filter: function(selector) {
				if (isFunction(selector)) return this.not(this.not(selector));
				return $(filter.call(this, function(element) {
					return zepto.matches(element, selector);
				}));
			},
			add: function(selector, context) {
				return $(uniq(this.concat($(selector, context))));
			},
			is: function(selector) {
				return this.length > 0 && zepto.matches(this[0], selector);
			},
			not: function(selector) {
				var nodes = [];
				if (isFunction(selector) && selector.call !== undefined) this.each(function(idx) {
					if (!selector.call(this, idx)) nodes.push(this);
				});
				else {
					var excludes = typeof selector == "string" ? this.filter(selector) : likeArray(selector) && isFunction(selector.item) ? slice.call(selector) : $(selector);
					this.forEach(function(el) {
						if (excludes.indexOf(el) < 0) nodes.push(el);
					});
				}
				return $(nodes);
			},
			has: function(selector) {
				return this.filter(function() {
					return isObject(selector) ? $.contains(this, selector) : $(this).find(selector).size();
				});
			},
			eq: function(idx) {
				return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
			},
			first: function() {
				var el = this[0];
				return el && !isObject(el) ? el : $(el);
			},
			last: function() {
				var el = this[this.length - 1];
				return el && !isObject(el) ? el : $(el);
			},
			find: function(selector) {
				var result, $this = this;
				if (!selector) result = $();
				else if (typeof selector == "object") result = $(selector).filter(function() {
					var node = this;
					return emptyArray.some.call($this, function(parent) {
						return $.contains(parent, node);
					});
				});
				else if (this.length == 1) result = $(zepto.qsa(this[0], selector));
				else result = this.map(function() {
					return zepto.qsa(this, selector);
				});
				return result;
			},
			closest: function(selector, context) {
				var nodes = [],
					collection = typeof selector == "object" && $(selector);
				this.each(function(_, node) {
					while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector))) node = node !== context && !isDocument(node) && node.parentNode;
					if (node && nodes.indexOf(node) < 0) nodes.push(node);
				});
				return $(nodes);
			},
			parents: function(selector) {
				var ancestors = [],
					nodes = this;
				while (nodes.length > 0) nodes = $.map(nodes, function(node) {
					if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
						ancestors.push(node);
						return node;
					}
				});
				return filtered(ancestors, selector);
			},
			parent: function(selector) {
				return filtered(uniq(this.pluck("parentNode")), selector);
			},
			children: function(selector) {
				return filtered(this.map(function() {
					return children(this);
				}), selector);
			},
			contents: function() {
				return this.map(function() {
					return this.contentDocument || slice.call(this.childNodes);
				});
			},
			siblings: function(selector) {
				return filtered(this.map(function(i, el) {
					return filter.call(children(el.parentNode), function(child) {
						return child !== el;
					});
				}), selector);
			},
			empty: function() {
				return this.each(function() {
					this.innerHTML = "";
				});
			},
			pluck: function(property) {
				return $.map(this, function(el) {
					return el[property];
				});
			},
			show: function() {
				return this.each(function() {
					this.style.display == "none" && (this.style.display = "");
					if (getComputedStyle(this, "").getPropertyValue("display") == "none") this.style.display = defaultDisplay(this.nodeName);
				});
			},
			replaceWith: function(newContent) {
				return this.before(newContent).remove();
			},
			wrap: function(structure) {
				var func = isFunction(structure);
				if (this[0] && !func) var dom = $(structure).get(0),
					clone = dom.parentNode || this.length > 1;
				return this.each(function(index) {
					$(this).wrapAll(func ? structure.call(this, index) : clone ? dom.cloneNode(true) : dom);
				});
			},
			wrapAll: function(structure) {
				if (this[0]) {
					$(this[0]).before(structure = $(structure));
					var children;
					while ((children = structure.children()).length) structure = children.first();
					$(structure).append(this);
				}
				return this;
			},
			wrapInner: function(structure) {
				var func = isFunction(structure);
				return this.each(function(index) {
					var self = $(this),
						contents = self.contents(),
						dom = func ? structure.call(this, index) : structure;
					contents.length ? contents.wrapAll(dom) : self.append(dom);
				});
			},
			unwrap: function() {
				this.parent().each(function() {
					$(this).replaceWith($(this).children());
				});
				return this;
			},
			clone: function() {
				return this.map(function() {
					return this.cloneNode(true);
				});
			},
			hide: function() {
				return this.css("display", "none");
			},
			toggle: function(setting) {
				return this.each(function() {
					var el = $(this);
					(setting === undefined ? el.css("display") == "none" : setting) ? el.show(): el.hide();
				});
			},
			prev: function(selector) {
				return $(this.pluck("previousElementSibling")).filter(selector || "*");
			},
			next: function(selector) {
				return $(this.pluck("nextElementSibling")).filter(selector || "*");
			},
			html: function(html) {
				return 0 in arguments ? this.each(function(idx) {
					var originHtml = this.innerHTML;
					$(this).empty().append(funcArg(this, html, idx, originHtml));
				}) : 0 in this ? this[0].innerHTML : null;
			},
			text: function(text) {
				return 0 in arguments ? this.each(function(idx) {
					var newText = funcArg(this, text, idx, this.textContent);
					this.textContent = newText == null ? "" : "" + newText;
				}) : 0 in this ? this.pluck("textContent").join("") : null;
			},
			attr: function(name, value) {
				var result;
				return typeof name == "string" && !(1 in arguments) ? 0 in this && this[0].nodeType == 1 && (result = this[0].getAttribute(name)) != null ? result : undefined : this.each(function(idx) {
					if (this.nodeType !== 1) return;
					if (isObject(name))
						for (key in name) setAttribute(this, key, name[key]);
					else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)));
				});
			},
			removeAttr: function(name) {
				return this.each(function() {
					this.nodeType === 1 && name.split(" ").forEach(function(attribute) {
						setAttribute(this, attribute);
					}, this);
				});
			},
			prop: function(name, value) {
				name = propMap[name] || name;
				return 1 in arguments ? this.each(function(idx) {
					this[name] = funcArg(this, value, idx, this[name]);
				}) : this[0] && this[0][name];
			},
			removeProp: function(name) {
				name = propMap[name] || name;
				return this.each(function() {
					delete this[name];
				});
			},
			data: function(name, value) {
				var attrName = "data-" + name.replace(capitalRE, "-$1").toLowerCase();
				var data = 1 in arguments ? this.attr(attrName, value) : this.attr(attrName);
				return data !== null ? deserializeValue(data) : undefined;
			},
			val: function(value) {
				if (0 in arguments) {
					if (value == null) value = "";
					return this.each(function(idx) {
						this.value = funcArg(this, value, idx, this.value);
					});
				} else {
					return this[0] && (this[0].multiple ? $(this[0]).find("option").filter(function() {
						return this.selected;
					}).pluck("value") : this[0].value);
				}
			},
			offset: function(coordinates) {
				if (coordinates) return this.each(function(index) {
					var $this = $(this),
						coords = funcArg(this, coordinates, index, $this.offset()),
						parentOffset = $this.offsetParent().offset(),
						props = {
							top: coords.top - parentOffset.top,
							left: coords.left - parentOffset.left
						};
					if ($this.css("position") == "static") props["position"] = "relative";
					$this.css(props);
				});
				if (!this.length) return null;
				if (document.documentElement !== this[0] && !$.contains(document.documentElement, this[0])) return {
					top: 0,
					left: 0
				};
				var obj = this[0].getBoundingClientRect();
				return {
					left: obj.left + window.pageXOffset,
					top: obj.top + window.pageYOffset,
					width: Math.round(obj.width),
					height: Math.round(obj.height)
				};
			},
			css: function(property, value) {
				if (arguments.length < 2) {
					var element = this[0];
					if (typeof property == "string") {
						if (!element) return;
						return element.style[camelize(property)] || getComputedStyle(element, "").getPropertyValue(property);
					} else if (isArray(property)) {
						if (!element) return;
						var props = {};
						var computedStyle = getComputedStyle(element, "");
						$.each(property, function(_, prop) {
							props[prop] = element.style[camelize(prop)] || computedStyle.getPropertyValue(prop);
						});
						return props;
					}
				}
				var css = "";
				if (type(property) == "string") {
					if (!value && value !== 0) this.each(function() {
						this.style.removeProperty(dasherize(property));
					});
					else css = dasherize(property) + ":" + maybeAddPx(property, value);
				} else {
					for (key in property)
						if (!property[key] && property[key] !== 0) this.each(function() {
							this.style.removeProperty(dasherize(key));
						});
						else css += dasherize(key) + ":" + maybeAddPx(key, property[key]) + ";";
				}
				return this.each(function() {
					this.style.cssText += ";" + css;
				});
			},
			index: function(element) {
				return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0]);
			},
			hasClass: function(name) {
				if (!name) return false;
				return emptyArray.some.call(this, function(el) {
					return this.test(className(el));
				}, classRE(name));
			},
			addClass: function(name) {
				if (!name) return this;
				return this.each(function(idx) {
					if (!("className" in this)) return;
					classList = [];
					var cls = className(this),
						newName = funcArg(this, name, idx, cls);
					newName.split(/\s+/g).forEach(function(klass) {
						if (!$(this).hasClass(klass)) classList.push(klass);
					}, this);
					classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "));
				});
			},
			removeClass: function(name) {
				return this.each(function(idx) {
					if (!("className" in this)) return;
					if (name === undefined) return className(this, "");
					classList = className(this);
					funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass) {
						classList = classList.replace(classRE(klass), " ");
					});
					className(this, classList.trim());
				});
			},
			toggleClass: function(name, when) {
				if (!name) return this;
				return this.each(function(idx) {
					var $this = $(this),
						names = funcArg(this, name, idx, className(this));
					names.split(/\s+/g).forEach(function(klass) {
						(when === undefined ? !$this.hasClass(klass) : when) ? $this.addClass(klass): $this.removeClass(klass);
					});
				});
			},
			scrollTop: function(value) {
				if (!this.length) return;
				var hasScrollTop = "scrollTop" in this[0];
				if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset;
				return this.each(hasScrollTop ? function() {
					this.scrollTop = value;
				} : function() {
					this.scrollTo(this.scrollX, value);
				});
			},
			scrollLeft: function(value) {
				if (!this.length) return;
				var hasScrollLeft = "scrollLeft" in this[0];
				if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset;
				return this.each(hasScrollLeft ? function() {
					this.scrollLeft = value;
				} : function() {
					this.scrollTo(value, this.scrollY);
				});
			},
			position: function() {
				if (!this.length) return;
				var elem = this[0],
					offsetParent = this.offsetParent(),
					offset = this.offset(),
					parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? {
						top: 0,
						left: 0
					} : offsetParent.offset();
				offset.top -= parseFloat($(elem).css("margin-top")) || 0;
				offset.left -= parseFloat($(elem).css("margin-left")) || 0;
				parentOffset.top += parseFloat($(offsetParent[0]).css("border-top-width")) || 0;
				parentOffset.left += parseFloat($(offsetParent[0]).css("border-left-width")) || 0;
				return {
					top: offset.top - parentOffset.top,
					left: offset.left - parentOffset.left
				};
			},
			offsetParent: function() {
				return this.map(function() {
					var parent = this.offsetParent || document.body;
					while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static") parent = parent.offsetParent;
					return parent;
				});
			}
		};
		$.fn.detach = $.fn.remove;
		["width", "height"].forEach(function(dimension) {
			var dimensionProperty = dimension.replace(/./, function(m) {
				return m[0].toUpperCase();
			});
			$.fn[dimension] = function(value) {
				var offset, el = this[0];
				if (value === undefined) return isWindow(el) ? el["inner" + dimensionProperty] : isDocument(el) ? el.documentElement["scroll" + dimensionProperty] : (offset = this.offset()) && offset[dimension];
				else return this.each(function(idx) {
					el = $(this);
					el.css(dimension, funcArg(this, value, idx, el[dimension]()));
				});
			};
		});

		function traverseNode(node, fun) {
			fun(node);
			for (var i = 0, len = node.childNodes.length; i < len; i++) traverseNode(node.childNodes[i], fun);
		}
		adjacencyOperators.forEach(function(operator, operatorIndex) {
			var inside = operatorIndex % 2;
			$.fn[operator] = function() {
				var argType, nodes = $.map(arguments, function(arg) {
						var arr = [];
						argType = type(arg);
						if (argType == "array") {
							arg.forEach(function(el) {
								if (el.nodeType !== undefined) return arr.push(el);
								else if ($.zepto.isZ(el)) return arr = arr.concat(el.get());
								arr = arr.concat(zepto.fragment(el));
							});
							return arr;
						}
						return argType == "object" || arg == null ? arg : zepto.fragment(arg);
					}),
					parent, copyByClone = this.length > 1;
				if (nodes.length < 1) return this;
				return this.each(function(_, target) {
					parent = inside ? target : target.parentNode;
					target = operatorIndex == 0 ? target.nextSibling : operatorIndex == 1 ? target.firstChild : operatorIndex == 2 ? target : null;
					var parentInDocument = $.contains(document.documentElement, parent);
					nodes.forEach(function(node) {
						if (copyByClone) node = node.cloneNode(true);
						else if (!parent) return $(node).remove();
						parent.insertBefore(node, target);
						if (parentInDocument) traverseNode(node, function(el) {
							if (el.nodeName != null && el.nodeName.toUpperCase() === "SCRIPT" && (!el.type || el.type === "text/javascript") && !el.src) {
								var target = el.ownerDocument ? el.ownerDocument.defaultView : window;
								target["eval"].call(target, el.innerHTML);
							}
						});
					});
				});
			};
			$.fn[inside ? operator + "To" : "insert" + (operatorIndex ? "Before" : "After")] = function(html) {
				$(html)[operator](this);
				return this;
			};
		});
		zepto.Z.prototype = Z.prototype = $.fn;
		zepto.uniq = uniq;
		zepto.deserializeValue = deserializeValue;
		$.zepto = zepto;
		return $;
	}();
	window.Zepto = Zepto;
	window.$ === undefined && (window.$ = Zepto);
	(function($) {
		var _zid = 1,
			undefined, slice = Array.prototype.slice,
			isFunction = $.isFunction,
			isString = function(obj) {
				return typeof obj == "string";
			},
			handlers = {},
			specialEvents = {},
			focusinSupported = "onfocusin" in window,
			focus = {
				focus: "focusin",
				blur: "focusout"
			},
			hover = {
				mouseenter: "mouseover",
				mouseleave: "mouseout"
			};
		specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = "MouseEvents";

		function zid(element) {
			return element._zid || (element._zid = _zid++);
		}

		function findHandlers(element, event, fn, selector) {
			event = parse(event);
			if (event.ns) var matcher = matcherFor(event.ns);
			return (handlers[zid(element)] || []).filter(function(handler) {
				return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || zid(handler.fn) === zid(fn)) && (!selector || handler.sel == selector);
			});
		}

		function parse(event) {
			var parts = ("" + event).split(".");
			return {
				e: parts[0],
				ns: parts.slice(1).sort().join(" ")
			};
		}

		function matcherFor(ns) {
			return new RegExp("(?:^| )" + ns.replace(" ", " .* ?") + "(?: |$)");
		}

		function eventCapture(handler, captureSetting) {
			return handler.del && (!focusinSupported && handler.e in focus) || !!captureSetting;
		}

		function realEvent(type) {
			return hover[type] || focusinSupported && focus[type] || type;
		}

		function add(element, events, fn, data, selector, delegator, capture) {
			var id = zid(element),
				set = handlers[id] || (handlers[id] = []);
			events.split(/\s/).forEach(function(event) {
				if (event == "ready") return $(document).ready(fn);
				var handler = parse(event);
				handler.fn = fn;
				handler.sel = selector;
				if (handler.e in hover) fn = function(e) {
					var related = e.relatedTarget;
					if (!related || related !== this && !$.contains(this, related)) return handler.fn.apply(this, arguments);
				};
				handler.del = delegator;
				var callback = delegator || fn;
				handler.proxy = function(e) {
					e = compatible(e);
					if (e.isImmediatePropagationStopped()) return;
					e.data = data;
					var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args));
					if (result === false) e.preventDefault(), e.stopPropagation();
					return result;
				};
				handler.i = set.length;
				set.push(handler);
				if ("addEventListener" in element) element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
			});
		}

		function remove(element, events, fn, selector, capture) {
			var id = zid(element);
			(events || "").split(/\s/).forEach(function(event) {
				findHandlers(element, event, fn, selector).forEach(function(handler) {
					delete handlers[id][handler.i];
					if ("removeEventListener" in element) element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
				});
			});
		}
		$.event = {
			add: add,
			remove: remove
		};
		$.proxy = function(fn, context) {
			var args = 2 in arguments && slice.call(arguments, 2);
			if (isFunction(fn)) {
				var proxyFn = function() {
					return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments);
				};
				proxyFn._zid = zid(fn);
				return proxyFn;
			} else if (isString(context)) {
				if (args) {
					args.unshift(fn[context], fn);
					return $.proxy.apply(null, args);
				} else {
					return $.proxy(fn[context], fn);
				}
			} else {
				throw new TypeError("expected function");
			}
		};
		$.fn.bind = function(event, data, callback) {
			return this.on(event, data, callback);
		};
		$.fn.unbind = function(event, callback) {
			return this.off(event, callback);
		};
		$.fn.one = function(event, selector, data, callback) {
			return this.on(event, selector, data, callback, 1);
		};
		var returnTrue = function() {
				return true;
			},
			returnFalse = function() {
				return false;
			},
			ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
			eventMethods = {
				preventDefault: "isDefaultPrevented",
				stopImmediatePropagation: "isImmediatePropagationStopped",
				stopPropagation: "isPropagationStopped"
			};

		function compatible(event, source) {
			if (source || !event.isDefaultPrevented) {
				source || (source = event);
				$.each(eventMethods, function(name, predicate) {
					var sourceMethod = source[name];
					event[name] = function() {
						this[predicate] = returnTrue;
						return sourceMethod && sourceMethod.apply(source, arguments);
					};
					event[predicate] = returnFalse;
				});
				event.timeStamp || (event.timeStamp = Date.now());
				if (source.defaultPrevented !== undefined ? source.defaultPrevented : "returnValue" in source ? source.returnValue === false : source.getPreventDefault && source.getPreventDefault()) event.isDefaultPrevented = returnTrue;
			}
			return event;
		}

		function createProxy(event) {
			var key, proxy = {
				originalEvent: event
			};
			for (key in event)
				if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key];
			return compatible(proxy, event);
		}
		$.fn.delegate = function(selector, event, callback) {
			return this.on(event, selector, callback);
		};
		$.fn.undelegate = function(selector, event, callback) {
			return this.off(event, selector, callback);
		};
		$.fn.live = function(event, callback) {
			$(document.body).delegate(this.selector, event, callback);
			return this;
		};
		$.fn.die = function(event, callback) {
			$(document.body).undelegate(this.selector, event, callback);
			return this;
		};
		$.fn.on = function(event, selector, data, callback, one) {
			var autoRemove, delegator, $this = this;
			if (event && !isString(event)) {
				$.each(event, function(type, fn) {
					$this.on(type, selector, data, fn, one);
				});
				return $this;
			}
			if (!isString(selector) && !isFunction(callback) && callback !== false) callback = data, data = selector, selector = undefined;
			if (callback === undefined || data === false) callback = data, data = undefined;
			if (callback === false) callback = returnFalse;
			return $this.each(function(_, element) {
				if (one) autoRemove = function(e) {
					remove(element, e.type, callback);
					return callback.apply(this, arguments);
				};
				if (selector) delegator = function(e) {
					var evt, match = $(e.target).closest(selector, element).get(0);
					if (match && match !== element) {
						evt = $.extend(createProxy(e), {
							currentTarget: match,
							liveFired: element
						});
						return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)));
					}
				};
				add(element, event, callback, data, selector, delegator || autoRemove);
			});
		};
		$.fn.off = function(event, selector, callback) {
			var $this = this;
			if (event && !isString(event)) {
				$.each(event, function(type, fn) {
					$this.off(type, selector, fn);
				});
				return $this;
			}
			if (!isString(selector) && !isFunction(callback) && callback !== false) callback = selector, selector = undefined;
			if (callback === false) callback = returnFalse;
			return $this.each(function() {
				remove(this, event, callback, selector);
			});
		};
		$.fn.trigger = function(event, args) {
			event = isString(event) || $.isPlainObject(event) ? $.Event(event) : compatible(event);
			event._args = args;
			return this.each(function() {
				if (event.type in focus && typeof this[event.type] == "function") this[event.type]();
				else if ("dispatchEvent" in this) this.dispatchEvent(event);
				else $(this).triggerHandler(event, args);
			});
		};
		$.fn.triggerHandler = function(event, args) {
			var e, result;
			this.each(function(i, element) {
				e = createProxy(isString(event) ? $.Event(event) : event);
				e._args = args;
				e.target = element;
				$.each(findHandlers(element, event.type || event), function(i, handler) {
					result = handler.proxy(e);
					if (e.isImmediatePropagationStopped()) return false;
				});
			});
			return result;
		};
		("focusin focusout focus blur load resize scroll unload click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select keydown keypress keyup error").split(" ").forEach(function(event) {
			$.fn[event] = function(callback) {
				return 0 in arguments ? this.bind(event, callback) : this.trigger(event);
			};
		});
		$.Event = function(type, props) {
			if (!isString(type)) props = type, type = props.type;
			var event = document.createEvent(specialEvents[type] || "Events"),
				bubbles = true;
			if (props)
				for (var name in props) name == "bubbles" ? bubbles = !!props[name] : event[name] = props[name];
			event.initEvent(type, bubbles, true);
			return compatible(event);
		};
	})(Zepto);
	(function($) {
		var jsonpID = +new Date(),
			document = window.document,
			key, name, rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
			scriptTypeRE = /^(?:text|application)\/javascript/i,
			xmlTypeRE = /^(?:text|application)\/xml/i,
			jsonType = "application/json",
			htmlType = "text/html",
			blankRE = /^\s*$/,
			originAnchor = document.createElement("a");
		originAnchor.href = window.location.href;

		function triggerAndReturn(context, eventName, data) {
			var event = $.Event(eventName);
			$(context).trigger(event, data);
			return !event.isDefaultPrevented();
		}

		function triggerGlobal(settings, context, eventName, data) {
			if (settings.global) return triggerAndReturn(context || document, eventName, data);
		}
		$.active = 0;

		function ajaxStart(settings) {
			if (settings.global && $.active++ === 0) triggerGlobal(settings, null, "ajaxStart");
		}

		function ajaxStop(settings) {
			if (settings.global && !--$.active) triggerGlobal(settings, null, "ajaxStop");
		}

		function ajaxBeforeSend(xhr, settings) {
			var context = settings.context;
			if (settings.beforeSend.call(context, xhr, settings) === false || triggerGlobal(settings, context, "ajaxBeforeSend", [xhr, settings]) === false) return false;
			triggerGlobal(settings, context, "ajaxSend", [xhr, settings]);
		}

		function ajaxSuccess(data, xhr, settings, deferred) {
			var context = settings.context,
				status = "success";
			settings.success.call(context, data, status, xhr);
			if (deferred) deferred.resolveWith(context, [data, status, xhr]);
			triggerGlobal(settings, context, "ajaxSuccess", [xhr, settings, data]);
			ajaxComplete(status, xhr, settings);
		}

		function ajaxError(error, type, xhr, settings, deferred) {
			var context = settings.context;
			settings.error.call(context, xhr, type, error);
			if (deferred) deferred.rejectWith(context, [xhr, type, error]);
			triggerGlobal(settings, context, "ajaxError", [xhr, settings, error || type]);
			ajaxComplete(type, xhr, settings);
		}

		function ajaxComplete(status, xhr, settings) {
			var context = settings.context;
			settings.complete.call(context, xhr, status);
			triggerGlobal(settings, context, "ajaxComplete", [xhr, settings]);
			ajaxStop(settings);
		}

		function ajaxDataFilter(data, type, settings) {
			if (settings.dataFilter == empty) return data;
			var context = settings.context;
			return settings.dataFilter.call(context, data, type);
		}

		function empty() {}
		$.ajaxJSONP = function(options, deferred) {
			if (!("type" in options)) return $.ajax(options);
			var _callbackName = options.jsonpCallback,
				callbackName = ($.isFunction(_callbackName) ? _callbackName() : _callbackName) || "Zepto" + jsonpID++,
				script = document.createElement("script"),
				originalCallback = window[callbackName],
				responseData, abort = function(errorType) {
					$(script).triggerHandler("error", errorType || "abort");
				},
				xhr = {
					abort: abort
				},
				abortTimeout;
			if (deferred) deferred.promise(xhr);
			$(script).on("load error", function(e, errorType) {
				clearTimeout(abortTimeout);
				$(script).off().remove();
				if (e.type == "error" || !responseData) {
					ajaxError(null, errorType || "error", xhr, options, deferred);
				} else {
					ajaxSuccess(responseData[0], xhr, options, deferred);
				}
				window[callbackName] = originalCallback;
				if (responseData && $.isFunction(originalCallback)) originalCallback(responseData[0]);
				originalCallback = responseData = undefined;
			});
			if (ajaxBeforeSend(xhr, options) === false) {
				abort("abort");
				return xhr;
			}
			window[callbackName] = function() {
				responseData = arguments;
			};
			script.src = options.url.replace(/\?(.+)=\?/, "?$1=" + callbackName);
			document.head.appendChild(script);
			if (options.timeout > 0) abortTimeout = setTimeout(function() {
				abort("timeout");
			}, options.timeout);
			return xhr;
		};
		$.ajaxSettings = {
			type: "GET",
			beforeSend: empty,
			success: empty,
			error: empty,
			complete: empty,
			context: null,
			global: true,
			xhr: function() {
				return new window.XMLHttpRequest();
			},
			accepts: {
				script: "text/javascript, application/javascript, application/x-javascript",
				json: jsonType,
				xml: "application/xml, text/xml",
				html: htmlType,
				text: "text/plain"
			},
			crossDomain: false,
			timeout: 0,
			processData: true,
			cache: true,
			dataFilter: empty
		};

		function mimeToDataType(mime) {
			if (mime) mime = mime.split(";", 2)[0];
			return mime && (mime == htmlType ? "html" : mime == jsonType ? "json" : scriptTypeRE.test(mime) ? "script" : xmlTypeRE.test(mime) && "xml") || "text";
		}

		function appendQuery(url, query) {
			if (query == "") return url;
			return (url + "&" + query).replace(/[&?]{1,2}/, "?");
		}

		function serializeData(options) {
			if (options.processData && options.data && $.type(options.data) != "string") options.data = $.param(options.data, options.traditional);
			if (options.data && (!options.type || options.type.toUpperCase() == "GET" || "jsonp" == options.dataType)) options.url = appendQuery(options.url, options.data), options.data = undefined;
		}
		$.ajax = function(options) {
			var settings = $.extend({}, options || {}),
				deferred = $.Deferred && $.Deferred(),
				urlAnchor, hashIndex;
			for (key in $.ajaxSettings)
				if (settings[key] === undefined) settings[key] = $.ajaxSettings[key];
			ajaxStart(settings);
			if (!settings.crossDomain) {
				urlAnchor = document.createElement("a");
				urlAnchor.href = settings.url;
				urlAnchor.href = urlAnchor.href;
				settings.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
			}
			if (!settings.url) settings.url = window.location.toString();
			if ((hashIndex = settings.url.indexOf("#")) > -1) settings.url = settings.url.slice(0, hashIndex);
			serializeData(settings);
			var dataType = settings.dataType,
				hasPlaceholder = /\?.+=\?/.test(settings.url);
			if (hasPlaceholder) dataType = "jsonp";
			if (settings.cache === false || (!options || options.cache !== true) && ("script" == dataType || "jsonp" == dataType)) settings.url = appendQuery(settings.url, "_=" + Date.now());
			if ("jsonp" == dataType) {
				if (!hasPlaceholder) settings.url = appendQuery(settings.url, settings.jsonp ? settings.jsonp + "=?" : settings.jsonp === false ? "" : "callback=?");
				return $.ajaxJSONP(settings, deferred);
			}
			var mime = settings.accepts[dataType],
				headers = {},
				setHeader = function(name, value) {
					headers[name.toLowerCase()] = [name, value];
				},
				protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
				xhr = settings.xhr(),
				nativeSetHeader = xhr.setRequestHeader,
				abortTimeout;
			if (deferred) deferred.promise(xhr);
			if (!settings.crossDomain) setHeader("X-Requested-With", "XMLHttpRequest");
			setHeader("Accept", mime || "*/*");
			if (mime = settings.mimeType || mime) {
				if (mime.indexOf(",") > -1) mime = mime.split(",", 2)[0];
				xhr.overrideMimeType && xhr.overrideMimeType(mime);
			}
			if (settings.contentType || settings.contentType !== false && settings.data && settings.type.toUpperCase() != "GET") setHeader("Content-Type", settings.contentType || "application/x-www-form-urlencoded");
			if (settings.headers)
				for (name in settings.headers) setHeader(name, settings.headers[name]);
			xhr.setRequestHeader = setHeader;
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					xhr.onreadystatechange = empty;
					clearTimeout(abortTimeout);
					var result, error = false;
					if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304 || xhr.status == 0 && protocol == "file:") {
						dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader("content-type"));
						if (xhr.responseType == "arraybuffer" || xhr.responseType == "blob") result = xhr.response;
						else {
							result = xhr.responseText;
							try {
								result = ajaxDataFilter(result, dataType, settings);
								if (dataType == "script")(1, eval)(result);
								else if (dataType == "xml") result = xhr.responseXML;
								else if (dataType == "json") result = blankRE.test(result) ? null : $.parseJSON(result);
							} catch (e) {
								error = e;
							}
							if (error) return ajaxError(error, "parsererror", xhr, settings, deferred);
						}
						ajaxSuccess(result, xhr, settings, deferred);
					} else {
						ajaxError(xhr.statusText || null, xhr.status ? "error" : "abort", xhr, settings, deferred);
					}
				}
			};
			if (ajaxBeforeSend(xhr, settings) === false) {
				xhr.abort();
				ajaxError(null, "abort", xhr, settings, deferred);
				return xhr;
			}
			var async = "async" in settings ? settings.async : true;
			xhr.open(settings.type, settings.url, async, settings.username, settings.password);
			if (settings.xhrFields)
				for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name];
			for (name in headers) nativeSetHeader.apply(xhr, headers[name]);
			if (settings.timeout > 0) abortTimeout = setTimeout(function() {
				xhr.onreadystatechange = empty;
				xhr.abort();
				ajaxError(null, "timeout", xhr, settings, deferred);
			}, settings.timeout);
			xhr.send(settings.data ? settings.data : null);
			return xhr;
		};

		function parseArguments(url, data, success, dataType) {
			if ($.isFunction(data)) dataType = success, success = data, data = undefined;
			if (!$.isFunction(success)) dataType = success, success = undefined;
			return {
				url: url,
				data: data,
				success: success,
				dataType: dataType
			};
		}
		$.get = function() {
			return $.ajax(parseArguments.apply(null, arguments));
		};
		$.post = function() {
			var options = parseArguments.apply(null, arguments);
			options.type = "POST";
			return $.ajax(options);
		};
		$.getJSON = function() {
			var options = parseArguments.apply(null, arguments);
			options.dataType = "json";
			return $.ajax(options);
		};
		$.fn.load = function(url, data, success) {
			if (!this.length) return this;
			var self = this,
				parts = url.split(/\s/),
				selector, options = parseArguments(url, data, success),
				callback = options.success;
			if (parts.length > 1) options.url = parts[0], selector = parts[1];
			options.success = function(response) {
				self.html(selector ? $("<div>").html(response.replace(rscript, "")).find(selector) : response);
				callback && callback.apply(self, arguments);
			};
			$.ajax(options);
			return this;
		};
		var escape = encodeURIComponent;

		function serialize(params, obj, traditional, scope) {
			var type, array = $.isArray(obj),
				hash = $.isPlainObject(obj);
			$.each(obj, function(key, value) {
				type = $.type(value);
				if (scope) key = traditional ? scope : scope + "[" + (hash || type == "object" || type == "array" ? key : "") + "]";
				if (!scope && array) params.add(value.name, value.value);
				else if (type == "array" || !traditional && type == "object") serialize(params, value, traditional, key);
				else params.add(key, value);
			});
		}
		$.param = function(obj, traditional) {
			var params = [];
			params.add = function(key, value) {
				if ($.isFunction(value)) value = value();
				if (value == null) value = "";
				this.push(escape(key) + "=" + escape(value));
			};
			serialize(params, obj, traditional);
			return params.join("&").replace(/%20/g, "+");
		};
	})(Zepto);
	(function($) {
		$.fn.serializeArray = function() {
			var name, type, result = [],
				add = function(value) {
					if (value.forEach) return value.forEach(add);
					result.push({
						name: name,
						value: value
					});
				};
			if (this[0]) $.each(this[0].elements, function(_, field) {
				type = field.type, name = field.name;
				if (name && field.nodeName.toLowerCase() != "fieldset" && !field.disabled && type != "submit" && type != "reset" && type != "button" && type != "file" && (type != "radio" && type != "checkbox" || field.checked)) add($(field).val());
			});
			return result;
		};
		$.fn.serialize = function() {
			var result = [];
			this.serializeArray().forEach(function(elm) {
				result.push(encodeURIComponent(elm.name) + "=" + encodeURIComponent(elm.value));
			});
			return result.join("&");
		};
		$.fn.submit = function(callback) {
			if (0 in arguments) this.bind("submit", callback);
			else if (this.length) {
				var event = $.Event("submit");
				this.eq(0).trigger(event);
				if (!event.isDefaultPrevented()) this.get(0).submit();
			}
			return this;
		};
	})(Zepto);
	(function() {
		try {
			getComputedStyle(undefined);
		} catch (e) {
			var nativeGetComputedStyle = getComputedStyle;
			window.getComputedStyle = function(element, pseudoElement) {
				try {
					return nativeGetComputedStyle(element, pseudoElement);
				} catch (e) {
					return null;
				}
			};
		}
	})();
	(function($) {
		var slice = Array.prototype.slice;

		function Deferred(func) {
			var tuples = [
					["resolve", "done", $.Callbacks({
						once: 1,
						memory: 1
					}), "resolved"],
					["reject", "fail", $.Callbacks({
						once: 1,
						memory: 1
					}), "rejected"],
					["notify", "progress", $.Callbacks({
						memory: 1
					})]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					always: function() {
						deferred.done(arguments).fail(arguments);
						return this;
					},
					then: function() {
						var fns = arguments;
						return Deferred(function(defer) {
							$.each(tuples, function(i, tuple) {
								var fn = $.isFunction(fns[i]) && fns[i];
								deferred[tuple[1]](function() {
									var returned = fn && fn.apply(this, arguments);
									if (returned && $.isFunction(returned.promise)) {
										returned.promise().done(defer.resolve).fail(defer.reject).progress(defer.notify);
									} else {
										var context = this === promise ? defer.promise() : this,
											values = fn ? [returned] : arguments;
										defer[tuple[0] + "With"](context, values);
									}
								});
							});
							fns = null;
						}).promise();
					},
					promise: function(obj) {
						return obj != null ? $.extend(obj, promise) : promise;
					}
				},
				deferred = {};
			$.each(tuples, function(i, tuple) {
				var list = tuple[2],
					stateString = tuple[3];
				promise[tuple[1]] = list.add;
				if (stateString) {
					list.add(function() {
						state = stateString;
					}, tuples[i ^ 1][2].disable, tuples[2][2].lock);
				}
				deferred[tuple[0]] = function() {
					deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
					return this;
				};
				deferred[tuple[0] + "With"] = list.fireWith;
			});
			promise.promise(deferred);
			if (func) func.call(deferred, deferred);
			return deferred;
		}
		$.when = function(sub) {
			var resolveValues = slice.call(arguments),
				len = resolveValues.length,
				i = 0,
				remain = len !== 1 || sub && $.isFunction(sub.promise) ? len : 0,
				deferred = remain === 1 ? sub : Deferred(),
				progressValues, progressContexts, resolveContexts, updateFn = function(i, ctx, val) {
					return function(value) {
						ctx[i] = this;
						val[i] = arguments.length > 1 ? slice.call(arguments) : value;
						if (val === progressValues) {
							deferred.notifyWith(ctx, val);
						} else if (!--remain) {
							deferred.resolveWith(ctx, val);
						}
					};
				};
			if (len > 1) {
				progressValues = new Array(len);
				progressContexts = new Array(len);
				resolveContexts = new Array(len);
				for (; i < len; ++i) {
					if (resolveValues[i] && $.isFunction(resolveValues[i].promise)) {
						resolveValues[i].promise().done(updateFn(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFn(i, progressContexts, progressValues));
					} else {
						--remain;
					}
				}
			}
			if (!remain) deferred.resolveWith(resolveContexts, resolveValues);
			return deferred.promise();
		};
		$.Deferred = Deferred;
	})(Zepto);
	(function($) {
		$.Callbacks = function(options) {
			options = $.extend({}, options);
			var memory, fired, firing, firingStart, firingLength, firingIndex, list = [],
				stack = !options.once && [],
				fire = function(data) {
					memory = options.memory && data;
					fired = true;
					firingIndex = firingStart || 0;
					firingStart = 0;
					firingLength = list.length;
					firing = true;
					for (; list && firingIndex < firingLength; ++firingIndex) {
						if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
							memory = false;
							break;
						}
					}
					firing = false;
					if (list) {
						if (stack) stack.length && fire(stack.shift());
						else if (memory) list.length = 0;
						else Callbacks.disable();
					}
				},
				Callbacks = {
					add: function() {
						if (list) {
							var start = list.length,
								add = function(args) {
									$.each(args, function(_, arg) {
										if (typeof arg === "function") {
											if (!options.unique || !Callbacks.has(arg)) list.push(arg);
										} else if (arg && arg.length && typeof arg !== "string") add(arg);
									});
								};
							add(arguments);
							if (firing) firingLength = list.length;
							else if (memory) {
								firingStart = start;
								fire(memory);
							}
						}
						return this;
					},
					remove: function() {
						if (list) {
							$.each(arguments, function(_, arg) {
								var index;
								while ((index = $.inArray(arg, list, index)) > -1) {
									list.splice(index, 1);
									if (firing) {
										if (index <= firingLength) --firingLength;
										if (index <= firingIndex) --firingIndex;
									}
								}
							});
						}
						return this;
					},
					has: function(fn) {
						return !!(list && (fn ? $.inArray(fn, list) > -1 : list.length));
					},
					empty: function() {
						firingLength = list.length = 0;
						return this;
					},
					disable: function() {
						list = stack = memory = undefined;
						return this;
					},
					disabled: function() {
						return !list;
					},
					lock: function() {
						stack = undefined;
						if (!memory) Callbacks.disable();
						return this;
					},
					locked: function() {
						return !stack;
					},
					fireWith: function(context, args) {
						if (list && (!fired || stack)) {
							args = args || [];
							args = [context, args.slice ? args.slice() : args];
							if (firing) stack.push(args);
							else fire(args);
						}
						return this;
					},
					fire: function() {
						return Callbacks.fireWith(this, arguments);
					},
					fired: function() {
						return !!fired;
					}
				};
			return Callbacks;
		};
	})(Zepto);
	(function($) {
		var touch = {},
			touchTimeout, tapTimeout, swipeTimeout, longTapTimeout, longTapDelay = 750,
			gesture;

		function swipeDirection(x1, x2, y1, y2) {
			return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? x1 - x2 > 0 ? "Left" : "Right" : y1 - y2 > 0 ? "Up" : "Down";
		}

		function longTap() {
			longTapTimeout = null;
			if (touch.last) {
				touch.el.trigger("longTap");
				touch = {};
			}
		}

		function cancelLongTap() {
			if (longTapTimeout) clearTimeout(longTapTimeout);
			longTapTimeout = null;
		}

		function cancelAll() {
			if (touchTimeout) clearTimeout(touchTimeout);
			if (tapTimeout) clearTimeout(tapTimeout);
			if (swipeTimeout) clearTimeout(swipeTimeout);
			if (longTapTimeout) clearTimeout(longTapTimeout);
			touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
			touch = {};
		}

		function isPrimaryTouch(event) {
			return (event.pointerType == "touch" || event.pointerType == event.MSPOINTER_TYPE_TOUCH) && event.isPrimary;
		}

		function isPointerEventType(e, type) {
			return e.type == "pointer" + type || e.type.toLowerCase() == "mspointer" + type;
		}
		$(document).ready(function() {
			var now, delta, deltaX = 0,
				deltaY = 0,
				firstTouch, _isPointerType;
			if ("MSGesture" in window) {
				gesture = new MSGesture();
				gesture.target = document.body;
			}
			$(document).bind("MSGestureEnd", function(e) {
				var swipeDirectionFromVelocity = e.velocityX > 1 ? "Right" : e.velocityX < -1 ? "Left" : e.velocityY > 1 ? "Down" : e.velocityY < -1 ? "Up" : null;
				if (swipeDirectionFromVelocity) {
					touch.el.trigger("swipe");
					touch.el.trigger("swipe" + swipeDirectionFromVelocity);
				}
			}).on("touchstart MSPointerDown pointerdown", function(e) {
				if ((_isPointerType = isPointerEventType(e, "down")) && !isPrimaryTouch(e)) return;
				firstTouch = _isPointerType ? e : e.touches[0];
				if (e.touches && e.touches.length === 1 && touch.x2) {
					touch.x2 = undefined;
					touch.y2 = undefined;
				}
				now = Date.now();
				delta = now - (touch.last || now);
				touch.el = $("tagName" in firstTouch.target ? firstTouch.target : firstTouch.target.parentNode);
				touchTimeout && clearTimeout(touchTimeout);
				touch.x1 = firstTouch.pageX;
				touch.y1 = firstTouch.pageY;
				if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
				touch.last = now;
				longTapTimeout = setTimeout(longTap, longTapDelay);
				if (gesture && _isPointerType) gesture.addPointer(e.pointerId);
			}).on("touchmove MSPointerMove pointermove", function(e) {
				if ((_isPointerType = isPointerEventType(e, "move")) && !isPrimaryTouch(e)) return;
				firstTouch = _isPointerType ? e : e.touches[0];
				cancelLongTap();
				touch.x2 = firstTouch.pageX;
				touch.y2 = firstTouch.pageY;
				deltaX += Math.abs(touch.x1 - touch.x2);
				deltaY += Math.abs(touch.y1 - touch.y2);
			}).on("touchend MSPointerUp pointerup", function(e) {
				if ((_isPointerType = isPointerEventType(e, "up")) && !isPrimaryTouch(e)) return;
				cancelLongTap();
				if (touch.x2 && Math.abs(touch.x1 - touch.x2) > 30 || touch.y2 && Math.abs(touch.y1 - touch.y2) > 30) swipeTimeout = setTimeout(function() {
					if (touch.el) {
						touch.el.trigger("swipe");
						touch.el.trigger("swipe" + swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2));
					}
					touch = {};
				}, 0);
				else if ("last" in touch)
					if (deltaX < 30 && deltaY < 30) {
						tapTimeout = setTimeout(function() {
							var event = $.Event("tap");
							event.cancelTouch = cancelAll;
							if (touch.el) touch.el.trigger(event);
							if (touch.isDoubleTap) {
								if (touch.el) touch.el.trigger("doubleTap");
								touch = {};
							} else {
								touchTimeout = setTimeout(function() {
									touchTimeout = null;
									if (touch.el) touch.el.trigger("singleTap");
									touch = {};
								}, 250);
							}
						}, 0);
					} else {
						touch = {};
					}
				deltaX = deltaY = 0;
			}).on("touchcancel MSPointerCancel pointercancel", cancelAll);
			$(window).on("scroll", cancelAll);
		});
		["swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "singleTap", "longTap"].forEach(function(eventName) {
			$.fn[eventName] = function(callback) {
				return this.on(eventName, callback);
			};
		});
	})(Zepto);;
	var flexImages = (function() {
		function flexImages(options) {
			if (!document.querySelector) return;

			function makeGrid(grid, items, o, noresize) {
				var x, new_w, exact_w, ratio = 1,
					rows = 1,
					max_w = grid.clientWidth - 2,
					row = [],
					row_width = 0,
					h, row_h = o.rowHeight;

				function _helper(lastRow) {
					if (o.maxRows && rows > o.maxRows || o.truncate && lastRow && rows > 1) row[x][0].style.display = 'none';
					else {
						if (row[x][4]) {
							row[x][3].setAttribute('src', row[x][4]);
							row[x][4] = '';
						}
						row[x][0].style.width = new_w + 'px';
						row[x][0].style.height = row_h + 'px';
						row[x][0].style.display = 'block';
					}
				}
				for (var i = 0; i < items.length; i++) {
					row.push(items[i]);
					row_width += items[i][2] + o.margin;
					if (row_width >= max_w) {
						var margins_in_row = row.length * o.margin;
						ratio = (max_w - margins_in_row) / (row_width - margins_in_row), row_h = Math.ceil(o.rowHeight * ratio), exact_w = 0, new_w;
						for (x = 0; x < row.length; x++) {
							new_w = Math.ceil(row[x][2] * ratio);
							exact_w += new_w + o.margin;
							if (exact_w > max_w) new_w -= exact_w - max_w;
							_helper();
						}
						row = [], row_width = 0;
						rows++;
					}
				}
				for (x = 0; x < row.length; x++) {
					new_w = Math.floor(row[x][2] * ratio), h = Math.floor(o.rowHeight * ratio);
					_helper(true);
				}
				if (!noresize && max_w != grid.clientWidth) makeGrid(grid, items, o, true);
			}
			var o = {
				selector: 0,
				container: '.item',
				object: 'img',
				rowHeight: 180,
				maxRows: 0,
				truncate: 0
			};
			for (var k in options) {
				if (options.hasOwnProperty(k)) o[k] = options[k];
			}
			var grids = typeof o.selector == 'object' ? [o.selector] : document.querySelectorAll(o.selector);
			for (var i = 0; i < grids.length; i++) {
				var grid = grids[i],
					containers = grid.querySelectorAll(o.container),
					items = [],
					t = new Date().getTime();
				if (!containers.length) continue;
				var s = window.getComputedStyle ? getComputedStyle(containers[0], null) : containers[0].currentStyle;
				o.margin = (parseInt(s.marginLeft) || 0) + (parseInt(s.marginRight) || 0) + (Math.round(parseFloat(s.borderLeftWidth)) || 0) + (Math.round(parseFloat(s.borderRightWidth)) || 0);
				for (var j = 0; j < containers.length; j++) {
					var c = containers[j],
						w = parseInt(c.getAttribute('data-w')),
						norm_w = w * (o.rowHeight / parseInt(c.getAttribute('data-h'))),
						obj = c.querySelector(o.object);
					items.push([c, w, norm_w, obj, obj.getAttribute('data-src')]);
				}
				makeGrid(grid, items, o);
				var tempf = function() {
					makeGrid(grid, items, o);
				};
				if (document.addEventListener) {
					window['flexImages_listener' + t] = tempf;
					window.removeEventListener('resize', window['flexImages_listener' + grid.getAttribute('data-flex-t')]);
					delete window['flexImages_listener' + grid.getAttribute('data-flex-t')];
					window.addEventListener('resize', window['flexImages_listener' + t]);
				} else grid.onresize = tempf;
				grid.setAttribute('data-flex-t', t)
			}
		}
		return flexImages;
	})();
	(function() {
		if (typeof define === 'function' && define.amd) define('flexImages', function() {
			return flexImages;
		});
		else if (typeof module !== 'undefined' && module.exports) module.exports = flexImages;
		else window.flexImages = flexImages;
	})();;
	(function($) {
		function drags(dragElement, resizeElement, container) {
			dragElement.on("mousedown.ba-events touchstart.ba-events", function(e) {
				dragElement.addClass("ba-draggable");
				resizeElement.addClass("ba-resizable");
				var startX = "undefined" !== typeof e.pageX ? e.pageX : e.touches[0].pageX,
					dragWidth = dragElement[0].offsetWidth,
					posX = dragElement.offset().left + dragWidth - startX,
					containerOffset = container.offset().left,
					containerWidth = container[0].offsetWidth;
				minLeft = containerOffset;
				maxLeft = containerOffset + containerWidth - dragWidth;
				dragElement.parents().on("mousemove.ba-events touchmove.ba-events", function(e) {
					var moveX = "undefined" !== typeof e.pageX ? e.pageX : e.touches[0].pageX;
					leftValue = Math.max(Math.min(maxLeft, moveX + posX - dragWidth), minLeft);
					widthValue = (leftValue + dragWidth / 2 - containerOffset) * 100 / containerWidth + "%";
					$(".ba-draggable").css("left", widthValue);
					$(".ba-resizable").css("width", widthValue);
				}).on("mouseup.ba-events touchend.ba-events touchcancel.ba-events", function() {
					dragElement.removeClass("ba-draggable");
					resizeElement.removeClass("ba-resizable");
					$(this).off(".ba-events");
				});
				e.preventDefault();
			});
			$(window).resize(function() {
				var width = container.width() + "px";
				resizeElement.find("img").css("width", width);
			});
		}
		$.fn.beforeAfter = function() {
			return this.each(function() {
				var cur = $(this),
					width = cur.width() + "px",
					resize = cur.find(".resize");
				resize.find("img").css("width", width);
				drags(cur.find(".handle"), resize, cur);
			});
		}
	}(Zepto));;
	var alt = alt || {};;
	(function($) {
		'use strict';
		$.extend($.fn, {
			switchClass: function(condition, addClasses, removeClasses) {
				return this.each(function() {
					if (condition) {
						$(this).addClass(addClasses).removeClass(removeClasses);
					} else {
						$(this).removeClass(addClasses).addClass(removeClasses);
					}
				});
			},
			initFlexImages: function() {
				return this.each(function() {
					new flexImages({
						selector: this,
						rowHeight: $(this).data('rowheight'),
						truncate: $(this).data('truncate')
					});
				});
			}
		});
		alt = {
			lastScroll: $(window).scrollTop(),
			$backToTop: $('#back-to-top'),
			windowHeight: $(window).height(),
			windowWidth: $(window).width(),
			ticking: false,
			$menutoggle: $('#main-nav__toggle'),
			$nav: $("#main-nav__ul"),
			$header: $('.js-page-header'),
			headerHeight: $('.js-page-header').height(),
			$search: $('.js-search'),
			$headerImg: $('.js-page-header__img'),
			$clickSwitch: $('.js-click'),
			fleximages: {
				selector: '.js-fleximages',
				rowHeight: 240
			},
			clickevent: 'touchstart click',
			shutterstock: {
				$block: $('.js-shutterstock__block'),
				container: '.js-shutterstock__ctnr',
				queryBase: window.location.origin + '/stock/search/',
				linkBase: 'http://shutterstock.7eer.net/c/39548/42119/1305?subId1=altphotos&subId2=' + $('.js-shutterstock__block').data('subid') + '&u=http%3A%2F%2Fwww.shutterstock.com%2Fpic.mhtml%3Fid%3D'
			},
			$beforeAfterSelector: $('.ba-slider'),
			init: function() {
				var self = this;
				self.imageRatio = self.$headerImg.length ? self.$headerImg.data('ratio') : 0;
				self.searchTop = self.$search.length ? self.$search.offset().top - 12 : 0;
				if (!Modernizr.objectfit && self.imageRatio) {
					self.resizeHeaderImage();
					$(window).bind('resize', function() {
						self.resizeHeaderImage();
					});
				}
				self.follow_ticker();
				$(window).bind('scroll', function() {
					self.lastScroll = $(window).scrollTop();
					self.follow_ticker();
				});
				$(window).bind('resize', function() {
					self.windowHeight = $(window).height();
					self.headerHeight = self.$header.height();
					self.$nav.switchClass(Modernizr.mq('(max-width:1024px)'), 'transition-active', '');
					self.follow_ticker();
				});
				self.validationForm();
				self.initClickSwitch();
				self.mobileMenu();
				$(self.fleximages.selector).initFlexImages();
				self.shutterstockApi();
				self.changeFocus();
				self.initBeforeAfterSlider();
			},
			follow_ticker: function() {
				var self = this;
				if (!self.ticking) {
					requestAnimationFrame(self.follow.bind(self));
					self.ticking = true;
				}
			},
			follow: function() {
				var self = this;
				self.$backToTop.switchClass(self.lastScroll > self.windowHeight, 'js-visible', 'js-hidden');
				self.$search.switchClass(self.lastScroll > self.searchTop, 'js-fixed', 'js-relative');
				self.ticking = false;
			},
			resizeHeaderImage: function() {
				var self = this;
				self.windowWidth = $(window).width();
				if (self.windowWidth / self.headerHeight > self.imageRatio) {
					self.$headerImg.css({
						width: self.windowWidth + 'px',
						height: 'auto',
						top: -0.5 * (self.windowWidth / self.imageRatio - self.headerHeight) + 'px',
						left: 0
					});
				} else {
					self.$headerImg.css({
						width: 'auto!important',
						height: self.headerHeight + 'px',
						left: -0.5 * (self.headerHeight * self.imageRatio - self.windowWidth) + 'px',
						top: 0
					});
				}
			},
			validationForm: function() {
				var $form = $('#alt-contact-form');
				var $required = $form.find('.js-cf__field-required');
				$form.on("keyup", '.js-cf__field-required', function(event) {
					if (this.validity.valid) {
						$(this).next('.error').html("").addClass('js-hidden').removeClass('js-visible');
					}
				}).on("submit", function(event) {
					$required.each(function(index, item) {
						if (!item.validity.valid) {
							var $error = $(item).next('.error');
							$error.html($error.data('message')).removeClass('js-hidden').addClass('js-visible');
							event.preventDefault();
						}
					});
				});
			},
			mobileMenu: function() {
				var self = this;
				self.$menutoggle.on(self.clickevent, function(event) {
					event.preventDefault();
					self.$nav.toggleClass('main-nav__ul-mopened');
					$('.search-form--sh').toggleClass('js-active');
					$(this).find('.main-nav__svg').toggleClass('js-hidden js-visible');
					if (self.$nav.hasClass('main-nav__ul-mopened')) {
						self.$search.addClass('js-fixed');
						self.ticking = true;
					} else {
						self.$search.removeClass('js-fixed');
						self.ticking = false;
						self.follow_ticker();
					}
				});
				$('.js-main-nav__access_btn').on(self.clickevent, function(event) {
					event.preventDefault();
					$(this).parents('li').toggleClass('js-submenu');
				});
			},
			initClickSwitch: function() {
				var self = this;
				self.$clickSwitch.on(self.clickevent, function(event) {
					event.preventDefault();
					if ($(this).data('parent')) {
						$(this).closest($(this).data('selector')).toggleClass('js-hidden js-visible');
					} else {
						$(this).siblings($(this).data('selector')).toggleClass('js-hidden js-visible');
					}
				});
				$('.js-share').one(self.clickevent, function() {
					$(this).toggleClass('js-hidden js-visible');
					$(this).siblings().toggleClass('js-hidden js-visible');
					return false;
				});
				$('.js-current-page').on("keyup", function(event) {
					$(this).attr('value', this.value);
					$(this).siblings('.js-mimic-input-width').html(this.value + '0');
				});
			},
			imageLoaded: function(object, index) {
				var self = this;
				var html = '';
				if (!object.assets.preview.url) {
					return $.Deferred().resolve().promise();
				}
				var dfd = $.Deferred(),
					img = new Image();
				img.src = object.assets.preview.url;
				img.onload = function() {
					html = '<div class="item item-' + index + ' fleximages__item u-hide-overflow" data-w="' + object.assets.preview.width + '" data-h="' + object.assets.preview.height + '">';
					html += '<a href="' + self.shutterstock.linkBase + object.id + '">';
					html += '<img src="' + img.src + '">';
					html += '</a>';
					html += '</div>';
					dfd.resolve(html);
				};
				img.onerror = function() {
					dfd.resolve('');
				};
				return dfd.promise();
			},
			changeFocus: function() {
				var self = this;
				self.$backToTop.on(self.clickevent, function() {
					setTimeout(function() {
						$('.search-form__input').eq(0).focus();
					}, 50);
				});
			},
			initBeforeAfterSlider: function() {
				var self = this;
				self.$beforeAfterSelector.beforeAfter();
			},
			shutterstockApi: function() {
				var self = this,
					queries = [];
				self.shutterstock.$block.each(function(index, block) {
					queries[index] = $(block).data('apiquery');
					if (queries[index] && queries.indexOf(queries[index]) === index) {
						$.getJSON(self.shutterstock.queryBase + queries[index] + '/').then(function(data) {
							var html = '';
							if (!('data' in data && data.data.constructor === Array)) {
								console.log('returned json is empty');
								return;
							}
							var $blocksByQuery = self.shutterstock.$block.filter('[data-apiquery=' + queries[index] + ']');
							if (data.data.length) {
								var first = true;
								data.data.forEach(function(object, index) {
									self.imageLoaded(object, index).then(function(html) {
										if (html) {
											$blocksByQuery.append(html);
											if (first) {
												$blocksByQuery.closest('.js-hidden--height').removeClass('js-hidden--height');
												$blocksByQuery.each(function(i, block) {
													var $preloader = $(block).parent().find('.js-loading');
													$preloader.removeClass($preloader.data('removeclass')).addClass($preloader.data('addclass'));
												});
												first = false;
											}
											$blocksByQuery.initFlexImages();
										}
									});
								});
							} else {
								$blocksByQuery.parent(self.shutterstock.container).append("<p>Oops, nothing found.</p>");
								$blocksByQuery.each(function(i, block) {
									var $preloader = $(block).parent().find('.js-loading');
									$preloader.removeClass($preloader.data('removeclass')).addClass($preloader.data('addclass'));
								});
							}
						});
					}
				});
			},
		};
	})(Zepto);
	(function() {
		var lastTime = 0;
		var vendors = ['webkit', 'moz'];
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		}
		if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
		if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}());
	alt.init();;
	'use strict';
	(function($) {
		if (typeof(String.prototype.trim) === "undefined") {
			String.prototype.trim = function() {
				return String(this).replace(/^\s+|\s+$/g, '');
			};
		}
		$.fn.endlessPaginate = function(options) {
			var defaults = {
					containerSelector: '.endless_container',
					loadingSelector: '.endless_loading',
					moreSelector: 'a.endless_more',
					onClick: function() {},
					onCompleted: function() {},
				},
				settings = $.extend(defaults, options);
			var getContext = function(link) {
				return {
					key: link.attr('rel').split(' ')[0],
					url: link.attr('href')
				};
			};
			return this.each(function() {
				var element = $(this),
					loadedPages = 1;
				element.on('click', settings.moreSelector, function() {
					var link = $(this),
						html_link = link.get(0),
						container = link.closest(settings.containerSelector),
						loading = container.find(settings.loadingSelector);
					link.parent().find('.js-hide-on-loading').hide();
					loading.show();
					var context = getContext(link);
					if (settings.onClick.apply(html_link, [context]) !== false) {
						var data = 'querystring_key=' + context.key;
						$.get(context.url, data, function(fragment) {
							container.before(fragment);
							container.remove();
							loadedPages += 1;
							settings.onCompleted.apply(html_link, [context, fragment.trim()]);
						});
					}
					return false;
				});
			});
		};
		$.endlessPaginate = function(options) {
			return $('body').endlessPaginate(options);
		};
	})(Zepto);
}).call(this);
