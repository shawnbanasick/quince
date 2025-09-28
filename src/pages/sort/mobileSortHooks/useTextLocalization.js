// hooks/useTextLocalization.js
import { useMemo } from "react";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../../utilities/decodeHTML";

export const useTextLocalization = (langObj) => {
  return useMemo(
    () => ({
      conditionsOfInstruction:
        ReactHtmlParser(decodeHTML(langObj.mobileSortConditionsOfInstruction)) || "",
      screenOrientationText: ReactHtmlParser(decodeHTML(langObj.screenOrientationText)) || "",
      expandViewMessage: ReactHtmlParser(decodeHTML(langObj.expandViewMessage)) || "",
      helpModalHead: ReactHtmlParser(decodeHTML(langObj.mobileSortHelpModalHead)) || "",
      helpModalText: ReactHtmlParser(decodeHTML(langObj.mobileSortHelpModalText)) || "",
      scrollBottomModalHead:
        ReactHtmlParser(decodeHTML(langObj.mobileSortScrollBottomModalHead)) || "",
      scrollBottomModalText:
        ReactHtmlParser(decodeHTML(langObj.mobileSortScrollBottomModalText)) || "",
    }),
    [langObj]
  );
};
