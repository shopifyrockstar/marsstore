(function ($) {
  var $ = jQuery = $;

  var cc = {
    sections: [] };


  theme.cartNoteMonitor = {
    load: function load($notes) {
      $notes.on('change.themeCartNoteMonitor paste.themeCartNoteMonitor keyup.themeCartNoteMonitor', function () {
        theme.cartNoteMonitor.postUpdate($(this).val());
      });
    },

    unload: function unload($notes) {
      $notes.off('.themeCartNoteMonitor');
    },

    updateThrottleTimeoutId: -1,
    updateThrottleInterval: 500,

    postUpdate: function postUpdate(val) {
      clearTimeout(theme.cartNoteMonitor.updateThrottleTimeoutId);
      theme.cartNoteMonitor.updateThrottleTimeoutId = setTimeout(function () {
        $.post(theme.routes.cart_url + '/update.js', {
          note: val },
        function (data) {}, 'json');
      }, theme.cartNoteMonitor.updateThrottleInterval);
    } };

  theme.Shopify = {
    formatMoney: function formatMoney(t, r) {
      function e(t, r) {
        return void 0 === t ? r : t;
      }
      function a(t, r, a, o) {
        if (r = e(r, 2),
        a = e(a, ","),
        o = e(o, "."),
        isNaN(t) || null == t)
        return 0;
        t = (t / 100).toFixed(r);
        var n = t.split(".");
        return n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + a) + (n[1] ? o + n[1] : "");
      }
      "string" == typeof t && (t = t.replace(".", ""));
      var o = "",
      n = /\{\{\s*(\w+)\s*\}\}/,
      i = r || this.money_format;
      switch (i.match(n)[1]) {
        case "amount":
          o = a(t, 2);
          break;
        case "amount_no_decimals":
          o = a(t, 0);
          break;
        case "amount_with_comma_separator":
          o = a(t, 2, ".", ",");
          break;
        case "amount_with_space_separator":
          o = a(t, 2, " ", ",");
          break;
        case "amount_with_period_and_space_separator":
          o = a(t, 2, " ", ".");
          break;
        case "amount_no_decimals_with_comma_separator":
          o = a(t, 0, ".", ",");
          break;
        case "amount_no_decimals_with_space_separator":
          o = a(t, 0, " ", "");
          break;
        case "amount_with_apostrophe_separator":
          o = a(t, 2, "'", ".");
          break;
        case "amount_with_decimal_separator":
          o = a(t, 2, ".", ".");}

      return i.replace(n, o);
    },
    formatImage: function formatImage(originalImageUrl, format) {
      return originalImageUrl ? originalImageUrl.replace(/^(.*)\.([^\.]*)$/g, '$1_' + format + '.$2') : '';
    },
    Image: {
      imageSize: function imageSize(t) {
        var e = t.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);
        return null !== e ? e[1] : null;
      },
      getSizedImageUrl: function getSizedImageUrl(t, e) {
        if (null == e)
        return t;
        if ("master" == e)
        return this.removeProtocol(t);
        var o = t.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);
        if (null != o) {
          var i = t.split(o[0]),
          r = o[0];
          return this.removeProtocol(i[0] + "_" + e + r);
        }
        return null;
      },
      removeProtocol: function removeProtocol(t) {
        return t.replace(/http(s)?:/, "");
      } } };


  theme.Disclosure = function () {
    var selectors = {
      disclosureList: '[data-disclosure-list]',
      disclosureToggle: '[data-disclosure-toggle]',
      disclosureInput: '[data-disclosure-input]',
      disclosureOptions: '[data-disclosure-option]' };


    var classes = {
      listVisible: 'disclosure-list--visible' };


    function Disclosure($disclosure) {
      this.$container = $disclosure;
      this.cache = {};
      this._cacheSelectors();
      this._connectOptions();
      this._connectToggle();
      this._onFocusOut();
    }

    Disclosure.prototype = $.extend({}, Disclosure.prototype, {
      _cacheSelectors: function _cacheSelectors() {
        this.cache = {
          $disclosureList: this.$container.find(selectors.disclosureList),
          $disclosureToggle: this.$container.find(selectors.disclosureToggle),
          $disclosureInput: this.$container.find(selectors.disclosureInput),
          $disclosureOptions: this.$container.find(selectors.disclosureOptions) };

      },

      _connectToggle: function _connectToggle() {
        this.cache.$disclosureToggle.on(
        'click',
        function (evt) {
          var ariaExpanded =
          $(evt.currentTarget).attr('aria-expanded') === 'true';
          $(evt.currentTarget).attr('aria-expanded', !ariaExpanded);

          this.cache.$disclosureList.toggleClass(classes.listVisible);
        }.bind(this));

      },

      _connectOptions: function _connectOptions() {
        this.cache.$disclosureOptions.on(
        'click',
        function (evt) {
          evt.preventDefault();
          this._submitForm($(evt.currentTarget).data('value'));
        }.bind(this));

      },

      _onFocusOut: function _onFocusOut() {
        this.cache.$disclosureToggle.on(
        'focusout',
        function (evt) {
          var disclosureLostFocus =
          this.$container.has(evt.relatedTarget).length === 0;

          if (disclosureLostFocus) {
            this._hideList();
          }
        }.bind(this));


        this.cache.$disclosureList.on(
        'focusout',
        function (evt) {
          var childInFocus =
          $(evt.currentTarget).has(evt.relatedTarget).length > 0;
          var isVisible = this.cache.$disclosureList.hasClass(
          classes.listVisible);


          if (isVisible && !childInFocus) {
            this._hideList();
          }
        }.bind(this));


        this.$container.on(
        'keyup',
        function (evt) {
          if (evt.which !== 27) return; // escape
          this._hideList();
          this.cache.$disclosureToggle.focus();
        }.bind(this));


        this.bodyOnClick = function (evt) {
          var isOption = this.$container.has(evt.target).length > 0;
          var isVisible = this.cache.$disclosureList.hasClass(
          classes.listVisible);


          if (isVisible && !isOption) {
            this._hideList();
          }
        }.bind(this);

        $('body').on('click', this.bodyOnClick);
      },

      _submitForm: function _submitForm(value) {
        this.cache.$disclosureInput.val(value);
        this.$container.parents('form').submit();
      },

      _hideList: function _hideList() {
        this.cache.$disclosureList.removeClass(classes.listVisible);
        this.cache.$disclosureToggle.attr('aria-expanded', false);
      },

      unload: function unload() {
        $('body').off('click', this.bodyOnClick);
        this.cache.$disclosureOptions.off();
        this.cache.$disclosureToggle.off();
        this.cache.$disclosureList.off();
        this.$container.off();
      } });


    return Disclosure;
  }();
  (function () {
    function throttle(callback, threshold) {
      var debounceTimeoutId = -1;
      var tick = false;

      return function () {
        clearTimeout(debounceTimeoutId);
        debounceTimeoutId = setTimeout(callback, threshold);

        if (!tick) {
          callback.call();
          tick = true;
          setTimeout(function () {
            tick = false;
          }, threshold);
        }
      };
    }

    var scrollEvent = document.createEvent('Event');
    scrollEvent.initEvent('throttled-scroll', true, true);

    window.addEventListener("scroll", throttle(function () {
      window.dispatchEvent(scrollEvent);
    }, 200));

  })();
  // requires: throttled-scroll, debouncedresize

  /*
    Define a section by creating a new function object and registering it with the section handler.
    The section handler manages:
      Instantiation for all sections on the current page
      Theme editor lifecycle events
      Deferred initialisation
      Event cleanup
  
    There are two ways to register a section.
    In a theme:
      theme.Sections.register('slideshow', theme.SlideshowSection);
      theme.Sections.register('header', theme.HeaderSection, { deferredLoad: false });
      theme.Sections.register('background-video', theme.VideoManager, { deferredLoadViewportExcess: 800 });
  
    As a component:
      cc.sections.push({ name: 'faq', section: theme.Faq });
  
    Assign any of these to receive Shopify section lifecycle events:
      this.onSectionLoad
      this.afterSectionLoadCallback
      this.onSectionSelect
      this.onSectionDeselect
      this.onBlockSelect
      this.onBlockDeselect
      this.onSectionUnload
      this.afterSectionUnloadCallback
      this.onSectionReorder
  
    If you add any events using the manager's registerEventListener,
    e.g. this.registerEventListener(element, 'click', this.functions.handleClick.bind(this)),
    these will be automatically cleaned up after onSectionUnload.
   */

  theme.Sections = new function () {
    var _ = this;

    _._instances = [];
    _._deferredSectionTargets = [];
    _._sections = [];
    _._deferredLoadViewportExcess = 300; // load defferred sections within this many px of viewport
    _._deferredWatcherRunning = false;

    _.init = function () {
      $(document).on('shopify:section:load', function (e) {
        // load a new section
        var target = _._themeSectionTargetFromShopifySectionTarget(e.target);
        if (target) {
          _.sectionLoad(target);
        }
      }).on('shopify:section:unload', function (e) {
        // unload existing section
        var target = _._themeSectionTargetFromShopifySectionTarget(e.target);
        if (target) {
          _.sectionUnload(target);
        }
      }).on('shopify:section:reorder', function (e) {
        // unload existing section
        var target = _._themeSectionTargetFromShopifySectionTarget(e.target);
        if (target) {
          _.sectionReorder(target);
        }
      });
      $(window).on('throttled-scroll.themeSectionDeferredLoader debouncedresize.themeSectionDeferredLoader', _._processDeferredSections);
      _._deferredWatcherRunning = true;
    };

    // register a type of section
    _.register = function (type, section, options) {
      _._sections.push({
        type: type,
        section: section,
        afterSectionLoadCallback: options ? options.afterLoad : null,
        afterSectionUnloadCallback: options ? options.afterUnload : null });


      // load now
      $('[data-section-type="' + type + '"]').each(function () {
        if (Shopify.designMode || options && options.deferredLoad === false || !_._deferredWatcherRunning) {
          _.sectionLoad(this);
        } else {
          _.sectionDeferredLoad(this, options);
        }
      });
    };

    // prepare a section to load later
    _.sectionDeferredLoad = function (target, options) {
      _._deferredSectionTargets.push({
        target: target,
        deferredLoadViewportExcess: options && options.deferredLoadViewportExcess ? options.deferredLoadViewportExcess : _._deferredLoadViewportExcess });

      _._processDeferredSections(true);
    };

    // load deferred sections if in/near viewport
    _._processDeferredSections = function (firstRunCheck) {
      if (_._deferredSectionTargets.length) {
        var viewportTop = $(window).scrollTop(),
        viewportBottom = viewportTop + $(window).height(),
        loopStart = firstRunCheck === true ? _._deferredSectionTargets.length - 1 : 0;
        for (var i = loopStart; i < _._deferredSectionTargets.length; i++) {
          var target = _._deferredSectionTargets[i].target,
          viewportExcess = _._deferredSectionTargets[i].deferredLoadViewportExcess,
          sectionTop = $(target).offset().top - viewportExcess,
          doLoad = sectionTop > viewportTop && sectionTop < viewportBottom;
          if (!doLoad) {
            var sectionBottom = sectionTop + $(target).outerHeight() + viewportExcess * 2;
            doLoad = sectionBottom > viewportTop && sectionBottom < viewportBottom;
          }
          if (doLoad || sectionTop < viewportTop && sectionBottom > viewportBottom) {
            // in viewport, load
            _.sectionLoad(target);
            // remove from deferred queue and resume checks
            _._deferredSectionTargets.splice(i, 1);
            i--;
          }
        }
      }

      // remove event if no more deferred targets left, if not on first run
      if (firstRunCheck !== true && _._deferredSectionTargets.length === 0) {
        _._deferredWatcherRunning = false;
        $(window).off('.themeSectionDeferredLoader');
      }
    };

    // load in a section
    _.sectionLoad = function (target) {
      var target = target,
      sectionObj = _._sectionForTarget(target),
      section = false;

      if (sectionObj.section) {
        section = sectionObj.section;
      } else {
        section = sectionObj;
      }

      if (section !== false) {
        var instance = {
          target: target,
          section: section,
          $shopifySectionContainer: $(target).closest('.shopify-section'),
          thisContext: {
            functions: section.functions,
            registeredEventListeners: [] } };


        instance.thisContext.registerEventListener = _._registerEventListener.bind(instance.thisContext);
        _._instances.push(instance);

        //Initialise any components
        if ($(target).data('components')) {
          //Init each component
          var components = $(target).data('components').split(',');
          components.forEach(component => {
            $(document).trigger('cc:component:load', [component, target]);
          });
        }

        _._callSectionWith(section, 'onSectionLoad', target, instance.thisContext);
        _._callSectionWith(section, 'afterSectionLoadCallback', target, instance.thisContext);

        // attach additional UI events if defined
        if (section.onSectionSelect) {
          instance.$shopifySectionContainer.on('shopify:section:select', function (e) {
            _._callSectionWith(section, 'onSectionSelect', e.target, instance.thisContext);
          });
        }
        if (section.onSectionDeselect) {
          instance.$shopifySectionContainer.on('shopify:section:deselect', function (e) {
            _._callSectionWith(section, 'onSectionDeselect', e.target, instance.thisContext);
          });
        }
        if (section.onBlockSelect) {
          $(target).on('shopify:block:select', function (e) {
            _._callSectionWith(section, 'onBlockSelect', e.target, instance.thisContext);
          });
        }
        if (section.onBlockDeselect) {
          $(target).on('shopify:block:deselect', function (e) {
            _._callSectionWith(section, 'onBlockDeselect', e.target, instance.thisContext);
          });
        }
      }
    };

    // unload a section
    _.sectionUnload = function (target) {
      var sectionObj = _._sectionForTarget(target);
      var instanceIndex = -1;
      for (var i = 0; i < _._instances.length; i++) {
        if (_._instances[i].target == target) {
          instanceIndex = i;
        }
      }
      if (instanceIndex > -1) {
        var instance = _._instances[instanceIndex];
        // remove events and call unload, if loaded
        $(target).off('shopify:block:select shopify:block:deselect');
        instance.$shopifySectionContainer.off('shopify:section:select shopify:section:deselect');
        _._callSectionWith(instance.section, 'onSectionUnload', target, instance.thisContext);
        _._unloadRegisteredEventListeners(instance.thisContext.registeredEventListeners);
        _._callSectionWith(sectionObj, 'afterSectionUnloadCallback', target, instance.thisContext);
        _._instances.splice(instanceIndex);

        //Destroy any components
        if ($(target).data('components')) {
          //Init each component
          var components = $(target).data('components').split(',');
          components.forEach(component => {
            $(document).trigger('cc:component:unload', [component, target]);
          });
        }
      } else {
        // check if it was a deferred section
        for (var i = 0; i < _._deferredSectionTargets.length; i++) {
          if (_._deferredSectionTargets[i].target == target) {
            _._deferredSectionTargets[i].splice(i, 1);
            break;
          }
        }
      }
    };

    _.sectionReorder = function (target) {
      var instanceIndex = -1;
      for (var i = 0; i < _._instances.length; i++) {
        if (_._instances[i].target == target) {
          instanceIndex = i;
        }
      }
      if (instanceIndex > -1) {
        var instance = _._instances[instanceIndex];
        _._callSectionWith(instance.section, 'onSectionReorder', target, instance.thisContext);
      }
    };

    // Helpers
    _._registerEventListener = function (element, eventType, callback) {
      element.addEventListener(eventType, callback);
      this.registeredEventListeners.push({
        element,
        eventType,
        callback });

    };

    _._unloadRegisteredEventListeners = function (registeredEventListeners) {
      registeredEventListeners.forEach(rel => {
        rel.element.removeEventListener(rel.eventType, rel.callback);
      });
    };

    _._callSectionWith = function (section, method, container, thisContext) {
      if (typeof section[method] === 'function') {
        try {
          if (thisContext) {
            section[method].bind(thisContext)(container);
          } else {
            section[method](container);
          }
        } catch (ex) {
          var sectionType = container.dataset['sectionType'];
          console.warn("Theme warning: '".concat(method, "' failed for section '").concat(sectionType, "'"));
          console.debug(container, ex);
        }
      }
    };

    _._themeSectionTargetFromShopifySectionTarget = function (target) {
      var $target = $('[data-section-type]:first', target);
      if ($target.length > 0) {
        return $target[0];
      } else {
        return false;
      }
    };

    _._sectionForTarget = function (target) {
      var type = $(target).attr('data-section-type');
      for (var i = 0; i < _._sections.length; i++) {
        if (_._sections[i].type == type) {
          return _._sections[i];
        }
      }
      return false;
    };

    _._sectionAlreadyRegistered = function (type) {
      for (var i = 0; i < _._sections.length; i++) {
        if (_._sections[i].type == type) {
          return true;
        }
      }
      return false;
    };
  }();
  class ccComponent {
    constructor(name) {var cssSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ".cc-".concat(name);
      var _this = this;
      this.instances = [];

      // Initialise any instance of this component within a section
      $(document).on('cc:component:load', function (event, component, target) {
        if (component === name) {
          $(target).find("".concat(cssSelector, ":not(.cc-initialized)")).each(function () {
            _this.init(this);
          });
        }
      });

      // Destroy any instance of this component within a section
      $(document).on('cc:component:unload', function (event, component, target) {
        if (component === name) {
          $(target).find(cssSelector).each(function () {
            _this.destroy(this);
          });
        }
      });

      // Initialise any instance of this component
      $(cssSelector).each(function () {
        _this.init(this);
      });
    }

    init(container) {
      $(container).addClass('cc-initialized');
    }

    destroy(container) {
      $(container).removeClass('cc-initialized');
    }

    registerInstance(container, instance) {
      this.instances.push({
        container,
        instance });

    }

    destroyInstance(container) {
      this.instances = this.instances.filter(item => {
        if (item.container === container) {
          if (typeof item.instance.destroy === 'function') {
            item.instance.destroy();
          }

          return item.container !== container;
        }
      });
    }}

  // Loading third party scripts
  theme.scriptsLoaded = {};
  theme.loadScriptOnce = function (src, callback, beforeRun, sync) {
    if (typeof theme.scriptsLoaded[src] === 'undefined') {
      theme.scriptsLoaded[src] = [];
      var tag = document.createElement('script');
      tag.src = src;

      if (sync || beforeRun) {
        tag.async = false;
      }

      if (beforeRun) {
        beforeRun();
      }

      if (typeof callback === 'function') {
        theme.scriptsLoaded[src].push(callback);
        if (tag.readyState) {// IE, incl. IE9
          tag.onreadystatechange = function () {
            if (tag.readyState == "loaded" || tag.readyState == "complete") {
              tag.onreadystatechange = null;
              for (var i = 0; i < theme.scriptsLoaded[this].length; i++) {
                theme.scriptsLoaded[this][i]();
              }
              theme.scriptsLoaded[this] = true;
            }
          }.bind(src);
        } else {
          tag.onload = function () {// Other browsers
            for (var i = 0; i < theme.scriptsLoaded[this].length; i++) {
              theme.scriptsLoaded[this][i]();
            }
            theme.scriptsLoaded[this] = true;
          }.bind(src);
        }
      }

      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      return true;
    } else if (typeof theme.scriptsLoaded[src] === 'object' && typeof callback === 'function') {
      theme.scriptsLoaded[src].push(callback);
    } else {
      if (typeof callback === 'function') {
        callback();
      }
      return false;
    }
  };

  theme.loadStyleOnce = function (src) {
    var srcWithoutProtocol = src.replace(/^https?:/, '');
    if (!document.querySelector('link[href="' + encodeURI(srcWithoutProtocol) + '"]')) {
      var tag = document.createElement('link');
      tag.href = srcWithoutProtocol;
      tag.rel = 'stylesheet';
      tag.type = 'text/css';
      var firstTag = document.getElementsByTagName('link')[0];
      firstTag.parentNode.insertBefore(tag, firstTag);
    }
  }; /// Show a short-lived text popup above an element
  theme.showQuickPopup = function (message, $origin) {
    var $popup = $('<div class="simple-popup"/>');
    var offs = $origin.offset();
    $popup.html(message).css({ 'left': offs.left, 'top': offs.top }).hide();
    $('body').append($popup);
    $popup.css({ marginTop: -$popup.outerHeight() - 10, marginLeft: -($popup.outerWidth() - $origin.outerWidth()) / 2 });
    $popup.fadeIn(200).delay(3500).fadeOut(400, function () {
      $(this).remove();
    });
  };
  /**
   * Use with template literals to build HTML with correct escaping.
   *
   * Example:
   *
   * const tve = theme.createTemplateVariableEncoder();
   * tve.add('className', className, 'attribute');
   * tve.add('title', title, 'html');
   * tve.add('richText', richText, 'raw');
   * const template = `
   *   <div class="${tve.values.className}">
   *     <h1>${tve.values.title}</h1>
   *     <div class="rte">${tve.values.richText}</div>
   *   </div>
   * `;
   */
  theme.createTemplateVariableEncoder = function () {
    return {
      utilityElement: document.createElement('div'),
      values: {},
      /**
       * Add a new value to sanitise.
       * @param {String} key - key used to retrieve this value
       * @param {String} value - the value to encode and store
       * @param {String} type - possible values: [attribute, html, raw] - the type of encoding to use
       */
      add: function add(key, value, type) {
        switch (type) {
          case 'attribute':
            this.utilityElement.innerHTML = '';
            this.utilityElement.setAttribute('util', value);
            this.values[key] = this.utilityElement.outerHTML.match(/util="([^"]*)"/)[1];
            break;
          case 'html':
            this.utilityElement.innerText = value;
            this.values[key] = this.utilityElement.innerHTML;
            break;
          case 'raw':
            this.values[key] = value;
            break;
          default:
            throw "Type '".concat(type, "' not handled");}

      } };

  };
  // Turn a <select> tag into clicky boxes
  // Use with: $('select').clickyBoxes()
  $.fn.clickyBoxes = function (prefix) {
    if (prefix == 'destroy') {
      $(this).off('.clickyboxes');
      $(this).next('.clickyboxes').off('.clickyboxes');
    } else {
      return $(this).filter('select:not(.clickybox-replaced)').addClass('clickybox-replaced').each(function () {
        //Make sure rows are unique
        var prefix = prefix || $(this).attr('id');
        //Create container
        var $optCont = $('<ul class="clickyboxes"/>').attr('id', 'clickyboxes-' + prefix).data('select', $(this)).insertAfter(this);

        var $label;
        if ($(this).is('[id]')) {
          $label = $('label[for="' + $(this).attr('id') + '"]'); // Grab real label
        } else {
          $label = $(this).siblings('label'); // Rough guess
        }
        if ($label.length > 0) {
          $optCont.addClass('options-' + removeDiacritics($label.text()).toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/-*$/, ''));
        }

        //Add options to container
        $(this).find('option').each(function () {
          $('<li/>').appendTo($optCont).append(
          $('<a href="#"/>').attr('data-value', $(this).val()).html($(this).html()).
          addClass('opt--' + removeDiacritics($(this).text()).toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/-*$/, '')));

        });
        //Select change event
        $(this).hide().addClass('replaced').on('change.clickyboxes keyup.clickyboxes', function () {
          //Choose the right option to show
          var val = $(this).val();
          $optCont.find('a').removeClass('active').filter(function () {
            return $(this).attr('data-value') == val;
          }).addClass('active');
        }).trigger('keyup'); //Initial value
        //Button click event
        $optCont.on('click.clickyboxes', 'a', function () {
          if (!$(this).hasClass('active')) {
            var $clicky = $(this).closest('.clickyboxes');
            $clicky.data('select').val($(this).data('value')).trigger('change');
            $clicky.trigger('change');
          }
          return false;
        });
      });
    }
  };
  class ccPopup {
    constructor($container, namespace) {
      this.$container = $container;
      this.namespace = namespace;
      this.cssClasses = {
        visible: 'cc-popup--visible',
        bodyNoScroll: 'cc-popup-no-scroll',
        bodyNoScrollPadRight: 'cc-popup-no-scroll-pad-right' };

    }

    /**
     * Open popup on timer / local storage - move focus to input ensure you can tab to submit and close
     * Add the cc-popup--visible class
     * Update aria to visible
     */
    open(callback) {
      // Prevent the body from scrolling
      if (this.$container.data('freeze-scroll')) {
        $('body').addClass(this.cssClasses.bodyNoScroll);

        // Add any padding necessary to the body to compensate for the scrollbar that just disappeared
        var scrollDiv = document.createElement('div');
        scrollDiv.className = 'popup-scrollbar-measure';
        document.body.appendChild(scrollDiv);
        var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        if (scrollbarWidth > 0) {
          $('body').css('padding-right', scrollbarWidth + 'px').addClass(this.cssClasses.bodyNoScrollPadRight);
        }
      }

      // Add reveal class
      this.$container.addClass(this.cssClasses.visible);

      // Track previously focused element
      this.previouslyActiveElement = document.activeElement;

      // Focus on the close button after the animation in has completed
      setTimeout(() => {
        this.$container.find('.cc-popup-close')[0].focus();
      }, 500);

      // Pressing escape closes the modal
      $(window).on('keydown' + this.namespace, event => {
        if (event.keyCode === 27) {
          this.close();
        }
      });

      if (callback) {
        callback();
      }
    }

    /**
     * Close popup on click of close button or background - where does the focus go back to?
     * Remove the cc-popup--visible class
     */
    close(callback) {
      // Remove reveal class
      this.$container.removeClass(this.cssClasses.visible);

      // Revert focus
      if (this.previouslyActiveElement) {
        $(this.previouslyActiveElement).focus();
      }

      // Destroy the escape event listener
      $(window).off('keydown' + this.namespace);

      // Allow the body to scroll and remove any scrollbar-compensating padding
      if (this.$container.data('freeze-scroll')) {
        var transitionDuration = 500;

        var $innerModal = this.$container.find('.cc-popup-modal');
        if ($innerModal.length) {
          transitionDuration = parseFloat(getComputedStyle($innerModal[0])['transitionDuration']);
          if (transitionDuration && transitionDuration > 0) {
            transitionDuration *= 1000;
          }
        }

        setTimeout(() => {
          $('body').removeClass(this.cssClasses.bodyNoScroll).removeClass(this.cssClasses.bodyNoScrollPadRight).css('padding-right', '0');
        }, transitionDuration);
      }

      if (callback) {
        callback();
      }
    }}
  ;
  /**
   * Display a modal window on-click. It's a lightbox.
   * To use:
   * Add 'cc-modal' class to a clickable element.
   *
   * Configure with:
   * - data-cc-modal-contentelement - selector for element containing content to show, innerHTML of element is copied into the modal
   * - data-cc-modal-size (optional) - 'small' or 'medium', defaults to 'medium'
   * - data-cc-modal-launch (optional) - 'true' if we want to open the modal immediately
   *
   * Example:
   * <a href="#password-login" class="cc-modal" data-cc-modal-contentelement="#password-login" data-cc-modal-size="small">
   * <div id="password-login" class="js-hidden">
  */
  class ModalInstance {
    constructor(container) {
      this.container = container;
      this.size = container.dataset.ccModalSize || 'medium';
      this.contentElement = document.querySelector(container.dataset.ccModalContentelement);

      this.container.addEventListener('click', this.handleClick.bind(this));

      if (container.dataset.ccModalLaunch === 'true') {
        setTimeout(this.open.bind(this), 10);
      }
    }

    /**
     * Handles 'click' event on the container
     * @param {Object} e - The event object
     */
    handleClick(e) {
      e.preventDefault();
      this.open();
      this.opener = e.target;
    }

    /**
     * Create the modal and add it to the page.
     */
    open() {
      var tve = theme.createTemplateVariableEncoder();
      tve.add('size', this.size, 'attribute');
      tve.add('content', this.contentElement.innerHTML, 'raw');
      tve.add('button_close_label', theme.strings.general_accessibility_labels_close, 'attribute');
      tve.add('button_close_icon', theme.icons.close, 'raw');

      var html = "\n      <div class=\"cc-modal-window cc-modal-window--pre-reveal cc-modal-window--size-".concat(
      tve.values.size, "\">\n        <div class=\"cc-modal-window__background\"></div>\n        <div class=\"cc-modal-window__foreground\" role=\"dialog\" aria-modal=\"true\">\n          <div class=\"cc-modal-window__content-container\">\n            <button class=\"cc-modal-window__close\" aria-label=\"").concat(



      tve.values.button_close_label, "\">").concat(tve.values.button_close_icon, "</button>\n            <div class=\"cc-modal-window__content\">").concat(
      tve.values.content, "</div>\n          </div>\n        </div>\n      </div>\n    ");





      var modalElementFragment = document.createRange().createContextualFragment(html);
      document.body.appendChild(modalElementFragment);

      document.body.classList.add('cc-modal-visible');
      this.modalElement = document.body.lastElementChild;

      this.modalElement.querySelector('.cc-modal-window__background').addEventListener('click', this.close.bind(this));
      this.modalElement.querySelector('.cc-modal-window__close').addEventListener('click', this.close.bind(this));

      setTimeout(() => {
        this.modalElement.classList.remove('cc-modal-window--pre-reveal');
        this.modalElement.querySelector('.cc-modal-window__close').focus();
      }, 10);
    }

    close() {
      this.modalElement.classList.add('cc-modal-window--closing');
      if (!document.querySelector('.cc-modal-window:not(.cc-modal-window--closing)')) {
        document.body.classList.remove('cc-modal-visible');
      }

      if (this.opener) {
        setTimeout(() => {
          this.opener.focus();
        }, 10);
      }

      // give transitions 5s to do their thing before we tidy up (note: this.modalElement may be reassigned during this timeout)
      setTimeout(function () {
        this.remove();
      }.bind(this.modalElement), 5000);
    }}


  class Modal extends ccComponent {
    constructor() {var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'modal';var cssSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ".cc-".concat(name);
      super(name, cssSelector);
    }

    init(container) {
      super.init(container);
      this.registerInstance(container, new ModalInstance(container));
    }

    destroy(container) {
      this.destroyInstance(container);
      super.destroy(container);
    }}


  new Modal();
  class FacetFiltersInstance {
    constructor(el) {
      this.filteringEnabled = el.dataset.filtering === 'true';
      this.sortingEnabled = el.dataset.sorting === 'true';

      this.filtersControl = document.querySelector('.cc-filters-control');
      this.filtersContainer = document.querySelector('.cc-filters-container');
      this.results = document.querySelector('.cc-filters-results');

      if (this.filteringEnabled) {
        this.filters = document.querySelector('.cc-filters');
        this.filtersFooter = document.querySelector('.cc-filters__footer');
        this.activeFilters = document.querySelector('.cc-active-filters');
        this.clearFiltersBtn = document.querySelector('.js-clear-filters');
      }

      if (this.sortingEnabled) {
        this.sortBy = document.querySelector('.cc-filter--sort');
        this.activeSortText = document.querySelector('.cc-sort-selected');
      }

      this.utils = {
        hidden: 'is-hidden',
        loading: 'is-loading',
        open: 'is-open',
        filtersOpen: 'filters-open' };


      if (this.filteringEnabled && !this.filtersFooter.classList.contains(this.utils.hidden)) {
        this.filters.style.height = "calc(100% - ".concat(this.filtersFooter.offsetHeight, "px)");
      }

      this.bindEvents();
    }

    bindEvents() {
      this.filtersControl.addEventListener('click', this.handleControlClick.bind(this));
      this.filtersContainer.addEventListener('click', this.handleFiltersClick.bind(this));
      this.filtersContainer.addEventListener('input', this.debounce(this.handleFilterChange.bind(this), 500));

      if (this.filteringEnabled) {
        if (document.querySelector('.cc-price-range')) {
          this.filtersContainer.addEventListener('change', this.debounce(this.handleFilterChange.bind(this), 500));
        }

        this.activeFilters.addEventListener('click', this.handleActiveFiltersClick.bind(this));
      }

      document.addEventListener('click', this.handleClickOutside.bind(this));
      window.addEventListener('popstate', this.handleHistoryChange.bind(this));
    }

    debounce(fn, wait) {var _this2 = this;
      var timer;

      return function () {for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(_this2, args), wait);
      };
    }

    /**
     * Handles 'click' event on the filter/sort buttons (mobile only)
     * @param {Object} e - The event object
     */
    handleControlClick(e) {
      if (!e.target.matches('.cc-filters-control__btn')) return;
      document.body.classList.add(this.utils.filtersOpen);

      if (e.target.matches('.js-show-filters')) {
        this.filters.classList.add(this.utils.open);
      } else {
        this.sortBy.open = true;

        // Slight delay required before starting transition
        setTimeout(() => {
          this.sortBy.classList.add(this.utils.open);
        }, 10);
      }
    }

    /**
     * Handles 'click' event on the filters container
     * @param {Object} e - The event object
     */
    handleFiltersClick(e) {
      var { target } = e;
      var filter = target.closest('.cc-filter');

      // Filter 'clear' button clicked
      if (target.matches('.cc-filter-clear-btn')) {
        e.preventDefault();
        this.applyFilters(new URL(e.target.href).searchParams.toString(), e);
        return;
      }

      // Filters/Sort 'close' button, '[x] results' button or 'apply' button clicked (mobile only)
      if (target.matches('.js-close-filters')) {
        if (filter) {
          // Delay to allow for filter closing transition
          setTimeout(() => {
            filter.classList.remove(this.utils.open);
            filter.open = false;
          }, 300);
        }

        if (this.filteringEnabled) {
          this.filters.classList.remove(this.utils.open);
        }

        document.body.classList.remove(this.utils.filtersOpen);
        return;
      }

      if (target.matches('.cc-filter__toggle') || target.matches('.cc-filter-back-btn')) {
        var openFilter = document.querySelector(".cc-filter[open]:not([data-index=\"".concat(filter.dataset.index, "\"])"));

        // If a filter was opened (tablet/desktop) and there's one already open, close it
        if (openFilter) {
          this.closeFilter(openFilter, false);
        }

        // Open/close the filter, class added to allow for css transition
        if (!filter.classList.contains(this.utils.open)) {
          setTimeout(() => {
            filter.classList.add(this.utils.open);
          }, 10);
        } else {
          e.preventDefault();
          this.closeFilter(filter);
        }
      }
    }

    /**
     * Handles 'click' event outside the filters (tablet/desktop)
     * @param {Object} e - The event object
     */
    handleClickOutside(e) {
      var openFilter = document.querySelector(".cc-filter.".concat(this.utils.open));

      // If there's a filter open and the click event wasn't on it, close it (tablet/desktop)
      if (openFilter) {
        var filter = e.target.closest('.cc-filter');

        if (!filter || filter !== openFilter) {
          this.closeFilter(openFilter);
        }
      }
    }

    /**
     * Handles 'input' and 'change' events on the filters and sort by
     * @param {Object} e - The event object
     */
    handleFilterChange(e) {
      // Ignore 'change' events not triggered by user moving the price range slider
      if (e.type === 'change' && (!e.detail || e.detail.sender !== 'theme:component:price_range')) return;

      // If price min/max input value changed, dispatch 'change' event to trigger update of the slider
      if (e.type === 'input' && e.target.classList.contains('cc-price-range__input')) {
        e.target.dispatchEvent(new Event('change', { bubbles: true }));
      }

      var formData = new FormData(document.getElementById('filters'));
      var searchParams = new URLSearchParams(formData);

      this.applyFilters(searchParams.toString(), e);
    }

    /**
     * Handles 'click' event on the active filters
     * @param {Object} e - The event object
     */
    handleActiveFiltersClick(e) {
      e.preventDefault();

      if (e.target.tagName === 'A') {
        this.applyFilters(new URL(e.target.href).searchParams.toString(), e);
      }
    }

    /**
     * Handles history changes (e.g. back button clicked)
     * @param {Object} e - The event object
     */
    handleHistoryChange(e) {
      var searchParams = '';

      if (e.state && e.state.searchParams) {
        searchParams = e.state.searchParams;
      }

      this.applyFilters(searchParams, null, false);
    }

    /**
     * Fetches the filtered/sorted page data and updates the current page
     * @param {string} searchParams - The filter/sort search parameters
     * @param {Object} e - The event object
     * @param {boolean} [updateUrl=true] - Whether to update the url with the selected filter/sort options
     */
    applyFilters(searchParams, e) {var updateUrl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      this.results.classList.add(this.utils.loading);

      fetch("".concat(window.location.pathname, "?").concat(searchParams)).
      then(response => response.text()).
      then(responseText => {
        var html = responseText;
        // Note: DOMParser.parseFromString behaviour is broken in iOS 15, returning incomplete content when referenced immediately
        var fetchedHTML = document.implementation.createHTMLDocument();
        fetchedHTML.documentElement.innerHTML = html;

        if (fetchedHTML.querySelector('.cc-facet-filters')) {
          this.updateFilters(fetchedHTML, e);
        }
        this.results.innerHTML = fetchedHTML.querySelector('.cc-filters-results').innerHTML;
        document.dispatchEvent(new CustomEvent('filters-applied', { bubbles: true }));
        this.results.classList.remove(this.utils.loading);
      });

      if (updateUrl) {
        this.updateURL(searchParams);
      }
    }

    /**
     * Updates the filters relevant to the fetched data
     * @param {html} fetchedHTML - HTML of the fetched page
     * @param {Object} e - The event object
     */
    updateFilters(fetchedHTML, e) {
      // Update the Filter/Sort buttons (mobile only)
      this.filtersControl.innerHTML = fetchedHTML.querySelector('.cc-filters-control').innerHTML;

      // Update the 'selected' option in the 'Sort by' dropdown button (tablet/desktop)
      if (e && e.target.name === 'sort_by') {
        this.activeSortText.textContent = e.target.nextElementSibling.textContent;
      }

      if (!this.filteringEnabled) return;

      document.querySelectorAll('.cc-filter').forEach(filter => {
        var { index } = filter.dataset;
        if (index === '0') return; // Sort by

        var fetchedFilter = fetchedHTML.querySelector(".cc-filter[data-index=\"".concat(index, "\"]"));

        if (filter.dataset.type === 'price_range') {
          this.updateFilter(filter, fetchedFilter, false);

          if (!e || e.target.tagName !== 'INPUT') {
            // Update price fields and trigger update of slider
            filter.querySelectorAll('input').forEach(input => {
              input.value = fetchedHTML.getElementById(input.id).value;
              input.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { sender: 'reset' } }));
            });
          }
        } else {
          if (e && e.target.tagName === 'INPUT') {
            var changedFilter = e.target.closest('.cc-filter');

            this.updateFilter(filter, fetchedFilter, filter.dataset.index !== changedFilter.dataset.index);
          } else {
            this.updateFilter(filter, fetchedFilter, true);
          }
        }
      });

      // Update the active filters
      this.updateActiveFilters(fetchedHTML);

      // Update the 'Clear all' button visibility (mobile only)
      this.clearFiltersBtn.hidden = fetchedHTML.querySelector('.js-clear-filters').hidden;

      // Update the '[x] results' button (mobile only)
      var footerEl = fetchedHTML.querySelector('.cc-filters__footer');
      var footerHidden = footerEl.classList.contains(this.utils.hidden);
      this.filtersFooter.innerHTML = footerEl.innerHTML;
      this.filtersFooter.classList.toggle(this.utils.hidden, footerHidden);
      this.filters.style.height = footerHidden ? null : "calc(100% - ".concat(this.filtersFooter.offsetHeight, "px)");
    }

    /**
     * Updates a filter
     * @param {HTMLElement} filter - The filter element
     * @param {HTMLElement} fetchedFilter - The fetched filter element
     * @param {boolean} updateAll - Whether to update all filter markup or just toggle/header
     */
    updateFilter(filter, fetchedFilter, updateAll) {
      if (updateAll) {
        filter.innerHTML = fetchedFilter.innerHTML;
      } else {
        // Update toggle and header only
        filter.replaceChild(fetchedFilter.querySelector('.cc-filter__toggle'), filter.querySelector('.cc-filter__toggle'));
        filter.querySelector('.cc-filter__header').innerHTML = fetchedFilter.querySelector('.cc-filter__header').innerHTML;
      }
    }

    /**
     * Updates the active filter
     * @param {html} fetchedHTML - HTML of the fetched page
     */
    updateActiveFilters(fetchedHTML) {
      var activeFilters = fetchedHTML.querySelector('.cc-active-filters');

      this.activeFilters.innerHTML = activeFilters.innerHTML;
      this.activeFilters.hidden = !this.activeFilters.querySelector('.cc-active-filter');
    }

    /**
     * Updates the url with the current filter/sort parameters
     * @param {string} searchParams - The filter/sort parameters
     */
    updateURL(searchParams) {
      history.pushState({ searchParams }, '', "".concat(window.location.pathname).concat(searchParams && '?'.concat(searchParams)));
    }

    /**
     * Closes a filter
     * @param {HTMLElement} filter - The filter element
     * @param {boolean} [delay=true] - Whether to wait for the css transition
     */
    closeFilter(filter) {var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      clearTimeout(this.closeTimer);
      filter.classList.remove(this.utils.open);

      // Delay to allow for filter closing transition
      this.closeTimer = setTimeout(() => {
        filter.open = false;
      }, delay ? 300 : null);
    }}


  class FacetFilters extends ccComponent {
    constructor() {var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'facet-filters';var cssSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ".cc-facet-filters";
      super(name, cssSelector);
    }

    init(container) {
      super.init(container);
      this.registerInstance(container, new FacetFiltersInstance(container));
    }

    destroy(container) {
      this.destroyInstance(container);
      super.destroy(container);
    }}


  new FacetFilters();


  class PriceRangeInstance {
    constructor(container) {
      this.container = container;

      this.selectors = {
        inputMin: '.cc-price-range__input--min',
        inputMax: '.cc-price-range__input--max',
        control: '.cc-price-range__control',
        controlMin: '.cc-price-range__control--min',
        controlMax: '.cc-price-range__control--max',
        bar: '.cc-price-range__bar',
        activeBar: '.cc-price-range__bar-active' };


      this.controls = {
        min: {
          barControl: container.querySelector(this.selectors.controlMin),
          input: container.querySelector(this.selectors.inputMin) },

        max: {
          barControl: container.querySelector(this.selectors.controlMax),
          input: container.querySelector(this.selectors.inputMax) } };



      this.controls.min.value = parseInt(
      this.controls.min.input.value === '' ? this.controls.min.input.placeholder : this.controls.min.input.value);


      this.controls.max.value = parseInt(
      this.controls.max.input.value === '' ? this.controls.max.input.placeholder : this.controls.max.input.value);


      this.valueMin = this.controls.min.input.min;
      this.valueMax = this.controls.min.input.max;
      this.valueRange = this.valueMax - this.valueMin;

      [this.controls.min, this.controls.max].forEach(item => {
        item.barControl.setAttribute('aria-valuemin', this.valueMin);
        item.barControl.setAttribute('aria-valuemax', this.valueMax);
      });

      this.controls.min.barControl.setAttribute('aria-valuenow', this.controls.min.value);
      this.controls.max.barControl.setAttribute('aria-valuenow', this.controls.max.value);

      this.bar = container.querySelector(this.selectors.bar);
      this.activeBar = container.querySelector(this.selectors.activeBar);
      this.inDrag = false;

      this.bindEvents();
      this.render();
    }

    getPxToValueRatio() {
      return this.bar.clientWidth / (this.valueMax - this.valueMin);
    }

    getPcToValueRatio() {
      return 100.0 / (this.valueMax - this.valueMin);
    }

    setActiveControlValue(value, reset) {
      // Clamp & default
      if (this.activeControl === this.controls.min) {
        if (value === '') {
          value = this.valueMin;
        }

        value = Math.max(this.valueMin, value);
        value = Math.min(value, this.controls.max.value);
      } else {
        if (value === '') {
          value = this.valueMax;
        }

        value = Math.min(this.valueMax, value);
        value = Math.max(value, this.controls.min.value);
      }

      // Round
      this.activeControl.value = Math.round(value);

      // Update input
      if (this.activeControl.input.value != this.activeControl.value) {
        if (this.activeControl.value == this.activeControl.input.placeholder) {
          this.activeControl.input.value = '';
        } else {
          this.activeControl.input.value = this.activeControl.value;
        }

        if (!reset) {
          this.activeControl.input.dispatchEvent(
          new CustomEvent('change', { bubbles: true, detail: { sender: 'theme:component:price_range' } }));

        }
      }

      // A11y
      this.activeControl.barControl.setAttribute('aria-valuenow', this.activeControl.value);
    }

    render() {
      this.drawControl(this.controls.min);
      this.drawControl(this.controls.max);
      this.drawActiveBar();
    }

    drawControl(control) {
      control.barControl.style.left = "".concat((control.value - this.valueMin) * this.getPcToValueRatio(), "%");
    }

    drawActiveBar() {
      this.activeBar.style.left = "".concat((this.controls.min.value - this.valueMin) * this.getPcToValueRatio(), "%");
      this.activeBar.style.right = "".concat((this.valueMax - this.controls.max.value) * this.getPcToValueRatio(), "%");
    }

    handleControlTouchStart(e) {
      e.preventDefault();
      this.startDrag(e.target, e.touches[0].clientX);
      this.boundControlTouchMoveEvent = this.handleControlTouchMove.bind(this);
      this.boundControlTouchEndEvent = this.handleControlTouchEnd.bind(this);
      window.addEventListener('touchmove', this.boundControlTouchMoveEvent);
      window.addEventListener('touchend', this.boundControlTouchEndEvent);
    }

    handleControlTouchMove(e) {
      this.moveDrag(e.touches[0].clientX);
    }

    handleControlTouchEnd(e) {
      e.preventDefault();
      window.removeEventListener('touchmove', this.boundControlTouchMoveEvent);
      window.removeEventListener('touchend', this.boundControlTouchEndEvent);
      this.stopDrag();
    }

    handleControlMouseDown(e) {
      e.preventDefault();
      this.startDrag(e.target, e.clientX);
      this.boundControlMouseMoveEvent = this.handleControlMouseMove.bind(this);
      this.boundControlMouseUpEvent = this.handleControlMouseUp.bind(this);
      window.addEventListener('mousemove', this.boundControlMouseMoveEvent);
      window.addEventListener('mouseup', this.boundControlMouseUpEvent);
    }

    handleControlMouseMove(e) {
      this.moveDrag(e.clientX);
    }

    handleControlMouseUp(e) {
      e.preventDefault();
      window.removeEventListener('mousemove', this.boundControlMouseMoveEvent);
      window.removeEventListener('mouseup', this.boundControlMouseUpEvent);
      this.stopDrag();
    }

    startDrag(target, startX) {
      this.activeControl = this.controls.min.barControl === target ? this.controls.min : this.controls.max;
      this.dragStartX = startX;
      this.dragStartValue = this.activeControl.value;
      this.inDrag = true;
    }

    moveDrag(moveX) {
      if (this.inDrag) {
        var value = this.dragStartValue + (moveX - this.dragStartX) / this.getPxToValueRatio();
        this.setActiveControlValue(value);
        this.render();
      }
    }

    stopDrag() {
      this.inDrag = false;
    }

    handleInputChange(e) {
      if (e.target.tagName !== 'INPUT') return;

      if (!e.detail || e.detail.sender !== 'theme:component:price_range') {
        var reset = e.detail && e.detail.sender === 'reset';

        this.activeControl = this.controls.min.input === e.target ? this.controls.min : this.controls.max;
        this.setActiveControlValue(e.target.value, reset);
        this.render();
      }
    }

    bindEvents() {
      [this.controls.min, this.controls.max].forEach(item => {
        item.barControl.addEventListener('touchstart', this.handleControlTouchStart.bind(this));
        item.barControl.addEventListener('mousedown', this.handleControlMouseDown.bind(this));
      });

      this.container.addEventListener('change', this.handleInputChange.bind(this));
    }

    destroy() {}}


  class PriceRange extends ccComponent {
    constructor() {var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'price-range';var cssSelector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ".cc-".concat(name);
      super(name, cssSelector);
    }

    init(container) {
      super.init(container);
      this.registerInstance(container, new PriceRangeInstance(container));
    }

    destroy(container) {
      this.destroyInstance(container);
      super.destroy(container);
    }}


  new PriceRange();


  // Manage videos
  theme.VideoManager = new function () {
    var _ = this;

    _._permitPlayback = function (container) {
      return !($(container).hasClass('video-container--background') && $(window).outerWidth() < 768);
    };

    // Youtube
    _.youtubeVars = {
      incrementor: 0,
      apiReady: false,
      videoData: {},
      toProcessSelector: '.video-container[data-video-type="youtube"]:not(.video--init)' };


    _.youtubeApiReady = function () {
      _.youtubeVars.apiReady = true;
      _._loadYoutubeVideos();
    };

    _._loadYoutubeVideos = function (container) {
      if ($(_.youtubeVars.toProcessSelector, container).length) {
        if (_.youtubeVars.apiReady) {

          // play those videos
          $(_.youtubeVars.toProcessSelector, container).each(function () {
            // Don't init background videos on mobile
            if (_._permitPlayback($(this))) {
              $(this).addClass('video--init');
              _.youtubeVars.incrementor++;
              var containerId = 'theme-yt-video-' + _.youtubeVars.incrementor;
              $(this).data('video-container-id', containerId);
              var videoElement = $('<div class="video-container__video-element">').attr('id', containerId).
              appendTo($('.video-container__video', this));
              var autoplay = $(this).data('video-autoplay');
              var loop = $(this).data('video-loop');
              var player = new YT.Player(containerId, {
                height: '360',
                width: '640',
                videoId: $(this).data('video-id'),
                playerVars: {
                  iv_load_policy: 3,
                  modestbranding: 1,
                  autoplay: 0,
                  loop: loop ? 1 : 0,
                  playlist: $(this).data('video-id'),
                  rel: 0,
                  showinfo: 0 },

                events: {
                  onReady: _._onYoutubePlayerReady.bind({ autoplay: autoplay, loop: loop, $container: $(this) }),
                  onStateChange: _._onYoutubePlayerStateChange.bind({ autoplay: autoplay, loop: loop, $container: $(this) }) } });


              _.youtubeVars.videoData[containerId] = {
                id: containerId,
                container: this,
                videoElement: videoElement,
                player: player };

            }
          });
        } else {
          // load api
          theme.loadScriptOnce('https://www.youtube.com/iframe_api');
        }
      }
    };

    _._onYoutubePlayerReady = function (event) {
      event.target.setPlaybackQuality('hd1080');
      if (this.autoplay) {
        event.target.mute();
        event.target.playVideo();
      }

      _._initBackgroundVideo(this.$container);
    };

    _._onYoutubePlayerStateChange = function (event) {
      if (event.data == YT.PlayerState.PLAYING) {
        this.$container.addClass('video--play-started');

        if (this.autoplay) {
          event.target.mute();
        }

        if (this.loop) {
          // 4 times a second, check if we're in the final second of the video. If so, loop it for a more seamless loop
          var finalSecond = event.target.getDuration() - 1;
          if (finalSecond > 2) {
            function loopTheVideo() {
              if (event.target.getCurrentTime() > finalSecond) {
                event.target.seekTo(0);
              }
              setTimeout(loopTheVideo, 250);
            }
            loopTheVideo();
          }
        }
      }
    };

    _._unloadYoutubeVideos = function (container) {
      for (var dataKey in _.youtubeVars.videoData) {
        var data = _.youtubeVars.videoData[dataKey];
        if ($(container).find(data.container).length) {
          data.player.destroy();
          delete _.youtubeVars.videoData[dataKey];
          return;
        }
      }
    };

    // Vimeo
    _.vimeoVars = {
      incrementor: 0,
      apiReady: false,
      videoData: {},
      toProcessSelector: '.video-container[data-video-type="vimeo"]:not(.video--init)' };


    _.vimeoApiReady = function () {
      _.vimeoVars.apiReady = true;
      _._loadVimeoVideos();
    };

    _._loadVimeoVideos = function (container) {
      if ($(_.vimeoVars.toProcessSelector, container).length) {
        if (_.vimeoVars.apiReady) {
          // play those videos

          $(_.vimeoVars.toProcessSelector, container).each(function () {
            // Don't init background videos on mobile
            if (_._permitPlayback($(this))) {
              $(this).addClass('video--init');
              _.vimeoVars.incrementor++;
              var $this = $(this);
              var containerId = 'theme-vi-video-' + _.vimeoVars.incrementor;
              $(this).data('video-container-id', containerId);
              var videoElement = $('<div class="video-container__video-element">').attr('id', containerId).
              appendTo($('.video-container__video', this));
              var autoplay = !!$(this).data('video-autoplay');
              var player = new Vimeo.Player(containerId, {
                url: $(this).data('video-url'),
                width: 640,
                loop: $(this).data('video-autoplay'),
                autoplay: autoplay,
                muted: $this.hasClass('video-container--background') || autoplay });

              player.on('playing', function () {
                $(this).addClass('video--play-started');
              }.bind(this));
              player.ready().then(function () {
                if (autoplay) {
                  player.setVolume(0);
                  player.play();
                }
                if (player.element && player.element.width && player.element.height) {
                  var ratio = parseInt(player.element.height) / parseInt(player.element.width);
                  $this.find('.video-container__video').css('padding-bottom', ratio * 100 + '%');
                }
                _._initBackgroundVideo($this);
              });
              _.vimeoVars.videoData[containerId] = {
                id: containerId,
                container: this,
                videoElement: videoElement,
                player: player,
                autoPlay: autoplay };

            }
          });
        } else {
          // load api
          if (window.define) {
            // workaround for third parties using RequireJS
            theme.loadScriptOnce('https://player.vimeo.com/api/player.js', function () {
              _.vimeoVars.apiReady = true;
              _._loadVimeoVideos();
              window.define = window.tempDefine;
            }, function () {
              window.tempDefine = window.define;
              window.define = null;
            });
          } else {
            theme.loadScriptOnce('https://player.vimeo.com/api/player.js', function () {
              _.vimeoVars.apiReady = true;
              _._loadVimeoVideos();
            });
          }
        }
      }
    };

    _._unloadVimeoVideos = function (container) {
      for (var dataKey in _.vimeoVars.videoData) {
        var data = _.vimeoVars.videoData[dataKey];
        if ($(container).find(data.container).length) {
          data.player.unload();
          delete _.vimeoVars.videoData[dataKey];
          return;
        }
      }
    };

    // Init third party apis - Youtube and Vimeo
    _._loadThirdPartyApis = function (container) {
      //Don't init youtube or vimeo background videos on mobile
      if (_._permitPlayback($('.video-container', container))) {
        _._loadYoutubeVideos(container);
        _._loadVimeoVideos(container);
      }
    };

    // Mp4
    _.mp4Vars = {
      incrementor: 0,
      videoData: {},
      toProcessSelector: '.video-container[data-video-type="mp4"]:not(.video--init)' };


    _._loadMp4Videos = function (container) {
      if ($(_.mp4Vars.toProcessSelector, container).length) {
        // play those videos
        $(_.mp4Vars.toProcessSelector, container).addClass('video--init').each(function () {
          _.mp4Vars.incrementor++;
          var $this = $(this);
          var containerId = 'theme-mp-video-' + _.mp4Vars.incrementor;
          $(this).data('video-container-id', containerId);
          var videoElement = $('<div class="video-container__video-element">').attr('id', containerId).
          appendTo($('.video-container__video', this));

          var $video = $('<video playsinline>');
          if ($(this).data('video-loop')) {
            $video.attr('loop', 'loop');
          }
          if (!$(this).hasClass('video-container--background')) {
            $video.attr('controls', 'controls');
          }
          if ($(this).data('video-autoplay')) {
            $video.attr({ autoplay: 'autoplay', muted: 'muted' });
            $video[0].muted = true; // required by Chrome - ignores attribute
            $video.one('loadeddata', function () {
              this.play();
            });
          }
          $video.on('playing', function () {
            $(this).addClass('video--play-started');
          }.bind(this));
          $video.attr('src', $(this).data('video-url')).appendTo(videoElement);
          _.mp4Vars.videoData[containerId] = {
            element: $video[0] };

        });
      }
    };

    _._unloadMp4Videos = function (container) {
    };

    // background video placement for iframes
    _._initBackgroundVideo = function ($container) {
      if ($container.hasClass('video-container--background') && $container.find('.video-container__video iframe').length) {
        function assessBackgroundVideo() {
          var $media = $('.video-container__media', this),
          $container = $media.length ? $media : this,
          cw = $container.width(),
          ch = $container.height(),
          cr = cw / ch,
          $frame = $('.video-container__video iframe', this),
          vr = $frame.attr('width') / $frame.attr('height'),
          $pan = $('.video-container__video', this),
          vCrop = 75; // pushes video outside container to hide controls
          if (cr > vr) {
            var vh = cw / vr + vCrop * 2;
            $pan.css({
              marginTop: (ch - vh) / 2 - vCrop,
              marginInlineStart: '',
              height: vh + vCrop * 2,
              width: '' });

          } else {
            var vw = cw * vr + vCrop * 2 * vr;
            $pan.css({
              marginTop: -vCrop,
              marginInlineStart: (cw - vw) / 2,
              height: ch + vCrop * 2,
              width: vw });

          }
        }
        assessBackgroundVideo.bind($container)();
        $(window).on('debouncedresize.' + $container.data('video-container-id'), assessBackgroundVideo.bind($container));
      }
    };

    // Compatibility with Sections
    this.onSectionLoad = function (container) {
      // url only - infer type
      $('.video-container[data-video-url]:not([data-video-type])').each(function () {
        var url = $(this).data('video-url');

        if (url.indexOf('.mp4') > -1) {
          $(this).attr('data-video-type', 'mp4');
        }

        if (url.indexOf('vimeo.com') > -1) {
          $(this).attr('data-video-type', 'vimeo');
          $(this).attr('data-video-id', url.split('?')[0].split('/').pop());
        }

        if (url.indexOf('youtu.be') > -1 || url.indexOf('youtube.com') > -1) {
          $(this).attr('data-video-type', 'youtube');
          if (url.indexOf('v=') > -1) {
            $(this).attr('data-video-id', url.split('v=').pop().split('&')[0]);
          } else {
            $(this).attr('data-video-id', url.split('?')[0].split('/').pop());
          }
        }
      });

      _._loadThirdPartyApis(container);
      _._loadMp4Videos(container);

      $(window).on('debouncedresize.video-manager-resize', function () {
        _._loadThirdPartyApis(container);
      });

      // play button
      $('.video-container__play', container).on('click', function (evt) {
        evt.preventDefault();
        var $container = $(this).closest('.video-container');
        // reveal
        $container.addClass('video-container--playing');

        // broadcast a play event on the section container
        $(container).trigger("cc:video:play");

        // play
        var id = $container.data('video-container-id');
        if (id.indexOf('theme-yt-video') === 0) {
          _.youtubeVars.videoData[id].player.playVideo();
        } else if (id.indexOf('theme-vi-video') === 0) {
          _.vimeoVars.videoData[id].player.play();
        } else if (id.indexOf('theme-mp-video') === 0) {
          _.mp4Vars.videoData[id].element.play();
        }
      });

      // modal close button
      $('.video-container__stop', container).on('click', function (evt) {
        evt.preventDefault();
        var $container = $(this).closest('.video-container');
        // hide
        $container.removeClass('video-container--playing');

        // broadcast a stop event on the section container
        $(container).trigger("cc:video:stop");

        // play
        var id = $container.data('video-container-id');
        if (id.indexOf('theme-yt-video') === 0) {
          _.youtubeVars.videoData[id].player.stopVideo();
        } else {
          _.vimeoVars.videoData[id].player.pause();
          _.vimeoVars.videoData[id].player.setCurrentTime(0);
        }
      });
    };

    this.onSectionUnload = function (container) {
      $('.video-container__play, .video-container__stop', container).off('click');
      $(window).off('.' + $('.video-container').data('video-container-id'));
      $(window).off('debouncedresize.video-manager-resize');
      _._unloadYoutubeVideos(container);
      _._unloadVimeoVideos(container);
      _._unloadMp4Videos(container);
      $(container).trigger("cc:video:stop");
    };
  }();

  // Youtube API callback
  window.onYouTubeIframeAPIReady = function () {
    theme.VideoManager.youtubeApiReady();
  };

  // Register the section
  cc.sections.push({
    name: 'video',
    section: theme.VideoManager });

  theme.MapSection = new function () {
    var _ = this;
    _.config = {
      zoom: 14,
      styles: {
        default: [],
        silver: [{ "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] }, { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f5f5f5" }] }, { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#eeeeee" }] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#e5e5e5" }] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#dadada" }] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] }, { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] }, { "featureType": "transit.line", "elementType": "geometry", "stylers": [{ "color": "#e5e5e5" }] }, { "featureType": "transit.station", "elementType": "geometry", "stylers": [{ "color": "#eeeeee" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#c9c9c9" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] }],
        retro: [{ "elementType": "geometry", "stylers": [{ "color": "#ebe3cd" }] }, { "elementType": "labels.text.fill", "stylers": [{ "color": "#523735" }] }, { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f5f1e6" }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#c9b2a6" }] }, { "featureType": "administrative.land_parcel", "elementType": "geometry.stroke", "stylers": [{ "color": "#dcd2be" }] }, { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{ "color": "#ae9e90" }] }, { "featureType": "landscape.natural", "elementType": "geometry", "stylers": [{ "color": "#dfd2ae" }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#dfd2ae" }] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#93817c" }] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#a5b076" }] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#447530" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#f5f1e6" }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#fdfcf8" }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#f8c967" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#e9bc62" }] }, { "featureType": "road.highway.controlled_access", "elementType": "geometry", "stylers": [{ "color": "#e98d58" }] }, { "featureType": "road.highway.controlled_access", "elementType": "geometry.stroke", "stylers": [{ "color": "#db8555" }] }, { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#806b63" }] }, { "featureType": "transit.line", "elementType": "geometry", "stylers": [{ "color": "#dfd2ae" }] }, { "featureType": "transit.line", "elementType": "labels.text.fill", "stylers": [{ "color": "#8f7d77" }] }, { "featureType": "transit.line", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ebe3cd" }] }, { "featureType": "transit.station", "elementType": "geometry", "stylers": [{ "color": "#dfd2ae" }] }, { "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "color": "#b9d3c2" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#92998d" }] }],
        dark: [{ "elementType": "geometry", "stylers": [{ "color": "#212121" }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] }, { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] }, { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] }, { "featureType": "administrative.country", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] }, { "featureType": "administrative.land_parcel", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#181818" }] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] }, { "featureType": "poi.park", "elementType": "labels.text.stroke", "stylers": [{ "color": "#1b1b1b" }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#8a8a8a" }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#373737" }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#3c3c3c" }] }, { "featureType": "road.highway.controlled_access", "elementType": "geometry", "stylers": [{ "color": "#4e4e4e" }] }, { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] }, { "featureType": "transit", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#3d3d3d" }] }],
        night: [{ "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] }, { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] }, { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] }, { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] }, { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] }, { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }],
        aubergine: [{ "elementType": "geometry", "stylers": [{ "color": "#1d2c4d" }] }, { "elementType": "labels.text.fill", "stylers": [{ "color": "#8ec3b9" }] }, { "elementType": "labels.text.stroke", "stylers": [{ "color": "#1a3646" }] }, { "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [{ "color": "#4b6878" }] }, { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{ "color": "#64779e" }] }, { "featureType": "administrative.province", "elementType": "geometry.stroke", "stylers": [{ "color": "#4b6878" }] }, { "featureType": "landscape.man_made", "elementType": "geometry.stroke", "stylers": [{ "color": "#334e87" }] }, { "featureType": "landscape.natural", "elementType": "geometry", "stylers": [{ "color": "#023e58" }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#283d6a" }] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#6f9ba5" }] }, { "featureType": "poi", "elementType": "labels.text.stroke", "stylers": [{ "color": "#1d2c4d" }] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#023e58" }] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#3C7680" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#304a7d" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#98a5be" }] }, { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [{ "color": "#1d2c4d" }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#2c6675" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#255763" }] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#b0d5ce" }] }, { "featureType": "road.highway", "elementType": "labels.text.stroke", "stylers": [{ "color": "#023e58" }] }, { "featureType": "transit", "elementType": "labels.text.fill", "stylers": [{ "color": "#98a5be" }] }, { "featureType": "transit", "elementType": "labels.text.stroke", "stylers": [{ "color": "#1d2c4d" }] }, { "featureType": "transit.line", "elementType": "geometry.fill", "stylers": [{ "color": "#283d6a" }] }, { "featureType": "transit.station", "elementType": "geometry", "stylers": [{ "color": "#3a4762" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0e1626" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#4e6d70" }] }] } };


    _.apiStatus = null;

    this.geolocate = function ($map) {
      var deferred = $.Deferred();
      var geocoder = new google.maps.Geocoder();
      var address = $map.data('address-setting');

      geocoder.geocode({ address: address }, function (results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
          deferred.reject(status);
        }

        deferred.resolve(results);
      });

      return deferred;
    };

    this.createMap = function (container) {
      var $map = $('.map-section__map-container', container);

      return _.geolocate($map).
      then(
      function (results) {
        var mapOptions = {
          zoom: _.config.zoom,
          styles: _.config.styles[$(container).data('map-style')],
          center: results[0].geometry.location,
          scrollwheel: false,
          disableDoubleClickZoom: true,
          disableDefaultUI: true,
          zoomControl: true };


        _.map = new google.maps.Map($map[0], mapOptions);
        _.center = _.map.getCenter();

        var marker = new google.maps.Marker({
          map: _.map,
          position: _.center,
          clickable: false });


        google.maps.event.addDomListener(window, 'resize', function () {
          google.maps.event.trigger(_.map, 'resize');
          _.map.setCenter(_.center);
        });
      }.bind(this)).

      fail(function () {
        var errorMessage;

        switch (status) {
          case 'ZERO_RESULTS':
            errorMessage = theme.strings.addressNoResults;
            break;
          case 'OVER_QUERY_LIMIT':
            errorMessage = theme.strings.addressQueryLimit;
            break;
          default:
            errorMessage = theme.strings.addressError;
            break;}


        // Only show error in the theme editor
        if (Shopify.designMode) {
          var $mapContainer = $map.parents('.map-section');

          $mapContainer.addClass('page-width map-section--load-error');
          $mapContainer.
          find('.map-section__wrapper').
          html(
          '<div class="errors text-center">' + errorMessage + '</div>');

        }
      });
    };

    this.onSectionLoad = function (target) {
      var $container = $(target);
      // Global function called by Google on auth errors
      window.gm_authFailure = function () {
        if (!Shopify.designMode) return;

        $container.addClass('page-width map-section--load-error');
        $container.
        find('.map-section__wrapper').
        html(
        '<div class="errors text-center">' + theme.strings.authError + '</div>');

      };

      // create maps
      var key = $container.data('api-key');

      if (typeof key !== 'string' || key === '') {
        return;
      }

      // load map
      theme.loadScriptOnce('https://maps.googleapis.com/maps/api/js?key=' + key, function () {
        _.createMap($container);
      });
    };

    this.onSectionUnload = function (target) {
      if (typeof window.google !== 'undefined' && typeof google.maps !== 'undefined') {
        google.maps.event.clearListeners(_.map, 'resize');
      }
    };
  }();

  // Register the section
  cc.sections.push({
    name: 'map',
    section: theme.MapSection });

  /**
   * StoreAvailability Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace StoreAvailability
   */

  theme.StoreAvailability = function (container) {
    var loadingClass = 'store-availability-loading';
    var initClass = 'store-availability-initialized';
    var storageKey = 'cc-location';

    this.onSectionLoad = function (container) {
      this.namespace = theme.namespaceFromSection(container);
      this.$container = $(container);
      this.productId = this.$container.data('store-availability-container');
      this.sectionUrl = this.$container.data('section-url');
      this.$modal;

      this.$container.addClass(initClass);
      this.transitionDurationMS = parseFloat(getComputedStyle(container).transitionDuration) * 1000;
      this.removeFixedHeightTimeout = -1;

      // Handle when a variant is selected
      $(window).on("cc-variant-updated".concat(this.namespace).concat(this.productId), (e, args) => {
        if (args.product.id === this.productId) {
          this.functions.updateContent.bind(this)(
          args.variant ? args.variant.id : null,
          args.product.title,
          this.$container.data('has-only-default-variant'),
          args.variant && typeof args.variant.available !== "undefined");

        }
      });

      // Handle single variant products
      if (this.$container.data('single-variant-id')) {
        this.functions.updateContent.bind(this)(
        this.$container.data('single-variant-id'),
        this.$container.data('single-variant-product-title'),
        this.$container.data('has-only-default-variant'),
        this.$container.data('single-variant-product-available'));

      }
    };

    this.onSectionUnload = function () {
      $(window).off("cc-variant-updated".concat(this.namespace).concat(this.productId));
      this.$container.off('click');
      if (this.$modal) {
        this.$modal.off('click');
      }
    };

    this.functions = {
      // Returns the users location data (if allowed)
      getUserLocation: function getUserLocation() {
        return new Promise((resolve, reject) => {
          var storedCoords;

          if (sessionStorage[storageKey]) {
            storedCoords = JSON.parse(sessionStorage[storageKey]);
          }

          if (storedCoords) {
            resolve(storedCoords);

          } else {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
              function (position) {
                var coords = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude };


                //Set the localization api
                fetch('/localization.json', {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json' },

                  body: JSON.stringify(coords) });


                //Write to a session storage
                sessionStorage[storageKey] = JSON.stringify(coords);

                resolve(coords);
              }, function () {
                resolve(false);
              }, {
                maximumAge: 3600000, // 1 hour
                timeout: 5000 });


            } else {
              resolve(false);
            }
          }
        });
      },

      // Requests the available stores and calls the callback
      getAvailableStores: function getAvailableStores(variantId, cb) {
        return $.get(this.sectionUrl.replace('VARIANT_ID', variantId), cb);
      },

      // Haversine Distance
      // The haversine formula is an equation giving great-circle distances between
      // two points on a sphere from their longitudes and latitudes
      calculateDistance: function calculateDistance(coords1, coords2, unitSystem) {
        var dtor = Math.PI / 180;
        var radius = unitSystem === 'metric' ? 6378.14 : 3959;

        var rlat1 = coords1.latitude * dtor;
        var rlong1 = coords1.longitude * dtor;
        var rlat2 = coords2.latitude * dtor;
        var rlong2 = coords2.longitude * dtor;

        var dlon = rlong1 - rlong2;
        var dlat = rlat1 - rlat2;

        var a =
        Math.pow(Math.sin(dlat / 2), 2) +
        Math.cos(rlat1) * Math.cos(rlat2) * Math.pow(Math.sin(dlon / 2), 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return radius * c;
      },

      // Updates the existing modal pickup with locations with distances from the user
      updateLocationDistances: function updateLocationDistances(coords) {
        var unitSystem = this.$modal.find('[data-unit-system]').data('unit-system');
        var self = this;

        this.$modal.find('[data-distance="false"]').each(function () {
          var thisCoords = {
            latitude: parseFloat($(this).data('latitude')),
            longitude: parseFloat($(this).data('longitude')) };


          if (thisCoords.latitude && thisCoords.longitude) {
            var distance = self.functions.calculateDistance(
            coords, thisCoords, unitSystem).toFixed(1);

            $(this).html(distance);

            //Timeout to trigger animation
            setTimeout(() => {
              $(this).closest('.store-availability-list__location__distance').addClass('-in');
            }, 0);
          }

          $(this).attr('data-distance', 'true');
        });
      },

      // Requests the available stores and updates the page with info below Add to Basket, and append the modal to the page
      updateContent: function updateContent(variantId, productTitle, isSingleDefaultVariant, isVariantAvailable) {
        this.$container.off('click', '[data-store-availability-modal-open]');
        this.$container.off('click' + this.namespace, '.cc-popup-close, .cc-popup-background');
        $('.store-availabilities-modal').remove();

        if (!isVariantAvailable) {
          //If the variant is Unavailable (not the same as Out of Stock) - hide the store pickup completely
          this.$container.addClass(loadingClass);
          if (this.transitionDurationMS > 0) {
            this.$container.css('height', '0px');
          }
        } else {
          this.$container.addClass(loadingClass);
          if (this.transitionDurationMS > 0) {
            this.$container.css('height', this.$container.outerHeight() + 'px');
          }
        }

        if (isVariantAvailable) {
          this.functions.getAvailableStores.call(this, variantId, response => {
            if (response.trim().length > 0 && !response.includes('NO_PICKUP')) {
              this.$container.html(response);
              this.$container.html(this.$container.children().first().html()); // editor bug workaround

              this.$container.find('[data-store-availability-modal-product-title]').html(productTitle);

              if (isSingleDefaultVariant) {
                this.$container.find('.store-availabilities-modal__variant-title').remove();
              }

              this.$container.find('.cc-popup').appendTo('body');

              this.$modal = $('body').find('.store-availabilities-modal');
              var popup = new ccPopup(this.$modal, this.namespace);

              this.$container.on('click', '[data-store-availability-modal-open]', () => {
                popup.open();

                //When the modal is opened, try and get the users location
                this.functions.getUserLocation().then(coords => {
                  if (coords && this.$modal.find('[data-distance="false"]').length) {
                    //Re-retrieve the available stores location modal contents
                    this.functions.getAvailableStores.call(this, variantId, response => {
                      this.$modal.find('.store-availabilities-list').html($(response).find('.store-availabilities-list').html());
                      this.functions.updateLocationDistances.bind(this)(coords);
                    });
                  }
                });

                return false;
              });

              this.$modal.on('click' + this.namespace, '.cc-popup-close, .cc-popup-background', () => {
                popup.close();
              });

              this.$container.removeClass(loadingClass);

              if (this.transitionDurationMS > 0) {
                var newHeight = this.$container.find('.store-availability-container').outerHeight();
                this.$container.css('height', newHeight > 0 ? newHeight + 'px' : '');
                clearTimeout(this.removeFixedHeightTimeout);
                this.removeFixedHeightTimeout = setTimeout(() => {
                  this.$container.css('height', '');
                }, this.transitionDurationMS);
              }
            }
          });
        }
      } };


    // Initialise the section when it's instantiated
    this.onSectionLoad(container);
  };

  // Register section
  cc.sections.push({
    name: 'store-availability',
    section: theme.StoreAvailability });

  /**
   * Popup Section Script
   * ------------------------------------------------------------------------------
   *
   * @namespace Popup
   */

  theme.Popup = new function () {
    /**
     * Popup section constructor. Runs on page load as well as Theme Editor
     * `section:load` events.
     * @param {string} container - selector for the section container DOM element
     */

    var dismissedStorageKey = 'cc-theme-popup-dismissed';

    this.onSectionLoad = function (container) {
      this.namespace = theme.namespaceFromSection(container);
      this.$container = $(container);
      this.popup = new ccPopup(this.$container, this.namespace);

      var dismissForDays = this.$container.data('dismiss-for-days'),
      delaySeconds = this.$container.data('delay-seconds'),
      showPopup = true,
      testMode = this.$container.data('test-mode'),
      lastDismissed = window.localStorage.getItem(dismissedStorageKey);

      // Should we show it during this page view?
      // Check when it was last dismissed
      if (lastDismissed) {
        var dismissedDaysAgo = (new Date().getTime() - lastDismissed) / (1000 * 60 * 60 * 24);
        if (dismissedDaysAgo < dismissForDays) {
          showPopup = false;
        }
      }

      // Check for error or success messages
      if (this.$container.find('.cc-popup-form__response').length) {
        showPopup = true;
        delaySeconds = 1;

        // If success, set as dismissed
        if (this.$container.find('.cc-popup-form__response--success').length) {
          this.functions.popupSetAsDismissed.call(this);
        }
      }

      // Prevent popup on Shopify robot challenge page
      if (document.querySelector('.shopify-challenge__container')) {
        showPopup = false;
      }

      // Show popup, if appropriate
      if (showPopup || testMode) {
        setTimeout(() => {
          this.popup.open();
        }, delaySeconds * 1000);
      }

      // Click on close button or modal background
      this.$container.on('click' + this.namespace, '.cc-popup-close, .cc-popup-background', () => {
        this.popup.close(() => {
          this.functions.popupSetAsDismissed.call(this);
        });
      });
    };

    this.onSectionSelect = function () {
      this.popup.open();
    };

    this.functions = {
      /**
       * Use localStorage to set as dismissed
       */
      popupSetAsDismissed: function popupSetAsDismissed() {
        window.localStorage.setItem(dismissedStorageKey, new Date().getTime());
      } };


    /**
     * Event callback for Theme Editor `section:unload` event
     */
    this.onSectionUnload = function () {
      this.$container.off(this.namespace);
    };
  }();

  // Register section
  cc.sections.push({
    name: 'newsletter-popup',
    section: theme.Popup });



  theme.icons = {
    left: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
    right: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>',
    close: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
    chevronLeft: '<svg fill="#000000" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M14.298 18.187l1.061-1.061-5.127-5.126 5.127-5.126-1.061-1.061-6.187 6.187z"></path></svg>',
    chevronRight: '<svg fill="#000000" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M9.702 18.187l-1.061-1.061 5.127-5.126-5.127-5.126 1.061-1.061 6.187 6.187z"></path></svg>',
    chevronDown: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/><path d="M0-.75h24v24H0z" fill="none"/></svg>',
    tick: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>' };


  // Get support Shopify features
  try {
    theme.Shopify.features = JSON.parse(document.documentElement.querySelector('#shopify-features').textContent);
  } catch (e) {
    theme.Shopify.features = {};
  }

  theme.namespaceFromSection = function (container) {
    return ['.', $(container).data('section-type'), $(container).data('section-id')].join('');
  };

  // Product Media
  theme.ProductMedia = new function () {
    var _ = this;

    _._setupShopifyXr = function () {
      if (!window.ShopifyXR) {
        document.addEventListener('shopify_xr_initialized', _._setupShopifyXr.bind(this));
        return;
      }

      window.ShopifyXR.addModels(JSON.parse($(this).html()));
      window.ShopifyXR.setupXRElements();
    };

    this.init = function (container, callbacks) {
      var callbacks = callbacks || {},
      _container = container;

      // necessary callbacks (before automatic behaviours)
      if (callbacks.onImageVisible) {
        $(container).on('mediaVisible', '.product-media--image', callbacks.onImageVisible);
      }

      if (callbacks.onImageHidden) {
        $(container).on('mediaHidden', '.product-media--image', callbacks.onImageHidden);
      }

      if (callbacks.onVideoVisible) {
        $(container).on('mediaVisible', '.product-media--video-loaded', callbacks.onVideoVisible);
      }

      if (callbacks.onVideoHidden) {
        $(container).on('mediaHidden', '.product-media--video-loaded', callbacks.onVideoHidden);
      }

      if (callbacks.onModelVisible) {
        $(container).on('mediaVisible', '.product-media--model-loaded', callbacks.onModelVisible);
      }

      $('model-viewer', container).each(function () {
        if (callbacks.onModelViewerPlay) {
          $(this).on('shopify_model_viewer_ui_toggle_play', callbacks.onModelViewerPlay);
        }
        if (callbacks.onModelViewerPause) {
          $(this).on('shopify_model_viewer_ui_toggle_pause', callbacks.onModelViewerPause);
        }
      });

      // when any media appears
      $(container).on('mediaVisible', '.product-media--video-loaded, .product-media--model-loaded', function () {
        // autoplay all media on larger screens
        if ($(window).width() >= 768) {
          $(this).data('player').play();
        }
        // update view-in-space
        if ($(this).hasClass('product-media--model')) {
          $('.view-in-space', _container).attr('data-shopify-model3d-id', $(this).data('model-id'));
        }
        // pause all other media
        $('.product-media').not(this).trigger('mediaHidden');
      });

      // when any media is hidden
      $(container).on('mediaHidden', '.product-media--video-loaded, .product-media--model-loaded', function () {
        // pause all media
        $(this).data('player').pause();
      });

      if (callbacks.onModelHidden) {
        $(container).on('mediaHidden', '.product-media--model-loaded', callbacks.onModelHidden);
      } // set up video media elements with a controller
      $(container).find('.product-media--video').each(function (index) {
        var enableLooping = $(this).data('enable-video-looping'),
        $currentMedia = $(this),
        element = $(this).find('iframe, video')[0];
        if (element.tagName === 'VIDEO') {
          // set up a controller for Plyr video
          window.Shopify.loadFeatures([
          {
            name: 'video-ui',
            version: '1.0',
            onLoad: function () {
              var playerObj = { playerType: 'html5', element: element };

              playerObj.play = function () {
                this.plyr.play();
              }.bind(playerObj);

              playerObj.pause = function () {
                this.plyr.pause();
              }.bind(playerObj);

              playerObj.destroy = function () {
                this.plyr.destroy();
              }.bind(playerObj);

              playerObj.plyr = new Shopify.Plyr(element, {
                controls: [
                'play',
                'progress',
                'mute',
                'volume',
                'play-large',
                'fullscreen'],

                loop: { active: enableLooping },
                hideControlsOnPause: true,
                iconUrl: '//cdn.shopify.com/shopifycloud/shopify-plyr/v1.0/shopify-plyr.svg',
                tooltips: { controls: false, seek: true } });

              $(this).data('player', playerObj).addClass('product-media--video-loaded');
              $currentMedia.find('.plyr__controls').addClass('swiper-no-swiping');

              // callbacks for Plyr playback
              $(element).on('playing', function () {
                // pause other media
                $('.product-media').not($currentMedia).trigger('mediaHidden');
                // prevent bubbling inputs that can be used by carousels
                $currentMedia.find('.plyr__controls').off('.themeMediaEventFix').
                on('keydown.themeMediaEventFix touchstart.themeMediaEventFix touchmove.themeMediaEventFix touchend.themeMediaEventFix mousedown.themeMediaEventFix mousemove.themeMediaEventFix mouseup.themeMediaEventFix', function (e) {
                  e.stopPropagation();
                });
                if (callbacks.onPlyrPlay) {
                  callbacks.onPlyrPlay(playerObj);
                }
              });
              $(element).on('pause ended', function () {
                // remove event bubbling interceptor
                $currentMedia.find('.plyr__controls').off('.themeMediaEventFix');
                if (callbacks.onPlyrPause) {
                  callbacks.onPlyrPause(playerObj);
                }
              });
              if (callbacks.onPlyrInit) {
                callbacks.onPlyrInit(playerObj);
              }
            }.bind(this) }]);


          theme.loadStyleOnce('https://cdn.shopify.com/shopifycloud/shopify-plyr/v1.0/shopify-plyr.css');

        } else if (element.tagName === 'IFRAME') {
          if (
          /^(https?:\/\/)?(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/.test(
          element.src))

          {
            // set up a controller for YouTube video
            var existingYTCB = window.onYouTubeIframeAPIReady;
            var loadYoutubeVideo = function () {
              var playerObj = { playerType: 'youtube', element: element };
              var videoId = $(this).data('video-id');

              playerObj.player = new YT.Player(element, {
                videoId: videoId,
                events: {
                  onStateChange: function onStateChange(event) {
                    if (event.data === YT.PlayerState.ENDED && enableLooping) {
                      event.target.seekTo(0);
                    }

                    if (event.data === YT.PlayerState.PLAYING) {
                      $('.product-media').not($currentMedia).trigger('mediaHidden');
                      if (callbacks.onYouTubePlay) {
                        callbacks.onYouTubePlay(playerObj);
                      }
                    }

                    if (event.data === YT.PlayerState.PAUSED && event.data === YT.PlayerState.ENDED) {
                      if (callbacks.onYouTubePause) {
                        callbacks.onYouTubePause(playerObj);
                      }
                    }
                  } } });



              playerObj.play = function () {
                this.player.playVideo();
              }.bind(playerObj);

              playerObj.pause = function () {
                this.player.pauseVideo();
              }.bind(playerObj);

              playerObj.destroy = function () {
                this.player.destroy();
              }.bind(playerObj);

              $(this).data('player', playerObj).addClass('product-media--video-loaded');

              if (callbacks.onYouTubeInit) {
                callbacks.onYouTubeInit(playerObj);
              }
            }.bind(this);
            window.onYouTubeIframeAPIReady = function () {
              if (existingYTCB) {
                existingYTCB();
              }
              loadYoutubeVideo();
            };
            theme.loadScriptOnce('https://www.youtube.com/iframe_api');
          }
        }
      });

      // set up a 3d model when it first appears
      $(container).on('mediaVisible mediaVisibleInitial', '.product-media--model:not(.product-media--model-loaded):not(.product-media--model-loading)', function (e) {
        var element = $(this).find('model-viewer')[0],
        $currentMedia = $(this),
        autoplay = e.type != 'mediaVisibleInitial';
        // do not run this twice
        $(this).addClass('product-media--model-loading');
        // load viewer
        theme.loadStyleOnce('https://cdn.shopify.com/shopifycloud/model-viewer-ui/assets/v1.0/model-viewer-ui.css');
        window.Shopify.loadFeatures([
        {
          name: 'model-viewer-ui',
          version: '1.0',
          onLoad: function (evt) {
            $(this).data('player', new Shopify.ModelViewerUI(element));
            // add mouseup event proxy to fix carousel swipe gestures
            $('<div class="theme-event-proxy">').on('mouseup', function (e) {
              e.stopPropagation();
              e.preventDefault();
              var newEventTarget = $(e.currentTarget).closest('.product-media')[0];
              newEventTarget.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            }).appendTo(
            $(this).find('.shopify-model-viewer-ui__controls-overlay'));

            // when playing or loading, prevent bubbling of down/up/move
            $(this).find('model-viewer').on('shopify_model_viewer_ui_toggle_play', function () {
              $(this).closest('.shopify-model-viewer-ui').on('keydown.themeMediaEventFix touchstart.themeMediaEventFix touchmove.themeMediaEventFix touchend.themeMediaEventFix mousedown.themeMediaEventFix mousemove.themeMediaEventFix mouseup.themeMediaEventFix', function (e) {
                e.stopPropagation();
              });
            }).on('shopify_model_viewer_ui_toggle_pause', function () {
              $(this).closest('.shopify-model-viewer-ui').off('.themeMediaEventFix');
            });
            // ensure play exclusivity
            $(this).find('model-viewer').on('shopify_model_viewer_ui_toggle_play', function () {
              $('.product-media').not($currentMedia).trigger('mediaHidden');
            });
            // set class and re-trigger visible event now loaded
            $(this).addClass('product-media--model-loaded').removeClass('product-media--model-loading');
            if (callbacks.onModelViewerInit) {
              callbacks.onModelViewerInit(element);
            }
            if (autoplay) {
              $(this).trigger('mediaVisible');
            }
          }.bind(this) }]);


      });

      // load AR viewer
      if ($('.model-json', container).length) {
        window.Shopify.loadFeatures([
        {
          name: 'shopify-xr',
          version: '1.0',
          onLoad: _._setupShopifyXr.bind($('.model-json', container)) }]);


      }

      // pause video when a 3d model is launched in AR
      $(document).on('shopify_xr_launch', function () {
        $('.product-media--video-loaded').each(function () {
          $(this).data('player').pause();
        });
      });

      // 3d model in first place - start in paused mode
      setTimeout(function () {
        $('.product-media:first', this).filter('.product-media--model').trigger('mediaVisibleInitial');
      }.bind(container), 50);
    };

    this.destroy = function (container) {
      $(document).off('shopify_xr_launch');
      $(container).off('mediaVisible mediaVisibleInitial mediaHidden');
      $('.product-media--video-loaded, .product-media--model-loaded', container).each(function () {
        $(this).data('player').destroy();
      });
      $('.product-media--video video', container).off('playing pause ended');
      $('model-viewer', container).off('shopify_model_viewer_ui_toggle_play shopify_model_viewer_ui_toggle_pause');
    };
  }();

  theme.applyAjaxToProductForm = function ($form) {
    var shopifyAjaxAddURL = theme.routes.cart_add_url + '.js';
    var shopifyAjaxStorePageURL = theme.routes.cart_url;
    $form.find('form[data-ajax="true"].product-purchase-form').on('submit', function (evt) {
      evt.preventDefault();

      var $form = $(this);
      //Disable add button
      $form.find('button[type="submit"]').attr('disabled', 'disabled').html(theme.strings.products_product_adding_to_cart);

      // Add to cart
      $.post(shopifyAjaxAddURL, $form.serialize(), function (data) {
        // Enable add button
        var $btn = $form.find('button[type="submit"]').removeAttr('disabled');

        // Show added message
        $btn.html(theme.icons.tick + ' ' + theme.strings.products_product_added_to_cart);

        // Back to default button text
        setTimeout(function () {
          $btn.html(theme.strings.products_product_add_to_cart);
        }, 3000);

        // Added, show CTA
        if ($btn.next('.added-cta').length == 0) {
          var $cta = $('<a></a>').attr('href', theme.routes.cart_url);
          $cta.append($('<span class="beside-img">').html(theme.strings.products_product_added_cta));
          $cta.append(' ').append(theme.icons.chevronRight);
          $cta = $cta.wrap('<div class="added-cta">').parent().hide().insertAfter($btn);
          $cta.slideDown(500, function () {
            $(this).addClass('show');
            // resize lightbox, if in quick-buy
            if ($btn.closest('#fancybox-content').length) {
              $.fancybox.resize();
            }
          });
        }

        // Dispatch change event
        document.documentElement.dispatchEvent(
        new CustomEvent('theme:cartchanged', { bubbles: true, cancelable: false }));

      }, 'text').fail(function (data) {
        // Enable add button
        $form.find('button[type="submit"]').removeAttr('disabled').html(theme.strings.products_product_add_to_cart);

        // Not added, show message
        if (typeof data != 'undefined' && typeof data.status != 'undefined') {
          var jsonRes = $.parseJSON(data.responseText);
          theme.showQuickPopup(jsonRes.description, $form.find('button[type="submit"]:first'));
        } else {
          //Some unknown error? Disable ajax and add the old-fashioned way.
          $form.addClass('noAJAX');
          $form.submit();
        }
      });
    });
  };

  theme.removeAjaxFromProductForm = function ($form) {
    $form.find('form[data-ajax="true"].product-purchase-form').off('submit');
  };

  theme.loadClickyboxOptions = function (container) {
    // show box-style options
    var $form = $('.product-form', container);
    var $clickies = $('[data-make-box]', container).addClass('has-clickyboxes').find('select').clickyBoxes();

    // If we have clicky boxes, add the disabled-state to options that have no valid variants
    if ($clickies.length > 0) {
      var productData = theme.OptionManager.getProductData($form);

      // each option
      for (var optionIndex = 0; optionIndex < productData.options.length; optionIndex++) {
        // list each value for this option
        var optionValues = {};
        for (var variantIndex = 0; variantIndex < productData.variants.length; variantIndex++) {
          var variant = productData.variants[variantIndex];
          if (typeof optionValues[variant.options[optionIndex]] === 'undefined') {
            optionValues[variant.options[optionIndex]] = false;
          }
          // mark true if an option is available
          if (variant.available) {
            optionValues[variant.options[optionIndex]] = true;
          }
        }
        // mark any completely unavailable options
        for (var key in optionValues) {
          if (!optionValues[key]) {
            $('.selector-wrapper:eq(' + optionIndex + ') .clickyboxes li a', $form).filter(function () {
              return $(this).attr('data-value') == key;
            }).addClass('unavailable');
          }
        }
      }
    }
  };

  theme.unloadClickyboxOptions = function (container) {
    $('.selector-wrapper select.clickybox-replaced', container).clickyBoxes('destroy');
  };

  theme.FeaturedProduct = new function () {
    this.onSectionLoad = function (container) {
      // gallery
      $('.product-gallery', container).trigger('initProductGallery');

      // product options
      theme.OptionManager.initProductOptions($('.product-form', container));

      // boxed variant style
      theme.loadClickyboxOptions(container);
    };

    this.onSectionUnload = function (container) {
      $('.product-gallery', container).trigger('destroyProductGallery');
      theme.OptionManager.unloadProductOptions($('.product-form', container));
      theme.unloadClickyboxOptions(container);
    };
  }();

  theme.SlideshowSection = new function () {
    this.onSectionLoad = function (container) {
      this.namespace = theme.namespaceFromSection(container);
      this.$container = $(container);

      $('.slideshow', container).each(function () {
        var transition = $(this).data('slideshow-transition');
        $(this).on('init', function () {
          $('.lazyload--manual', this).removeClass('.lazyload--manual').addClass('lazyload');
          $('.slick-cloned', this).removeClass('slick-slide--transition-enable slick-slide--transition-start');
        }).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
          // disable transitions
          var $nextSlide = $(slick.$slides[nextSlide]);
          $nextSlide.removeClass('slick-slide--transition-enable slick-slide--transition-start');
          if (nextSlide == currentSlide + 1 || nextSlide === 0 && currentSlide == slick.slideCount - 1) {
            $(this).addClass('slick--transition-right').removeClass('slick--transition-left');
          } else {
            $(this).addClass('slick--transition-left').removeClass('slick--transition-right');
          }
          var isToClone = false;
          if (nextSlide === 0 && currentSlide !== 2 || nextSlide === slick.slideCount - 1 && currentSlide === 0) {
            isToClone = true;
          }
          setTimeout(
          function () {
            this.addClass('slick-slide--transition-enable');
            setTimeout(function () {
              this.addClass('slick-slide--transition-start');
            }.bind(this), 20);
          }.bind($(slick.$slides[nextSlide])),
          Math.max(0, isToClone ? slick.options.speed : slick.options.speed - 150));

        }).on('afterChange', function (event, slick, currentSlide) {
          $(slick.$slides[currentSlide]).siblings().removeClass('slick-slide--transition-enable slick-slide--transition-start');
        }).slick({
          autoplay: $(this).hasClass('auto-play'),
          fade: transition == 'fade',
          speed: transition == 'instant' ? 0 : 500,
          infinite: true,
          useTransform: true,
          prevArrow: '<button type="button" class="slick-prev" aria-label="' + theme.strings.previous + '">' + theme.icons.chevronLeft + '</button>',
          nextArrow: '<button type="button" class="slick-next" aria-label="' + theme.strings.next + '">' + theme.icons.chevronRight + '</button>',
          responsive: [
          {
            breakpoint: 768,
            settings: {
              fade: false,
              arrows: false,
              dots: true } }],



          autoplaySpeed: parseInt($(this).data('slideshow-interval')) });

      });

      if ($(container).find('.height--full').length) {
        this.isFirstSection = this.$container.closest('.shopify-section').index() === 0;

        this.functions.assessFullHeightItems.call(this);
        $(window).on('debouncedresize' + this.namespace, this.functions.assessFullHeightItems.bind(this));
      }
    };

    this.onSectionUnload = function (container) {
      $('.slick-slider', container).off('setPosition init').slick('unslick');
      $(window).off(this.namespace);
    };

    this.onBlockSelect = function (container) {
      $(container).closest('.slick-slider').
      slick('slickGoTo', $(container).data('slick-index')).
      slick('slickPause');
    };

    this.onBlockDeselect = function (container) {
      $(container).closest('.slick-slider').slick('slickPlay');
    };

    this.functions = {
      assessFullHeightItems: function assessFullHeightItems() {
        var headerOffset = 0,
        $pageHeader = $('.page-header');
        if (this.isFirstSection || $pageHeader.css('position') == 'fixed') {
          headerOffset += $pageHeader.outerHeight();
        }
        this.$container.find('.height--full').css('height', 'calc(100vh - ' + headerOffset + 'px)');
      } };

  }();

  theme.GallerySection = new function () {
    this.onSectionLoad = function (container) {
      this.$container = $(container);
      this.namespace = theme.namespaceFromSection(container);

      var $carouselGallery = $('.gallery--mobile-carousel', container);
      if ($carouselGallery.length) {
        var assessCarouselFunction = function assessCarouselFunction() {
          var isCarousel = $carouselGallery.hasClass('slick-slider'),
          shouldShowCarousel = $(window).width() < 768;

          if (!shouldShowCarousel) {
            $('.lazyload--manual', $carouselGallery).removeClass('lazyload--manual').addClass('lazyload');
          }

          if (isCarousel && !shouldShowCarousel) {
            // Destroy carousel

            // - unload slick
            $carouselGallery.slick('unslick').off('init');
            $carouselGallery.find('a, .gallery__item').removeAttr('tabindex').removeAttr('role');
            $carouselGallery.find('.slick-slide--transition-enable').removeClass('slick-slide--transition-enable');
            $carouselGallery.find('.slick-slide--transition-start').removeClass('slick-slide--transition-start');
            $carouselGallery.removeClass('slick--overlay-transitions slick-slider--overlay-dots slick--transition-left slick--transition-right');

            // - re-row items
            var rowLimit = $carouselGallery.data('grid');
            var $currentRow = null;
            $carouselGallery.find('.gallery__item').each(function (index) {
              if (index % rowLimit === 0) {
                $currentRow = $('<div class="gallery__row">').appendTo($carouselGallery);
              }
              $(this).appendTo($currentRow);
            });
          } else if (!isCarousel && shouldShowCarousel) {
            // Create carousel

            // - de-row items
            $carouselGallery.find('.gallery__item').appendTo($carouselGallery);
            $carouselGallery.find('.gallery__row').remove();

            // - init carousel
            $carouselGallery.addClass('slick--overlay-transitions slick-slider--overlay-dots').on('init', function () {
              $('.lazyload--manual', this).removeClass('.lazyload--manual').addClass('lazyload');
              $('.gallery__item-1', this).addClass('slick-slide--transition-enable slick-slide--transition-start');
              $('.slick-cloned', this).removeClass('slick-slide--transition-enable slick-slide--transition-start');
            }).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
              // disable transitions
              var $nextSlide = $(slick.$slides[nextSlide]);
              $nextSlide.removeClass('slick-slide--transition-enable slick-slide--transition-start');
              if (nextSlide == currentSlide + 1 || nextSlide === 0 && currentSlide == slick.slideCount - 1) {
                $(this).addClass('slick--transition-right').removeClass('slick--transition-left');
              } else {
                $(this).addClass('slick--transition-left').removeClass('slick--transition-right');
              }
              var isToClone = false;
              if (nextSlide === 0 && currentSlide !== 2 || nextSlide === slick.slideCount - 1 && currentSlide === 0) {
                isToClone = true;
              }
              setTimeout(
              function () {
                this.addClass('slick-slide--transition-enable');
                setTimeout(function () {
                  this.addClass('slick-slide--transition-start');
                }.bind(this), 20);
              }.bind($(slick.$slides[nextSlide])),
              Math.max(0, isToClone ? slick.options.speed : slick.options.speed - 150));

            }).on('afterChange', function (event, slick, currentSlide) {
              $(slick.$slides[currentSlide]).siblings().removeClass('slick-slide--transition-enable slick-slide--transition-start');
            }).slick({
              autoplay: false,
              fade: false,
              speed: 500,
              infinite: true,
              useTransform: true,
              arrows: false,
              dots: true });

          }
        };

        assessCarouselFunction();
        $(window).on('debouncedresize.themeSection' + this.namespace, assessCarouselFunction);
      }

      this.functions.setHiddenHeights.call(this);
      $(window).on('debouncedresize.themeSection' + this.namespace, this.functions.setHiddenHeights.bind(this));
    };

    this.onSectionUnload = function (container) {
      $(window).off('.themeSection' + this.namespace);
      $('.slick-slider', container).each(function () {
        $(this).slick('unslick').off('init');
      });
    };

    this.onBlockSelect = function (block) {
      var blockSlideIndex = $(block).data('slick-index');
      $(block).closest('.slick-slider').each(function () {
        $(this).slick('slickGoTo', blockSlideIndex);
      });
    };

    this.functions = {
      setHiddenHeights: function setHiddenHeights() {
        $('.overlay--v-bottom .gallery__transition-el__inner', this.$container).each(function () {
          $(this).closest('.overlay-text__inner').css('transform', 'translateY(-' + $(this).height() + 'px)');
        });
        $('.overlay--v-center .gallery__transition-el__inner', this.$container).each(function () {
          $(this).closest('.overlay-text__inner').css('transform', 'translateY(-' + Math.round($(this).height() / 2) + 'px)');
        });
      } };

  }();

  theme.HeaderSection = new function () {
    this.onSectionLoad = function (container) {
      // Never allow the home page to be active
      $('.mainnav .tier1 .expanded > a').filter(function () {
        return $(this).attr('href').length < 6 && $(this).attr('href') != '#'; // assume home page url will not be longer than "/fr/"
      }).parents('li.expanded').removeClass('expanded');

      // Only allow one expanded menu
      $('.mainnav .tier1 > ul > li.expanded:first').nextAll('.expanded').removeClass('expanded').find('.expanded').removeClass('expanded');

      // Expand sidebar nav on page load
      $('.mainnav .tier1 > ul > li.expanded:first > a').each(function () {
        var $tier1 = $(this).closest('.tier1');
        // only show if inside-mode
        if ($('#navbar').hasClass('nav-style-in')) {
          $tier1.addClass('removetrans showback');
          $(this).click();
        }
        setTimeout(function () {
          $tier1.removeClass('removetrans');
        }, 10);
      });

      // ensure top edge of nav is correct
      this.functions.assessHeaderHeight();
      $(window).on('load debouncedresize', this.functions.assessHeaderHeight);

      if (theme.settings.enable_live_search) {
        // live/predictive search
        var $resultsBox = $('.quick-search__results', container);
        if ($resultsBox.length) {
          var searchTimeoutThrottle = 500,
          searchTimeoutID = -1,
          currReqObj = null,
          $resultItemsBox = $('.quick-search__results-items', container),
          includeMeta = $resultsBox.data('live-search-meta');

          var productBlockQv = "";

          if (theme.settings.prod_block_qv) {
            productBlockQv = [
            '<div class="quick-buy-row">',
            '<a href="<%= url %>" class="quick-buy button button--slim">', theme.strings.productListingQuickView, '</a>',
            '</div>'].
            join('');
          }

          var pageResultTemplate = [
          '<div class="block text size-large">',
          '<div class="main">',
          '<%= image %>',
          '<h2 class="search-result-title"><%= title %></h2>',
          '<p class="search-result-description"><%= content %></p>',
          '</div>',
          '<div class="sub">',
          '<a class="cta-link" href="<%= url %>">', theme.strings.searchReadMore, '</a>',
          '</div>',
          '</div>'].
          join('');
          var pageResultImageTemplate = '<p class="image"><a href="<%= url %>"><img src="<%= src %>" alt="" role="presentation"></a></p>';

          var productResultTemplate = [
          '<div class="block product size-medium">',
          '<div class="main">',
          '<a class="img-link" href="<%= url %>">',
          '<%= image %>',
          '</a>' +
          productBlockQv,
          '</div>',
          '<div class="sub">',

          $resultsBox.data('show-vendor') ?
          [
          '<div class="product-vendor">',
          '<%= vendor %>',
          '</div>'].
          join('') : '',

          '<a class="product-block-title" href="<%= url %>"><%= title %></a>',

          $resultsBox.data('show-price') ?
          [
          '<div class="pricearea">',
          '<%= price %>',
          '</div>'].
          join('') : '',

          '</div>' +
          '</div>'].
          join('');

          $(container).on('keyup change', '.quick-search__input', function () {
            //Only search if search string longer than 2, and it has changed
            if ($(this).val().length > 2 && $(this).val() != $(this).data('oldval')) {
              //Reset previous value
              $(this).data('oldval', $(this).val());

              // Kill outstanding ajax request
              if (currReqObj != null) currReqObj.abort();

              // Kill previous search
              clearTimeout(searchTimeoutID);

              var $form = $(this).closest('form');

              //URL for full search page
              var linkURL = $form.attr('action') + ($form.attr('action').indexOf('?') >= 0 ? '&' : '?') + $form.serialize();

              //Show loading
              $resultsBox.addClass('quick-search__results--loading');

              // Do next search (in X milliseconds)
              searchTimeoutID = setTimeout(function () {
                var ajaxUrl, ajaxData;
                if (theme.Shopify.features.predictiveSearch) {
                  // use the API
                  ajaxUrl = theme.routes.search_url + '/suggest.json';
                  ajaxData = {
                    "q": $form.find('input[name="q"]').val(),
                    "resources": {
                      "type": $form.find('input[name="type"]').val(),
                      "limit": 8,
                      "options": {
                        "unavailable_products": "last",
                        "fields": includeMeta ? "title,product_type,variants.title,vendor,tag,variants.sku" : "title,product_type,variants.title,vendor" } } };



                } else {
                  // use the theme template fallback
                  ajaxUrl = linkURL + '&view=data';
                  ajaxData = null;
                }
                currReqObj = $.ajax({
                  url: ajaxUrl,
                  data: ajaxData,
                  dataType: 'json',
                  success: function success(response) {
                    currReqObj = null;
                    $resultsBox.removeClass('quick-search__results--loading');
                    var $results = $('<div class="quick-search__results-items-inner">');

                    if (response.resources.results.products) {
                      for (var i = 0; i < response.resources.results.products.length; i++) {
                        var result = response.resources.results.products[i];
                        var priceHtml = '';
                        var imageHtml = '';

                        if (result.image) {
                          imageHtml = [
                          '<div class="product-image">',
                          '<div class="product-image__primary rimage-wrapper rimage-wrapper--natural-size lazyload--placeholder">',
                          '<img class="rimage__image lazyload fade-in" data-src="',
                          theme.Shopify.formatImage(result.image, '350x'),
                          '" alt="" role="presention"/>',
                          '</div>',
                          '</div>'].
                          join('');
                        }

                        if (result.price_max != result.price_min) {
                          priceHtml += '<span class="product-price__from">' + theme.strings.productsListingFrom + '</span> ';
                        }

                        if (parseFloat(result.compare_at_price_min) > parseFloat(result.price_min)) {
                          priceHtml += [
                          '<span class="product-price__amount product-price__amount--on-sale theme-money">',
                          theme.Shopify.formatMoney(result.price_min, theme.money_format_with_product_code_preference),
                          '</span> ',
                          '<span class="product-price__compare theme-money">',
                          theme.Shopify.formatMoney(result.compare_at_price_min, theme.money_format),
                          '</span>'].
                          join('');
                        } else {
                          priceHtml += '<span class="product-price__amount theme-money">' + theme.Shopify.formatMoney(result.price_min, theme.money_format_with_product_code_preference) + '</span>';
                        }

                        $results.append(
                        productResultTemplate.replace('<%= image %>', imageHtml).
                        replace('<%= title %>', result.title).
                        replace('<%= vendor %>', result.vendor).
                        replace('<%= price %>', priceHtml).
                        replace(/<%= url %>/g, result.url).
                        replace('<%= id %>', result.id));

                      }
                    }

                    if (response.resources.results.pages) {
                      for (var i = 0; i < response.resources.results.pages.length; i++) {
                        var result = response.resources.results.pages[i];
                        $results.append(
                        pageResultTemplate.replace('<%= image %>', '').
                        replace('<%= title %>', result.title).
                        replace('<%= content %>', 'CONTENT').
                        replace('<%= url %>', result.url));

                      }
                    }

                    if (response.resources.results.articles) {
                      for (var i = 0; i < response.resources.results.articles.length; i++) {
                        var result = response.resources.results.articles[i];
                        var image;
                        if (result.image) {
                          image = pageResultImageTemplate.
                          replace('<%= src %>', theme.Shopify.formatImage(result.image, '400x')).
                          replace('<%= url %>', result.url);
                        } else {
                          image = '';
                        }

                        $results.append(
                        pageResultTemplate.replace('<%= image %>', image).
                        replace('<%= title %>', result.title).
                        replace('<%= content %>', 'CONTENT').
                        replace('<%= url %>', result.url));

                      }
                    }

                    if ($results.children().length == 0) {
                      // No results
                      $resultsBox.removeClass('quick-search__results--populated').addClass('quick-search__results--empty');
                      $resultItemsBox.empty();
                    } else {
                      // Numerous results
                      $resultsBox.removeClass('quick-search__results--empty').addClass('quick-search__results--populated');
                      $results.find('.block').append([
                      '<a href="', linkURL, '" class="quick-search__show-all cta-link-hover-parent">',
                      '<span class="quick-search__show-all-text">',
                      '<span class="quick-search__show-all-text cta-link">',
                      theme.strings.liveSearchSeeAll,
                      '</span>',
                      '</span>',
                      '</a>'].join(''));
                      $resultItemsBox.empty().append($results);
                      // visibility
                      var numToShow = Math.floor($(window).width() / $resultsBox.data('result-width'));
                      var blockMarginLeft = parseInt($results.find('.block:first').css('margin-left'));
                      $results.find('.block').css('width', 'calc(' + 100 / numToShow + '% - ' + blockMarginLeft + 'px)').each(function (index) {
                        if (index == numToShow - 1) {
                          $(this).addClass('block-result--more');
                        } else if (index >= numToShow) {
                          $(this).addClass('block-result--hide');
                        }
                      });
                    }
                  } });

              }, searchTimeoutThrottle);
            } else if ($(this).val().length <= 2) {
              //Deleted text? Clear results
              $resultsBox.removeClass('quick-search__results--loading quick-search__results--populated');
              $resultItemsBox.empty();
            }
          });
        }
      }

      $(container).on('click', '.search, .quick-search__close, .quick-search-close-mask', function () {
        clearTimeout(theme.liveSearchHeaderClassTimeoutId);
        if ($('body').toggleClass('show-quick-search').hasClass('show-quick-search')) {
          $(this).closest('.page-header').find('.quick-search').find('input:first').focus();
          $('body').addClass('page-header-above-mask');
        } else {
          theme.liveSearchHeaderClassTimeoutId = setTimeout(function () {
            $('body').removeClass('page-header-above-mask');
          }, 500);
        }
        return false;
      });

      // Touch events for fly-out nav
      if ($('.nav-style-out', container).length) {
        var $body = $('body');
        $(container).on('touchstart touchend click', '.tier1title[aria-haspopup="true"]', function (evt) {
          if (!$body.hasClass('show-nav-mobile')) {
            if (evt.type == 'touchstart') {
              $(this).data('touchstartedAt', evt.timeStamp);
            } else if (evt.type == 'touchend') {
              // down & up in under a second - presume tap
              if (evt.timeStamp - $(this).data('touchstartedAt') < 1000) {
                $(this).data('touchOpenTriggeredAt', evt.timeStamp);
                if ($(this).parent().hasClass('outside-expanded')) {
                  // trigger close
                  $(this).parent().trigger('mouseleave');
                } else {
                  // trigger close on any open items
                  $('.outside-expanded').trigger('mouseleave');
                  // trigger open
                  $(this).parent().trigger('mouseenter');
                }
                // prevent fake click
                return false;
              }
            } else if (evt.type == 'click') {
              // if touch open was triggered very recently, prevent click event
              if ($(this).data('touchOpenTriggeredAt') && evt.timeStamp - $(this).data('touchOpenTriggeredAt') < 1000) {
                return false;
              }
            }
          }
        });
      }

      $('.disclosure', container).each(function () {
        $(this).data('disclosure', new theme.Disclosure($(this)));
      });

      // listen to cart changes
      $(document).on('theme:cartchanged.headerSection', function () {
        $.get(theme.routes.search_url, function (data) {
          var $parsedData = $('<div>' + data + '</div>');
          var cartSummarySelectors = ['.page-header .cartsummary'];
          for (var i = 0; i < cartSummarySelectors.length; i++) {
            var $newCartObj = $parsedData.find(cartSummarySelectors[i]).first();
            var $currCart = $(cartSummarySelectors[i]);
            $currCart.html($newCartObj.html());
          }
        });
      });
    };

    // set navbar 'top' value based on screen size and header position
    this.functions = {
      assessHeaderHeight: function assessHeaderHeight() {
        var $header = $('.page-header'),
        navBarTop = '',
        contentTop = '';
        if ($header.length && $header.css('position') == 'fixed') {
          var headerHeight = $header.outerHeight();
          contentTop = headerHeight;
          if ($header.hasClass('page-header--full-width')) {
            navBarTop = headerHeight;
          }
        }

        $('#navbar').css('top', navBarTop);
        $('#content').css('padding-top', contentTop);
      } };


    this.onSectionUnload = function (container) {
      $(container).off('click keyup change submit touchstart touchend');
      $(document).off('.headerSection');
      $(window).off('load debouncedresize', this.functions.assessHeaderHeight);
      $('.disclosure', container).each(function () {
        $(this).data('disclosure').unload();
      });
    };
  }();

  theme.FooterSection = new function () {
    this.onSectionLoad = function (container) {
      if ($('.nav-column__title', container).length) {
        $(container).on('click', '.nav-column__title .button', function () {
          $(this).closest('.page-footer__column').toggleClass('open');
        });
      }

      $('.disclosure', container).each(function () {
        $(this).data('disclosure', new theme.Disclosure($(this)));
      });
    };

    this.onSectionUnload = function (container) {
      $(container).off('click');
      $('.disclosure', container).each(function () {
        $(this).data('disclosure').unload();
      });
    };
  }();

  theme.ProductTemplateSection = new function () {
    this.onSectionLoad = function (container) {
      /// Init store availability if applicable
      if ($('[data-store-availability-container]', container).length) {
        this.storeAvailability = new theme.StoreAvailability($('[data-store-availability-container]', container)[0]);
      }

      // reviews link
      $('.themed-product-reviews', container).on('click', function () {
        $('html, body').animate({ scrollTop: $('#shopify-product-reviews').offset().top - 50 }, 1000);
      });

      // gallery
      $('.product-gallery', container).trigger('initProductGallery');

      // product options
      theme.OptionManager.initProductOptions($('.product-form', container));

      // boxed variant style
      theme.loadClickyboxOptions(container);

      // related products layout
      $(document).trigger('loadmasonry');
    };

    this.onSectionUnload = function (container) {
      $('.product-gallery', container).trigger('destroyProductGallery');
      theme.OptionManager.unloadProductOptions($('.product-form', container));
      $('.blocklayout', container).masonry('destroy');
      $('.themed-product-reviews', container).off('click');
      theme.unloadClickyboxOptions(container);
      if (this.storeAvailability) {
        this.storeAvailability.onSectionUnload();
      }
    };
  }();

  theme.CollectionTemplateSection = new function () {
    this.onSectionLoad = function (container) {
      // Masonry layout
      $(document).trigger('loadmasonry');

      $(document).on('filters-applied', function () {
        $(window).off('scroll.infiniscroll');
        this.functions.initInfiniteScroll(container);
      }.bind(this));

      this.functions.initInfiniteScroll(container);
    };

    this.onSectionUnload = function (container) {
      $('.blocklayout', container).masonry('destroy');
      $(window).off('scroll.infiniscroll');
    };

    this.functions = {
      initInfiniteScroll: function initInfiniteScroll(container) {
        if ($('.pagination:not(.init-infiniscroll)', container).length == 1 &&
        $('.pagination:not(.init-infiniscroll) a.next', container).length > 0 &&
        $('.do-infinite', container).length == 1) {
          var $pager = $('.pagination', container).addClass('init-infiniscroll'),
          $productGrid = $pager.closest('.pagination-row').prev(),
          $moreBtn = $('<a href="' + $pager.find('a.next').attr('href') + '" class="infiniscroll" />').html(theme.strings.products_listing_more_products);

          $pager.empty().append($moreBtn);

          // Click to show more
          $pager.on('click', 'a.infiniscroll:not(.loading)', function () {
            $moreBtn.addClass('loading').html(theme.strings.products_listing_loading);
            $.get($pager.find('a').attr('href'), function (data) {
              var $data = $($.parseHTML(data));
              // isolate and hide new blocks
              var $newbies = $data.find('.do-infinite .block:not(.no-inf)');
              if ($newbies.length) {
                $newbies.addClass('initially-hidden');
                // Add & reveal
                if ($productGrid.hasClass('blocklayout')) {
                  theme.MasonryManager.appendItems($newbies, $productGrid);
                } else {
                  $newbies.insertAfter($productGrid.find('.block:not(.block--flex-placeholder):last'));
                }
                $newbies.removeClass('initially-hidden');
              }

              // Any more?
              var $next = $data.find('.pagination a.next');
              if ($next.length == 0) {
                //We are out of products
                $pager.html('<span class="infiniscroll no-more">' + theme.strings.products_listing_no_more_products + '</span>').fadeOut(5000);
              } else {
                //More to show
                $moreBtn.attr('href', $next.attr('href')).removeClass('loading').html(theme.strings.products_listing_more_products);
              }
            });
            return false;
          });

          // Scroll event to trigger click
          $(window).on('scroll.infiniscroll', function () {
            var $pager = $('.pagination.init-infiniscroll');
            if ($pager.length && $(window).scrollTop() + $(window).height() > $pager.offset().top) {
              $pager.find('a').trigger('click');
            }
          });
        }
      } };

  }();

  theme.CartTemplateSection = new function () {
    this.onSectionLoad = function (container) {
      theme.cartNoteMonitor.load($('#cartform [name="note"]', container));

      // listen to cart changes
      $(document).on('theme:cartchanged.cartSection', function () {
        $.get(theme.routes.cart_url, function (data) {
          var $parsedData = $('<div>' + data + '</div>');
          var cartSummarySelectors = ['[data-section-type="cart-template"]'];
          for (var i = 0; i < cartSummarySelectors.length; i++) {
            var $newCartObj = $parsedData.find(cartSummarySelectors[i]).first();
            var $currCart = $(cartSummarySelectors[i]);

            // rebuild cart section
            $currCart[0].dispatchEvent(
            new CustomEvent('shopify:section:unload', { bubbles: true, cancelable: false }));


            $currCart.html($newCartObj.html());

            $currCart[0].dispatchEvent(
            new CustomEvent('shopify:section:load', { bubbles: true, cancelable: false }));

          }
        });
      });
    };

    this.onSectionUnload = function (container) {
      theme.cartNoteMonitor.unload($('#cartform [name="note"]', container));
      $(document).off('.cartSection');
    };
  }();

  theme.FeaturedCollectionSection = new function () {
    this.onSectionLoad = function (container) {
      this.namespace = theme.namespaceFromSection(container);
      this.container = container;

      if (container.querySelector('.blocklayout')) {
        $(document).trigger('loadmasonry');
      } else {
        this.blockContainer = container.querySelector('.fixedlayout');
        if (this.blockContainer.dataset.rowLimit) {
          this.functions.checkFixedLayoutRowCap.call(this);
          $(window).on('debouncedresize' + this.namespace, this.functions.checkFixedLayoutRowCap.bind(this));
        }
      }
    };

    this.onSectionUnload = function (container) {
      if (container.querySelector('.blocklayout')) {
        $('.blocklayout', container).masonry('destroy');
      } else {
        $(window).off(this.namespace);
      }
    };

    this.functions = {
      checkFixedLayoutRowCap: function checkFixedLayoutRowCap() {
        var rowLimit = this.blockContainer.dataset.rowLimit,
        blockWidth = Math.floor($(this.blockContainer.querySelector('.block')).outerWidth(true)),
        blockLimit = Math.floor($(this.blockContainer).width() / blockWidth) * rowLimit;
        $(this.blockContainer).children().each(function (index) {
          $(this).toggleClass('hidden', index >= blockLimit);
        });
      } };

  }();

  theme.MasonrySection = new function () {
    this.onSectionLoad = function () {
      $(document).trigger('loadmasonry');
    };

    this.onSectionUnload = function (container) {
      $('.blocklayout', container).masonry('destroy');
    };
  }();

  // Manage option dropdowns
  theme.productData = {};
  theme.OptionManager = new function () {
    var _ = this;

    _._getVariantOptionElement = function (variant, $container) {
      return $container.find('select[name="id"] option[value="' + variant.id + '"]');
    };

    _.selectors = {
      container: '.product-container',
      gallery: '.product-gallery',
      priceArea: '.pricearea',
      variantIdInputs: '[name="id"]',
      submitButton: 'input[type=submit], button[type=submit]',
      multiOption: '.option-selectors',
      installmentsFormSuffix: '-installments' };


    _.strings = {
      priceNonExistent: theme.strings.products_variant_non_existent,
      unitPriceSeparator: theme.strings.products_product_unit_price_separator,
      buttonDefault: theme.strings.products_product_add_to_cart,
      buttonNoStock: theme.strings.products_variant_out_of_stock,
      buttonNoVariant: theme.strings.products_variant_non_existent,
      inventoryNotice: theme.strings.onlyXLeft };


    _._getString = function (key, variant) {
      var string = _.strings[key];
      if (variant) {
        string = string.replace('[PRICE]', '<span class="theme-money">' + theme.Shopify.formatMoney(variant.price, theme.money_format_with_product_code_preference) + '</span>');
      }
      return string;
    };

    _.getProductData = function ($form) {
      var productId = $form.data('product-id');
      var data = null;
      if (!theme.productData[productId]) {
        theme.productData[productId] = JSON.parse(document.getElementById('ProductJson-' + productId).innerHTML);
      }
      data = theme.productData[productId];
      if (!data) {
        console.log('Product data missing (id: ' + $form.data('product-id') + ')');
      }
      return data;
    };

    _.addVariantUrlToHistory = function (variant) {
      if (variant) {
        var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
        window.history.replaceState({ path: newurl }, '', newurl);
      }
    };

    _.updateSku = function (variant, $container) {
      $container.find('.sku .sku__value').html(variant ? variant.sku : '');
      $container.find('.sku').toggleClass('sku--no-sku', !variant || !variant.sku);
    };

    _.updateBarcode = function (variant, $container) {
      $container.find('.barcode .barcode__value').html(variant ? variant.barcode : '');
      $container.find('.barcode').toggleClass('barcode--no-barcode', !variant || !variant.barcode);
    };

    _.updateInventoryNotice = function (variant, $container) {
      var inventoryData = _._getVariantOptionElement(variant, $container).data('inventory');
      if (inventoryData) {
        $container.find('.product-inventory-notice').removeClass('product-inventory-notice--no-inventory').html(
        _._getString('inventoryNotice').replace('[[ quantity ]]', inventoryData));

      } else {
        $container.find('.product-inventory-notice').addClass('product-inventory-notice--no-inventory').empty();
      }
    };

    _.updateBackorder = function (variant, $container) {
      var $backorder = $container.find('.backorder');
      if ($backorder.length) {
        if (variant && variant.available) {
          if (variant.inventory_management && _._getVariantOptionElement(variant, $container).data('stock') == 'out') {
            var productData = _.getProductData($backorder.closest('.product-form'));
            $backorder.find('.backorder__variant').html(productData.title + (variant.title.indexOf('Default') >= 0 ? '' : ' - ' + variant.title));
            $backorder.show();
          } else {
            $backorder.hide();
          }
        } else {
          $backorder.hide();
        }
      }
    };

    _.updatePrice = function (variant, $container) {
      var $priceArea = $container.find(_.selectors.priceArea);
      $priceArea.removeClass('price--reduced');

      if (variant) {
        var $newPriceArea = $('<div>');
        $('<span class="price theme-money">').html(theme.Shopify.formatMoney(variant.price, theme.money_format_with_product_code_preference)).appendTo($newPriceArea);

        if (variant.compare_at_price > variant.price) {
          $newPriceArea.append(' ');
          $('<span class="was-price theme-money">').html(theme.Shopify.formatMoney(variant.compare_at_price, theme.money_format)).appendTo($newPriceArea);
          $priceArea.addClass('price--reduced');
        }
        if (variant.unit_price_measurement) {
          var $newUnitPriceArea = $('<div class="unit-price">').appendTo($newPriceArea);
          $('<span class="unit-price__price theme-money">').html(theme.Shopify.formatMoney(variant.unit_price, theme.money_format)).appendTo($newUnitPriceArea);
          $('<span class="unit-price__separator">').html(_._getString('unitPriceSeparator')).appendTo($newUnitPriceArea);
          $('<span class="unit-price__unit">').html(_.getBaseUnit(variant)).appendTo($newUnitPriceArea);
        }
        $priceArea.html($newPriceArea.html());
      } else {
        $priceArea.html(_._getString('priceNonExistent', variant));
      }
    };

    _.getBaseUnit = function (variant) {
      return variant.unit_price_measurement.reference_value === 1 ?
      variant.unit_price_measurement.reference_unit :
      variant.unit_price_measurement.reference_value +
      variant.unit_price_measurement.reference_unit;
    },

    _._updateButtonText = function ($button, string, variant) {
      $button.each(function () {
        var newVal;
        newVal = _._getString('button' + string, variant);
        if (newVal !== false) {
          if ($(this).is('input')) {
            $(this).val(newVal);
          } else {
            $(this).html(newVal);
          }
        }
      });
    };

    _.updateButtons = function (variant, $container) {
      var $button = $container.find(_.selectors.submitButton);

      if (variant && variant.available == true) {
        $button.removeAttr('disabled');
        _._updateButtonText($button, 'Default', variant);
      } else {
        $button.attr('disabled', 'disabled');
        if (variant) {
          _._updateButtonText($button, 'NoStock', variant);
        } else {
          _._updateButtonText($button, 'NoVariant', variant);
        }
      }
    };

    _.updateContainerStatusClasses = function (variant, $container) {
      $container.toggleClass('variant-status--unavailable', !variant.available);
      $container.toggleClass('variant-status--backorder', variant.available &&
      variant.inventory_management &&
      _._getVariantOptionElement(variant, $container).data('stock') == 'out');
    };

    _.initProductOptions = function ($productForm) {
      if ($productForm.hasClass('theme-init') || !$productForm.find(_.selectors.variantIdInputs).length) return;

      var productData = _.getProductData($productForm);
      $productForm.addClass('theme-init');

      // init option selectors
      $productForm.find(_.selectors.multiOption).on('change.themeProductOptions', 'select', function () {
        var selectedOptions = [];
        $(this).closest(_.selectors.multiOption).find('select').each(function () {
          selectedOptions.push($(this).val());
        });
        // find variant
        var variant = false;
        for (var i = 0; i < productData.variants.length; i++) {
          var v = productData.variants[i];
          var matchCount = 0;
          for (var j = 0; j < selectedOptions.length; j++) {
            if (v.options[j] == selectedOptions[j]) {
              matchCount++;
            }
          }
          if (matchCount == selectedOptions.length) {
            variant = v;
            break;
          }
        }
        // trigger change
        if (variant) {
          $productForm.find(_.selectors.variantIdInputs).val(variant.id);
        }
        // a jQuery event may not be picked up by all listeners
        $productForm.find(_.selectors.variantIdInputs).each(function () {
          this.dispatchEvent(
          new CustomEvent('change', { bubbles: true, cancelable: false, detail: variant }));

        });
      });

      // init variant ids
      $productForm.find(_.selectors.variantIdInputs).each(function () {
        // change state for original dropdown
        $(this).on('change.themeProductOptions firstrun.themeProductOptions', function (e) {
          if ($(this).is('input[type=radio]:not(:checked)')) {
            return; // handle radios - only update for checked
          }
          var variant = e.detail;
          if (!variant && variant !== false) {
            for (var i = 0; i < productData.variants.length; i++) {
              if (productData.variants[i].id == $(this).val()) {
                variant = productData.variants[i];
              }
            }
          }
          var $container = $(this).closest(_.selectors.container);

          // string overrides
          var $addToCart = $container.find(_.selectors.submitButton).filter('[data-add-to-cart-text]');
          if ($addToCart.length) {
            _.strings.buttonDefault = $addToCart.data('add-to-cart-text');
          }

          // update price
          _.updatePrice(variant, $container);

          // update buttons
          _.updateButtons(variant, $container);

          // emit an event to broadcast the variant update
          $(window).trigger('cc-variant-updated', {
            variant: variant,
            product: productData });


          // variant images
          if (variant && variant.featured_media) {
            $container.find(_.selectors.gallery).trigger('variantImageSelected', variant);
          }

          // extra details
          _.updateBarcode(variant, $container);
          _.updateSku(variant, $container);
          _.updateInventoryNotice(variant, $container);
          //_.updateTransferNotice(variant, $container);
          _.updateBackorder(variant, $container);
          _.updateContainerStatusClasses(variant, $container);

          // variant urls
          if ($productForm.data('enable-history-state') && e.type == 'change') {
            _.addVariantUrlToHistory(variant);
          }

          // allow other things to hook on
          $productForm.trigger('variantChanged', variant);
        });

        // first-run
        $(this).trigger('firstrun');
      });

      // ajax
      theme.applyAjaxToProductForm($productForm);
    };

    _.unloadProductOptions = function ($productForm) {
      $productForm.removeClass('theme-init').each(function () {
        $(this).trigger('unloading').off('.themeProductOptions');
        $(this).find(_.selectors.multiOption).off('.themeProductOptions');
        theme.removeAjaxFromProductForm($productForm);
      });
    };
  }();

  /// Footer position
  theme.repositionFooter = function () {
    var $preFooterContent = $('#content');
    var $footer = $('.page-footer');
    if ($footer.length) {
      var offset = $(window).height() - ($preFooterContent.offset().top + $preFooterContent.outerHeight()) - $footer.outerHeight();
      $footer.css('margin-top', offset > 0 ? offset : '');
    };
  };

  theme.MasonryManager = new function () {
    var _ = this;
    _.getInitialisedMasonry = function () {
      return $('.blocklayout').filter(function () {
        return !!$(this).data('masonry');
      });
    };

    _.remasonry = function () {
      _.getInitialisedMasonry().each(function () {
        $masonry = $(this);

        var w = _.setBlockWidths($masonry);

        // limit to number of visible rows
        var perRow = Math.round($masonry.width() / w);
        $masonry.filter('[data-row-limit]:not([data-row-limit=""])').each(function () {
          var limit = $(this).data('row-limit') * perRow;
          $(this).children().each(function (index) {
            $(this).toggleClass('hidden', index >= limit);
          });
        });

        _.setFixedSizes();

        $masonry.masonry({
          columnWidth: w });

      });
    };

    _.setFixedSizes = function () {
      _.getInitialisedMasonry().each(function () {
        var $fixed = $(this).children('.fixed-ratio:not(.hidden):not(.size-large)');
        if ($fixed.length > 0) {
          var h = -1;
          $fixed.each(function (i) {
            var $lastChild = $(this).children().last();
            h = Math.max(h, $lastChild.position().top + $lastChild.outerHeight(true));
          });
          $fixed.css('height', h);
        }
      });
    };
    _.getUnInitialisedMasonry = function () {
      return $('.blocklayout').filter(function () {
        return !$(this).data('masonry');
      });
    };

    _.getBlockMargin = function ($masonry) {
      var $firstBlock = $masonry.find('.block:first');
      return $firstBlock.length ? parseInt($firstBlock.css('margin-left')) : theme.settings.block_gut_int;
    };

    _.columnWidth = function ($masonry) {
      var baseWidth = theme.settings.block_width_int;
      if (typeof $masonry.data('block-width') !== 'undefined') {
        baseWidth = parseInt($masonry.data('block-width'));
      }
      var defWidth = baseWidth * ($masonry.hasClass('double-sized') ? 2 : 1) + _.getBlockMargin($masonry) * 2;
      var cols = Math.ceil(($masonry.width() - 200) / defWidth);

      //Min two per row on mobile (delete to go 1-a-row)
      var isProductGrid = $masonry.find('.block.product').length > 0;
      if (isProductGrid && $(window).width() < 768) {
        cols = Math.max(2, cols);
      }

      return Math.floor($masonry.width() / cols);
    };

    _.setBlockWidths = function ($masonryToSet) {
      var colWidth = 0,
      $m = $masonryToSet ? $masonryToSet : $('.blocklayout');
      $m.each(function () {
        var $masonry = $(this);
        colWidth = _.columnWidth($masonry);
        var marginWidth = _.getBlockMargin($masonry) * 2;
        $masonry.children(':not(.size-large):not(.size-full-width)').css('width', colWidth - marginWidth);
        $masonry.children('.size-full-width').css('width', '100%');
        if ($(window).width() < colWidth * 2 + marginWidth) {
          $masonry.children('.size-large').css('width', colWidth - marginWidth);
        } else {
          $masonry.children('.size-large').css('width', colWidth * 2 - marginWidth);
        }
      });
      return colWidth;
    };

    _.appendItems = function ($items, $masonryContainer) {
      $masonryContainer.append($items);
      _.setBlockWidths();
      _.setFixedSizes();
      $masonryContainer.masonry('appended', $items);
    };
  }();

  theme.swipers = {};

  theme.productGallerySlideshowTabFix = function ($swiper) {
    var swiperId = $swiper.data('swiper-id');
    var swiper = theme.swipers[swiperId];

    if (swiper) {
      // which slide are we going to?
      var $activeMedia = $swiper.find('.product-media-gallery-selected').removeClass('product-media-gallery-selected'),
      $activeSlide = null;
      if ($activeMedia.length) {

        // selected from thumbnail
        $activeSlide = $activeMedia.closest('.swiper-slide');
      } else {

        // visible
        $activeSlide = $swiper.find('.swiper-slide').filter(function () {
          if ($(this).hasClass('swiper-slide-active')) {

            return true;
          } else {

            var containerLeft = $(swiper.$el).offset().left,
            containerRight = containerLeft + $(swiper.$el).width() + 15, // a bit extra to cover margins & stuff
            slideRight = Math.floor($(this).offset().left + $(this).width()); // avoid rounding errors
            return slideRight >= containerLeft && slideRight <= containerRight;
          }
          return false;
        });
      }
      // tabindex everything to prevent tabbing into hidden slides
      $activeSlide.find('a, input, button, select, iframe, video, model-viewer, [tabindex]').each(function () {
        $(this).attr('tabindex', '0');
      });
      $swiper.find('.swiper-slide').not($activeSlide).find('a, input, button, select, iframe, video, model-viewer, [tabindex]').each(function () {
        $(this).attr('tabindex', '-1');
      });
    }
  };

  $(function ($) {
    $(document).on('keyup.themeTabCheck', function (evt) {
      if (evt.keyCode === 9) {
        $('body').addClass('tab-used');
        $(document).off('keyup.themeTabCheck');
      }
    });

    $(document).on('variantImageSelected', '.product-gallery', function (e, variant) {
      var $swiperImgLinks = $('.swiper-container:first .swiper-slide .product-gallery__image', this);
      var swiperId = $('.swiper-container:first', this).data('swiper-id');
      var swiper = theme.swipers[swiperId];

      if (swiper) {
        var toMatch = variant.featured_media.id;
        var $match = $swiperImgLinks.filter(function () {
          return $(this).data('media-id') == toMatch;
        }).first();

        if ($match.length) {
          swiper.slideTo($match.parent().index());
        }
      }
    });

    //First masonry load
    $(document).on('loadmasonry', function () {
      theme.MasonryManager.getUnInitialisedMasonry().each(function () {
        var $masonry = $(this);
        $masonry.masonry({
          isResizeBound: false,
          itemSelector: '.block',
          columnWidth: theme.MasonryManager.setBlockWidths(),
          isLayoutInstant: true, //Built-in transforms are buggy, using CSS instead
          isAnimated: !Modernizr.csstransitions });


        setTimeout(function () {
          theme.MasonryManager.remasonry();
          // pagination hidden until products loaded, on collections
          $masonry.addClass('blocklayout--reveal-pagination');
          // layout has changed
          theme.repositionFooter();
        }, 10);
      });
    }).trigger('loadmasonry');

    //Re-up the masonry after fonts are loaded, or on resize
    $(window).on('load debouncedresize', theme.MasonryManager.remasonry);

    $(document).on('filters-applied', function () {
      $(document).trigger('loadmasonry');
    });

    /// Redirect dropdowns
    $(document).on('change', 'select.navdrop', function () {
      window.location = $(this).val();
    });

    /// General purpose lightbox
    $('a[rel="fancybox"]').fancybox({ titleShow: false });

    /// Main nav

    // Inside mode: Click top level item
    $(document).on('click', '.nav-style-in .mainnav .tier1 > ul > li > a, .show-nav-mobile .mainnav .tier1 > ul > li > a', function (e) {
      if ($(this).siblings('div').length) {
        e.preventDefault();
        var $this = $(this);
        // store scroll position
        var panelScroll = $('#navpanel').scrollTop();
        $('#navpanel').data('lastScroll', panelScroll);
        // scroll to top
        $('#navpanel').animate({ scrollTop: 0 }, panelScroll > 0 ? 250 : 0, function () {
          // transition
          $this.parent().addClass('expanded');
          var $tier1 = $this.closest('.tier1').addClass('inside-expanded-tier2');
          // a11y
          $this.attr('aria-expanded', 'true');
          $this.siblings('.tier2').attr('id', 'current-submenu');
          $('.mainnav .back').removeAttr('tabindex');
          // show back button
          setTimeout(function () {
            $tier1.addClass('showback');
          }, 250);
        });
      }
    });

    // Inside mode: Go back up
    $(document).on('click', '#navpanel .mainnav .back', function (e) {
      e.preventDefault();
      // hide back button
      var $tier1 = $(this).closest('.tier1').removeClass('showback');

      // a11y
      $tier1.find('[aria-expanded]').attr('aria-expanded', 'false');
      $('.mainnav .back').attr('tabindex', '-1');
      $('#current-submenu').removeAttr('id');

      // scroll
      var lastScroll = $('#navpanel').data('lastScroll');
      var panelScroll = $('#navpanel').scrollTop();
      if (typeof lastScroll != 'undefined') {
        $('#navpanel').animate({ scrollTop: lastScroll + 'px' }, lastScroll != panelScroll ? 250 : 0);
      }

      // transition
      setTimeout(function () {
        $tier1.removeClass('inside-expanded-tier2');
        // after transition
        setTimeout(function () {
          $tier1.find('.expanded').removeClass('expanded');
        }, 260);
      }, 210);
    });


    // Flyout mode: Hover over nav
    var navHoverRemoveTimeoutId = -1;
    $(document).on('mouseenter mouseleave focusin focusout', 'body:not(.show-nav-mobile) .nav-style-out #navpanel .mainnav .tier1 > ul > li', function (e) {
      if ($(this).children('div').length) {
        e.preventDefault();
        var doShow = e.type == 'mouseenter' || e.type == 'focusin';
        var w = $('#content').width();
        var $thisLi = $(this);
        clearTimeout(navHoverRemoveTimeoutId);
        if (doShow) {
          // clear existing visible items
          var $existing = $('.mainnav .outside-expanded').removeClass('outside-expanded');

          // prepare to show
          if (!$('body').hasClass('nav-outside-expanded-mode')) {
            $('body').addClass('nav-outside-expanded-mode');
            $('.bodywrap, .page-header').css('margin-right', $('#content').width() - w); // cater for scrollbar
          }
          $thisLi.find('.tier2 .tier-title').css('margin-top', $('#navpanel .shoplogo').outerHeight());

          // show (after reflow caused by css changes)
          $('body').addClass('nav-outside-expanded-show');
          $thisLi.addClass('outside-expanded');
          $thisLi.children('a').attr('aria-expanded', 'true');

        } else {
          // hide, after small delay
          $thisLi.children('a').attr('aria-expanded', 'false');
          navHoverRemoveTimeoutId = setTimeout(function () {
            $('body').removeClass('nav-outside-expanded-show');
            $thisLi.removeClass('outside-expanded');

            navHoverRemoveTimeoutId = setTimeout(function () {
              // remove hover mode & scrollbar margin
              $('body').removeClass('nav-outside-expanded-mode');
              $('.mainnav .tier2 .tier-title').css('margin-top', '');
              $('.bodywrap, .page-header').css('margin-right', '');
            }, 260); //post trans
          }, 500);
        }
      }
    });

    // Tier 3 expansion
    $(document).on('click', '.tier2 > ul > li > a', function (e) {
      var $sib = $(this).siblings('ul');
      if ($sib.length) {
        e.preventDefault();
        if ($sib.is(':visible')) {
          $sib.slideUp(250);
          $(this).attr('aria-expanded', 'false').parent().removeClass('expanded');
        } else {
          $sib.slideDown(250);
          $(this).attr('aria-expanded', 'true').parent().addClass('expanded');
        }
      }
    });

    // Mobile nav visibility
    $(document).on('click', '.nav-toggle', function (e) {
      e.preventDefault();
      $('body').toggleClass('show-nav-mobile');
    });
    $(document).on('click touchend', 'body.show-nav-mobile', function (e) {
      if (e.target == this) {
        $(this).removeClass('show-nav-mobile');
        return false;
      }
    });


    /// Quick buy popup
    $(document).on('click', '.block.product .quick-buy', function () {
      var productSelector = '.product:not(.insert)';
      var $prod = $(this).closest(productSelector);
      var prevIndex = $prod.index(productSelector) - 1;
      var nextIndex = $prod.index(productSelector) + 1;
      if (nextIndex > $prod.siblings(productSelector).length) {
        nextIndex = -1;
      }

      $.fancybox.showActivity();

      var url = $(this).attr('href');
      $.get(url, function (data) {
        var $template = $('<div class="quickbuy-form">').append($('<div>' + data + '</div>').find('[data-section-type="product-template"]:first').html());
        // refine content
        $template.find('.not-in-quickbuy').remove();
        $template.find('.only-in-quickbuy').removeClass('only-in-quickbuy');
        $template.find('[data-enable-history-state]').attr('data-enable-history-state', false).data('enable-history-state', false);
        // update labels & ids
        $template.find('label[for]').each(function () {
          $(this).attr('for', $(this).attr('for') + '-qb');
        });
        $template.find('form[id], :input[id]').each(function () {
          $(this).attr('id', $(this).attr('id') + '-qb');
        });
        $.fancybox({
          padding: 0,
          showCloseButton: false,
          content: $($template.wrap('<div>').parent().html()).prepend(
          ['<div class="action-icons">',
          '<a href="#" class="prev-item action-icon" data-idx="', prevIndex, '" aria-label="', theme.strings.previous, '">', theme.icons.left, '</a>',
          '<a href="#" class="next-item action-icon" data-idx="', nextIndex, '" aria-label="', theme.strings.next, '">', theme.icons.right, '</a>',
          '<a href="#" class="close-box action-icon" aria-label="', theme.strings.close, '">', theme.icons.close, '</a>',
          '</div>'].join('')),

          onComplete: function onComplete() {
            // init product form, if required
            theme.OptionManager.initProductOptions($('.quickbuy-form .product-form'));

            theme.loadClickyboxOptions($('.quickbuy-form'));

            if (Shopify.PaymentButton && $('.quickbuy-form .shopify-payment-button').length) {
              $(document).on('shopify:payment_button:loaded.themeQuickBuy', function () {
                $(document).off('shopify:payment_button:loaded.themeQuickBuy');
                $.fancybox.resize();
              });

              Shopify.PaymentButton.init();
            }

            // gallery
            $('.quickbuy-form .product-gallery').trigger('initProductGallery');

            // set focus
            $('.quickbuy-form .close-box:first').focus();
          },
          onCleanup: function onCleanup() {
            $('.quickbuy-form .product-gallery').trigger('destroyProductGallery');
            theme.OptionManager.unloadProductOptions($('.quickbuy-form .product-form'));
            theme.unloadClickyboxOptions($('.quickbuy-form'));
          } });

      });

      return false;
    });
    $(document).on('click', '.quickbuy-form .close-box', function () {
      $.fancybox.close();
      return false;
    }).on('click', '.quickbuy-form .prev-item, .quickbuy-form .next-item', function () {
      $($('.block.product:not(.insert)').get($(this).data('idx'))).find('.quick-buy').click();
      return false;
    });

    // lightbox on click
    $(document).on('click', '.product-gallery .gallery-top button.product-gallery__image', function (e) {
      e.preventDefault();
      if ($(this).closest('.quickbuy-form').length == 0) {
        var $gall = $(this).closest('.product-gallery');
        if ($('.gallery-top .swiper-slide', $gall).length > 1) {
          var imgs = Array();
          var srcToShow = $(this).data('zoom-src');
          var indexToShow = 0;
          $('.gallery-top .swiper-slide button.product-gallery__image', $gall).each(function (index) {
            imgs.push({
              href: $(this).data('zoom-src') });

            if ($(this).data('zoom-src') == srcToShow) {
              indexToShow = index;
            }
          });
          $.fancybox(imgs, { index: indexToShow, padding: 0 });
        } else {
          $.fancybox([{ href: $(this).data('zoom-src') }], { padding: 0 });
        }
      }
    });


    /// Terms requirement on cart
    $(document).on('click', '#cartform[data-require-terms="true"] #update-cart, #cartform[data-require-terms="true"] .additional-checkout-buttons a, #cartform[data-require-terms="true"] .additional-checkout-buttons input', function () {
      var $form = $(this).closest('form');
      if ($form.has('#terms') && $form.find('#terms:checked').length == 0) {
        alert(theme.strings.cart_terms_confirmation);
        return false;
      }
    });

    /// Assess footer position on ready/load/resize
    theme.repositionFooter();
    $(window).on('load debouncedresize', theme.repositionFooter);


    /// Product gallery
    $(document).on('initProductGallery', '.product-gallery:not(.product-gallery--init)', function () {
      var $gallery = $(this);
      $gallery.addClass('product-gallery--init');

      var $swiper = $('.swiper-container', this);
      // if multiple slides
      if ($swiper.find('.swiper-slide').length > 1) {
        var initial = 0;
        var $feat = $swiper.find('.swiper-slide[data-featured="true"]');
        if ($feat.length) {
          initial = $feat.index();
        }

        var swiperOpts = {
          navigation: {
            nextEl: $swiper.find('.swiper-button-next')[0],
            prevEl: $swiper.find('.swiper-button-prev')[0] },

          slidesPerView: $swiper.data('slides-to-show'),
          spaceBetween: 10,
          speed: 500,
          autoHeight: $swiper.data('slides-to-show') == 'auto' ? $(window).width() < 768 : true,
          initialSlide: initial,
          preventClicks: false,
          on: {
            transitionEnd: function transitionEnd(swiper) {
              if ($swiper.hasClass('swiper-no-transition-callback')) {
                // triggered by activity inside a slide, do not mess with media
                $swiper.removeClass('swiper-no-transition-callback');
              } else {
                // current slide has changed, process media
                // pause all after change
                $('.product-media').trigger('mediaHidden');
                // play if selected through thumbnail
                var $toPlay = $('.product-media-gallery-selected .product-media', $swiper);
                // play if only one item visible in carousel
                if (!$toPlay.length) {
                  var $active = $('.swiper-slide-active', $swiper);
                  if (Math.floor($active.width()) == Math.floor($swiper.width())) {
                    $toPlay = $active.find('.product-media');
                  }
                }
                $toPlay.trigger('mediaVisible');
                // set view-in-space 3d model
                var $activeModel = $('.swiper-slide-active .product-media--model', $swiper);
                if ($activeModel.length) {
                  $gallery.find('.view-in-space').attr('data-shopify-model3d-id', $activeModel.data('model-id'));
                }
              }
              // fix tabbing
              theme.productGallerySlideshowTabFix($swiper); // uses & removes class 'product-media-gallery-selected'
            } } };



        var galleryTop = new Swiper($swiper, swiperOpts);

        var randomId = new Date().getTime();
        theme.swipers[randomId] = galleryTop;
        $swiper.attr('data-swiper-id', randomId);

        galleryTop.slideTo(initial, 0);

        // gallery control
        $(this).on('click', '.gallery-thumbs a', function (e) {
          e.preventDefault();
          $swiper.find('.product-gallery__image[data-media-id="' + $(this).data('media-id') + '"]').addClass('product-media-gallery-selected');
          galleryTop.slideTo($(this).index());
        });
      }

      var swipeToSlideIfNotCurrent = function swipeToSlideIfNotCurrent(slideChild) {
        var $slide = $(slideChild).closest('.swiper-slide');
        $slideContainer = $slide.closest('.swiper-container');
        if ($slide.offset().left < $slideContainer.offset().left) {
          $slideContainer.addClass('swiper-no-transition-callback');
          var swiperId = $slideContainer.data('swiper-id');
          var swiper = theme.swipers[swiperId];
          swiper.slideTo($slide.index());
        }
      };

      // initialise product media
      theme.ProductMedia.init(this, {
        onPlyrInit: function onPlyrInit(playerObj) {
          theme.productGallerySlideshowTabFix($swiper);
        },
        onYoutubeInit: function onYoutubeInit(playerObj) {
          theme.productGallerySlideshowTabFix($swiper);
        },
        onModelViewerInit: function onModelViewerInit(element) {
          theme.productGallerySlideshowTabFix($swiper);
        },
        onPlyrPlay: function onPlyrPlay(playerObj) {
          swipeToSlideIfNotCurrent(playerObj.element);
        },
        onYouTubePlay: function onYouTubePlay(playerObj) {
          swipeToSlideIfNotCurrent(playerObj.element);
        },
        onModelViewerPlay: function onModelViewerPlay(e) {
          swipeToSlideIfNotCurrent(e.target);
          setTimeout(function () {
            $(e.target).closest('.swiper-container').addClass('swiper-no-swiping');
          });
        },
        onModelViewerPause: function onModelViewerPause(e) {
          $(e.target).closest('.swiper-container').removeClass('swiper-no-swiping');
        } });


      // init all media now, as multiple media can be seen at once
      $swiper.find('.product-media').trigger('mediaVisibleInitial');
    });

    $(document).on('destroyProductGallery', '.product-gallery', function () {
      $(this).removeClass('product-gallery--init').off('click');
      theme.ProductMedia.destroy(this);
      var swiperId = $('.swiper-container', this).data('swiper-id');
      var swiper = theme.swipers[swiperId];
      if (swiper) {
        swiper.destroy();
      }
    });

    /// Custom share buttons
    $(document).on('click', '.sharing a', function (e) {
      var $parent = $(this).parent();
      if ($parent.hasClass('twitter')) {
        e.preventDefault();
        var url = $(this).attr('href');
        var width = 575,
        height = 450,
        left = ($(window).width() - width) / 2,
        top = ($(window).height() - height) / 2,
        opts = 'status=1, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0' +
        ',width=' + width +
        ',height=' + height +
        ',top=' + top +
        ',left=' + left;
        window.open(url, 'Twitter', opts);

      } else if ($parent.hasClass('facebook')) {
        e.preventDefault();
        var url = $(this).attr('href');
        var width = 626,
        height = 256,
        left = ($(window).width() - width) / 2,
        top = ($(window).height() - height) / 2,
        opts = 'status=1, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0' +
        ',width=' + width +
        ',height=' + height +
        ',top=' + top +
        ',left=' + left;
        window.open(url, 'Facebook', opts);

      } else if ($parent.hasClass('pinterest')) {
        e.preventDefault();
        var url = $(this).attr('href');
        var width = 700,
        height = 550,
        left = ($(window).width() - width) / 2,
        top = ($(window).height() - height) / 2,
        opts = 'status=1, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0' +
        ',width=' + width +
        ',height=' + height +
        ',top=' + top +
        ',left=' + left;
        window.open(url, 'Pinterest', opts);

      } else if ($parent.hasClass('google')) {
        e.preventDefault();
        var url = $(this).attr('href');
        var width = 550,
        height = 450,
        left = ($(window).width() - width) / 2,
        top = ($(window).height() - height) / 2,
        opts = 'status=1, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0' +
        ',width=' + width +
        ',height=' + height +
        ',top=' + top +
        ',left=' + left;
        window.open(url, 'Google+', opts);

      }
    });

    /// Register all sections
    theme.Sections.init();
    theme.Sections.register('header-section', theme.HeaderSection, { deferredLoad: false });
    theme.Sections.register('footer-section', theme.FooterSection);
    theme.Sections.register('slideshow', theme.SlideshowSection);
    theme.Sections.register('gallery', theme.GallerySection);
    theme.Sections.register('custom-row', theme.VideoManager, { deferredLoadViewportExcess: 800 });
    theme.Sections.register('featured-product', theme.FeaturedProduct);
    theme.Sections.register('featured-collection', theme.FeaturedCollectionSection);
    theme.Sections.register('featured-collections', theme.MasonrySection);
    theme.Sections.register('background-video', theme.VideoManager, { deferredLoadViewportExcess: 800 });
    theme.Sections.register('collection-template', theme.CollectionTemplateSection, { deferredLoad: false });
    theme.Sections.register('list-collections-template', theme.MasonrySection, { deferredLoad: false });
    theme.Sections.register('blog-template', theme.MasonrySection, { deferredLoad: false });
    theme.Sections.register('cart-template', theme.CartTemplateSection, { deferredLoad: false });
    theme.Sections.register('product-template', theme.ProductTemplateSection, { deferredLoad: false });
    theme.Sections.register('search-template', theme.MasonrySection, { deferredLoad: false });
  });


  //Register dynamically pulled in sections
  $(function ($) {
    if (cc.sections.length) {
      cc.sections.forEach(section => {
        try {
          var data = {};
          if (typeof section.deferredLoad !== 'undefined') {
            data.deferredLoad = section.deferredLoad;
          }
          if (typeof section.deferredLoadViewportExcess !== 'undefined') {
            data.deferredLoadViewportExcess = section.deferredLoadViewportExcess;
          }
          theme.Sections.register(section.name, section.section, data);
        } catch (err) {
          console.error("Unable to register section ".concat(section.name, "."), err);
        }
      });
    } else {
      console.warn('Barry: No common sections have been registered.');
    }
  });

})(theme.jQuery);  
/* Built with Barry v1.0.8 */


$("#toggle-note").click(function(evt){
  evt.preventDefault();
  $("#checkout-note").toggleClass("hide-note");
console.log("clicked");
})