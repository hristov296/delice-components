/** @jsx jsx */
import React, { useState, useCallback } from "react";
import { jsx } from "@emotion/core";
import classnames from "classnames";

import { inputMain, flexCenter, selectDown, cselectList, cselectOption } from "./Components";

const DefaultSelectOption = React.memo((props) => <>{props.value}</>);

export default React.forwardRef((props, selectRef) => {
  const {
    selectEntries,
    availableEntries,
    optionEntries = selectEntries,
    customClassname,
    selectValue,
    setSelectValue,
    sliceFrom = 0,
    OptionComponent = DefaultSelectOption,
  } = props;
  const [showSelect, setSelect] = useState(false);

  const handleBodyClick = useCallback((ev) => {
    const currentPath = ev.path || (ev.composedPath && ev.composedPath());
    // console.log("executing");

    if (!currentPath.filter((el) => el.classList && el.classList.contains(customClassname)).length) {
      // console.log("removing2");
      setSelect(false);
      document.body.removeEventListener("click", handleBodyClick);
    }
  }, []);

  const toggleSelect = useCallback((showSelect) => {
    if (showSelect) {
      // console.log("removing");
      document.body.removeEventListener("click", handleBodyClick);
      setSelect(false);
    } else {
      // console.log("adding");

      document.body.addEventListener("click", handleBodyClick);
      setSelect(true);
    }
  }, []);

  const cselectClick = useCallback((val, isDisabled) => {
    if (isDisabled) return;
    document.body.removeEventListener("click", handleBodyClick);
    setSelect(false);
    selectRef.current.value = val;
    setSelectValue(val);
  }, []);

  return (
    <>
      <select ref={selectRef} className="screen-reader-text" id={customClassname} name={customClassname}>
        {Object.entries(optionEntries).map((el, i) => (
          <option key={i} value={el[0]}>
            {el[1]}
          </option>
        ))}
      </select>
      <div
        className={customClassname}
        role="presentantion"
        css={{ position: "relative", cursor: "pointer" }}>
        <div
          onClick={() => toggleSelect(showSelect)}
          css={[inputMain, flexCenter]}
          className="cselect-active">
          <OptionComponent
            value={selectEntries[selectValue] ? selectEntries[selectValue] : selectEntries.default}
            isDefault={selectValue === "default" || !selectEntries[selectValue]}
          />
          <svg css={selectDown}>
            <use xlinkHref="#ch-down" />
          </svg>
        </div>
        <div className={classnames("cselect-list", { active: showSelect })} css={cselectList}>
          {Object.entries(selectEntries)
            .slice(sliceFrom)
            .map((el, i) => {
              const isDisabled =
                availableEntries && availableEntries.map((el) => el.key).indexOf(el[0]) === -1;
              return (
                <div
                  key={i}
                  onClick={() => cselectClick(el[0], isDisabled)}
                  css={[cselectOption, flexCenter]}
                  className={classnames("cselect-item", { disabled: isDisabled })}>
                  <OptionComponent value={el[1]} />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
});
