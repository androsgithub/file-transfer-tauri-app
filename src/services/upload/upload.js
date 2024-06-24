import axios from "axios";

export const upload = async (file, setProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios
    .post(localStorage.getItem("server-ip"), formData, {
      onUploadProgress: (e) => {
        if (setProgress) {
          setProgress(Math.round(e.progress * 100));
        }
      },
    })
    .catch((error) => error);

  return response;
};
