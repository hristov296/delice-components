import React, { Component } from "react";
import classnames from "classnames";

import ProductBox from "./ProductBox";

export default function (props) {
  return (
    <div className="product-related">
      <div className="prod-tabs">
        <div className="container">
          <div className={classnames("tab-header", "active")}>Свързани продукти</div>
        </div>
      </div>

      <div className="related-wrap bg-pattern">
        <div className="container">
          <div className="product-tab-content prod_related delice-products">
            {props.prods.map((el, i) => (
              <ProductBox
                key={i}
                link={el.link}
                thumbnail={el.thumbnail}
                title={el.title}
                desc={el.desc}
                price={el.price_html}
                button={props.prodLink.replace(/( href=")(.*?)(")/g, `$1${el.link}$3`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
