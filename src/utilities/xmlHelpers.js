// Shared helpers for working with xml-js "compact" mode output.
// Used by processConfigXMLData, processMapXMLData, processStatementsXMLData,
// and processLanguageXMLData so this logic exists in exactly one place.

/**
 * xml-js gives an OBJECT (not an array) when there's only a single matching
 * child element in the XML, and an array when there are multiple. Normalize
 * so callers can always safely use .find(), .map(), .length, etc.
 */
export const toArray = (value) =>
  Array.isArray(value) ? value : [value].filter(Boolean);

/**
 * Safely read the text content of an xml-js compact-mode node.
 * Never throws, regardless of what's missing along the chain.
 */
export const getText = (node, fallback = "") => node?._text ?? fallback;

/**
 * Safely read an attribute off an xml-js compact-mode node.
 * Never throws, regardless of what's missing along the chain.
 */
export const getAttr = (node, attrName, fallback = "") =>
  node?._attributes?.[attrName] ?? fallback;

/**
 * Safely parse a "true"/"false" attribute or text value into a real boolean.
 * Falls back to `fallback` if the value is missing or not valid JSON.
 */
export const parseBool = (value, fallback = false) => {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "boolean") return value;
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "boolean" ? parsed : fallback;
  } catch (error) {
    console.log(error);
    return fallback;
  }
};
