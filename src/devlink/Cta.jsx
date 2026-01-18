"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./Cta.module.css";

export function Cta({ as: _Component = _Builtin.Block }) {
  return (
    <_Component className={_utils.cx(_styles, "section")} tag="div">
      <_Builtin.Block className={_utils.cx(_styles, "div-block-2")} tag="div">
        <_Builtin.Block className={_utils.cx(_styles, "container")} tag="div">
          <_Builtin.Block className={_utils.cx(_styles, "cta-wrap")} tag="div">
            <_Builtin.Block
              className={_utils.cx(_styles, "div-block")}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(_styles, "cta-text")}
                tag="div"
              >
                <_Builtin.Block
                  className={_utils.cx(_styles, "heading-jumbo-small")}
                  tag="div"
                >
                  {"Call To Action"}
                  <br />
                </_Builtin.Block>
                <_Builtin.Block
                  className={_utils.cx(
                    _styles,
                    "paragraph-bigger",
                    "cc-bigger-light"
                  )}
                  tag="div"
                >
                  {
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique."
                  }
                  <br />
                </_Builtin.Block>
              </_Builtin.Block>
              <_Builtin.Link
                className={_utils.cx(
                  _styles,
                  "primary-button",
                  "cc-jumbo-button"
                )}
                button={false}
                block="inline"
                options={{
                  href: "#",
                }}
              >
                <_Builtin.Block
                  className={_utils.cx(_styles, "text-block-2")}
                  tag="div"
                >
                  {"Start Now"}
                </_Builtin.Block>
              </_Builtin.Link>
            </_Builtin.Block>
          </_Builtin.Block>
        </_Builtin.Block>
      </_Builtin.Block>
    </_Component>
  );
}
