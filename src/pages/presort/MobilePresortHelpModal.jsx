import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";

const getLangObj = (state) => state.langObj;
const getTriggerModal = (state) => state.triggerMobilePresortHelpModal;
const getSetTriggerModal = (state) => state.setTriggerMobilePresortHelpModal;

const PresortFinishedModal = () => {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  const triggerModal = useStore(getTriggerModal);
  const setTriggerModal = useStore(getSetTriggerModal);

  const presortHelpModalHead =
    ReactHtmlParser(decodeHTML(langObj.mobilePresortHelpModalHead)) || "";
  const presortHelpModalText =
    ReactHtmlParser(decodeHTML(langObj.mobilePresortHelpModalText)) || "";

  // const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setTriggerModal(false);
  };

  return (
    <Modal
      id="presortHelpModal"
      className="presortCustomModal"
      open={triggerModal}
      onClose={onCloseModal}
      closeOnOverlayClick={false}
      center
    >
      <ModalHeader>{presortHelpModalHead}</ModalHeader>
      <hr />
      <ModalContent>{presortHelpModalText}</ModalContent>
    </Modal>
  );
};

export default PresortFinishedModal;

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

// react-responsive-modal-overlay
