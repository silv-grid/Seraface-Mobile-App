import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Gradients, GradientDirections } from "../../../constants/gradients";

export const GradientView = ({
  preset = "primaryButton",
  direction = "leftToRight",
  children,
  style,
  className,
  ...props
}) => (
  <LinearGradient
    colors={Gradients[preset]}
    start={
      typeof direction === "string"
        ? GradientDirections[direction].start
        : direction.start
    }
    end={
      typeof direction === "string"
        ? GradientDirections[direction].end
        : direction.end
    }
    style={style}
    className={className}
    {...props}
  >
    {children}
  </LinearGradient>
);
