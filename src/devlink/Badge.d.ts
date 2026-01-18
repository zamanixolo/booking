import * as React from "react";
import * as Types from "./types";

declare function Badge(props: {
  as?: React.ElementType;
  text?: Types.Builtin.Text;
  variant?: "Light" | "Dark";
}): React.JSX.Element;
