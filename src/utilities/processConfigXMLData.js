import { parseBool } from "../utilities/xmlHelpers";

// NOTE: config.xml is parsed with xml-js in NON-compact mode
// (`{ compact: false }` in App.js), so nodes use `.elements[0].text` and
// `.attributes.id` rather than the `._text`/`._attributes` compact-mode
// shape used by map.xml, statements.xml, and language.xml. Because of that,
// this file uses its own small `elText`/`elAttr` helpers below instead of
// the shared `getText`/`getAttr` in xmlHelpers.js, which are compact-mode
// only. `parseBool` has no shape dependency, so it's shared as-is.

const elText = (node, fallback = "") => node?.elements?.[0]?.text ?? fallback;
const elAttr = (node, attrName, fallback = "") =>
  node?.attributes?.[attrName] ?? fallback;

const processConfigXMLData = (dataObject) => {
  const data = dataObject.elements[0].elements;
  const configObj = {};
  let surveyQuestionArray = [];

  // --- config file version ---
  const versionElement = data.find(
    (el) => el.attributes?.id === "configFileVersion",
  );
  configObj.configFileVersion = elText(versionElement);

  let surveyData = [];
  for (let i = 0; i < data.length; i++) {
    const tempObj = data[i];
    const key = tempObj.attributes?.id;

    // separate out survey questions
    if (key === "survey") {
      surveyData.push([...tempObj.elements]);
      continue;
    }

    // skip keys with no elements (empty in the XML file)
    if (!("elements" in tempObj)) continue;

    // array-valued keys are handled elsewhere; skip them here
    const arrayKeys = [
      "columnHeadersColorsArray",
      "columnColorsArray",
      "qSortHeaderNumbers",
      "qSortHeaders",
      "qSortPattern",
    ];
    if (arrayKeys.includes(key)) continue;

    let value = tempObj.elements?.[0]?.text;
    if (value === "true") {
      value = true;
    } else if (value === "false") {
      value = false;
    } else if (value !== undefined && value !== "" && !isNaN(value)) {
      value = +value;
    }
    configObj[key] = value;
  }

  // --- build survey question objects ---
  const requiredAnswersObj = {};

  if (surveyData.length > 0) {
    surveyQuestionArray = surveyData.map((questionElements, j) => {
      const id = `itemNum${j + 1}`;
      const mainEl = questionElements[0];
      const questionType = elAttr(mainEl, "type");
      const isRequired = parseBool(elAttr(mainEl, "required", "false"));

      requiredAnswersObj[id] = isRequired
        ? "no-*?*-response"
        : questionType === "information"
          ? "info - n.a."
          : "no response";

      const base = {
        id,
        itemNum: j + 1,
        type: questionType,
        hasBeenAnswered: false,
      };

      switch (questionType) {
        case "information":
          return {
            ...base,
            background: elAttr(mainEl, "bg"),
            options: elText(questionElements[1]),
          };

        case "text":
          return {
            ...base,
            required: isRequired,
            label: elText(questionElements[1]),
            note: elText(questionElements[2]),
            limitLength: elAttr(mainEl, "limitLength", "999"),
            restricted: elAttr(mainEl, "restricted", "false"),
            limited: elAttr(mainEl, "limited", "false"),
            placeholder: elText(questionElements[3]),
          };

        case "textarea":
          return {
            ...base,
            required: elAttr(mainEl, "required", "false"),
            label: elText(questionElements[1]),
            note: elText(questionElements[2]),
            placeholder: elText(questionElements[3]),
          };

        case "radio":
          return {
            ...base,
            required: isRequired,
            other: parseBool(elAttr(mainEl, "other", "false")),
            label: elText(questionElements[1]),
            note: elText(questionElements[2]),
            options: elText(mainEl),
          };

        case "select":
          return {
            ...base,
            required: elAttr(mainEl, "required", "false"),
            label: elText(questionElements[1]),
            options: elText(mainEl),
            note: elText(questionElements[2]),
          };

        case "checkbox":
          return {
            ...base,
            required: parseBool(elAttr(mainEl, "required", "false")),
            other: parseBool(elAttr(mainEl, "other", "false")),
            label: elText(questionElements[1]),
            options: elText(mainEl),
            note: elText(questionElements[2]),
          };

        case "rating2":
          return {
            ...base,
            required: elAttr(mainEl, "required", "false"),
            label: elText(questionElements[1]),
            scale: elAttr(mainEl, "scale", "Yes;;;No"),
            options: elText(mainEl),
            note: elText(questionElements[2]),
          };

        case "likert":
          return {
            ...base,
            required: elAttr(mainEl, "required", "false"),
            label: elText(questionElements[1]),
            scale: elAttr(
              mainEl,
              "scale",
              "Strongly Disagree;;;Disagree;;;Neutral;;;Agree;;;Strongly Agree",
            ),
            options: elText(mainEl),
          };

        case "rating5":
        case "rating10":
          return {
            ...base,
            required: elAttr(mainEl, "required", "false"),
            label: elText(questionElements[1]),
            options: elText(mainEl),
            note: elText(questionElements[2]),
          };

        default:
          console.warn(
            `Unknown survey question type: "${questionType}" (item ${j + 1})`,
          );
          return base;
      }
    });

    // seed localStorage with the required-answers template, once
    let resultsSurvey;
    try {
      resultsSurvey = JSON.parse(localStorage.getItem("resultsSurvey"));
    } catch (error) {
      console.error("Failed to parse stored resultsSurvey:", error);
      resultsSurvey = null;
    }

    if (!resultsSurvey) {
      localStorage.setItem("resultsSurvey", JSON.stringify(requiredAnswersObj));
      localStorage.setItem(
        "resultsSurveyArchive",
        JSON.stringify(requiredAnswersObj),
      );
    }

    configObj.requiredAnswersObj = requiredAnswersObj;
  }

  return {
    requiredAnswersObj,
    configObj,
    surveyQuestionObjArray: surveyQuestionArray,
    shuffleCards: configObj?.shuffleCards,
  };
};

export default processConfigXMLData;
