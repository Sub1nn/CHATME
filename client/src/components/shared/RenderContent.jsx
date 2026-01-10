/**
 * RenderContent.jsx
 *
 * Utility renderer for message attachments.
 *
 * Responsibilities:
 *  - Render the correct UI element based on detected file type
 *  - Support common attachment types used in chat messages:
 *      - images
 *      - videos
 *      - audio files
 *      - fallback for unknown file types
 *
 * This function is intentionally kept simple and stateless.
 * It returns a JSX element based on the provided file type.
 */

import React from "react";

// Utility used to resize / optimize image URLs before rendering
import { transformImage } from "../../lib/features";

// Fallback icon for unsupported or unknown file types
import { FileOpen as FileOpenIcon } from "@mui/icons-material";

/**
 * RenderAttachment
 *
 * @param {string} file - Detected file type (e.g. "image", "video", "audio")
 * @param {string} url  - Direct URL to the attachment resource
 *
 * @returns {JSX.Element} Rendered attachment component
 */
const RenderAttachment = (file, url) => {
  switch (file) {
    // Video attachment with controls enabled
    case "video":
      return <video src={url} preload="none" width={"200px"} controls />;

    // Image attachment with basic size constraints
    case "image":
      return (
        <img
          src={transformImage(url, 200)}
          alt="Attachement"
          width={"200px"}
          height={"150px"}
          style={{
            objectFit: "contain",
          }}
        />
      );

    // Audio attachment with native browser controls
    case "audio":
      return <audio src={url} preload="none" controls />;

    // Fallback for unsupported file types
    default:
      return <FileOpenIcon />;
  }
};

export default RenderAttachment;
