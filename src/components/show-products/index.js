import React from "react";
import ReactDOM from "react-dom";
import ShowProducts from "./ShowProducts";

let spContainer = document.querySelectorAll(".react-element-show-products");

spContainer.forEach((el) => {
  const currId = el.getAttribute("id");

  ReactDOM.render(
    <ShowProducts
      cats={window[currId].cats}
      products={window[currId].products}
      shortcodes={window.re_sp_data.shortcodes}
      attr={window[currId].attr}
    />,
    el
  );
});
