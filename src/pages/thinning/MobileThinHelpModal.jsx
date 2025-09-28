import { useCallback } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import PulsingDownTriangle from "./PulsingDownTriangle";
import debounce from "lodash/debounce";

// import useLocalStorage from "../../utilities/useLocalStorage";

const getLangObj = (state) => state.langObj;
const getTriggerModal = (state) => state.triggerMobileThinHelpModal;
const getSetTriggerModal = (state) => state.setTriggerMobileThinHelpModal;
const getSetTriggerMobileThinGuidanceModal = (state) => state.setTriggerMobileThinGuidanceModal;
const getHasScrolledToBottom = (state) => state.m_hasScrolledBottom;
const getSetHasScrolledToBottom = (state) => state.setM_hasScrolledBottom;

const MobileThinHelpModal = (props) => {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  const triggerModal = useStore(getTriggerModal);
  const setTriggerModal = useStore(getSetTriggerModal);
  const setTriggerMobileThinGuidanceModal = useStore(getSetTriggerMobileThinGuidanceModal);
  const setHasScrolledToBottom = useStore(getSetHasScrolledToBottom);
  const hasScrolledToBottom = useStore(getHasScrolledToBottom);
  let threshold = 50;

  // const [hasDisplayed, setHasDisplayed] = useLocalStorage(
  //   "m_HasDisplayedFirstThinModal",
  //   false
  // );
  const handleScroll = useCallback(
    debounce((event) => {
      const target = event.target;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      if (distanceFromBottom <= threshold) {
        setHasScrolledToBottom(true);
      }
    }, 100), // Debounce delay in milliseconds
    [setHasScrolledToBottom, threshold]
  );

  const ModalHead = ReactHtmlParser(decodeHTML(langObj.mobileThinHelpModalHead)) || "";
  const ModalText = ReactHtmlParser(decodeHTML(langObj.mobileThinHelpModalText)) || "";

  // const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setTriggerModal(false);

    if (props.modalHead.length !== 0) {
      setTriggerMobileThinGuidanceModal(true);
    }
    // if (hasDisplayed === false) {
    // setHasDisplayed(true);
    // }
  };

  return (
    <Modal
      id="thinHelpModal"
      className="thinCustomModal"
      open={triggerModal}
      onClose={onCloseModal}
      closeOnOverlayClick={false}
      center
    >
      <ModalHeader>{ModalHead}</ModalHeader>
      <hr />
      <ModalContent onScroll={handleScroll}>{ModalText}</ModalContent>
      <OverlayTriangle>
        <PulsingDownTriangle atBottom={hasScrolledToBottom} showArrow={props.showArrow} />
      </OverlayTriangle>
    </Modal>
  );
};

export { MobileThinHelpModal };

const ModalHeader = styled.div`
  font-size: 24px;
  line-height: 1.42;
  padding: 10px 0px 10px 0px;
  margin-top: 25px;
  color: ${(props) => {
    return props.theme.mobileText;
  }};
  hr {
    color: black;
  }
`;

const ModalContent = styled.div`
  margin-top: 15px;
  color: ${(props) => {
    return props.theme.mobileText;
  }};
`;

const OverlayTriangle = styled.div`
  position: absolute;
  left: 50%;
  top: 96%; /* Adjust as needed */
  transform: translate(-50%, -50%);
  z-index: 2;
  pointer-events: none; /* So clicks pass through */
`;
