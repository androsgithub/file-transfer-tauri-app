import { ArrowLeft, LoaderCircle, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { ProgressBar } from "./ProgressBar";

export const Config = ({ setMenu }) => {
  const [serverIp, setServerIp] = useState(
    localStorage.getItem("server-ip") || ""
  );
  const [appColor, setAppColor] = useState(
    localStorage.getItem("app-color") || "#ffffff"
  );

  const saveAll = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const ip = data.get("serverip");
    localStorage.setItem("server-ip", ip);
    saveColor();
    setMenu("upload");
  };

  const saveColor = () => {
    localStorage.setItem("app-color", appColor);
  };

  return (
    <form
      className="flex flex-col gap-2 w-full h-full"
      data-tauri-drag-region
      onSubmit={saveAll}
    >
      <div>
        <button
          onClick={() => setMenu("upload")}
          className="p-1 flex items-center gap-2 hover:bg-white/5 rounded-full transition-all px-3"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
      </div>

      <div
        className="flex flex-col py-2 justify-center h-full w-full gap-3"
        data-tauri-drag-region
      >
        <div className="flex flex-col gap-[3px]">
          <label htmlFor="" className="text-neutral-400">
            Servidor
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              className="bg-transparent w-full rounded-full border-[1px] border-neutral-400 p-1 px-3"
              placeholder="Insira um link de servidor"
              name="serverip"
              id="serverip"
              value={serverIp}
              onChange={(e) => setServerIp(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-[3px]">
          <label htmlFor="" className="text-neutral-400">
            Cor do aplicativo
          </label>
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <HexColorPicker
              style={{ height: "65px", width: "100%" }}
              onChange={setAppColor}
              color={appColor}
            />
          </div>
        </div>
        <div style={{ color: appColor }}>{appColor}</div>
        <div className="flex gap-4 items-center justify-center">
          <div
            className={`font-semibold`}
            style={{ transition: "all 300ms", color: appColor }}
          >
            Texto colorido
          </div>
        </div>
        <ProgressBar progress={50} color={appColor} />
      </div>
      <div className="flex justify-end items-center">
        <button className="relative" type="submit">
          <div className="bg-transparent transition-all hover:bg-white/10 rounded-full w-full h-full absolute"></div>
          <div
            className="flex p-1 px-4 gap-1 items-center justify-center font-bold rounded-full transition-all"
            style={{ backgroundColor: appColor + "22", color: appColor }}
          >
            <Save
              color={appColor}
              size={16}
              strokeWidth={2.3}
              className="transition-all"
            />
            Salvar
          </div>
        </button>
      </div>
    </form>
  );
};
