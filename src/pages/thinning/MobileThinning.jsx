import { useEffect, useRef, useState, useMemo } from "react";
import styled from "styled-components";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import decodeHTML from "../../utilities/decodeHTML";
import ReactHtmlParser from "html-react-parser";
import finishThinningSorts from "./finishThinningSorts";
import Boxes from "./Boxes";
import Instructions from "./Instructions";
import moveSelectedNegCards from "./moveSelectedNegCards";
import moveSelectedPosCards from "./moveSelectedPosCards";
import uniq from "lodash/uniq";

const MobileThinning = () => {
  let mobilePresortResults = JSON.parse(
    localStorage.getItem("mobilePresortResults")
  );

  return <p>MobileThinning</p>;
};

export default MobileThinning;
