import React from "react";
import { transformImage } from "../../lib/features";
import { FileOpen as FileOpenIcon } from "@mui/icons-material";

const RenderContent = (file, url) => {
  switch (file) {
    case "video":
      return <video src={url} controls preload="none" width={"200px"} />;
      break;
    case "audio":
      return <audio src={url} controls preload="none" />;
      break;
    case "image":
      return (
        <img
          src={transformImage(url, 200)}
          alt="Attachment"
          width={"200px"}
          height={"150px"}
          style={{
            objectFit: "contain",
          }}
        />
      );
      break;
    case "audio":
      return <audio src={url} controls preload="none" />;
      break;

    default:
      return <FileOpenIcon />;
  }
};

export default RenderContent;
