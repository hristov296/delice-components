import React, { useState } from "react";
import classnames from "classnames";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { useWindowWidth } from "../../state/windowWidth";

// const Carousel = React.lazy(() =>
//   import(/* webpackChunkName: 'CarouselThumbnails' */ "./state/Carousel")
// );

import Svg from "../../view/Svg";
import ProductBox from "../../view/ProductBox";

function CatCarousel(props) {
  const [active, setActive] = useState(0);

  const { content, shortcodes, data } = props;
  const { cat_link, product_link } = shortcodes;
  const width = useWindowWidth();

  const totalCats = content.length;

  let maxItems = width > 1024 ? 4 : width > 800 ? 3 : width > 600 ? 2 : 1;

  if ((totalCats === 3 && width < 800) || (totalCats === 4 && width < 950)) {
    maxItems = 0;
  }

  const TitleTag = data.title_tag;
  const catLinkButton = cat_link.replace(/(a href=")(.*?)(")/g, `$1${content[active].link}$3`);

  return (
    <div className="cat-carousel">
      <div className="header-cc flex items-center">
        <div className="left-section left-fl">
          <div className={classnames("cc-title-wrap", "flex", { "content-center": maxItems === 0 })}>
            <Svg icon="lines" />
            <TitleTag className="cc-main-title fw-medium">{data.title}</TitleTag>
          </div>
          {maxItems === 0 ? (
            ""
          ) : (
            <TransitionGroup component={null}>
              <CSSTransition key={active} timeout={{ enter: 300, exit: 0 }} classNames="slideIn">
                <TitleTag className="cc-subtitle fw-medium">{content[active].name}</TitleTag>
              </CSSTransition>
            </TransitionGroup>
          )}
        </div>
        {maxItems === 0 || width < 800 ? (
          ""
        ) : (
          <div className="right-section right-fl">
            <TransitionGroup component={null}>
              <CSSTransition key={active} timeout={300} classNames="fade">
                <p className="cat-description">{content[active].desc}</p>
              </CSSTransition>
            </TransitionGroup>
          </div>
        )}
      </div>
      <div className="content-cc flex">
        {content.length > 1 ? (
          <div
            className={classnames("nav-cc", { vertical: maxItems === 0 })}
            style={{ "--total-cats": content.length }}>
            {content.map((el, i) => (
              <div
                key={i}
                className={classnames("nav-item bxs-light", { active: i == active })}
                onClick={() => {
                  maxItems === 0 ? (window.location.href = el.link) : setActive(i);
                }}>
                <Svg icon={el.icon} />
                <h4 className="nav-title">{el.name}</h4>
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
        <TransitionGroup className="cc-content-animate">
          <CSSTransition key={active} classNames="fade" timeout={300}>
            <div
              className={classnames("delice-products", `d-columns-${content[active].products.length}`)}>
              {content[active].products.slice(0, maxItems).map((el, i) => (
                <ProductBox
                  key={i}
                  link={el.link}
                  thumbnail={el.thumbnail}
                  title={el.title}
                  desc={el.desc}
                  price={el.price_html}
                  button={product_link.replace(/( href=")(.*?)(")/g, `$1${el.link}$3`)}
                />
              ))}
              {/* {
                <React.Suspense fallback={null}>
                  <Carousel
                    //ref={props.refProp}
                    type="div"
                    thumbImgs={content[active].products.map((el, i) => (
                      <ProductBox
                        key={i}
                        link={el.link}
                        thumbnail={el.thumbnail}
                        title={el.title}
                        desc={el.desc}
                        price={el.price_html}
                        button={product_link.replace(/(href=")(")/g, `$1${el.link}$2`)}
                      />
                    ))}
                    //onThumbClick={props.onThumbClick}
                  />
                </React.Suspense>
              } */}
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
      {maxItems === 0 ? (
        ""
      ) : (
        <div className="cc-cat-link" dangerouslySetInnerHTML={{ __html: catLinkButton }} />
      )}
    </div>
  );
}

export default CatCarousel;
