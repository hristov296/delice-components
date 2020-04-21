import React from "react";
import classnames from "classnames";

import ProductBox from "./view/ProductBox";

function ShowProducts(props) {
  const { cats, shortcodes, products, attr } = props;
  const { product_link } = shortcodes;

  const content = cats ? cats[0].products : products;
  console.log(props);

  return (
    <div className={classnames("show_products", { present: attr && attr.presentational })}>
      <div className="delice-products">
        {content.map((el, i) => (
          <ProductBox
            key={i}
            link={el.link}
            thumbnail={el.thumbnail}
            title={el.title}
            desc={el.desc}
            button={
              attr && attr.presentational
                ? null
                : product_link.replace(/( href=")(.*?)(")/g, `$1${el.link}$3`)
            }
          />
        ))}
      </div>
    </div>
  );
}

export default ShowProducts;
