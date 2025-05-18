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
// import CardHeightSizer from "./CardHeightSizer";
// import ProgressBar from "@ramonak/react-progress-bar";
// import calcProgressScore from "./calcProgressScore";
// import MobileHelpButton from "./MobileHelpButton";
import MobileSurveyBackButton from "./MobileSurveyBackButton";

const getLangObj = (state) => state.langObj;
const getConfigObj = (state) => state.configObj;
const getCurrentPage = (state) => state.currentPage;
const getLocalUsercode = (state) => state.localUsercode;
// const getDisplayNextButton = (state) => state.displayNextButton;
// const getAdditionalProgress = (state) => state.progressScoreAdditional;
// const getAdditionalProgressSort = (state) => state.progressScoreAdditionalSort;
// const getDisplayMobileHelpButton = (state) => state.displayMobileHelpButton;
// const getSetDisplayMobileHelpButton = (state) =>
//   state.setDisplayMobileHelpButton;

const StyledFooter = () => {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  const configObj = useSettingsStore(getConfigObj);
  const currentPage = useStore(getCurrentPage);
  const localUsercode = useStore(getLocalUsercode);
  // const additionalProgress = useStore(getAdditionalProgress);
  // const additionalProgressSort = useStore(getAdditionalProgressSort);
  // let displayNextButton = useStore(getDisplayNextButton);
  // let displayMobileHelpButton = useStore(getDisplayMobileHelpButton);
  // const setDisplayMobileHelpButton = useStore(getSetDisplayMobileHelpButton);

  // let showProgressBar = false;
  // let showCardHeightSizer = true;
  // let showAdjustmentContainer = true;
  // let backButtonText = langObj.postsortBackButtonText;
  // let showBackButton;
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
  // const useImages = configObj.useImages;

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
  } else {
    nextButtonText = ReactHtmlParser(decodeHTML(langObj.btnNext)) || "";
  }

  let backButtonText = ReactHtmlParser(decodeHTML(langObj.mobileSurveyBackButtonText)) || "";

  // if (currentPage === "postsort" && configObj.showBackButton) {
  //   // showBackButton = false;
  // } else {
  //   // showBackButton = false;
  // }

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

  // Image sort adjustments
  // if (currentPage === "presort") {
  //   if (configObj.useImages === true) {
  //     // showAdjustmentContainer = false;
  //     // showCardHeightSizer = false;
  //   } else {
  //     // showAdjustmentContainer = true;
  //     // showCardHeightSizer = false;
  //   }
  // }

  // Image sort adjustments
  if (currentPage === "submit" || currentPage === "landing" || currentPage === "consent") {
    showFooterFontSizer = false;
    showFooterViewSizer = false;
    // if (useImages === true) {
    //   showAdjustmentContainer = true;
    //   // showCardHeightSizer = true;
    //   showFooterFontSizer = false;
    // } else {
    //   showAdjustmentContainer = false;
    //   // showCardHeightSizer = true;
    //   showFooterFontSizer = true;
    // }
    // showAdjustmentContainer = true;
  }

  if (currentPage === "survey") {
    showFooterFontSizer = false;
    showFooterViewSizer = true;
    // showAdjustmentContainer = false;
  }

  // font size and view adjustments display
  if (currentPage === "landing" || currentPage === "survey" || currentPage === "submit") {
    // showAdjustmentContainer = false;
  }

  if (currentPage === "postsort") {
    showLogo = false;
    // showAdjustmentContainer = true;
  }

  // let CenterContent = (
  //   <React.Fragment>
  //     {showAdjustmentContainer && (
  //       <AdjustmentsContainer>
  //         {showFooterFontSizer && <MobileFooterFontSizer />}
  //         {showFooterViewSizer && <MobileFooterViewSizer />}
  //       </AdjustmentsContainer>
  //     )}
  //   </React.Fragment>
  // );

  const nextPage = getNextPage(currentPage, showPostsort, showSurvey, showConsent, showThinning);

  // ************************
  // *** EARLY RETURN ***********
  // ************************
  if (screenOrientation === "landscape-primary") {
    return null;
  }

  return (
    <StyledFooterDiv>
      {showLogo && <LogoContainer>{logoHtml}</LogoContainer>}
      {showBackButton && (
        <MobileSurveyBackButton to={"/postsort"}>{backButtonText}</MobileSurveyBackButton>
      )}
      {showFooterFontSizer && <MobileFooterFontSizer />}
      {showFooterViewSizer && <MobileFooterViewSizer />}
      {displayNextButton && (
        <MobileNextButton width={nextButtonWidth} to={nextPage}>
          {nextButtonText}
        </MobileNextButton>
      )}
    </StyledFooterDiv>
  );
};

export default StyledFooter;

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
`;

// const AdjustmentsContainer = styled.div`
//   display: flex;
//   flex-direction: row;
//   /* justify-content: space-between; */
//   /* gap: 10px; */
//   margin-left: 2vw;
//   width: 100%;
//   outline: 1px solid red;
// `;

const LogoContainer = styled.div`
  padding-top: 5px;
  padding-left: 5px;
  display: flex;
  justify-self: start;
  align-self: center;
  text-align: center;
`;

// const CenterDiv = styled.div`
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
// `;

// const ButtonDiv = styled.div`
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
// `;
