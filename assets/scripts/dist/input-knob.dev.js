"use strict";

window.addEventListener("load", function () {
  var op = window.inputKnobsOptions || {};
  op.knobWidth = op.knobWidth || op.knobDiameter || 64;
  op.knobHeight = op.knobHeight || op.knobDiameter || 64;
  op.sliderWidth = op.sliderWidth || op.sliderDiameter || 128;
  op.sliderHeight = op.sliderHeight || op.sliderDiameter || 20;
  op.switchWidth = op.switchWidth || op.switchDiameter || 24;
  op.switchHeight = op.switchHeight || op.switchDiameter || 24;
  op.fgcolor = op.fgcolor || "#f00";
  op.bgcolor = op.bgcolor || "#000";
  op.knobMode = op.knobMode || "linear";
  op.sliderMode = op.sliderMode || "relative";
  var styles = document.createElement("style");
  styles.innerHTML = "input[type=range].input-knob,input[type=range].input-slider{\n  -webkit-appearance:none;\n  -moz-appearance:none;\n  border:none;\n  box-sizing:border-box;\n  overflow:hidden;\n  background-repeat:no-repeat;\n  background-size:100% 100%;\n  background-position:0px 0%;\n  background-color:transparent;\n  touch-action:none;\n}\ninput[type=range].input-knob{\n  width:".concat(op.knobWidth, "px; height:").concat(op.knobHeight, "px;\n}\ninput[type=range].input-slider{\n  width:").concat(op.sliderWidth, "px; height:").concat(op.sliderHeight, "px;\n}\ninput[type=range].input-knob::-webkit-slider-thumb,input[type=range].input-slider::-webkit-slider-thumb{\n  -webkit-appearance:none;\n  opacity:0;\n}\ninput[type=range].input-knob::-moz-range-thumb,input[type=range].input-slider::-moz-range-thumb{\n  -moz-appearance:none;\n  height:0;\n  border:none;\n}\ninput[type=range].input-knob::-moz-range-track,input[type=range].input-slider::-moz-range-track{\n  -moz-appearance:none;\n  height:0;\n  border:none;\n}\ninput[type=checkbox].input-switch,input[type=radio].input-switch {\n  width:").concat(op.switchWidth, "px;\n  height:").concat(op.switchHeight, "px;\n  -webkit-appearance:none;\n  -moz-appearance:none;\n  background-size:100% 200%;\n  background-position:0% 0%;\n  background-repeat:no-repeat;\n  border:none;\n  border-radius:0;\n  background-color:transparent;\n}\ninput[type=checkbox].input-switch:checked,input[type=radio].input-switch:checked {\n  background-position:0% 100%;\n}");
  document.head.appendChild(styles);

  var makeKnobFrames = function makeKnobFrames(fr, fg, bg) {
    var r = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"64\" height=\"".concat(fr * 64, "\" viewBox=\"0 0 64 ").concat(fr * 64, "\" preserveAspectRatio=\"none\">\n<defs><g id=\"K\"><circle cx=\"32\" cy=\"32\" r=\"30\" fill=\"").concat(bg, "\"/>\n<line x1=\"32\" y1=\"28\" x2=\"32\" y2=\"7\" stroke-linecap=\"round\" stroke-width=\"6\" stroke=\"").concat(fg, "\"/></g></defs>\n<use xlink:href=\"#K\" transform=\"rotate(-135,32,32)\"/>");

    for (var i = 1; i < fr; ++i) {
      r += "<use xlink:href=\"#K\" transform=\"translate(0,".concat(64 * i, ") rotate(").concat(-135 + 270 * i / fr, ",32,32)\"/>");
    }

    return r + "</svg>";
  };

  var makeHSliderFrames = function makeHSliderFrames(fr, fg, bg, w, h) {
    var r = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"".concat(w, "\" height=\"").concat(fr * h, "\" viewBox=\"0 0 ").concat(w, " ").concat(fr * h, "\" preserveAspectRatio=\"none\">\n<defs><g id=\"B\"><rect x=\"0\" y=\"0\" width=\"").concat(w, "\" height=\"").concat(h, "\" rx=\"").concat(h / 2, "\" ry=\"").concat(h / 2, "\" fill=\"").concat(bg, "\"/></g>\n<g id=\"K\"><circle x=\"").concat(w / 2, "\" y=\"0\" r=\"").concat(h / 2 * 0.9, "\" fill=\"").concat(fg, "\"/></g></defs>");

    for (var i = 0; i < fr; ++i) {
      r += "<use xlink:href=\"#B\" transform=\"translate(0,".concat(h * i, ")\"/>");
      r += "<use xlink:href=\"#K\" transform=\"translate(".concat(h / 2 + (w - h) * i / 100, ",").concat(h / 2 + h * i, ")\"/>");
    }

    return r + "</svg>";
  };

  var makeVSliderFrames = function makeVSliderFrames(fr, fg, bg, w, h) {
    var r = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"".concat(w, "\" height=\"").concat(fr * h, "\" viewBox=\"0 0 ").concat(w, " ").concat(fr * h, "\" preserveAspectRatio=\"none\">\n<defs><rect id=\"B\" x=\"0\" y=\"0\" width=\"").concat(w, "\" height=\"").concat(h, "\" rx=\"").concat(w / 2, "\" ry=\"").concat(w / 2, "\" fill=\"").concat(bg, "\"/>\n<circle id=\"K\" x=\"0\" y=\"0\" r=\"").concat(w / 2 * 0.9, "\" fill=\"").concat(fg, "\"/></defs>");

    for (var i = 0; i < fr; ++i) {
      r += "<use xlink:href=\"#B\" transform=\"translate(0,".concat(h * i, ")\"/>");
      r += "<use xlink:href=\"#K\" transform=\"translate(".concat(w / 2, " ").concat(h * (i + 1) - w / 2 - i * (h - w) / 100, ")\"/>");
    }

    return r + "</svg>";
  };

  var initSwitches = function initSwitches(el) {
    var w, h, d, fg, bg;
    if (el.inputKnobs) return;
    el.inputKnobs = {};

    el.refresh = function () {
      var src = el.getAttribute("data-src");
      d = +el.getAttribute("data-diameter");
      var st = document.defaultView.getComputedStyle(el, null);
      w = parseFloat(el.getAttribute("data-width") || d || st.width);
      h = parseFloat(el.getAttribute("data-height") || d || st.height);
      bg = el.getAttribute("data-bgcolor") || op.bgcolor;
      fg = el.getAttribute("data-fgcolor") || op.fgcolor;
      el.style.width = w + "px";
      el.style.height = h + "px";
      if (src) el.style.backgroundImage = "url(" + src + ")";else {
        var minwh = Math.min(w, h);
        var svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".concat(w, "\" height=\"").concat(h * 2, "\" viewBox=\"0 0 ").concat(w, " ").concat(h * 2, "\" preserveAspectRatio=\"none\">\n<g><rect fill=\"").concat(bg, "\" x=\"1\" y=\"1\" width=\"").concat(w - 2, "\" height=\"").concat(h - 2, "\" rx=\"").concat(minwh * 0.25, "\" ry=\"").concat(minwh * 0.25, "\"/>\n<rect fill=\"").concat(bg, "\" x=\"1\" y=\"").concat(h + 1, "\" width=\"").concat(w - 2, "\" height=\"").concat(h - 2, "\" rx=\"").concat(minwh * 0.25, "\" ry=\"").concat(minwh * 0.25, "\"/>\n<circle fill=\"").concat(fg, "\" cx=\"").concat(w * 0.5, "\" cy=\"").concat(h * 1.5, "\" r=\"").concat(minwh * 0.25, "\"/></g></svg>");
        el.style.backgroundImage = "url(data:image/svg+xml;base64," + btoa(svg) + ")";
      }
    };

    el.refresh();
  };

  var initKnobs = function initKnobs(el) {
    var w, h, d, fg, bg;

    if (el.inputKnobs) {
      el.redraw();
      return;
    }

    var ik = el.inputKnobs = {};

    el.refresh = function () {
      d = +el.getAttribute("data-diameter");
      var st = document.defaultView.getComputedStyle(el, null);
      w = parseFloat(el.getAttribute("data-width") || d || st.width);
      h = parseFloat(el.getAttribute("data-height") || d || st.height);
      bg = el.getAttribute("data-bgcolor") || op.bgcolor;
      fg = el.getAttribute("data-fgcolor") || op.fgcolor;
      ik.sensex = ik.sensey = 200;
      if (el.className.indexOf("input-knob") >= 0) ik.itype = "k";else {
        if (w >= h) {
          ik.itype = "h";
          ik.sensex = w - h;
          ik.sensey = Infinity;
          el.style.backgroundSize = "auto 100%";
        } else {
          ik.itype = "v";
          ik.sensex = Infinity;
          ik.sensey = h - w;
          el.style.backgroundSize = "100% auto";
        }
      }
      el.style.width = w + "px";
      el.style.height = h + "px";
      ik.frameheight = h;
      var src = el.getAttribute("data-src");

      if (src) {
        el.style.backgroundImage = "url(".concat(src, ")");
        var sp = +el.getAttribute("data-sprites");
        if (sp) ik.sprites = sp;else ik.sprites = 0;
        if (ik.sprites >= 1) el.style.backgroundSize = "100% ".concat((ik.sprites + 1) * 100, "%");else if (ik.itype != "k") {
          el.style.backgroundColor = bg;
          el.style.borderRadius = Math.min(w, h) * 0.25 + "px";
        }
      } else {
        var svg;

        switch (ik.itype) {
          case "k":
            svg = makeKnobFrames(101, fg, bg);
            break;

          case "h":
            svg = makeHSliderFrames(101, fg, bg, w, h);
            break;

          case "v":
            svg = makeVSliderFrames(101, fg, bg, w, h);
            break;
        }

        ik.sprites = 100;
        el.style.backgroundImage = "url(data:image/svg+xml;base64," + btoa(svg) + ")";
        el.style.backgroundSize = "100% ".concat((ik.sprites + 1) * 100, "%");
      }

      ik.valrange = {
        min: +el.min,
        max: el.max == "" ? 100 : +el.max,
        step: el.step == "" ? 1 : +el.step
      };
      el.redraw(true);
    };

    el.setValue = function (v) {
      v = Math.round((v - ik.valrange.min) / ik.valrange.step) * ik.valrange.step + ik.valrange.min;
      if (v < ik.valrange.min) v = ik.valrange.min;
      if (v > ik.valrange.max) v = ik.valrange.max;
      el.value = v;

      if (el.value != ik.oldvalue) {
        el.setAttribute("value", el.value);
        el.redraw();
        var event = document.createEvent("HTMLEvents");
        event.initEvent("input", false, true);
        el.dispatchEvent(event);
        ik.oldvalue = el.value;
      }
    };

    ik.pointerdown = function (ev) {
      el.focus();
      var evorg = ev;
      if (ev.touches) ev = ev.touches[0];
      var rc = el.getBoundingClientRect();
      var cx = (rc.left + rc.right) * 0.5,
          cy = (rc.top + rc.bottom) * 0.5;
      var dx = ev.clientX,
          dy = ev.clientY;
      var da = Math.atan2(ev.clientX - cx, cy - ev.clientY);

      if (ik.itype == "k" && op.knobMode == "circularabs") {
        dv = ik.valrange.min + (da / Math.PI * 0.75 + 0.5) * (ik.valrange.max - ik.valrange.min);
        el.setValue(dv);
      }

      if (ik.itype != "k" && op.sliderMode == "abs") {
        dv = (ik.valrange.min + ik.valrange.max) * 0.5 + ((dx - cx) / ik.sensex - (dy - cy) / ik.sensey) * (ik.valrange.max - ik.valrange.min);
        el.setValue(dv);
      }

      ik.dragfrom = {
        x: ev.clientX,
        y: ev.clientY,
        a: Math.atan2(ev.clientX - cx, cy - ev.clientY),
        v: +el.value
      };
      document.addEventListener("mousemove", ik.pointermove);
      document.addEventListener("mouseup", ik.pointerup);
      document.addEventListener("touchmove", ik.pointermove);
      document.addEventListener("touchend", ik.pointerup);
      document.addEventListener("touchcancel", ik.pointerup);
      document.addEventListener("touchstart", ik.preventScroll);
      evorg.preventDefault();
      evorg.stopPropagation();
    };

    ik.pointermove = function (ev) {
      var dv;
      var rc = el.getBoundingClientRect();
      var cx = (rc.left + rc.right) * 0.5,
          cy = (rc.top + rc.bottom) * 0.5;
      if (ev.touches) ev = ev.touches[0];
      var dx = ev.clientX - ik.dragfrom.x,
          dy = ev.clientY - ik.dragfrom.y;
      var da = Math.atan2(ev.clientX - cx, cy - ev.clientY);

      switch (ik.itype) {
        case "k":
          switch (op.knobMode) {
            case "linear":
              dv = (dx / ik.sensex - dy / ik.sensey) * (ik.valrange.max - ik.valrange.min);
              if (ev.shiftKey) dv *= 0.2;
              el.setValue(ik.dragfrom.v + dv);
              break;

            case "circularabs":
              if (!ev.shiftKey) {
                dv = ik.valrange.min + (da / Math.PI * 0.75 + 0.5) * (ik.valrange.max - ik.valrange.min);
                el.setValue(dv);
                break;
              }

            case "circularrel":
              if (da > ik.dragfrom.a + Math.PI) da -= Math.PI * 2;
              if (da < ik.dragfrom.a - Math.PI) da += Math.PI * 2;
              da -= ik.dragfrom.a;
              dv = da / Math.PI / 1.5 * (ik.valrange.max - ik.valrange.min);
              if (ev.shiftKey) dv *= 0.2;
              el.setValue(ik.dragfrom.v + dv);
          }

          break;

        case "h":
        case "v":
          dv = (dx / ik.sensex - dy / ik.sensey) * (ik.valrange.max - ik.valrange.min);
          if (ev.shiftKey) dv *= 0.2;
          el.setValue(ik.dragfrom.v + dv);
          break;
      }
    };

    ik.pointerup = function () {
      document.removeEventListener("mousemove", ik.pointermove);
      document.removeEventListener("touchmove", ik.pointermove);
      document.removeEventListener("mouseup", ik.pointerup);
      document.removeEventListener("touchend", ik.pointerup);
      document.removeEventListener("touchcancel", ik.pointerup);
      document.removeEventListener("touchstart", ik.preventScroll);
      var event = document.createEvent("HTMLEvents");
      event.initEvent("change", false, true);
      el.dispatchEvent(event);
    };

    ik.preventScroll = function (ev) {
      ev.preventDefault();
    };

    ik.keydown = function () {
      el.redraw();
    };

    ik.wheel = function (ev) {
      var delta = ev.deltaY > 0 ? -ik.valrange.step : ik.valrange.step;
      if (!ev.shiftKey) delta *= 5;
      el.setValue(+el.value + delta);
      ev.preventDefault();
      ev.stopPropagation();
    };

    el.redraw = function (f) {
      if (f || ik.valueold != el.value) {
        var v = (el.value - ik.valrange.min) / (ik.valrange.max - ik.valrange.min);
        if (ik.sprites >= 1) el.style.backgroundPosition = "0px " + -(v * ik.sprites | 0) * ik.frameheight + "px";else {
          switch (ik.itype) {
            case "k":
              el.style.transform = "rotate(" + (270 * v - 135) + "deg)";
              break;

            case "h":
              el.style.backgroundPosition = (w - h) * v + "px 0px";
              break;

            case "v":
              el.style.backgroundPosition = "0px " + (h - w) * (1 - v) + "px";
              break;
          }
        }
        ik.valueold = el.value;
      }
    };

    el.refresh();
    el.redraw(true);
    el.addEventListener("keydown", ik.keydown);
    el.addEventListener("mousedown", ik.pointerdown);
    el.addEventListener("touchstart", ik.pointerdown);
    el.addEventListener("wheel", ik.wheel);
  };

  var refreshque = function refreshque() {
    var elem = document.querySelectorAll("input.input-knob,input.input-slider");

    for (var i = 0; i < elem.length; ++i) {
      procque.push([initKnobs, elem[i]]);
    }

    elem = document.querySelectorAll("input[type=checkbox].input-switch,input[type=radio].input-switch");

    for (var _i = 0; _i < elem.length; ++_i) {
      procque.push([initSwitches, elem[_i]]);
    }
  };

  var procque = [];
  refreshque();
  setInterval(function () {
    for (var i = 0; procque.length > 0 && i < 8; ++i) {
      var q = procque.shift();
      q[0](q[1]);
    }

    if (procque.length <= 0) refreshque();
  }, 50);
});