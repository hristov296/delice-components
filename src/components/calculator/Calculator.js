/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState, useRef, useReducer, useEffect } from "react";

import CustomSelect from "./CustomSelect";

import {
  calcContainer,
  calcTitle,
  labelTitle,
  gridContainer,
  inputMain,
  textareaMain,
  gridFullRow,
  colorsImg,
  colorsTitle,
  measureBox,
  measureInput,
  measureUnit,
  flexStretch,
  flexCenter,
  priceSpan,
  endContainer,
  sendButton,
  endNotice,
  addPrices,
  notice,
  dTitle,
  schemeImg,
  gridMeasures,
  endBox,
  endImgContainer,
  endTitleBox,
  endButtonBox,
} from "./Components";

import {
  linesSelect,
  colorsSelect,
  openingSelect,
  remoteSelect,
  modelsSelect,
  measureA,
  measureB,
  measureC,
  prices,
  openingData,
} from "./form-data";

const DelTitle = React.memo(({ title }) => (
  <div css={[flexCenter, dTitle]}>
    <svg className="icon" css={{ color: "var(--col-yellow)", width: "80px", height: "14px" }}>
      <use xlinkHref="#lines" />
    </svg>
    <p css={labelTitle}>{title}</p>
  </div>
));
const BoxTitle = React.memo(({ title }) => (
  <div css={{ textAlign: "center" }}>
    <p css={{ marginBottom: "0 !important" }}>{title}</p>
    <svg width="85px" height="4px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 85 4">
      <path strokeWidth="2px" stroke="#f9b516" d="M0,2H85" />
    </svg>
  </div>
));
const MeasureInput = React.memo(({ label, id, onChange }) => (
  <label htmlFor={id} css={{ display: "flex", flexFlow: "column", position: "relative" }}>
    <span css={{ marginLeft: "5px" }}>{label}</span>
    <input id={id} type="number" name={id} css={measureInput} onChange={onChange} placeholder="0" />
    <span css={measureUnit}>см.</span>
  </label>
));

const ColorsSelectOption = React.memo((props) =>
  !props.isDefault && props.value ? (
    <>
      <img width="28px" height="28px" css={colorsImg} src={props.value[1]} alt={props.value[0]} />
      <span css={colorsTitle}>{props.value[0]}</span>
    </>
  ) : (
    props.value[0]
  )
);

const initialState = {
  "measure-a": "0",
  "measure-b": "0",
  "measure-c": "0",
  "measure-d": "0",
  "measure-e": "0",
  "measure-f": "0",
};

const reducer = (state, { field, value, type }) => {
  switch (type) {
    case "update":
      return {
        ...state,
        [field]: value,
      };
    case "reset":
    default:
      return {
        ...initialState,
      };
  }
};

const initialEndState = {
  foundModel: false,
  endPrice: 0,
  horCut: false,
  verCut: false,
  possibleModels: [],
};

const endReducer = (state, action) => {
  switch (action.type) {
    case "update":
      return {
        ...state,
        ...action.updatedProp,
      };
    default:
      return {
        ...initialEndState,
      };
  }
};

const found = (value, set) => {
  const tempFound = set.find((el) => {
    let satisfy = false;
    if (el.sizes.length > 1) {
      if (value >= el.sizes[0] && value < el.sizes[1]) {
        satisfy = true;
      }
    } else {
      if (value >= el.sizes) {
        satisfy = true;
      }
    }
    return satisfy;
  });

  if (!tempFound) {
    return null;
  }

  if (typeof tempFound.values === "object") {
    return tempFound.values;
  } else {
    return Object.assign(
      {},
      [...Array(Object.values(modelsSelect).length)].map((el) => tempFound.values)
    );
  }
};

export default () => {
  const [dLines, setDLines] = useState("default");
  const [dColors, setDColors] = useState("default");
  const [dOpening, setDOpening] = useState("default");
  const [dRemote, setDRemote] = useState("default");
  const [dModels, setDModels] = useState("default");
  const [loading, setLoading] = useState(false);
  const [formNotice, setFormNotice] = useState(false);
  const linesSelectRef = useRef();
  const colorSelectRef = useRef();
  const openingSelectRef = useRef();
  const remoteSelectRef = useRef();
  const modelsSelectRef = useRef();
  const formRef = useRef();
  let timeout;

  const [state, dispatch] = useReducer(reducer, initialState);
  const [endState, dispatchEnd] = useReducer(endReducer, initialEndState);

  const onChange = (e) => {
    e.persist();
    clearTimeout(timeout);
    setLoading(true);
    // console.log("cleared", timeout);
    if (e.target.value != "") {
      e.target.classList.add("show-measure");
      e.target.nextElementSibling.style.left = 13 + e.target.value.length * 9.4 + "px";
    } else {
      e.target.classList.remove("show-measure");
    }
    timeout = setTimeout(() => {
      dispatch({
        field: e.target.name,
        value: e.target.value === "" ? 0 : e.target.value,
        type: "update",
      });
      // console.log("dispatched");
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }, 900);
  };

  useEffect(() => {
    if (!Object.values(state).filter((el) => el === "").length) {
      const shirochina = +state["measure-a"] + +state["measure-e"] + +state["measure-f"];
      const visochina = +state["measure-b"] + +state["measure-d"];
      const dulbochina = +state["measure-c"];

      const foundA = found(shirochina, measureA);
      const foundB = found(visochina, measureB);
      const foundC = found(dulbochina, measureC);

      if (foundA && foundB && foundC) {
        if (dLines !== "default") {
          // const possibleModels = Object.keys(modelsSelect).reduce((acc, current, i) => {
          //   if (foundA[i] && foundB[i] && foundC[i]) {
          //     acc.push({ key: i, model: current, value: [foundA[i], foundB[i]] });
          //   }
          //   return acc;
          // }, []);
          const possibleModels = Object.keys(modelsSelect)
            .filter((el, i) => foundA[i] && foundB[i] && foundC[i])
            .map((el, i) => ({ key: el, value: [foundA[i], foundB[i]], model: modelsSelect[el] }));
          // currentPrice.current = prices[possibleModels[0].model][dLines];
          // setMeasureState(possibleModels[0]);
          setDModels(possibleModels[0].key);
          // console.log(possibleModels);
          // console.log(modelsSelect);

          dispatchEnd({
            updatedProp: {
              foundModel: possibleModels[0].key,
              endPrice: prices[possibleModels[0].key][dLines],
              horCut: possibleModels[0].value[0] === 2,
              verCut: possibleModels[0].value[1] === 2,
              possibleModels,
            },
            type: "update",
          });
        }
      } else {
        dispatchEnd({
          updatedProp: {
            foundModel: false,
          },
          type: "update",
        });
      }
      // console.log(foundA, foundB, foundC);
    } else {
      dispatchEnd({
        updatedProp: {
          foundModel: false,
        },
        type: "update",
      });
    }
  }, [state, dLines]);

  useEffect(() => {
    setDColors("default");
  }, [dLines]);

  useEffect(() => {
    if (dModels === "default") return;
    const currModel = endState.possibleModels.find((el) => el.key === dModels);
    // console.log(currModel, endState.possibleModels, dModels);

    dispatchEnd({
      updatedProp: {
        endPrice: prices[currModel.key][dLines],
        horCut: currModel.value[0] === 2,
        verCut: currModel.value[1] === 2,
      },
      type: "update",
    });
  }, [dModels]);
  // console.log(endState.possibleModels, dModels);

  const sendForm = (e) => {
    e.preventDefault();
    setFormNotice(false);
    if (
      [dLines, dColors].find((el) => el === "default") ||
      ["name", "email", "city", "phone", "message"].find(
        (el) => formRef.current.elements.namedItem("form-" + el).value === ""
      )
    ) {
      setFormNotice("Моля, попълнете всички полета");
      return;
    }

    const currEmail = formRef.current.elements.namedItem("form-email").value;
    if (!/^[a-zA-Z][a-zA-Z0-9._-]*@[a-zA-Z0-9]+\.[a-zA-Z]+/.test(currEmail)) {
      setFormNotice("Неправилен имейл адрес");
      return;
    }

    const currPhone = formRef.current.elements.namedItem("form-phone").value;
    if (!/[+0-9]{5,}/.test(currPhone)) {
      setFormNotice("Неправилен телефонен номер");
      return;
    }

    setLoading(true);
    const data = {
      "form-name": formRef.current["form-name"].value,
      "form-email": formRef.current["form-email"].value,
      "form-city": formRef.current["form-city"].value,
      "form-phone": formRef.current["form-phone"].value,
      "form-message": formRef.current["form-message"].value,
      lines: linesSelect[dLines],
      color: colorsSelect[dLines][dColors][0],
      "measure-a": formRef.current["measure-a"].value || 0,
      "measure-b": formRef.current["measure-b"].value || 0,
      "measure-c": formRef.current["measure-c"].value || 0,
      "measure-d": formRef.current["measure-d"].value || 0,
      "measure-e": formRef.current["measure-e"].value || 0,
      "measure-f": formRef.current["measure-f"].value || 0,
      opening: openingSelect[dOpening],
      remote: remoteSelect[dRemote],
      model: modelsSelect[dModels],
      horCut: endState.horCut,
      verCut: endState.verCut,
      possibleModels: endState.possibleModels,
    };
    // console.log(data);

    fetch("/wp-json/rcv2/v1/sendmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((e) => {
        if (e.ok) {
          setLoading(false);
          setFormNotice("Запитването е изпратено успешно! Ще се свържем с вас скоро.");
        } else {
          setLoading(false);
          setFormNotice("Сървърна грешка при изпращане на запитване");
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setFormNotice("Сървърна грешка при изпращане на запитване");
      });
  };
  // console.log(loading, endState.foundModel);

  return (
    <div className="container" css={{ "@media (max-width: 400px)": { padding: 0 } }}>
      <form ref={formRef}>
        <div css={calcContainer}>
          <div className="double-top-lines" />
          <h3 css={calcTitle}>Подайте запитване за цена</h3>
          <div css={gridContainer({ gap: 30, min: 500 })}>
            <div>
              <DelTitle title="Данни за контакт" />
              <div css={gridContainer({ gap: 15, min: 250 })}>
                <input css={inputMain} type="text" placeholder="Име:*" id="form-name" name="form-name" />
                <input
                  css={inputMain}
                  type="text"
                  placeholder="Град:*"
                  id="form-city"
                  name="form-city"
                />
                <input
                  css={inputMain}
                  type="tel"
                  placeholder="Телефон:*"
                  id="form-phone"
                  name="form-phone"
                />
                <input
                  css={inputMain}
                  type="email"
                  placeholder="Имейл:*"
                  id="form-email"
                  name="form-email"
                />
                <textarea
                  css={[inputMain, textareaMain, gridFullRow]}
                  placeholder="Съобщение:*"
                  id="form-message"
                  name="form-message"
                />
              </div>
            </div>
            <div>
              <DelTitle title="Моля, изберете дизайн и цвят" />
              <div css={gridContainer({ gap: 15, min: 250 })}>
                <div>
                  <CustomSelect
                    ref={colorSelectRef}
                    customClassname="cselect-colors"
                    selectEntries={linesSelect}
                    sliceFrom={1}
                    selectValue={dLines}
                    setSelectValue={setDLines}
                  />
                </div>
                <div>
                  <CustomSelect
                    ref={linesSelectRef}
                    customClassname="cselect-lines"
                    selectEntries={colorsSelect[dLines]}
                    sliceFrom={1}
                    selectValue={dColors}
                    setSelectValue={setDColors}
                    OptionComponent={ColorsSelectOption}
                    optionEntries={Object.assign(
                      {},
                      ...Object.keys(colorsSelect).map((key) => ({ [key]: colorsSelect[key][0] }))
                    )}
                  />
                </div>
              </div>
            </div>
            <div css={gridFullRow}>
              <DelTitle title="Визуална схема на размерите на гаража" />
              <div css={{ display: "flex", flexWrap: "wrap" }}>
                <img
                  width="790px"
                  height="607px"
                  src="https://delice.bg/wp-content/uploads/2020/04/garage-visuals-A.jpg"
                  css={[schemeImg, { flex: "47 47 235px", width: "260px" }]}
                />
                <img
                  width="1219px"
                  height="607px"
                  src="https://delice.bg/wp-content/uploads/2020/04/garage-visuals-B.jpg"
                  css={[schemeImg, { flex: "70 70 350px", width: "370px" }]}
                />
              </div>
            </div>
            <div css={gridFullRow}>
              <DelTitle title="Моля, въведете размерите на своя гараж в сантиметри" />
              <div css={gridMeasures}>
                {/* gridContainer({ gap: 25, min: 350 })}> */}
                <div css={[flexStretch, { gridArea: "a" }]}>
                  <div css={measureBox}>
                    <BoxTitle title="Широчина между стените A + F + E" />
                    <MeasureInput onChange={onChange} id="measure-a" label="A" />
                    <MeasureInput onChange={onChange} id="measure-f" label="F" />
                    <MeasureInput onChange={onChange} id="measure-e" label="E" />
                  </div>
                </div>
                <div css={[flexStretch, { gridArea: "b" }]}>
                  <div css={measureBox}>
                    <BoxTitle title="Дълбочина на гаража C" />
                    <MeasureInput onChange={onChange} id="measure-c" label="C" />
                  </div>
                </div>
                <div css={[flexStretch, { gridArea: "c" }]}>
                  <div css={measureBox}>
                    <BoxTitle title="Височина до тавана B + D" />
                    <MeasureInput onChange={onChange} id="measure-b" label="B" />
                    <MeasureInput onChange={onChange} id="measure-d" label="D" />
                  </div>
                </div>
                <div css={{ gridArea: "d" }}>
                  <label css={{ paddingLeft: "8px" }} htmlFor="cselect-opening">
                    Аварийно отваряне
                  </label>
                  <CustomSelect
                    ref={openingSelectRef}
                    customClassname="cselect-opening"
                    selectEntries={openingSelect}
                    selectValue={dOpening}
                    setSelectValue={setDOpening}
                  />
                </div>
                <div css={{ gridArea: "e" }}>
                  <label css={{ paddingLeft: "8px" }} htmlFor="cselect-remote">
                    Допълнително дистанционно HSE4 BiSecur
                  </label>
                  <CustomSelect
                    ref={remoteSelectRef}
                    customClassname="cselect-remote"
                    selectEntries={remoteSelect}
                    selectValue={dRemote}
                    setSelectValue={setDRemote}
                  />
                </div>
                <div css={{ gridArea: "f" }}>
                  <label css={{ paddingLeft: "8px" }} htmlFor="cselect-models">
                    Предпочитан размер на вратата
                  </label>
                  <CustomSelect
                    ref={modelsSelectRef}
                    customClassname="cselect-models"
                    selectEntries={modelsSelect}
                    availableEntries={endState.possibleModels}
                    selectValue={dModels}
                    setSelectValue={setDModels}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div css={[calcContainer, endBox]}>
          <div css={endImgContainer}>
            {dLines !== "default" && dColors !== "default" ? (
              <img
                css={{ width: "300px", height: "300px" }}
                src={`https://delice.bg/wp-content/uploads/2020/04/calc-${dLines}-${dColors}.jpg`}
              />
            ) : (
              ""
            )}
          </div>
          <div css={endContainer}>
            <div css={endTitleBox}>
              <DelTitle title={`Гаражна врата Renomatic 2020 ${linesSelect[dLines]}`} />
              <span css={[priceSpan, { marginLeft: "auto" }]}>Цена: {endState.endPrice} лв.</span>
            </div>
            <p>
              Комплект автоматична гаражна врата RenoMatic 2020 с включено задвижване ProMatic 4 BiSecur
              и 1 дистанционнo HSE 4 BS
            </p>
            <div>
              {endState.horCut ? (
                <p css={addPrices}>
                  <span>- Прерязване по широчина</span>
                  <span>+ 60лв.</span>
                </p>
              ) : (
                ""
              )}
              {endState.verCut ? (
                <p css={addPrices}>
                  <span>- Прерязване по височина</span>
                  <span>+ 60лв.</span>
                </p>
              ) : (
                ""
              )}
              {dOpening !== "default" ? (
                <p css={addPrices}>
                  <span>- {openingData[dOpening][0]}</span>
                  <span>+ {openingData[dOpening][1]}лв.</span>
                </p>
              ) : (
                ""
              )}
              {dRemote !== "default" ? (
                <p css={addPrices}>
                  <span>{`- ${dRemote.substr(3)} бр. допълнително дистанционно HSE4 BiSecur`}</span>
                  <span>+ {dRemote.substr(3) * 90}лв.</span>
                </p>
              ) : (
                ""
              )}
            </div>
            <div css={endButtonBox}>
              <span css={priceSpan}>
                Крайна цена{" "}
                {endState.endPrice +
                  (endState.horCut && 60) +
                  (endState.verCut && 60) +
                  openingData[dOpening][1] +
                  (dRemote.substr(3) * 90 || 0)}
                лв.
              </span>
              {formNotice ? <div css={notice}>{formNotice}</div> : ""}
              <button css={sendButton} onClick={sendForm} type="submit">
                Изпрати
                <svg className="icon">
                  <use xlinkHref="#arrow" />
                </svg>
              </button>
            </div>
            {dLines === "default" || dColors === "default" ? (
              <div css={endNotice}>Моля, изберете желаните дизайн и цвят</div>
            ) : endState.foundModel === false ? (
              <div css={endNotice}>Предоставените размери не отговарят на нито един модел</div>
            ) : (
              ""
            )}
            {loading ? (
              <div css={endNotice}>
                <img src="https://delice.bg/wp-content/themes/delice/dist/img/preload.png" />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
