import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";

const getLangObj = (state) => state.langObj;
const getTriggerConfirmationFinishedModal = (state) =>
  state.triggerConfirmationFinishedModal;
const getSetTriggerConfirmationFinishedModal = (state) =>
  state.setTriggerConfirmationFinishedModal;

const ConfirmationModal = () => {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  const triggerConfirmationFinishedModal = useStore(
    getTriggerConfirmationFinishedModal
  );
  const setTriggerConfirmationFinishedModal = useStore(
    getSetTriggerConfirmationFinishedModal
  );

  const thinningConfirmModalHead =
    ReactHtmlParser(decodeHTML(langObj.thinningConfirmModalHead)) || "";
  const thinningConfirmModalText =
    ReactHtmlParser(decodeHTML(langObj.thinningConfirmModalText)) || "";

  const onCloseModal = () => {
    setTriggerConfirmationFinishedModal(false);
  };

  return (
    <Modal
      className="customModal"
      open={triggerConfirmationFinishedModal}
      onClose={onCloseModal}
      center
    >
      <ModalHeader>{thinningConfirmModalHead}</ModalHeader>
      <hr />
      <ModalContent>{thinningConfirmModalText}</ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;

const ModalHeader = styled.div`
  font-size: 24px;
  line-height: 1.42;
  padding: 10px 0px 10px 0px;

  hr {
    color: black;
  }
`;

const ModalContent = styled.div`
  margin-top: 15px;
`;

// react-responsive-modal-overlay
