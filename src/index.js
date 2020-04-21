import React from "react";

// const ReactDOM = React.lazy(() => import( /* webpackChunkName: 'CarouselThumbnails' */ 'react-dom'));
// const SingleProduct = React.lazy(() => import( /* webpackChunkName: 'CarouselThumbnails' */ './SingleProduct'));

let ccContainer = document.querySelectorAll(".react-element-cat-carousel");
let spContainer = document.querySelectorAll(".react-element-show-products");
let singleProd = document.querySelector("#single-product-render");
let deliceCalc = document.querySelectorAll(".react-element-renomatic-calculator");

if (ccContainer.length) {
  // console.log("asd");

  import(/* webpackChunkName: "ReactDOM" */ "react-dom")
    .then(({ default: ReactDOM }) => {
      ccContainer.forEach((el) => {
        const currId = el.getAttribute("id");

        import(/* webpackChunkName: "CatCarousel" */ "./CatCarousel")
          .then(({ default: CatCarousel }) => {
            ReactDOM.render(
              <CatCarousel
                content={window[currId].cats}
                shortcodes={window.re_cc_data.shortcodes}
                data={window[currId].data}
              />,
              el
            );
          })
          .catch((err) => "Error importing react module: " + currId);
      });
    })
    .catch((err) => "Error importing ReactDOM");
}

if (spContainer.length) {
  import(/* webpackChunkName: "ReactDOM" */ "react-dom")
    .then(({ default: ReactDOM }) => {
      spContainer.forEach((el) => {
        const currId = el.getAttribute("id");

        import(/* webpackChunkName: "ShowProducts" */ "./ShowProducts")
          .then(({ default: ShowProducts }) => {
            ReactDOM.render(
              <ShowProducts
                cats={window[currId].cats}
                products={window[currId].products}
                shortcodes={window.re_sp_data.shortcodes}
                attr={window[currId].attr}
              />,
              el
            );
          })
          .catch((err) => "Error importing react module: " + currId);
      });
    })
    .catch((err) => "Error importing ReactDOM");
}

if (singleProd) {
  import(/* webpackChunkName: "ReactDOM" */ "react-dom").then(({ default: ReactDOM }) => {
    import(/* webpackChunkName: "SingleProduct" */ "./SingleProduct")
      .then(({ default: SingleProduct }) => {
        ReactDOM.render(<SingleProduct data={window.re_data} />, singleProd);
      })
      .catch((err) => "error importing module:" + singleProd);
  });
}

if (deliceCalc.length) {
  import(/* webpackChunkName: "ReactDOM" */ "react-dom")
    .then(({ default: ReactDOM }) => {
      deliceCalc.forEach((el) => {
        const currId = el.getAttribute("id");

        import(/* webpackChunkName: "DeliceCalculator" */ "./DeliceCalculator")
          .then(({ default: DeliceCalculator }) => {
            ReactDOM.render(
              <DeliceCalculator
              // cats={window[currId].cats}
              // products={window[currId].products}
              // shortcodes={window.re_sp_data.shortcodes}
              // attr={window[currId].attr}
              />,
              el
            );
          })
          .catch((err) => "Error importing react module: " + currId);
      });
    })
    .catch((err) => "Error importing ReactDOM");
}

// ReactDOM.render(<React.Suspense fallback={<img src={window.re_preload.url} />}><SingleProduct data={window.re_data} /></React.Suspense>, singleProd);

// import(/* webpackChunkName: "ReactDOM" */ 'react-dom').then( ({default: ReactDOM}) => {
//     ReactDOM.render(<React.Suspense fallback={null}><SingleProduct data={window.re_data} /></React.Suspense>, singleProd);
// })
