"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./Navigation.module.css";

export function Navigation({ as: _Component = _Builtin.NavbarWrapper }) {
  return (
    <_Component
      className={_utils.cx(_styles, "navigation")}
      tag="div"
      data-collapse="medium"
      data-animation="default"
      data-duration="400"
      config={{
        animation: "default",
        easing: "ease",
        easing2: "ease",
        duration: 400,
        docHeight: false,
        collapse: "medium",
        noScroll: false,
      }}
    >
      <_Builtin.Block
        className={_utils.cx(_styles, "navigation-wrap")}
        tag="div"
      >
        <_Builtin.NavbarBrand
          className={_utils.cx(_styles, "logo-link")}
          options={{
            href: "#",
          }}
        >
          <_Builtin.Block
            className={_utils.cx(_styles, "text-block")}
            tag="div"
          >
            {"Attorneys"}
          </_Builtin.Block>
        </_Builtin.NavbarBrand>
        <_Builtin.Block className={_utils.cx(_styles, "menu")} tag="div">
          <_Builtin.NavbarMenu
            className={_utils.cx(_styles, "navigation-items")}
            tag="nav"
            role="navigation"
          >
            <_Builtin.NavbarLink
              className={_utils.cx(_styles, "navigation-item")}
              options={{
                href: "#",
              }}
            >
              {"About"}
            </_Builtin.NavbarLink>
            <_Builtin.NavbarLink
              className={_utils.cx(_styles, "navigation-item")}
              options={{
                href: "#",
              }}
            >
              {"Services"}
            </_Builtin.NavbarLink>
            <_Builtin.NavbarLink
              className={_utils.cx(_styles, "navigation-item")}
              options={{
                href: "#",
              }}
            >
              {"team"}
            </_Builtin.NavbarLink>
            <_Builtin.NavbarLink
              className={_utils.cx(_styles, "navigation-item")}
              options={{
                href: "#",
              }}
            >
              {"INSIGHTS"}
            </_Builtin.NavbarLink>
            <_Builtin.NavbarLink
              className={_utils.cx(_styles, "navigation-item")}
              options={{
                href: "#",
              }}
            >
              {"Contact"}
            </_Builtin.NavbarLink>
          </_Builtin.NavbarMenu>
          <_Builtin.NavbarButton
            className={_utils.cx(_styles, "menu-button")}
            tag="div"
          >
            <_Builtin.Image
              className={_utils.cx(_styles, "menu-icon")}
              width="22"
              height="auto"
              loading="auto"
              alt=""
              src="https://cdn.prod.website-files.com/69059c60310619b7b211df93/69059c61310619b7b211e054_menu-icon.png"
            />
          </_Builtin.NavbarButton>
        </_Builtin.Block>
        <_Builtin.Link
          className={_utils.cx(_styles, "primary-button", "cc-contact-us")}
          button={false}
          block="inline"
          options={{
            href: "mailto:mail@business.com?subject=You've%20got%20mail!",
          }}
        >
          <_Builtin.Block tag="div">{"Contact us"}</_Builtin.Block>
        </_Builtin.Link>
      </_Builtin.Block>
    </_Component>
  );
}
