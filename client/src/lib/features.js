/**
 * features.js
 *
 * Collection of small, reusable utility functions used across the client.
 *
 * Utilities included:
 *  - fileFormat: determine attachment type from file extension
 *  - transformImage: modify Cloudinary image URLs for optimization
 *  - getLast7Days: generate last 7 day names (used in analytics/admin views)
 *  - getOrSaveFromStorage: helper for localStorage read/write
 */

import moment from "moment";

/**
 * fileFormat
 *
 * Determines the type of file based on its extension.
 * Used mainly for rendering chat message attachments.
 *
 * @param {string} url - File URL
 * @returns {string} One of: "video" | "audio" | "image" | "file"
 */
const fileFormat = (url = "") => {
  const fileExt = url.split(".").pop();

  if (fileExt === "mp4" || fileExt === "webm" || fileExt === "ogg")
    return "video";

  if (fileExt === "mp3" || fileExt === "wav") return "audio";

  if (
    fileExt === "png" ||
    fileExt === "jpg" ||
    fileExt === "jpeg" ||
    fileExt === "gif"
  )
    return "image";

  // Fallback for unsupported or unknown file types
  return "file";
};

/**
 * transformImage
 *
 * Optimizes Cloudinary image URLs by injecting transformation parameters.
 *
 * Example:
 *  Original:
 *   https://res.cloudinary.com/.../image/upload/v123/file.png
 *
 *  Transformed:
 *   https://res.cloudinary.com/.../image/upload/dpr_auto/w_200/v123/file.png
 *
 * @param {string} url - Original Cloudinary image URL
 * @param {number} width - Desired image width (default: 100)
 * @returns {string} Transformed image URL
 */
const transformImage = (url = "", width = 100) => {
  const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);
  return newUrl;
};

/**
 * getLast7Days
 *
 * Generates an array containing the names of the last 7 days
 * (including today), ordered from oldest to newest.
 *
 * Example output:
 *  ["Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"]
 *
 * Used mainly for charts and admin analytics.
 *
 * @returns {string[]} Array of weekday names
 */
const getLast7Days = () => {
  const currentDate = moment();
  const last7Days = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    const dayName = dayDate.format("dddd");
    last7Days.unshift(dayName);
  }

  return last7Days;
};

/**
 * getOrSaveFromStorage
 *
 * Wrapper around localStorage for JSON-safe get/set operations.
 *
 * @param {Object} options
 * @param {string} options.key - localStorage key
 * @param {*} options.value - value to store (used when get=false)
 * @param {boolean} options.get - if true, retrieve value instead of setting
 *
 * @returns {*} Parsed value from localStorage when get=true, otherwise undefined
 */
const getOrSaveFromStorage = ({ key, value, get }) => {
  if (get)
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
  else localStorage.setItem(key, JSON.stringify(value));
};

export { fileFormat, transformImage, getLast7Days, getOrSaveFromStorage };
