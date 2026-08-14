import { Suspense, useEffect, useState } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import LandingPage from "./pages/landing/Landing";
import PostsortPage from "./pages/postsort/Postsort";
import PresortPage from "./pages/presort/Presort";
import SortPage from "./pages/sort/Sort";
import SubmitPage from "./pages/submit/Submit";
import SurveyPage from "./pages/survey/Survey";
import ThinningPage from "./pages/thinning/Thinning";
import NoPageFound from "./utilities/NoPageFound";
import axios from "axios";
import processConfigXMLData from "./utilities/processConfigXMLData";
import processMapXMLData from "./utilities/processMapXMLData";
import processLanguageXMLData from "./utilities/processLanguageXMLData";
import processStatementsXMLData from "./utilities/processStatementsXMLData";
import LoadingScreen from "./pages/landing/LoadingScreen";
import StyledFooter from "./pages/footer/StyledFooter";
import useSettingsStore from "./globalState/useSettingsStore";
import useStore from "./globalState/useStore";
import cloneDeep from "lodash/cloneDeep";
import shuffle from "lodash/shuffle";
import convert from "xml-js";
import ConsentPage from "./pages/consent/Consent";
import detectMobileBrowser from "./utilities/detectMobileBrowser";
import MobileFooter from "./pages/footer/MobileFooter";
import MobilePresortPage from "./pages/presort/MobilePresort";
import MobileThinningPage from "./pages/thinning/MobileThinning";
import MobileSortPage from "./pages/sort/MobileSort";
import MobileSurveyPage from "./pages/survey/MobileSurvey";
import MobilePostsortPage from "./pages/postsort/MobilePostsort";
import MobileSubmitPage from "./pages/submit/MobileSubmit";
import { satisfies } from "compare-versions";
import MobileAccessDenied from "./utilities/MobileAccessDenied";
import OutOfDateWarningBanner from "./OutOfDate";

const getSetConfigObj = (state) => state.setConfigObj;
const getSetLangObj = (state) => state.setLangObj;
const getSetMapObj = (state) => state.setMapObj;
const getSetStatementsObj = (state) => state.setStatementsObj;
const getSetColumnStatements = (state) => state.setColumnStatements;
const getSetResetColumnStatements = (state) => state.setResetColumnStatements;
const getSetSurveyQuesObjArray = (state) => state.setSurveyQuestionObjArray;
const getSetRequiredAnswersObj = (state) => state.setRequiredAnswersObj;
const getSetDataLoaded = (state) => state.setDataLoaded;
const getConfigObj = (state) => state.configObj;
const getLangObj = (state) => state.langObj;
const getMapObj = (state) => state.mapObj;

function App() {
  const setConfigObj = useSettingsStore(getSetConfigObj);
  const setLangObj = useSettingsStore(getSetLangObj);
  const setMapObj = useSettingsStore(getSetMapObj);
  const setStatementsObj = useSettingsStore(getSetStatementsObj);
  const setColumnStatements = useSettingsStore(getSetColumnStatements);
  const setResetColumnStatements = useSettingsStore(
    getSetResetColumnStatements,
  );
  const setSurveyQuestionObjArray = useSettingsStore(getSetSurveyQuesObjArray);
  const setRequiredAnswersObj = useSettingsStore(getSetRequiredAnswersObj);
  const setDataLoaded = useStore(getSetDataLoaded);
  // const displayGoodbyeMessage = useStore(getDisplayGoodbyeMessage);
  // const disableRefreshCheck = useStore(getDisableRefreshCheck);
  const configObj = useSettingsStore(getConfigObj);
  const langObj = useSettingsStore(getLangObj);
  const mapObj = useSettingsStore(getMapObj);

  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [outOfDateFiles, setOutOfDateFiles] = useState([]);

  // small helper so each fetch reports which file failed
  const fetchXml = async (path) => {
    try {
      const response = await axios.get(path, {
        "Content-Type": "application/xml; charset=utf-8",
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to load ${path}: ${error.message}`);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        // language, config, and map don't depend on each other — fetch in parallel
        const [languageXml, configXml, mapXml] = await Promise.all([
          fetchXml("./settings/language.xml"),
          fetchXml("./settings/config.xml"),
          fetchXml("./settings/map.xml"),
        ]);

        // --- language ---
        const languageOptions = {
          compact: true,
          ignoreComment: true,
          spaces: 4,
        };
        const languageData = convert.xml2js(languageXml, languageOptions);
        const langObj = processLanguageXMLData(languageData);
        setLangObj(langObj);

        // --- config ---
        const configOptions = {
          compact: false,
          ignoreComment: true,
          spaces: 2,
        };
        const configData = convert.xml2js(configXml, configOptions);
        const configInfo = processConfigXMLData(configData);
        const {
          shuffleCards,
          configObj,
          surveyQuestionObjArray,
          requiredAnswersObj,
        } = configInfo;

        setConfigObj(configObj);
        setSurveyQuestionObjArray(surveyQuestionObjArray);
        setRequiredAnswersObj(requiredAnswersObj);

        let imagesArray = [];
        if (configObj.useImages === true) {
          for (let i = 0; i < configObj.numImages; i++) {
            imagesArray.push({
              backgroundColor: "white",
              element: (
                <img
                  src={`/settings/images/image${i + 1}.${configObj.imageFileType}`}
                  alt={`image${i + 1}`}
                  className="dragObject"
                />
              ),
              cardColor: "yellowSortCard",
              divColor: "isUncertainStatement",
              pinkChecked: false,
              yellowChecked: true,
              greenChecked: false,
              sortValue: 222,
              id: `image${i + 1}`,
              statement: `image${i + 1}`,
              statementNum: `${i + 1}`,
            });
          }

          if (configObj.shuffleCards === true) {
            imagesArray = shuffle(imagesArray);
          }
        }

        // --- map ---
        const mapOptions = { compact: true, ignoreComment: true, spaces: 4 };
        const mapData = convert.xml2js(mapXml, mapOptions);
        const { vColsObj, mapObj } = processMapXMLData(mapData);

        setMapObj(mapObj);

        // --- statements (depends on shuffleCards + vColsObj, so fetch after) ---
        const statementsXml = await fetchXml("./settings/statements.xml");
        const statementsOptions = {
          compact: true,
          ignoreComment: true,
          spaces: 4,
        };
        const statementsData = convert.xml2js(statementsXml, statementsOptions);
        const statementsObj = processStatementsXMLData(
          statementsData,
          shuffleCards,
          vColsObj,
        );

        statementsObj.columnStatements.imagesList = imagesArray;
        setColumnStatements(statementsObj.columnStatements);
        setResetColumnStatements(cloneDeep(statementsObj.columnStatements));
        setStatementsObj(statementsObj);

        setDataLoaded(true);
      } catch (error) {
        console.error("Failed to load settings files:", error);
        setLoadError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [
    setConfigObj,
    setLangObj,
    setStatementsObj,
    setColumnStatements,
    setRequiredAnswersObj,
    setSurveyQuestionObjArray,
    setMapObj,
    setDataLoaded,
    setResetColumnStatements,
  ]);

  // CHECK VERSION NUMBERS
  const baseTemplateVersion = "1.0.9";
  const maxTemplateVersion = "1.0.10";

  const versionChecks = [
    {
      key: "language",
      label: "language.xml",
      version: langObj["langFileVersion"] || "",
    },
    {
      key: "config",
      label: "config.xml",
      version: configObj["configFileVersion"] || "",
    },
    { key: "map", label: "map.xml", version: mapObj["mapFileVersion"] || "" },
  ];

  useEffect(() => {
    if (isLoading) return;

    const stale = versionChecks.filter(({ version }) => {
      try {
        return !satisfies(
          version,
          `>=${baseTemplateVersion} <${maxTemplateVersion}`,
        );
      } catch (error) {
        console.error("Error checking version:", error);
        return true; // treat unparseable/missing version as out-of-date
      }
    });

    if (stale.length > 0) {
      setOutOfDateFiles(stale);
    }
  }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (loadError) {
    return (
      <div className="App">
        <h1>Unable to load configuration</h1>
        <p>{loadError.message}</p>
        <p>
          Please check that your settings files are present and correctly
          formatted, then reload the page.
        </p>
      </div>
    );
  }

  if (configObj.useMobileMode === true || configObj.useMobileMode === "true") {
    let isMobile = detectMobileBrowser();
    if (isMobile) {
      console.log("Mobile Mode");

      if (
        configObj.preventMobileAccess === true ||
        configObj.preventMobileAcess === "true"
      ) {
        return (
          <div className="App">
            <Router>
              <Switch>
                <Route exact path="/" component={MobileAccessDenied} />
              </Switch>
            </Router>
          </div>
        );
      }

      if (
        configObj.showConsentPage === true ||
        configObj.showConsentPage === "true"
      ) {
        return (
          <div className="App">
            <OutOfDateWarningBanner
              files={outOfDateFiles}
              onDismiss={() => setOutOfDateFiles([])}
            />
            <Router>
              <Switch>
                <Route exact path="/" component={ConsentPage} />
                <Route exact path="/presort" component={MobilePresortPage} />
                <Route exact path="/thin" component={MobileThinningPage} />
                <Route exact path="/sort" component={MobileSortPage} />
                <Route exact path="/postsort" component={MobilePostsortPage} />
                <Route exact path="/survey" component={MobileSurveyPage} />
                <Route exact path="/submit" component={MobileSubmitPage} />
                <Route exact path="/landing" component={LandingPage} />
                <Route component={NoPageFound} />
              </Switch>
              <Suspense>
                <MobileFooter />
              </Suspense>
            </Router>
          </div>
        );
      }

      return (
        <div className="App">
          <OutOfDateWarningBanner
            files={outOfDateFiles}
            onDismiss={() => setOutOfDateFiles([])}
          />
          <Router>
            <Switch>
              <Route exact path="/" component={LandingPage} />
              <Route exact path="/presort" component={MobilePresortPage} />
              <Route exact path="/thin" component={MobileThinningPage} />
              <Route exact path="/sort" component={MobileSortPage} />
              <Route exact path="/postsort" component={MobilePostsortPage} />
              <Route exact path="/survey" component={MobileSurveyPage} />
              <Route exact path="/submit" component={MobileSubmitPage} />
              <Route component={NoPageFound} />
            </Switch>
            <Suspense>
              <MobileFooter />
            </Suspense>
          </Router>
        </div>
      );
    }
  }

  if (
    configObj.showConsentPage === true ||
    configObj.showConsentPage === "true"
  ) {
    // routing for desktop, with consent page, no thin process
    return (
      <div className="App">
        <OutOfDateWarningBanner
          files={outOfDateFiles}
          onDismiss={() => setOutOfDateFiles([])}
        />
        <Router>
          <Switch>
            <Route exact path="/" component={ConsentPage} />
            <Route exact path="/presort" component={PresortPage} />
            <Route exact path="/thin" component={ThinningPage} />
            <Route exact path="/sort" component={SortPage} />
            <Route exact path="/postsort" component={PostsortPage} />
            <Route exact path="/survey" component={SurveyPage} />
            <Route exact path="/submit" component={SubmitPage} />
            <Route exact path="/landing" component={LandingPage} />
            <Route component={NoPageFound} />
          </Switch>
          <Suspense>
            <StyledFooter />
          </Suspense>
        </Router>
      </div>
    );
  }

  // default routing for desktop, no consent page, no thin process
  return (
    <div className="App">
      <OutOfDateWarningBanner
        files={outOfDateFiles}
        onDismiss={() => setOutOfDateFiles([])}
      />
      <Router>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/presort" component={PresortPage} />
          <Route exact path="/thin" component={ThinningPage} />
          <Route exact path="/sort" component={SortPage} />
          <Route exact path="/postsort" component={PostsortPage} />
          <Route exact path="/survey" component={SurveyPage} />
          <Route exact path="/submit" component={SubmitPage} />
          <Route component={NoPageFound} />
        </Switch>
        <Suspense>
          <OutOfDateWarningBanner
            files={outOfDateFiles}
            onDismiss={() => setOutOfDateFiles([])}
          />

          <StyledFooter />
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
