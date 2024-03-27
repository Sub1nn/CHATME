const fileFormat = (url = "") => {
  const fileExt = url.split(".").pop();
  if (fileExt === "mp4" || fileExt === "webm" || fileExt === "ogg") {
    return "video";
  } else if (fileExt === "mp3" || fileExt === "wav") {
    return "audio";
  } else if (fileExt === "pdf") {
    return "pdf";
  } else if (fileExt === "doc" || fileExt === "docx") {
    return "doc";
  } else if (fileExt === "xls" || fileExt === "xlsx") {
    return "xls";
  } else if (fileExt === "ppt" || fileExt === "pptx") {
    return "ppt";
  } else if (fileExt === "zip" || fileExt === "rar") {
    return "archive";
  } else if (fileExt === "txt") {
    return "txt";
  } else if (
    fileExt === "jpg" ||
    fileExt === "jpeg" ||
    fileExt === "png" ||
    fileExt === "gif"
  ) {
    return "image";
  } else {
    return "file";
  }
};

const transformImage = (url = "", width = 100) => {
  return url;
};

export { fileFormat, transformImage };
