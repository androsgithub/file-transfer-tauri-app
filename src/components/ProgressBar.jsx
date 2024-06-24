import { LoaderCircle } from "lucide-react";
import React from "react";

export const ProgressBar = ({ progress, color = localStorage.getItem("app-color") }) => {
  return (
    <div className="w-full h-2 m-2 rounded-full flex items-center flex-col transition-all">
      <div className="bg-white/50 w-full h-2 rounded-full transition-all">
        <div
          className={`h-2 rounded-full transition-all`}
          style={{
            width: `${progress}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <div className="flex gap-2 items-center p-3 animate-fadeIn">
        <LoaderCircle
          size={16}
          className="animate-spin transition-all"
          color={color}
          strokeWidth={3}
        />
        <p
          className="text-xs font-semibold transition-all"
          style={{ color: color }}
        >
          {progress}%
        </p>
      </div>
    </div>
  );
};
