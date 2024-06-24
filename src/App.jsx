import { Upload } from "./components/Upload";
import { FileList } from "./components/File";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { appWindow } from "@tauri-apps/api/window";
import { Config } from "./components/Config";

function App() {
  const [menu, setMenu] = useState("upload");
  const [appColor, setAppColor] = useState(
    localStorage.getItem("app-color") || "#dedede"
  );
  useHotkeys("shift+f", async () => await appWindow.close(), {
    scopes: ["settings"],
  });

  useEffect(() => {
    if (!localStorage.getItem("app-color")) {
      localStorage.setItem("app-color", "#dedede");
    }
    setAppColor(localStorage.getItem("app-color"));
  }, [localStorage.getItem("app-color")]);

  return (
    <div className="bg-neutral-900/90" data-tauri-drag-region>
      <div
        className={`h-[100vh] w-[100vw] p-4 text-sm overflow-hidden text-neutral-300 transition-all`}
        style={{ backgroundColor: appColor + "08" }}
      >
        {menu == "upload" && <Upload setMenu={setMenu} />}
        {menu == "fileList" && <FileList setMenu={setMenu} />}
        {menu == "configuracao" && <Config setMenu={setMenu} />}
      </div>
    </div>
  );
}

export default App;
