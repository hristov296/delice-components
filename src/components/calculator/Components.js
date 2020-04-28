import { css } from "@emotion/core";

export const calcContainer = css`
  background-color: #fff;
  padding: 30px 15px 15px;
  margin-bottom: 15px;
  border-radius: 12px;
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.05);
`;
export const calcTitle = css`
  text-align: center;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 38px;
  color: #394a63;
  margin: 0 0 25px;
  @media (max-width: 768px) {
    font-size: 30px;
  }
  @media (max-width: 460px) {
    font-size: 23px;
  }
`;
export const labelTitle = css`
  font-family: var(--main-font);
  font-size: 21px;
  font-weight: 500;
  text-transform: uppercase;
  margin-left: 8px;
  margin-bottom: 0 !important;
  color: #394a63;
  @media (max-width: 460px) {
    margin-left: 0;
    margin-top: 3px;
  }
`;
export const dTitle = css`
  margin-bottom: 15px;
  @media (max-width: 460px) {
    flex-flow: column;
    align-items: flex-start;
  }
`;
export const gridContainer = (props) => css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${props.min || 250}px, 1fr));
  grid-gap: ${props.gap}px;
  @media (max-width: 550px) {
    grid-template-columns: 1fr;
  }
`;
export const endBox = css`
  display: flex;
  position: relative;
  @media (max-width: 850px) {
    flex-flow: column;
    padding: 10px;
  }
`;
export const gridMeasures = css`
  display: grid;
  grid-template-areas: "a b c" "a d c" "a e f";
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
  grid-gap: 15px;
  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas: "a c" "a c" "a b" "d b" "e f";
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas: "a" "b" "c" "d" "e" "f";
  }
`;
export const textareaMain = css`
  height: 100px;
  line-height: 1;
  padding: 8px;
`;
export const gridFullRow = css`
  grid-column: -1/1;
`;
export const colorsImg = css`
  border-radius: 5px;
  width: 28px;
  height: 28px;
  object-fit: cover;
  margin-right: 5px;
`;
export const colorsTitle = css`
  border-radius: 10px;
  color: #fff;
  font-family: var(--main-font);
  background-color: var(--col-blue);
  font-size: 13px;
  height: 34px;
  line-height: 34px;
  padding: 0 10px;
`;
export const measureBox = css`
  border: 2px solid #e3e5e8;
  border-radius: 5px;
  padding: 15px;
  height: 100%;
  @media (max-width: 400px) {
    padding: 10px;
  }
`;
export const measureInput = css`
  border: 3px solid #eef1f4;
  border-radius: 5px;
  height: 31px;
  line-height: 31px;
  padding: 0 8px;
  margin-bottom: 10px;
  transition: border-color 0.2s ease-out;
  &:focus {
    border-color: rgba(249, 181, 22, 0.44);
  }
`;
export const measureUnit = css`
  position: absolute;
  top: 26px;
  display: none;
  .show-measure + & {
    display: block;
  }
`;
export const flexStretch = css`
  display: flex;
  flex-flow: column;
  justify-content: space-between;
`;

export const inputMain = css`
  border-radius: 5px;
  border: 3px solid #eef1f4;
  padding: 0 8px;
  height: 40px;
  line-height: 40px;
  transition: border-color 0.2s ease-out;
  &:focus {
    border-color: rgba(249, 181, 22, 0.44);
  }
  @media (max-width: 400px) {
    font-size: 14px;
    padding: 0 5px;
  }
`;
export const flexCenter = css`
  display: flex;
  align-items: center;
`;
export const selectDown = css`
  width: 14px;
  height: 25px;
  fill: #4d5461;
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
`;
export const cselectList = css`
  position: absolute;
  top: calc(100% - 3px);
  left: 0;
  right: 0;
  background-color: #fff;
  border: 3px solid #eef1f4;
  border-top: none;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease-out;
  z-index: 10;
  &.active {
    opacity: 1;
    pointer-events: all;
  }
`;
export const cselectOption = css`
  height: 40px;
  line-height: 40px;
  padding: 8px;
  transition: color 0.15s ease-out, background-color 0.15s ease-out;
  &.disabled {
    text-decoration: line-through;
    color: #b1b1b1;
    cursor: not-allowed;
  }
  &:hover {
    color: #fff;
    background-color: #223952;
    &.disabled {
      background-color: #e6e6e6;
    }
  }
  @media (max-width: 400px) {
    font-size: 14px;
  }
`;
export const priceSpan = css`
  font-size: 23px;
  line-height: 1;
`;
export const endContainer = css`
  display: flex;
  flex-flow: column;
  margin: 0 10px;
  flex: 1;
`;
export const sendButton = css`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45px;
  padding: 0 15px;
  margin-left: auto;
  border: none;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  transition: border-color 0.3s;
  background-color: #284360;
  color: #ffffff;
  border-radius: 7px;
  .icon {
    margin-left: 8px;
  }
  &:hover {
    border-top-color: #f9b516;
  }
`;
export const endNotice = css`
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 0 15px;
  text-align: center;
`;
export const addPrices = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const notice = css`
  position: absolute;
  bottom: 15px;
  right: 170px;
  max-width: 300px;
  border: 1px solid #f9b516;
  padding: 10px;
  border-radius: 5px;
  @media (max-width: 768px) {
    position: relative;
    right: initial;
    bottom: initial;
    margin: 15px auto 0;
    text-align: center;
  }
`;
export const schemeImg = css`
  margin: 0 15px 15px;
  @media (max-width: 460px) {
    margin: 0 0 15px;
    width: 100%;
  }
`;
export const endImgContainer = css`
  margin: 0 10px;
  width: 300px;
  @media (max-width: 850px) {
    margin: 0 auto 25px;
  }
`;
export const endTitleBox = css`
  display: flex;
  @media (max-width: 768px) {
    flex-flow: column;
    margin-bottom: 15px;
  }
`;
export const endButtonBox = css`
  margin-top: auto;
  display: flex;
  @media (max-width: 768px) {
    flex-flow: column;
    text-align: right;
    button {
      margin: 10px auto 0;
    }
  }
`;
