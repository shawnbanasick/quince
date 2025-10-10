import { useEffect, useRef } from "react";
import styled from "styled-components";
import calculateTimeOnPage from "../../utilities/calculateTimeOnPage";
import decodeHTML from "../../utilities/decodeHTML";
import ReactHtmlParser from "html-react-parser";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import PromptUnload from "../../utilities/PromptUnload";
import ConsentModal from "./ConsentModal";
import parseParams from "../landing/parseParams";
import { ConsentTitleBar } from "./ConsentTitleBar";

/* eslint react/prop-types: 0 */

const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;
const getSetProgressScore = (state) => state.setProgressScore;
const getSetCurrentPage = (state) => state.setCurrentPage;
const getSetDisplayNextButton = (state) => state.setDisplayNextButton;
const getSetUrlUsercode = (state) => state.setUrlUsercode;

const ConsentPage = () => {
  // const ElementRef = useRef(null);

  // GLOBAL STATE
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  const setProgressScore = useStore(getSetProgressScore);
  const setCurrentPage = useStore(getSetCurrentPage);
  const setDisplayNextButton = useStore(getSetDisplayNextButton);
  const setUrlUsercode = useStore(getSetUrlUsercode);
  const consentText = ReactHtmlParser(decodeHTML(langObj.consentText)) || "";

  const startTimeRef = useRef(null);
  useEffect(() => {
    setDisplayNextButton(true);
    startTimeRef.current = Date.now();
    const setStateAsync = async () => {
      await setCurrentPage("consent");
      localStorage.setItem("currentPage", "consent");
      await setProgressScore(15);
    };
    setStateAsync();
    return () => {
      calculateTimeOnPage(startTimeRef.current, "consentPage", "consentPage");
    };
  }, [setCurrentPage, setProgressScore, setDisplayNextButton]);

  useEffect(() => {
    // set participant Id if set in URL
    let urlString = parseParams(window.location.href);
    // if nothing in URL, check local storage
    if (urlString === undefined || urlString === null) {
      let urlName = localStorage.getItem("urlUsercode");
      // if nothing in local storage, set to "not_set"
      if (urlName === null || urlName === undefined || urlName === "undefined") {
        console.log("no url usercode in storage");
        setUrlUsercode("not_set");
        localStorage.setItem("urlUsercode", "not_set");
      } else {
        // if something in local storage, set state
        console.log("URL usercode from storage: ", urlName);
        if (urlName === "not_set") {
          setUrlUsercode("not_set");
        } else {
          setUrlUsercode(`${urlName} (stored)`);
        }
      }
    } else {
      // if something in URL, set it in state
      let codeName = urlString;
      codeName = codeName.replace(/\/|#/g, "");
      console.log("URL usercode: ", codeName);
      setUrlUsercode(codeName);
      localStorage.setItem("urlUsercode", codeName);
    }
  }, [setUrlUsercode, configObj]);

  return (
    <>
      <ConsentModal />
      <PromptUnload />
      <ConsentTitleBar />
      <ContainerDiv data-testid="ConsentPageDiv">
        <div>{consentText}</div>
      </ContainerDiv>
    </>
  );
};

export default ConsentPage;

const ContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  padding-left: 5vw;
  padding-right: 5vw;
  padding-bottom: 90px;
  margin-bottom: 70px;
  transition: 0.3s ease all;
  margin-top: 70px;
  overflow-y: auto;
  width: 98vw;
  font-size: 1.2em;
  height: calc(100vh - 80px);
  /* border: 3px solid red; */
  -webkit-overflow-scrolling: touch;

  img {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  iframe {
    margin-top: 20px;
    margin-bottom: 20px;
  }
`;
