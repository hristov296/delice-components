import React, { Component } from "react";
// import { TransitionGroup, CSSTransition } from "react-transition-group";
import classnames from "classnames";

const VariableProductGallery = React.lazy(() =>
  import(/* webpackChunkName: 'VariableProductGallery' */ "../../state/VariableProductGallery")
);
const SimpleProductGallery = React.lazy(() =>
  import(/* webpackChunkName: 'SimpleProductGallery' */ "../../state/SimpleProductGallery")
);
const ProductTabs = React.lazy(() =>
  import(/* webpackChunkName: 'ProductTabs' */ "../../state/ProductTabs")
);
const ProductRelated = React.lazy(() =>
  import(/* webpackChunkName: 'ProductRelated' */ "../../view/ProductRelated")
);
const VariableAttributes = React.lazy(() =>
  import(/* webpackChunkName: 'VariableAttributes' */ "../../state/VariableAttributes")
);

import Svg from "../../view/Svg";

class SingleProduct extends Component {
  constructor(props) {
    super(props);
    this.carousel = React.createRef();
    this.currentCol = null;
    this.currentSurf = null;
    this.currentPrice = null;
    this.state = {
      currentSurf: null,
      currentCol: null,
      possibleSurf: [],
      possibleCol: [],
      currentPrice: null,
      height: window.innerHeight,
      width: window.innerWidth,
    };
  }

  componentDidMount() {
    this.props.data.attr_data && this.onClickAttr(null, null);
    window.addEventListener("resize", this.updateDimensions);

    window.wpcf7.supportHtml5 = (function () {
      var features = {};
      var input = document.createElement("input");

      features.placeholder = "placeholder" in input;

      var inputTypes = ["email", "url", "tel", "number", "range", "date"];

      window.jQuery.each(inputTypes, function (index, value) {
        input.setAttribute("type", value);
        features[value] = input.type !== "text";
      });

      return features;
    })();

    window.jQuery("div.wpcf7 > form").each(function () {
      var $form = window.jQuery(this);

      window.wpcf7.initForm($form);

      if (window.wpcf7.cached) {
        window.wpcf7.refill($form);
      }
    });
  }

  updateDimensions = () => {
    this.setState({
      height: window.innerHeight,
      width: window.innerWidth,
    });
  };
  calcPossibleCol = (surf) => {
    return Object.keys(this.props.data.attr_data.pa_surface[surf].combinations);
  };

  calcPossibleSurf = (col) => {
    return Object.keys(this.props.data.attr_data.pa_color[col].combinations);
  };

  calcPrice = (currentCol, currentSurf) => {
    return [
      this.props.data.attr_data.pa_surface[currentSurf].combinations[currentCol].active_price,
      this.props.data.attr_data.pa_surface[currentSurf].combinations[currentCol].sale_price,
    ];
  };

  onClickAttr = (el, attr) => {
    const { pa_surface, pa_color } = this.props.data.attr_data;
    let { currentCol, currentSurf } = this.state;

    let stateObj = {
      currentCol: null,
      currentSurf: null,
      currentPrice: null,
      possibleCol: Object.keys(pa_color),
      possibleSurf: Object.keys(pa_surface),
    };

    if (attr === "currentSurf") {
      if (currentSurf !== el) {
        stateObj.currentSurf = el;
        stateObj.possibleCol = this.calcPossibleCol(el);
      }
      if (this.carousel.current) this.carousel.current.setSlide(null);
    } else if (attr === "currentCol") {
      if (currentCol === el) return;
      if (currentSurf) {
        if (this.calcPossibleSurf(el).indexOf(currentSurf) > -1) {
          stateObj.currentSurf = currentSurf;
        } else {
          stateObj.currentSurf = this.calcPossibleSurf(el)[0];
        }
      } else {
        stateObj.currentSurf = this.calcPossibleSurf(el)[0];
      }
      stateObj.currentCol = el;
      stateObj.currentPrice = this.calcPrice(stateObj.currentCol, stateObj.currentSurf);
      stateObj.possibleCol = this.calcPossibleCol(stateObj.currentSurf);
      if (this.carousel.current)
        this.carousel.current.setSlide(Object.keys(this.props.data.attr_data.pa_color).indexOf(el));
    }

    this.setState(stateObj);
  };

  onThumbClick = (e, i) => {
    this.onClickAttr(Object.keys(this.props.data.attr_data.pa_color)[i], "currentCol");
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  render() {
    const { data } = this.props;

    const { currentCol, currentSurf, possibleCol, possibleSurf, currentPrice, width } = this.state;

    const thumbImgs =
      data.type === "simple"
        ? new Array(data.thumbnail).concat(data.main_gallery)
        : Object.values(data.attr_data ? data.attr_data.pa_color : {}).map((el) => ({
            src: el.image_full[0],
            w: el.image_full[1],
            h: el.image_full[2],
            title: el.name,
          }));

    let prodFeatures = Object.entries(data.pa_features || {}).map((el, i) => (
      <div key={i} className="feature-item">
        <span className="feat-tooltip">{el[1]}</span>
        <Svg icon={el[0]} class="feat-icon" />
      </div>
    ));
    const totalFeatures = prodFeatures.length;
    prodFeatures = prodFeatures.reduce((res, val, i) => {
      if (i < prodFeatures.length - 1) {
        res.push(val, <span key={`sep-${i}`} className="feat-item-sep" />);
      } else {
        res.push(val);
      }
      return res;
    }, []);

    return (
      <div
        className={classnames("single-product", {
          "simple-prod": data.type === "simple",
          "variable-prod": data.type === "variable",
        })}>
        <div className="prod-main-row flex container">
          {width > 1200 ? (
            <React.Suspense fallback={null}>
              {data.type === "simple" ? (
                <SimpleProductGallery thumbImgs={thumbImgs} />
              ) : (
                <VariableProductGallery
                  refProp={this.carousel}
                  onThumbClick={this.onThumbClick}
                  thumbImgs={thumbImgs}
                  data={data}
                  currentCol={currentCol}
                  currentSurf={currentSurf}
                />
              )}
            </React.Suspense>
          ) : (
            ""
          )}

          <div className="prod-entry">
            <div className="lines-title flex items-center">
              <Svg icon="lines" class="d-lines" />
              <h3 className="fw-medium tag-title mob-fs-20">{data.name}</h3>
            </div>
            <div className="prod-short-desc">
              <p dangerouslySetInnerHTML={{ __html: data.short_desc }} />
            </div>

            {width > 1200 ? (
              ""
            ) : (
              <React.Suspense fallback={null}>
                {data.type === "simple" ? (
                  <SimpleProductGallery thumbImgs={thumbImgs} />
                ) : (
                  <VariableProductGallery
                    refProp={this.carousel}
                    onThumbClick={this.onThumbClick}
                    thumbImgs={thumbImgs}
                    data={data}
                    currentCol={currentCol}
                    currentSurf={currentSurf}
                  />
                )}
              </React.Suspense>
            )}

            <React.Suspense fallback={null}>
              {data.type === "variable" && data.attr_data ? (
                <VariableAttributes
                  currentSurf={currentSurf}
                  currentPrice={currentPrice}
                  currentCol={currentCol}
                  possibleCol={possibleCol}
                  possibleSurf={possibleSurf}
                  attr_data={data.attr_data}
                  onClickAttr={(e, i) => this.onClickAttr(e, i)}
                />
              ) : (
                <div className="prod-var-price">
                  <p className="price-txt">
                    {data.simple_prod_price ? (
                      data.simple_prod_price === data.simple_prod_reg_price ? (
                        `Цена от ${data.simple_prod_price} лв.`
                      ) : (
                        <>
                          Цена от {data.simple_prod_price}, <del>{data.simple_prod_reg_price}</del> лв.
                        </>
                      )
                    ) : (
                      ""
                    )}
                  </p>
                </div>
              )}
            </React.Suspense>
            {data.link_to_calc ? (
              <div className="lines-title flex items-center">
                <Svg icon="lines" class="d-lines" />
                <p
                  className="fw-medium tag-title mob-fs-20"
                  style={{ fontSize: "18px", lineHeight: "1.3" }}>
                  За този модел врата имаме разработен калкулатор за цена. Ако желаете да пресметнете
                  тази цена, кликнете на бутона "Към калкулатор".
                </p>
              </div>
            ) : (
              <div className="product-cf" dangerouslySetInnerHTML={{ __html: data.cf7 }} />
            )}
          </div>
          {data.calculator_link ? (
            <div
              style={{ position: "absolute", top: "calc(100% + 10px)", right: "20px" }}
              dangerouslySetInnerHTML={{ __html: data.calculator_link }}
            />
          ) : (
            ""
          )}
        </div>

        {totalFeatures && width > 1200 ? (
          <div className="product-features container" style={{ "--total-features": totalFeatures }}>
            <div className="prod-feat-wrap">{prodFeatures}</div>
          </div>
        ) : (
          ""
        )}

        <React.Suspense fallback={null}>
          {data.tabs ? <ProductTabs tabs={data.tabs} /> : ""}
        </React.Suspense>

        <React.Suspense fallback={null}>
          <ProductRelated prods={data.related} prodLink={data.product_link} />
        </React.Suspense>
      </div>
    );
  }
}

export default SingleProduct;
