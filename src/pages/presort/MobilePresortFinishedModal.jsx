import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";

const getLangObj = (state) => state.langObj;
const getTriggerModal = (state) => state.triggerMobilePresortFinishedModal;
const getSetTriggerModal = (state) =>
  state.setTriggerMobilePresortFinishedModal;

const PresortFinishedModal = () => {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  const triggerModal = useStore(getTriggerModal);
  const setTriggerModal = useStore(getSetTriggerModal);

  const loginHelpModalHead =
    ReactHtmlParser(decodeHTML(langObj.mobilePresortFinishedModalHead)) || "";
  const loginHelpModalText =
    ReactHtmlParser(decodeHTML(langObj.mobilePresortFinishedModalText)) || "";

  // const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setTriggerModal(false);
  };

  return (
    <Modal
      id="presortFinishedModal"
      className="presortCustomModal"
      open={triggerModal}
      onClose={onCloseModal}
      closeOnOverlayClick={false}
      center
    >
      <ModalHeader>{loginHelpModalHead}</ModalHeader>
      <hr />
      <ModalContent>{loginHelpModalText}</ModalContent>
    </Modal>
  );
};

export default PresortFinishedModal;

const ModalHeader = styled.div`
  font-size: 24px;
  line-height: 1.42;
  padding: 10px 0px 10px 0px;
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
