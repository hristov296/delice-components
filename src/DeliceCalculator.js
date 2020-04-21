/** @jsx jsx */
// import React from "react";
import { jsx, css } from "@emotion/core";

const calcContainer = css`
  background-color: #fff;
  padding: 30px 15px 15px;
  border-radius: 12px;
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.05);
`;

const calcTitle = css`
  text-align: center;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 38px;
  color: #394a63;
  margin: 0 0 15px;
`;

const flex1 = css`
  flex: 50%;
`;

const flex2 = css`
  flex: 100%;
`;
// cosnole.log("asd");
// const DelTitle = React.memo(() => (
//   <div>
//     <svg className="icon">
//       <use xlinkHref="#lines" />
//     </svg>
//   </div>
// ));
// console.log(DelTitle);

export default () => {
  return (
    <div className="container">
      <div css={calcContainer}>
        <div className="double-top-lines" />
        <h3 css={calcTitle}>Подайте запитване за цена</h3>
        <div css={{ display: "flex" }}>
          <div css={flex1}>{/* <DelTitle /> */}</div>
          <div css={flex1}></div>
          <div css={flex2}></div>
          <div css={flex2}></div>
        </div>
      </div>
    </div>
  );
};
