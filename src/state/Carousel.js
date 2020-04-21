import React, { Component } from "react";
// import { Carousel } from "react-responsive-carousel";
import classnames from "classnames";

import "../assets/carousel.css";
import Svg from "../view/Svg";

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.resizeTimer = null;
    this.supportsPE = window.PointerEvent;
    this.totalItems = this.props.thumbImgs.length;
    this.contRef = React.createRef();
    this.wrapRef = React.createRef();
    this.contSize = 0;
    this.state = {
      translate: 0,
      initialTranslate: 0,
      currentSlide: typeof this.props.initialThumb !== "undefined" ? this.props.initialThumb : null,
      didMove: false,
    };
    this.imgsLoaded = 0;
  }

  static defaultProps = {
    direction: "horizontal",
  };

  componentDidMount() {
    window.addEventListener("resize", this.onWindowResize);
  }

  onImgLoad = () => {
    this.imgsLoaded++;

    this.imgsLoaded === this.totalItems && this.initCalcs();
  };

  onWindowResize = () => {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.initCalcs();
      this.setSlide(this.state.currentSlide);
    }, 200);
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
  }

  initCalcs = () => {
    if (this.wrapRef.current) {
      if (this.props.direction === "horizontal") {
        this.totalSize = this.wrapRef.current.getBoundingClientRect().width;
        this.contSize = this.contRef.current.getBoundingClientRect().width;
      } else {
        this.totalSize = this.wrapRef.current.getBoundingClientRect().height;
        this.contSize = this.contRef.current.getBoundingClientRect().height;
      }
    }
    this.singleSize = this.totalSize / this.totalItems;
    this.avDist = this.totalSize - this.contSize;
    this.absCenter = this.contSize / 2;
  };

  setSlide = i => {
    if (i === null) {
      this.setState({
        currentSlide: i,
        translate: 0,
      });
      return;
    }
    let calcTranslate = this.absCenter - (this.singleSize * (i + 1) - this.singleSize / 2);

    if (calcTranslate > 0) {
      calcTranslate = 0;
    }
    if (calcTranslate < -this.avDist && this.avDist > 0) {
      calcTranslate = -this.avDist;
    }

    this.setState({
      currentSlide: i,
      translate: calcTranslate,
    });
  };

  handleThumbClick = (e, i, onNav = false) => {
    e.preventDefault();

    if (this.state.didMove && !onNav) return;
    this.props.onThumbClick(e, i);

    this.setSlide(i);
  };

  handleGestureStart = e => {
    e.preventDefault();

    if (e.touches && e.touches.length > 1) {
      return;
    }

    // Add the move and end listeners
    if (this.supportsPE) {
      e.target.setPointerCapture(e.pointerId);
    } else {
      // Add Mouse Listeners

      document.addEventListener("mousemove", this.handleGestureMove, true);
      document.addEventListener("mouseup", this.handleGestureEnd, true);
    }

    this.wrapRef.current.style.transition = "initial";
    this.initialTouchPos = this.getGesturePointFromEvent(e);

    this.setState({ initialTranslate: this.state.translate, didMove: false });
  };

  getGesturePointFromEvent = e => {
    var point = {};

    if (e.targetTouches) {
      // Prefer Touch Events
      point.x = e.targetTouches[0].clientX;
      point.y = e.targetTouches[0].clientY;
    } else {
      // Either Mouse event or Pointer Event
      point.x = e.clientX;
      point.y = e.clientY;
    }

    return point;
  };

  handleGestureMove = e => {
    e.preventDefault();

    if (!this.initialTouchPos) {
      return;
    }

    if (this.props.direction === "horizontal") {
      const currTouchPos = this.initialTouchPos.x - this.getGesturePointFromEvent(e).x;

      if (currTouchPos !== 0) {
        this.setState({
          translate: -currTouchPos + this.state.initialTranslate,
          didMove: true,
        });
      }
    } else {
      const currTouchPos = this.initialTouchPos.y - this.getGesturePointFromEvent(e).y;

      if (currTouchPos !== 0) {
        this.setState({
          translate: -currTouchPos + this.state.initialTranslate,
          didMove: true,
        });
      }
    }
  };

  handleGestureEnd = e => {
    e.preventDefault();

    if (e.touches && e.touches.length > 0) {
      return;
    }

    this.wrapRef.current.style.transition = "transform 0.3s";
    // Remove Event Listeners
    if (this.supportsPE) {
      e.target.releasePointerCapture(e.pointerId);
    } else {
      // Remove Mouse Listeners
      document.removeEventListener("mousemove", this.handleGestureMove, true);
      document.removeEventListener("mouseup", this.handleGestureEnd, true);
    }

    if (this.state.translate < -this.avDist && this.avDist > 0) {
      this.setState({ translate: -this.avDist });
    } else if (
      this.state.translate > 0 ||
      (-this.avDist > this.contSize && this.state.translate < -this.avDist)
    ) {
      this.setState({ translate: 0 });
    }
    this.initialTouchPos = null;
  };

  render() {
    let swipeProps = {};

    const { thumbImgs, galImgs, onPsOpen, direction, type } = this.props;
    const { translate, currentSlide } = this.state;

    if (this.supportsPE) {
      swipeProps = {
        onPointerDown: this.handleGestureStart,
        onPointerMove: this.handleGestureMove,
        onPointerUp: this.handleGestureEnd,
        onPointerCancel: this.handleGestureEnd,
      };
    } else {
      swipeProps = {
        onTouchStart: this.handleGestureStart,
        onTouchMove: this.handleGestureMove,
        onTouchEnd: this.handleGestureEnd,
        onTouchCancel: this.handleGestureEnd,
        onMouseDown: this.handleGestureStart,
      };
    }

    if (direction === "horizontal") {
      swipeProps.style = {
        transform: "translateX(" + translate + "px)",
      };
    } else {
      swipeProps.style = {
        transform: "translateY(" + translate + "px)",
      };
    }

    return (
      <div className="product-carousel">
        <div className={classnames("ss-swiper", { dir_vertical: direction !== "horizontal" })}>
          <div
            className={classnames("thumb-nav", {
              disabled: currentSlide === 0 || currentSlide === null,
            })}
            onClick={e => {
              currentSlide > 0 && this.handleThumbClick(e, currentSlide - 1, true);
            }}>
            {direction === "horizontal" ? <Svg icon="ch-left" /> : <Svg icon="ch-up" />}
          </div>
          <div className="swipe-container" ref={this.contRef}>
            <div className="swipe-wrap" ref={this.wrapRef} {...swipeProps}>
              {type === "div"
                ? thumbImgs
                : thumbImgs.map((el, i) => (
                    <a
                      href="#"
                      onClick={e => {
                        this.handleThumbClick(e, i);
                      }}
                      className={classnames({ current: currentSlide === i })}>
                      <img
                        width={el.w}
                        height={el.h}
                        src={el.src}
                        title={el.title}
                        className="img-thumb"
                        onLoad={this.onImgLoad}
                      />
                    </a>
                  ))}
            </div>
          </div>
          <div
            className={classnames("thumb-nav", {
              disabled: currentSlide === this.totalItems - 1 || currentSlide === null,
            })}
            onClick={e => {
              currentSlide < this.totalItems - 1 && this.handleThumbClick(e, currentSlide + 1, true);
            }}>
            {direction === "horizontal" ? <Svg icon="ch-right" /> : <Svg icon="ch-down" />}
          </div>
        </div>
        {/* <div className="product-gal-main">
          <Carousel 
            showArrows={false}
            showStatus={false}
            showIndicators={false}
            swipeable={false}
            showThumbs={false}
            selectedItem={currentSlide} >
            {galImgs.map( (el, i) => <a href="#" onClick={e => onPsOpen(e, i)} ><img width={el.w} height={el.h} src={el.src} className="img" /></a>)}
          </Carousel>
        </div> */}
      </div>
    );
  }
}

export default Carousel;
