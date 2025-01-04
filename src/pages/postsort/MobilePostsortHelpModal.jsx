import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";

const getLangObj = (state) => state.langObj;
const getTriggerModal = (state) => state.triggerMobilePostsortHelpModal;
const getSetTriggerModal = (state) => state.setTriggerMobilePostsortHelpModal;

const MobilePostsortHelpModal = () => {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  const triggerModal = useStore(getTriggerModal);
  const setTriggerModal = useStore(getSetTriggerModal);

  const ModalHead =
    ReactHtmlParser(decodeHTML(langObj.mobilePostsortHelpModalHead)) || "";
  const ModalText =
    ReactHtmlParser(decodeHTML(langObj.mobilePostsortHelpModalText)) || "";

  // const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setTriggerModal(false);
  };

  return (
    <Modal
      id="postsortHelpModal"
      className="postsortCustomModal"
      open={triggerModal}
      onClose={onCloseModal}
      closeOnOverlayClick={false}
      center
    >
      <ModalHeader>{ModalHead}</ModalHeader>
      <hr />
      <ModalContent>{ModalText}</ModalContent>
    </Modal>
  );
};

export default MobilePostsortHelpModal;

const ModalHeader = styled.div`
  font-size: 24px;
  line-height: 1.42;
  padding: 10px 0px 10px 0px;
  margin-top: 25px;
  hr {
    color: black;
  }
`;

const ModalContent = styled.div`
  margin-top: 15px;
`;

// react-responsive-modal-overlay
