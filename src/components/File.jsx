import axios from "axios";
import {
  ArrowLeft,
  FileAudio,
  FileImage,
  FileVideo,
  LoaderCircle,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export const File = ({ title }) => {
  // const extension = useRef("");
  const [extension, setExtension] = useState(
    title.split(".")[title.split(".").length - 1] || ""
  );

  return (
    <a
      className="flex w-full h-full items-center hover:bg-white/10 animate-fadeInOpacity rounded-sm"
      href={`${localStorage.getItem("server-ip")}/files/${title.replaceAll(
        "#",
        "%23"
      )}`}
      target="_blank"
    >
      <div className="p-1">
        {extension == "mp4" && <FileVideo size={16} />}
        {(extension == "png" ||
          extension == "jpg" ||
          extension == "jpeg" ||
          extension == "mpeg") && <FileImage size={16} />}
        {extension == "mp3" && <FileAudio size={16} />}
      </div>
      <p className="flex">
        <div className="whitespace-nowrap text-ellipsis overflow-hidden max-w-[68vw]">
          {title
            .replaceAll(extension, "")
            .substring(title.indexOf("_"))
            .replace("_", "")}
        </div>
        <div>{extension}</div>
      </p>
    </a>
  );
};

export const FileList = ({ setMenu }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [files, setFiles] = useState([]);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    getFiles();
  }, []);

  const getFiles = async () => {
    setIsLoading(true);
    const _files = await axios
      .get(localStorage.getItem("server-ip") + "/files")
      .then((response) => response.data.files)
      .catch(() => setError(true));
    setFiles(_files);

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-1 h-full w-full" data-tauri-drag-region>
      <div className="flex justify-between items-center" data-tauri-drag-region>
        <button
          onClick={() => setMenu("upload")}
          className="p-1 flex items-center gap-2 hover:bg-white/5 rounded-full transition-all px-3"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
        <input
          type="text"
          className="bg-transparent w-1/2"
          placeholder="Pesquisa"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
      </div>

      {isLoading ? (
        <div
          className="flex flex-col w-full h-full items-center justify-center gap-2 animate-fadeInOpacity"
          data-tauri-drag-region
        >
          <LoaderCircle
            size={25}
            strokeWidth={3}
            style={{
              transition: "all 300ms",
              color: "#67e8f9",
            }}
            className="animate-spin"
          />

          <span className="text-xs text-cyan-300">Carregando arquivos...</span>
        </div>
      ) : (
        <>
          <div className="h-[80vh]" data-tauri-drag-region>
            {error && (
              <div className="flex h-full">
                <div
                  className="flex flex-col w-full items-center justify-center gap-1 text-xs animate-scaleIn h-full p-4"
                  data-tauri-drag-region
                >
                  <X size={58} strokeWidth={2} color="red" />
                  <span className="text-red-500 text-center text-sm">
                    Erro ao carregar arquivos
                  </span>
                  <span className="text-red-500 text-center text-sm">
                    Verifique as configurações do aplicativo.
                  </span>
                </div>
              </div>
            )}

            <div
              className="overflow-y-auto overflow-x-hidden flex flex-col gap-4 max-h-[75vh] pr-1"
              data-tauri-drag-region
            >
              {!error && (
                <>
                  {files
                    .filter((arquivo) => arquivo.includes(searchText))
                    .map((file) => (
                      <File key={file} title={file} />
                    ))}
                </>
              )}
            </div>
            {files?.length == 0 && !error && (
              <div
                className="flex items-center justify-center h-full font-semibold text-neutral-500 animate-scaleIn"
                data-tauri-drag-region
              >
                Sem arquivos
              </div>
            )}
          </div>
        </>
      )}
      <p className="text-neutral-500 text-xs font-semibold text-center w-full animate-fadeIn flex items-center justify-center gap-1">
        Um total de{" "}
        {isLoading ? (
          <LoaderCircle
            size={8}
            style={{
              transition: "all 300ms",
              color: "white",
            }}
            className="animate-spin"
          />
        ) : (
          files?.length
        )}{" "}
        arquivos
      </p>
    </div>
  );
};
