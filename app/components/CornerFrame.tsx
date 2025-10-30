"use client";

import type { PropsWithChildren, HTMLAttributes } from "react";

type CornerFrameProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    borderColor?: string; // main border color
    cornerColor?: string; // accent color for corner squares
    paddingClassName?: string; // control inner padding via class
    cornerOffset?: number; // px offset outside the border (use 0 to sit on edge)
    cornerRadius?: number; // px corner square radius
    backgroundColor?: string; // inner background color of the box
  }
>;

export default function CornerFrame({
  children,
  className,
  borderColor = "#C0C0C0",
  cornerColor = "#EBF73F",
  paddingClassName = "p-4",
  cornerOffset = 0,
  cornerRadius = 0,
  backgroundColor = "#141414",
  ...rest
}: CornerFrameProps) {
  return (
    <div
      className={`relative border ${paddingClassName} ${className ?? ""}`}
      style={{ borderColor: borderColor, backgroundColor }}
      {...rest}
    >
      <span
        className="absolute w-4 h-4 border-2 border-r-0 border-b-0"
        style={{
          top: `${cornerOffset}px`,
          left: `${cornerOffset}px`,
          borderColor: cornerColor,
          borderRadius: `${cornerRadius}px`,
          filter: `drop-shadow(0 0 2px ${cornerColor})`,
        }}
      />
      <span
        className="absolute w-4 h-4 border-2 border-l-0 border-b-0"
        style={{
          top: `${cornerOffset}px`,
          right: `${cornerOffset}px`,
          borderColor: cornerColor,
          borderRadius: `${cornerRadius}px`,
          filter: `drop-shadow(0 0 2px ${cornerColor})`,
        }}
      />
      <span
        className="absolute w-4 h-4 border-2 border-r-0 border-t-0"
        style={{
          bottom: `${cornerOffset}px`,
          left: `${cornerOffset}px`,
          borderColor: cornerColor,
          borderRadius: `${cornerRadius}px`,
          filter: `drop-shadow(0 0 2px ${cornerColor})`,
        }}
      />
      <span
        className="absolute w-4 h-4 border-2 border-l-0 border-t-0"
        style={{
          bottom: `${cornerOffset}px`,
          right: `${cornerOffset}px`,
          borderColor: cornerColor,
          borderRadius: `${cornerRadius}px`,
          filter: `drop-shadow(0 0 2px ${cornerColor})`,
        }}
      />
      {children}
    </div>
  );
}


