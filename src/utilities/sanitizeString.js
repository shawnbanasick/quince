const sanitizeString = (string) => {
  try {
    let sanitized = String(string);

    sanitized = sanitized
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;")
      // eslint-disable-next-line
      .replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F]/g, "");
    return sanitized;
  } catch (error) {
    console.log("There was an error sanitizing User Input");
    console.error(error);
  }
};

export default sanitizeString;
