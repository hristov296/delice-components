import React from "react";
import ReactDOM from "react-dom";
import SingleProduct from "./SingleProduct";

let singleProd = document.querySelector("#single-product-render");

if (singleProd) {
  ReactDOM.render(<SingleProduct data={window.re_data} />, singleProd);
}
