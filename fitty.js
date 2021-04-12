/*
 * fitty v2.3.3 - Snugly resizes text to fit its parent container
 * Copyright (c) 2020 Rik Schennink <rik@pqina.nl> (https://pqina.nl/)
 */
!(function(e, t) {
  if ("function" == typeof define && define.amd)
    define(["module", "exports"], t);
  else if ("undefined" != typeof exports) t(module, exports);
  else {
    var n = { exports: {} };
    t(n, n.exports), (e.fitty = n.exports);
  }
})(this, function(e, t) {
  "use strict";
  Object.defineProperty(t, "__esModule", { value: !0 });
  var g =
    Object.assign ||
    function(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];
        for (var i in n)
          Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
      }
      return e;
    };
  (t.default = (function(n) {
    if (n) {
      var r = { IDLE: 0, DIRTY_CONTENT: 1, DIRTY_LAYOUT: 2, DIRTY: 3 },
        i = [],
        e = null,
        o =
          "requestAnimationFrame" in n
            ? function() {
                n.cancelAnimationFrame(e),
                  (e = n.requestAnimationFrame(function() {
                    return l(
                      i.filter(function(e) {
                        return e.dirty && e.active;
                      })
                    );
                  }));
              }
            : function() {},
        t = function(t) {
          return function() {
            i.forEach(function(e) {
              return (e.dirty = t);
            }),
              o();
          };
        },
        l = function(e) {
          e
            .filter(function(e) {
              return !e.styleComputed;
            })
            .forEach(function(e) {
              e.styleComputed = s(e);
            }),
            e.filter(f).forEach(d);
          var t = e.filter(c);
          t.forEach(u),
            t.forEach(function(e) {
              d(e), a(e);
            }),
            t.forEach(p);
        },
        a = function(e) {
          return (e.dirty = r.IDLE);
        },
        u = function(e) {
          (e.availableWidth = e.element.parentNode.clientWidth),
            (e.currentWidth = e.element.scrollWidth),
            (e.previousFontSize = e.currentFontSize),
            (e.currentFontSize = Math.min(
              Math.max(
                e.minSize,
                (e.availableWidth / e.currentWidth) * e.previousFontSize
              ),
              e.maxSize
            )),
            (e.whiteSpace =
              e.multiLine && e.currentFontSize === e.minSize
                ? "normal"
                : "nowrap");
        },
        c = function(e) {
          return (
            e.dirty !== r.DIRTY_LAYOUT ||
            (e.dirty === r.DIRTY_LAYOUT &&
              e.element.parentNode.clientWidth !== e.availableWidth)
          );
        },
        s = function(e) {
          var t = n.getComputedStyle(e.element, null);
          (e.currentFontSize = parseFloat(t.getPropertyValue("font-size"))),
            (e.display = t.getPropertyValue("display")),
            (e.whiteSpace = t.getPropertyValue("white-space"));
        },
        f = function(e) {
          var t = !1;
          return (
            !e.preStyleTestCompleted &&
            (/inline-/.test(e.display) ||
              ((t = !0), (e.display = "inline-block")),
            "nowrap" !== e.whiteSpace && ((t = !0), (e.whiteSpace = "nowrap")),
            (e.preStyleTestCompleted = !0),
            t)
          );
        },
        d = function(e) {
          (e.element.style.whiteSpace = e.whiteSpace),
            (e.element.style.display = e.display),
            (e.element.style.fontSize = e.currentFontSize + "px");
        },
        p = function(e) {
          e.element.dispatchEvent(
            new CustomEvent("fit", {
              detail: {
                oldValue: e.previousFontSize,
                newValue: e.currentFontSize,
                scaleFactor: e.currentFontSize / e.previousFontSize
              }
            })
          );
        },
        y = function(e, t) {
          return function() {
            (e.dirty = t), e.active && o();
          };
        },
        m = function(e) {
          (e.originalStyle = {
            whiteSpace: e.element.style.whiteSpace,
            display: e.element.style.display,
            fontSize: e.element.style.fontSize
          }),
            w(e),
            (e.newbie = !0),
            (e.dirty = !0),
            i.push(e);
        },
        v = function(t) {
          return function() {
            (i = i.filter(function(e) {
              return e.element !== t.element;
            })),
              t.observeMutations && t.observer.disconnect(),
              (t.element.style.whiteSpace = t.originalStyle.whiteSpace),
              (t.element.style.display = t.originalStyle.display),
              (t.element.style.fontSize = t.originalStyle.fontSize);
          };
        },
        S = function(e) {
          return function() {
            e.active || ((e.active = !0), o());
          };
        },
        h = function(e) {
          return function() {
            return (e.active = !1);
          };
        },
        w = function(e) {
          e.observeMutations &&
            ((e.observer = new MutationObserver(y(e, r.DIRTY_CONTENT))),
            e.observer.observe(e.element, e.observeMutations));
        },
        b = {
          minSize: 16,
          maxSize: 512,
          multiLine: !0,
          observeMutations: "MutationObserver" in n && {
            subtree: !0,
            childList: !0,
            characterData: !0
          }
        },
        z = null,
        T = function() {
          n.clearTimeout(z),
            (z = n.setTimeout(t(r.DIRTY_LAYOUT), E.observeWindowDelay));
        },
        F = ["resize", "orientationchange"];
      return (
        Object.defineProperty(E, "observeWindow", {
          set: function(e) {
            var t = (e ? "add" : "remove") + "EventListener";
            F.forEach(function(e) {
              n[t](e, T);
            });
          }
        }),
        (E.observeWindow = !0),
        (E.observeWindowDelay = 100),
        (E.fitAll = t(r.DIRTY)),
        E
      );
    }
    function D(e, t) {
      var n = g({}, b, t),
        i = e.map(function(e) {
          var t = g({}, n, { element: e, active: !0 });
          return (
            m(t),
            {
              element: e,
              fit: y(t, r.DIRTY),
              unfreeze: S(t),
              freeze: h(t),
              unsubscribe: v(t)
            }
          );
        });
      return o(), i;
    }
    function E(e) {
      var t,
        n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
      return "string" == typeof e
        ? D(((t = document.querySelectorAll(e)), [].slice.call(t)), n)
        : D([e], n)[0];
    }
  })("undefined" == typeof window ? null : window)),
    (e.exports = t.default);
});
