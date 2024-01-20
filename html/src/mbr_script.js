var mbr = (function() {
  function mbr(selector, parent) {
    parent = parent || window.document;

    return parent.querySelectorAll(selector);
  }

  var CONST = {
    FUNCTION: 'function',
    OBJECT: 'object',
    DEFAULT: 'DEFAULT',
    EVENT: {
      CLICK: 'click',
      HASHCHANGE: 'hashchange',
      LOAD: 'load',
      KEYPRESS: 'keypress'
    },
    EXPIRES: 'expires',
    TAG: {
      BODY: 'body',
      HEAD: 'head',
      STYLE: 'style'
    },
    METHOD: {
      GET: 'GET',
      POST: 'POST',
      PUT: 'PUT',
      DELETE: 'DELETE'
    },
    NUMBER: 'number',
    ON: 'on',
    STRING: 'string',
    SYMBOL: {
      AMP: '&',
      AT: '@',
      DASH: '-',
      EQ: '=',
      HASH: '#',
      SPACE: ' ',
      COLON: ':',
      SEMICOLON: ';',
      EMPTY: '',
      LBRACE: '{',
      RBRACE: '}',
      COMMA_SPACE: ', ',
      QUESTION: '?'
    }
  }

  var RE = {
    toCamel: /-([a-z])/g,
    fromCamel: /[A-Z]/g,
    template: /\$\{(\w+)\}/g
  }

  var empty = {};

  mbr.toArray = function (arrayLike) {
    var length = arrayLike.length;
    if (!length) return [];

    var result = [];

    for (var i = 0; i < length; i++) {
      result[i] = arrayLike[i];
    }

    return result;
  }

  /**
   * @param {string | Object} options
   * @param {Node} [parent]
   * @param {Map | Function} [props];
   */
  mbr.dom = function(options, parent, props) {
    var tag;
    var iterate;
    var key;
    var text;

    if (typeof options === CONST.STRING) {
      tag = options;
    } else {
      tag = options.tag;
      props = options.props;
      parent = options.parent;
      iterate = options.iterate;
      key = options.key;
      text = options.text;
    }

    var props = props || empty;
	  var doc = parent ? parent.ownerDocument : document;

    var prop;
    var styleProp;

    if (iterate) {
      for (var index in iterate) {
        mbr.dom({
          tag: tag,
          props: props,
          parent: parent,
          key: {
            item: iterate[index],
            key: index
          }
        });
      }
    } else {
      var element = text ? doc.createTextNode(text) : doc.createElement(tag);
      if (typeof props === CONST.FUNCTION) {
        props && props(element, key);
      } else {
        for (prop in props) {
          if (typeof props[prop] === CONST.OBJECT) {
            for (styleProp in props[prop]) {
              element[prop][styleProp] = props[prop][styleProp];
            }
          } else {
            element[prop] = props[prop];
          }
        }
      }

      parent && parent.appendChild(element);
    }

    return element;
  }

  mbr.dom.txt = function(text, parent) {
    return mbr.dom({text: text, parent: parent});
  }

  mbr.event = function(element, listenTo, callback) {
	  (element === window && listenTo === CONST.EVENT.CLICK) && (element = window.document);

	  var action = {
		  element: element,
		  listenTo: listenTo,
		  callback: callback
	  };

	  if(element.addEventListener) {
		  element.addEventListener(listenTo, callback, false);
		  action.del = function() {
		    element.removeEventListener(listenTo, callback, false);
		    // --- regystry ---
		    // mbr.event.registry.splice(action.index, 1);
		  }
	  }
	  else if(element.attachEvent) {
		  element.attachEvent(CONST.ON + listenTo, callback);
		  action.del = function() {
		    element.detachEvent(CONST.ON + listenTo, callback);
		    // --- regystry ---
		    // mbr.event.registry.splice(action.index, 1);
		  }
	  }
    // --- regystry ---
	  // action.index = mbr.event.regystry.push(action) - 1;

	  return action;
  }
  // --- regystry ---
  //mbr.event.regystry = [];

  mbr.iterate = function(object, callback) {
    var state = {};

    for (state.key in object) {
      if (state.stop) break;
      state.item = object[state.key];
      callback(state);
    }
  }

  mbr.typeof = function(target) {
    return Object.prototype.toString.call(target);
  }

  function toCamel(full, letter) {
    return letter.toUpperCase();
  }
  function fromCamel(letter) {
    return CONST.SYMBOL.DASH + letter.toLowerCase();
  }

  mbr.camel = {
    to: function (string) {
      return string.replace(RE.toCamel, toCamel);
    },
    from: function(string) {
      return string.replace(RE.fromCamel, fromCamel);
    }
  }

  function toStyles(styleObject, parent) {
    var rules = [];
    var children = {};
    var styles = [];
    var key;
    parent = parent || CONST.SYMBOL.EMPTY;

    for (key in styleObject) {
      if (typeof styleObject[key] === CONST.OBJECT) {
        children[key] = styleObject[key];
      } else {
        if (key[0] === CONST.SYMBOL.AT) {
          rules.push(mbr.camel.from(key) + CONST.SYMBOL.SPACE + styleObject[key] + CONST.SYMBOL.SEMICOLON)
        } else {
          rules.push(mbr.camel.from(key) + CONST.SYMBOL.COLON + styleObject[key] + CONST.SYMBOL.SEMICOLON);
        }
      }
    }

    (rules.length && parent) && styles.push({selector: parent, rules: rules});
    for (key in children) {
      if (key[0] === CONST.SYMBOL.AT) {
        styles.push({selector: parent + key, group: toStyles(children[key])});
      } else {
        styles = styles.concat(toStyles(children[key], parent + key));
      }
    }

    return styles;
  }

  function renderAllStyles(styles) {
    var string = '';
    for (var i = 0, l = styles.length; i < l; i++) {
      string += styles[i].selector +
        (styles[i].types ? (CONST.SYMBOL.SPACE + styles[i].types.join(CONST.SYMBOL.COMMA_SPACE)) : CONST.SYMBOL.EMPTY) +
        CONST.SYMBOL.LBRACE +
        (styles[i].rules ? styles[i].rules.join(CONST.SYMBOL.EMPTY) : CONST.SYMBOL.EMPTY) +
        (styles[i].group ? renderAllStyles(styles[i].group) : CONST.SYMBOL.EMPTY) +
        CONST.SYMBOL.RBRACE;
    }
    return string;
  }

  mbr.styleSheet = function (model, parent) {
    this.model = model;
    this.styles = toStyles(model);
    this.element = mbr.dom(CONST.TAG.STYLE, parent, {innerHTML: renderAllStyles(this.styles)});
  }

  mbr.win = {
    onload: function (callback) {
      return callback ? mbr.event(window, CONST.EVENT.LOAD, function() {
        callback(
          document.getElementsByTagName(CONST.TAG.BODY)[0],
          document.getElementsByTagName(CONST.TAG.HEAD)[0]
        );
      }) : null;
    },
    onhashchange: function (callback) {
      return callback ? mbr.event(window, CONST.EVENT.HASHCHANGE, callback) : null;
    }
  }

  /**
   * Options:
   *    async (boolean) - Async request (default - true);
   *    data (any) - Data to be sent. Can be processed by `onrequest` option, to return desired data for server;
   *    url (string) - Request URL;
   *    method (string) - Request method (default - GET);
   *    headers (string[]) - Headers map;
   *    onrequest (Function(data, request)) - Action on request being submitted;
   *    onresponse (Function(response, request, data)) - Action on response have been received.
   */
  function Ajax (options) {
    this.options = options || {};
    if (!this.options.url) return;
    var async = this.options.async === undefined ? true : !!this.options.async;
    this.request = window.XMLHttpRequest ?
      new XMLHttpRequest() :
      new ActiveXObject("Microsoft.XMLHTTP");
    var _this = this;

    if (this.options.headers) {
      for (var name in this.options.headers) {
        this.request.setRequestHeader(name, this.options.headers[name]);
      }
    }

    this.request.open(this.options.method || CONST.METHOD.GET, this.getUrl(), async);
    var dataToSend = this.options.onrequest &&
      this.options.onrequest(this.options.data, this.request) ||
      this.options.data;
    (typeof dataToSend === CONST.STRING) || (dataToSend = JSON.stringify(dataToSend));
    this.request.send(dataToSend);

    if (async) {
      this.request.onreadystatechange = function () {
        if (_this.request.readyState === 4) {
          _this.options.onresponse && _this.options.onresponse(_this.request.responseText, _this.request, _this.options.data);
        }
      }
    } else {
      this.options.onresponse && this.options.onresponse(this.request.responseText, this.request, this.options.data);
    }
  }
  Ajax.prototype.getUrl = function () {
    var result = this.options.url;
    var params = '';
    if (this.options.params) {
      for (var key in this.options.params) {
        params += (params ? CONST.SYMBOL.AMP : CONST.SYMBOL.EMPTY) +
          key + '=' + encodeURIComponent(this.options.params[key]);
      }
      params && (result += CONST.SYMBOL.QUESTION + params);
    }
    return result;
  }

  mbr.ajax = function (options) {
    return new Ajax(options || {});
  }

  function parseHashParams (params) {
    var params = params.split(CONST.SYMBOL.AMP);
    var result = {};
    var index;
    for (var i in params) {
      index = params[i].indexOf(CONST.SYMBOL.EQ);
      if (index === -1) {
        result[params[i]] = true;
      } else {
        result[params[i].substr(0, index)] = decodeURIComponent(params[i].substr(index + 1));
      }
    }
    return result;
  }

  function parseHash (hash) {
    var result = {};
    var separatorIndex = hash.indexOf(CONST.SYMBOL.QUESTION);
    if (separatorIndex > -1) {
      result.path = hash.substr(1, separatorIndex - 1);
      result.params = parseHashParams(hash.substr(separatorIndex + 1));
    } else {
      result.path = hash && hash.substr(1);
    }
    return result;
  }

  function serializeHashParams (params) {
    var result = CONST.SYMBOL.EMPTY;
    if (params) {
      for (var key in params) {
        result += (result ? CONST.SYMBOL.AMP : CONST.SYMBOL.EMPTY) +
          key + CONST.SYMBOL.EQ + encodeURIComponent(params[key]); 
      }
    }
    return result ? (CONST.SYMBOL.QUESTION + result) : result;
  }

  mbr.router = function (routes, params) {
    params || (params = empty);
    var win = window;
    var defaultCallback;
    var context;
    if (params instanceof Function) {
      defaultCallback = params;
    } else {
      defaultCallback = params.defaultCallback;
      context = params.context;
    }
    function applyHash (event) {
      var hash = event.target.location.hash;
      var props = parseHash(hash);
      if (routes && routes[props.path]) {
        defaultCallback ?
          defaultCallback.call(context, routes[props.path], props.params) :
          routes[props.path].call(context, props.params);
      }
    }

    var result = {
      attach: function (attachWindow) {
        win = attachWindow || window;
        mbr.event(win, CONST.EVENT.HASHCHANGE, applyHash);
        applyHash({target: win});
      },
      go: function (hash, params) {win.location.hash = CONST.SYMBOL.HASH + hash + serializeHashParams(params);}
    };
    return result;
  }

  function LocRes (resources, props) {
    props || (props = empty);
    this.resources = resources || {};
    this.onMissingKey = props.onMissingKey;
  }
  LocRes.prototype.use = function (locale) {
    this.locale = locale;
  }
  LocRes.prototype.get = function (key, substitutions) {
    var text = this.resources && this.resources[this.locale] && this.resources[this.locale][key];
    if (text) {
      if (substitutions) {
        text = text.replace(RE.template, function (regMatch, key) {
          return substitutions[key] || CONST.SYMBOL.EMPTY;
        });
      }
    } else {
      text = this.onMissingKey ? this.onMissingKey(key, this.locale) : key;
    }
    return text;
  }
  mbr.locres = function (resources, props) {
    return new LocRes(resources, props);
  }

  function Form (props) {
    props || (props = empty);
    var on = props.on || empty;
    this.fields = props.fields || {};
    this.action = props.action;
    this.validator = props.validator;
    this.onSubmit = on.submit;
    this.onResponse = on.response;

    props.block && this.attachTo(props.block);
  }
  Form.prototype.submit = function () {
    if (!this.locked && (!this.validator || this.validator(this.fields)) && this.onSubmit) {
      new Ajax({
        url: this.action,
        method: CONST.METHOD.POST,
        onrequest: this.onSubmit,
        onresponse: this.onResponse,
        data: this.fields
      });
    }
  }
  Form.prototype.attachTo = function (block) {
    var _this = this;
    mbr.event(block, CONST.EVENT.KEYPRESS, function (event) {
      if (event.which === 13 && !(event.target instanceof HTMLTextAreaElement)) {
        _this.submit();
      }
    });
  }
  Form.prototype.lock = function () {
    this.locked = true;
  };
  Form.prototype.unlock = function () {
    this.locked = false;
  };
  mbr.form = function (props) {
    return new Form(props);
  }

  function ClassName (element) {
    this.element = element;
  }
  ClassName.prototype.has = function (name) {
    var className = CONST.SYMBOL.SPACE + this.element.className + CONST.SYMBOL.SPACE;
    return className.indexOf(CONST.SYMBOL.SPACE + name + CONST.SYMBOL.SPACE) > -1;
  }
  ClassName.prototype.add = function (name) {
    if (!this.has(name)) {
      var className = this.element.className;
      this.element.className = className ? (className + CONST.SYMBOL.SPACE + name) : name;
    }
    return this;
  }
  ClassName.prototype.del = function (name) {
    return this.replace(name, CONST.SYMBOL.SPACE);
  }
  ClassName.prototype.set = function (from) {
    if (from instanceof Array) {
      this.element.className = from.join(CONST.SYMBOL.SPACE);
    } else {
      this.element.className = from;
    }
    return this;
  }
  ClassName.prototype.replace = function (fromName, toName) {
    if (this.has(fromName)) {
      var className = CONST.SYMBOL.SPACE + this.element.className + CONST.SYMBOL.SPACE;
      var oldName = CONST.SYMBOL.SPACE + fromName + CONST.SYMBOL.SPACE;
      var newName = (toName === CONST.SYMBOL.SPACE) ?
        CONST.SYMBOL.SPACE : CONST.SYMBOL.SPACE + toName + CONST.SYMBOL.SPACE;
      className = className.replace(oldName, newName);
      this.element.className = className.substring(1, className.length - 1);
    }
    return this;
  }
  ClassName.prototype.toggle = function (name) {
    this.has(name) ? this.del(name) : this.add(name);
    return this;
  }
  ClassName.prototype.switch = function (value) {
    this.switcher && this.del(this.switcher);
    this.switcher = value;
    this.add(value);
    return this;
  }
  mbr.classname = function (element) {
    return new ClassName(element);
  }
  mbr.template = function (template, substitutions) {
    return substitutions ? template.replace(RE.template, function (_, key) {
      if (key === CONST.DEFAULT) {
        return substitutions;
      } else {
        return substitutions[key] || CONST.SYMBOL.EMPTY
      }
    }) : template;
  }

  return mbr;
})()
