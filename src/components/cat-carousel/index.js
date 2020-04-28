import React from "react";
import ReactDOM from "react-dom";
import CatCarousel from "./CatCarousel";

let ccContainer = document.querySelectorAll(".react-element-cat-carousel");

ccContainer.forEach((el) => {
  const currId = el.getAttribute("id");

  ReactDOM.render(
    <CatCarousel
      content={window[currId].cats}
      shortcodes={window.re_cc_data.shortcodes}
      data={window[currId].data}
    />,
    el
  );
});
