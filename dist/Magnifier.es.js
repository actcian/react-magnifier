import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import React, { useState, useRef, useEffect } from 'react';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".magnifier {\n  position: relative;\n  display: inline-block;\n  line-height: 0;\n}\n\n.magnifier-image {\n  cursor: none;\n}\n\n.magnifying-glass {\n  position: absolute;\n  z-index: 1;\n  background: #e5e5e5 no-repeat;\n  border: solid #ebebeb;\n  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);\n  opacity: 0;\n  transition: opacity 0.3s;\n  pointer-events: none;\n}\n.magnifying-glass.circle {\n  border-radius: 50%;\n}\n.magnifying-glass.visible {\n  opacity: 1;\n}";
styleInject(css_248z);

var Magnifier = function (props) {
    var src = props.src, width = props.width, height = props.height, className = props.className, zoomImgSrc = props.zoomImgSrc, zoomFactor = props.zoomFactor, mgWidth = props.mgWidth, mgHeight = props.mgHeight, mgBorderWidth = props.mgBorderWidth, mgShape = props.mgShape, mgShowOverflow = props.mgShowOverflow, mgMouseOffsetX = props.mgMouseOffsetX, mgMouseOffsetY = props.mgMouseOffsetY, mgTouchOffsetX = props.mgTouchOffsetX, mgTouchOffsetY = props.mgTouchOffsetY;
    var _a = useState(false), showZoom = _a[0], setShowZoom = _a[1];
    var _b = useState(0), mgOffsetX = _b[0], setMgOffsetX = _b[1];
    var _c = useState(0), mgOffsetY = _c[0], setMgOffsetY = _c[1];
    var _d = useState(0), relX = _d[0], setRelX = _d[1];
    var _e = useState(0), relY = _e[0], setRelY = _e[1];
    var imgRef = useRef(null);
    var _f = useState(null), imgBounds = _f[0], setImgBounds = _f[1];
    var calcImgBounds = function () {
        if (imgRef.current) {
            setImgBounds(imgRef.current.getBoundingClientRect());
        }
    };
    var calcImgBoundsDebounced = debounce(calcImgBounds, 200);
    var onMouseMove = throttle(function (e) {
        if (imgBounds) {
            var target = e.target;
            var newRelX = (e.clientX - imgBounds.left) / target.clientWidth;
            var newRelY = (e.clientY - imgBounds.top) / target.clientHeight;
            setMgOffsetX(mgMouseOffsetX);
            setMgOffsetY(mgMouseOffsetY);
            setRelX(newRelX);
            setRelY(newRelY);
            setShowZoom(true);
        }
    }, 20, { trailing: false });
    var onMouseOut = function () {
        setShowZoom(false);
    };
    var onTouchMove = function (e) {
        e.preventDefault();
        if (imgBounds) {
            var target = e.target;
            var newRelX = (e.targetTouches[0].clientX - imgBounds.left) / target.clientWidth;
            var newRelY = (e.targetTouches[0].clientY - imgBounds.top) / target.clientHeight;
            if (newRelX >= 0 && newRelY >= 0 && newRelX <= 1 && newRelY <= 1) {
                setMgOffsetX(mgTouchOffsetX);
                setMgOffsetY(mgTouchOffsetY);
                setRelX(newRelX);
                setRelY(newRelY);
                setShowZoom(true);
            }
            else {
                setShowZoom(false);
            }
        }
    };
    useEffect(function () {
        var imgElement = imgRef.current;
        if (imgElement) {
            imgElement.addEventListener("mouseenter", calcImgBounds);
            imgElement.addEventListener("mousemove", onMouseMove);
            imgElement.addEventListener("mouseout", onMouseOut);
            imgElement.addEventListener("touchstart", calcImgBounds);
            imgElement.addEventListener("touchmove", onTouchMove);
            imgElement.addEventListener("touchend", function () { return setShowZoom(false); });
            window.addEventListener("resize", calcImgBoundsDebounced);
            window.addEventListener("scroll", calcImgBoundsDebounced, true);
        }
        return function () {
            if (imgElement) {
                imgElement.removeEventListener("mouseenter", calcImgBounds);
                imgElement.removeEventListener("mousemove", onMouseMove);
                imgElement.removeEventListener("mouseout", onMouseOut);
                imgElement.removeEventListener("touchstart", calcImgBounds);
                imgElement.removeEventListener("touchmove", onTouchMove);
                imgElement.removeEventListener("touchend", function () { return setShowZoom(false); });
            }
            window.removeEventListener("resize", calcImgBoundsDebounced);
            window.removeEventListener("scroll", calcImgBoundsDebounced, true);
        };
    }, [imgBounds]);
    return (React.createElement("div", { className: "magnifier ".concat(className), style: {
            width: width,
            height: height,
            overflow: mgShowOverflow ? "visible" : "hidden",
        } },
        React.createElement("img", { className: "magnifier-image", src: src, width: "100%", height: "100%", onLoad: calcImgBounds, ref: imgRef }),
        imgBounds && (React.createElement("div", { className: "magnifying-glass ".concat(showZoom ? "visible" : "", " ").concat(mgShape), style: {
                width: mgWidth,
                height: mgHeight,
                left: "calc(".concat(relX * 100, "% - ").concat(mgWidth / 2, "px + ").concat(mgOffsetX, "px - ").concat(mgBorderWidth, "px)"),
                top: "calc(".concat(relY * 100, "% - ").concat(mgHeight / 2, "px + ").concat(mgOffsetY, "px - ").concat(mgBorderWidth, "px)"),
                backgroundImage: "url(\"".concat(zoomImgSrc || src, "\")"),
                backgroundPosition: "calc(".concat(relX * 100, "% + ").concat(mgWidth / 2, "px - ").concat(relX * mgWidth, "px) calc(").concat(relY * 100, "% + ").concat(mgHeight / 2, "px - ").concat(relY * mgWidth, "px)"),
                backgroundSize: "".concat(zoomFactor * (imgBounds.width || 0), "% ").concat(zoomFactor * (imgBounds.height || 0), "%"),
                borderWidth: mgBorderWidth,
            } }))));
};

export default Magnifier;
