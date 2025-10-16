import styled from "styled-components";
import MobileNextButton from "./MobileNextButton";
import MobileFooterFontSizer from "./MobileFooterFontSizer";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import getNextPage from "./getNextPage";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import MobileFooterViewSizer from "./MobileFooterViewSizer";
import useScreenOrientation from "../../utilities/useScreenOrientation";
import MobileSurveyBackButton from "./MobileSurveyBackButton";

const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;
const getCurrentPage = (state) => state.currentPage;
const getLocalUsercode = (state) => state.localUsercode;
const getDisplayNextButton = (state) => state.displayNextButton;

const MobileStyledFooter = () => {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  const currentPage = useStore(getCurrentPage);
  const localUsercode = useStore(getLocalUsercode);
  let displayNextButtonGlobal = useStore(getDisplayNextButton);
  let showFooterFontSizer = true;
  let showLogo = false;
  let showFooterViewSizer = true;
  let displayNextButton = false;
  let nextButtonWidth = 60;
  let nextButtonText = "";

  const showPostsort = configObj.showPostsort;
  const showSurvey = configObj.showSurvey;
  const showConsent = configObj.showConsentPage;
  const showThinning = configObj.useThinProcess;

  // *** HOOKS ***
  let screenOrientation = useScreenOrientation();

  // *** LOGO ***
  let logoHtml = ReactHtmlParser(
    decodeHTML(`{{{center}}}{{{img src="./logo/logo.png" height="20" width="125" /}}}{{{/center}}}`)
  );

  // *** TEXT LOCALIZATION ***
  if (currentPage === "landing") {
    nextButtonWidth = 60;
    nextButtonText = ReactHtmlParser(decodeHTML(langObj.btnNextLanding)) || "";
  } else if (currentPage === "consent") {
    nextButtonWidth = 180;
    nextButtonText = ReactHtmlParser(decodeHTML(langObj.btnNextConsent)) || "";
  } else {
    nextButtonText = ReactHtmlParser(decodeHTML(langObj.btnNext)) || "";
  }

  let backButtonText = ReactHtmlParser(decodeHTML(langObj.postsortBackButtonText)) || "";

  // *** LOCAL DATA COLLECTION SETUP ***
  if (currentPage === "sort" && configObj.setupTarget === "local") {
    const usercode = localUsercode;
    const projectName = configObj.studyTitle;
    const today = new Date();
    const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + " " + time;
    logoHtml = `${usercode} - ${projectName} - ${dateTime}`;
  }

  // Display LOGO
  if (currentPage === "submit" || currentPage === "landing" || currentPage === "consent") {
    showLogo = true;
  }

  // Display NEXT button
  if (
    currentPage === "landing" ||
    currentPage === "consent" ||
    currentPage === "thin" ||
    currentPage === "postsort" ||
    currentPage === "survey" ||
    currentPage === "sort" ||
    currentPage === "presort"
  ) {
    displayNextButton = true;
  }

  // Display BACK button
  let showBackButton = false;
  if (currentPage === "survey") {
    showBackButton = true;
  }

  // Local data collection setup
  if (configObj.setupTarget === "local" && currentPage === "landing") {
    displayNextButton = false;
  }

  if (currentPage === "landing") {
    displayNextButton = displayNextButtonGlobal;
  }

  // Image sort adjustments
  if (currentPage === "submit" || currentPage === "landing" || currentPage === "consent") {
    showFooterFontSizer = false;
    showFooterViewSizer = false;
  }

  if (currentPage === "survey") {
    showFooterFontSizer = false;
    showFooterViewSizer = true;
  }

  if (currentPage === "postsort") {
    showLogo = false;
  }

  const nextPage = getNextPage(currentPage, showPostsort, showSurvey, showConsent, showThinning);

  // ************************
  // *** EARLY RETURN ***********
  // ************************
  if (screenOrientation === "landscape-primary") {
    return null;
  }

  return (
    <StyledFooterDiv data-testid="mobileFooterDiv">
      {showLogo && <LogoContainer data-testid="logoDiv">{logoHtml}</LogoContainer>}
      {showBackButton && (
        <MobileSurveyBackButton to={"/postsort"}>{backButtonText}</MobileSurveyBackButton>
      )}
      {showFooterFontSizer && <MobileFooterFontSizer data-testid="mobileFooterFontSizerComp" />}
      {showFooterViewSizer && <MobileFooterViewSizer data-testid="mobileFooterViewSizerComp" />}
      {displayNextButton && (
        <MobileNextButton
          data-testid="mobileFooterNextButton"
          width={nextButtonWidth}
          to={nextPage}
        >
          {nextButtonText}
        </MobileNextButton>
      )}
    </StyledFooterDiv>
  );
};

export default MobileStyledFooter;

const StyledFooterDiv = styled.footer`
  display: flex;
  flex-direction: row;
  position: fixed;
  bottom: 0px;
  left: 0px;
  border-top: 1px solid lightgray;
  justify-content: space-between;
  padding: 5px;
  align-items: center;
  user-select: none;
`;

const LogoContainer = styled.div`
  padding-top: 5px;
  padding-left: 5px;
  display: flex;
  justify-self: start;
  align-self: center;
  text-align: center;
`;
