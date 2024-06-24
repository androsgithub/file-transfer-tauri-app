import React from "react";

export const Badge = ({ text }) => {
  return (
    <pre
      className="text-[9px] p-[1px] px-[8px] bg-white/5 rounded-md text-white/20 border-b-[1px] border-white/15"
      data-tauri-drag-region
    >
      {text}
    </pre>
  );
};
