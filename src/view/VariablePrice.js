import React from "react";

export default function(props) {
  const { regPrice, salePrice } = props;

  if (regPrice !== salePrice) {
    return (
      <>
        Цена от {salePrice}, <del>{regPrice}</del> лв.
      </>
    );
  } else {
    return <>Цена от {regPrice} лв.</>;
  }
}
