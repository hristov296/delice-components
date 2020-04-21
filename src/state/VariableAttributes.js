import React, { useState, useEffect } from "react";
import classnames from "classnames";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import OnImagesLoaded from "react-on-images-loaded";
import VariablePrice from "../view/VariablePrice";

function VariableAttributes(props) {
  const [loaded, updateLoaded] = useState(0);
  const ev = new Event("imgOnHover");

  useEffect(() => {
    document.dispatchEvent(ev);
  });

  return (
    <OnImagesLoaded onLoaded={() => updateLoaded(1)} timeout={20000}>
      {/* <React.Fragment> */}
      <img
        hidden={loaded}
        src={window.re_preload.url}
        style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}
      />
      <div hidden={!loaded} className="prod-attributes">
        <div className="prod-surface">
          <TransitionGroup component={null}>
            <CSSTransition key={props.currentSurf} timeout={2000} classNames="fade">
              <p>
                Повърхност:{" "}
                {props.currentSurf ? (
                  props.attr_data.pa_surface[props.currentSurf].name
                ) : (
                  <span class="it-text">Изберете повърхност</span>
                )}
              </p>
            </CSSTransition>
          </TransitionGroup>
          <ul className="attr-list">
            {props.possibleSurf.map((el, i) => (
              <li
                className={classnames("attr-item", { active: el === props.currentSurf })}
                onClick={e => props.onClickAttr(el, "currentSurf")}>
                <img
                  src={props.attr_data.pa_surface[el].image_thumb[0]}
                  width={props.attr_data.pa_surface[el].image_thumb[1]}
                  height={props.attr_data.pa_surface[el].image_thumb[2]}
                  alt={props.attr_data.pa_surface[el].name}
                  className="attr-thumb"
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="prod-color">
          <TransitionGroup component={null}>
            <CSSTransition key={props.currentCol} timeout={250} classNames="fade">
              <p>
                Цвят:{" "}
                {props.currentCol ? (
                  props.attr_data.pa_color[props.currentCol].name
                ) : (
                  <span class="it-text">Изберете цвят</span>
                )}
              </p>
            </CSSTransition>
          </TransitionGroup>
          <ul className="attr-list">
            {Object.entries(props.attr_data.pa_color).map(el => (
              <li
                className={classnames("attr-item", {
                  active: el[0] === props.currentCol,
                  hidden: props.possibleCol.indexOf(el[0]) === -1,
                })}
                onClick={e => props.onClickAttr(el[0], "currentCol")}>
                <img
                  src={el[1].image_thumb[0]}
                  width={el[1].image_thumb[1]}
                  height={el[1].image_thumb[2]}
                  alt={el[1].name}
                  className="attr-thumb"
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="prod-var-price">
          <TransitionGroup component={null}>
            <CSSTransition key={props.currentPrice} timeout={250} classNames="fade">
              <p className={classnames("price-txt", { "it-text": !props.currentPrice })}>
                {props.currentPrice ? (
                  <VariablePrice salePrice={props.currentPrice[0]} regPrice={props.currentPrice[1]} />
                ) : (
                  `Моля изберете комбинация от цвят и повърхност.`
                )}
              </p>
            </CSSTransition>
          </TransitionGroup>
        </div>
      </div>
      {/* </React.Fragment> */}
    </OnImagesLoaded>
  );
}

export default VariableAttributes;
