const stringToBoolean = (str) => {
  if (str === "true") {
    return true;
  } else if (str === "false" || str === "0" || str === "null" || str === "undefined") {
    return false;
  } else {
    // Default behavior for other strings (e.g., treat as truthy)
    return !!str;
  }
};
