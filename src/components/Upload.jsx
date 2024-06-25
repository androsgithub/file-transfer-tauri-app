import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Badge } from "./Badge";
import { upload } from "../services/upload/upload";
import {
  Check,
  CircleX,
  Info,
  List,
  LoaderCircle,
  Send,
  Settings,
  X,
} from "lucide-react";
import { appWindow } from "@tauri-apps/api/window";
import { useHotkeys } from "react-hotkeys-hook";
import { ProgressBar } from "./ProgressBar";

export const Upload = ({ setMenu }) => {
  const [files, setFiles] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [enviado, setEnviado] = useState(false);
  const [errorOnSend, setErrorOnSend] = useState(null);
  const [isSending, setIsSending] = useState(false);

  useHotkeys("shift+e", () => uploadFiles(), { scopes: ["settings"] });
  useHotkeys("shift+a", () => setMenu("fileList"), { scopes: ["settings"] });

  const handleRemoveAllFiles = () => {
    setFiles(null);
    setProgress(0);
    setCurrentFile(null);
  };

  const uploadFiles = async () => {
    let response;
    let finished;

    for (let file in files) {
      setIsSending(true);
      setCurrentFile({ file: files[file], index: parseInt(file) + 1 });
      response = await upload(files[file], setProgress);
      await new Promise((r) => setTimeout(r, 100));
      setIsSending(false);
      if (response.name == "AxiosError") {
        setErrorOnSend(response);
        setCurrentFile(null);
        setProgress(0);
        setTimeout(() => setErrorOnSend(null), 750);
        return;
      }

      if (file == files.length - 1) {
        finished = true;
      }
    }

    if (response.status === 201 && finished) {
      setEnviado(true);
      setFiles(null);
      setCurrentFile(null);
      setTimeout(() => setEnviado(false), 750);
      setProgress(0);
    }
  };

  useEffect(() => {
    if (!files) {
      setProgress(0);
    }
  }, [progress]);

  useEffect(() => {
    const handlePaste = (event) => {
      const clipboardItems = event.clipboardData.items;
      const filesArray = [];

      for (let i = 0; i < clipboardItems.length; i++) {
        if (clipboardItems[i].kind === "file") {
          const file = clipboardItems[i].getAsFile();
          filesArray.push(file);
        }
      }

      if (filesArray.length > 0) {
        setFiles(filesArray);
      }
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div
      className="flex flex-col h-full w-full gap-4 items-center"
      data-tauri-drag-region
    >
      {files || progress > 0 ? (
        <HasFile
          files={files}
          handleRemoveAllFiles={handleRemoveAllFiles}
          setCurrentFile={setCurrentFile}
          progress={progress}
          currentFile={currentFile}
          errorOnSend={errorOnSend}
          isSending={isSending}
        />
      ) : (
        <Dropzone setFiles={setFiles} enviado={enviado} />
      )}
      <div
        className="flex items-center justify-center text-neutral-700 font-bold w-full"
        data-tauri-drag-region
      >
        <div className="w-full h-[2px] bg-white/10" data-tauri-drag-region />
        <p className="text-xs z-10 px-3" data-tauri-drag-region>
          Ferramentas
        </p>
        <div className="w-full h-[2px] bg-white/10" data-tauri-drag-region />
      </div>
      <div
        className="flex flex-col items-start justify-between w-full h-full font-semibold"
        data-tauri-drag-region
      >
        <button
          disabled={files && localStorage.getItem("server-ip") ? false : true}
          className={`transition-all flex items-center gap-3 duration-300 relative cursor-default ${
            files ? "hover:bg-white/5" : ""
          } ${
            localStorage.getItem("server-ip") ? "" : "hover:bg-transparent"
          } p-1 pl-2 rounded-full w-full`}
          style={{
            color: files
              ? localStorage.getItem("app-color")
              : "rgb(64, 64, 64)",
          }}
          onClick={uploadFiles}
        >
          {progress > 0 ? (
            <>
              <LoaderCircle
                size={20}
                strokeWidth={3}
                style={{
                  transition: "all 300ms",
                  color: files ? localStorage.getItem("app-color") : "#383838",
                }}
                className="animate-spin"
              />
              Enviando...
            </>
          ) : (
            <>
              {localStorage.getItem("server-ip") ? (
                <>
                  <Send
                    size={20}
                    style={{
                      rotate: files ? "0deg" : "45deg",
                      transition: "all 300ms",
                      color: files
                        ? localStorage.getItem("app-color")
                        : "#383838",
                    }}
                  />
                  {files ? "Enviar" : "Adicione um arquivo"}
                </>
              ) : (
                <div className="flex gap-2 text-md font-bold items-center">
                  <Info
                    size={20}
                    strokeWidth={2.5}
                    style={{ transition: "all 300ms" }}
                  />
                  <span className="transition-all">Insira um servidor</span>
                </div>
              )}
            </>
          )}
          {localStorage.getItem("server-ip") && <Badge text="SHIFT + E" />}
        </button>

        <button
          className="pl-2 transition-all flex items-center gap-3 text-neutral-300 hover:bg-white/5 p-1 rounded-full w-full"
          onClick={() => setMenu("fileList")}
        >
          <List size={20} /> Ver todos os arquivos <Badge text="SHIFT + A" />
        </button>
        <button
          className="pl-2 transition-all flex items-center gap-3 text-neutral-300 hover:bg-white/5 p-1 rounded-full w-full"
          onClick={async () => setMenu("configuracao")}
        >
          <Settings
            size={25}
            color="#d4d4d4"
            strokeWidth={2}
            style={{ width: 25, height: 25 }}
          />
          Configurações <Badge text="SHIFT + A" />
        </button>
        <button
          className="pl-2 transition-all flex items-center gap-3 text-neutral-300 hover:bg-white/5 p-1 rounded-full w-full"
          onClick={async () => await appWindow.close()}
        >
          <CircleX size={20} /> Sair <Badge text="SHIFT + F" />
        </button>
      </div>
    </div>
  );
};

const HasFile = ({
  files,
  progress,
  currentFile,
  errorOnSend,
  isSending,
  handleRemoveAllFiles,
}) => {
  return (
    <div
      className={`flex flex-col justify-center items-center bg-[rgba(255,255,255,0.03)] p-2 text-white w-full h-full rounded-lg border-white/10 border-[2px]  relative transition-all ${
        errorOnSend
          ? "border-red-500 bg-red-500/10 hover:border-red-500 hover:bg-red-500/10 border-double"
          : ""
      } ${
        isSending
          ? "border-t-neutral-500/75 border-r-neutral-500/75 bg-gradient-to-tr from-neutral-500/5 to-neutral-200/10 border-solid animate-pulse"
          : "border-dashed"
      }`}
      data-tauri-drag-region
    >
      <span
        className="text-center text-xs text-neutral-500 font-semibold h-full w-full flex flex-col items-center justify-center break-all"
        data-tauri-drag-region
      >
        {!errorOnSend ? (
          <>
            {progress > 0 && currentFile ? (
              <span>{currentFile?.file?.name}</span>
            ) : (
              <>
                {files?.length > 1 ? (
                  <span>{files?.length} arquivos</span>
                ) : (
                  <>{files?.[0].name}</>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {errorOnSend ? (
              <div className="flex w-full items-center justify-center gap-1 text-xs text-[#40ff80] animate-scaleIn">
                <X size={22} strokeWidth={2} color="red" />
              </div>
            ) : (
              ""
            )}
          </>
        )}
        {currentFile && files?.length > 1 && (
          <span className="text-neutral-400 font-semibold mt-1">
            {currentFile?.index}/{files?.length}
          </span>
        )}
        {progress > 0 && <ProgressBar progress={progress} />}
      </span>

      {!errorOnSend && (
        <button
          onClick={handleRemoveAllFiles}
          className="flex justify-center items-center absolute right-0 top-0 text-neutral-400 hover:text-neutral-200 hover:cursor-default transition-all"
        >
          <X size={20} className="m-2" />
        </button>
      )}
    </div>
  );
};

function Dropzone({ setFiles, enviado }) {
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col w-full justify-center items-center bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.04)] p-2 text-white h-full rounded-lg border-white/10 relative ${
        isDragActive ? "border-dashed border-[3px]" : "border-[1px]"
      } ${
        enviado
          ? "border-green-500 bg-green-500/10 hover:border-green-500 hover:bg-green-500/10"
          : ""
      } `}
    >
      <input {...getInputProps()} />{" "}
      <div
        className={`text-center text-neutral-500 flex flex-col gap-2 items-center justify-center`}
      >
        {!enviado && (
          <>
            {isDragActive ? (
              <>Solte para enviar</>
            ) : (
              <>
                <span>
                  <span
                    className="font-semibold"
                    style={{ color: localStorage.getItem("app-color") }}
                  >
                    Clique/Jogue
                  </span>{" "}
                  arquivos aqui
                </span>
                <span className="text-xs">
                  <Badge text="CTRL + V" />
                </span>
              </>
            )}
          </>
        )}
      </div>
      {enviado ? (
        <div className="flex w-full items-center justify-center gap-1 text-xs text-[#40ff80] animate-scaleIn">
          <Check size={18} strokeWidth={2} color="#40ff80" />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
