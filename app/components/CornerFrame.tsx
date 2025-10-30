"use client";

import type { PropsWithChildren, HTMLAttributes } from "react";

type CornerFrameProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    borderColor?: string; // main border color
    cornerColor?: string; // accent color for corner squares
    paddingClassName?: string; // control inner padding via class
  }
>;

export default function CornerFrame({
  children,
  className,
  borderColor = "#C0C0C0",
  cornerColor = "#FFFFFF",
  paddingClassName = "p-4",
  ...rest
}: CornerFrameProps) {
  return (
    <div
      className={`relative border ${paddingClassName} ${className ?? ""}`}
      style={{ borderColor: borderColor, backgroundColor: "#000000" }}
      {...rest}
    >
      <span
        className="absolute w-3 h-3 border-[2px] rounded-[2px] top-[-6px] left-[-6px] border-r-0 border-b-0"
        style={{ borderColor: cornerColor, filter: `drop-shadow(0 0 2px ${cornerColor})` }}
      />
      <span
        className="absolute w-3 h-3 border-[2px] rounded-[2px] top-[-6px] right-[-6px] border-l-0 border-b-0"
        style={{ borderColor: cornerColor, filter: `drop-shadow(0 0 2px ${cornerColor})` }}
      />
      <span
        className="absolute w-3 h-3 border-[2px] rounded-[2px] bottom-[-6px] left-[-6px] border-r-0 border-t-0"
        style={{ borderColor: cornerColor, filter: `drop-shadow(0 0 2px ${cornerColor})` }}
      />
      <span
        className="absolute w-3 h-3 border-[2px] rounded-[2px] bottom-[-6px] right-[-6px] border-l-0 border-t-0"
        style={{ borderColor: cornerColor, filter: `drop-shadow(0 0 2px ${cornerColor})` }}
      />
      {children}
    </div>
  );
}


