import React from "react";

export default function(props) {
  return (
    <div className="d-product">
      <a href={props.link} aria-label={props.title + " заглавна снимка"}>
        <div className="d-fig-wrap">
          <figure className="d-thumb bxs-light" dangerouslySetInnerHTML={{ __html: props.thumbnail }} />
        </div>
      </a>
      <div className="d-content-wrap bxs-light">
        <a href={props.link}>
          <h4 className="d-title">{props.title}</h4>
        </a>
        <p className="d-excerpt" dangerouslySetInnerHTML={{ __html: props.desc }} />
        <div className="d-product-bottom">
          {props.price ? (
            <div className="d-product-price" dangerouslySetInnerHTML={{ __html: props.price }} />
          ) : (
            ""
          )}
          <div className="d-product-link" dangerouslySetInnerHTML={{ __html: props.button }} />
        </div>
      </div>
    </div>
  );
}
