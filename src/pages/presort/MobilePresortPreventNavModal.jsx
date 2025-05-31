import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";

const getLangObj = (state) => state.langObj;
const getTriggerMobilePresortPreventNavModal = (state) => state.triggerMobilePresortPreventNavModal;
const getSetTriggerMobilePresortPreventNavModal = (state) =>
  state.setTriggerMobilePresortPreventNavModal;

const MobilePresortPreventNavModal = () => {
  // STATE
  const langObj = useSettingsStore(getLangObj);

  const triggerMobilePresortPreventNavModal = useStore(getTriggerMobilePresortPreventNavModal);
  const setTriggerMobilePresortPreventNavModal = useStore(
    getSetTriggerMobilePresortPreventNavModal
  );
  const modalHead = ReactHtmlParser(decodeHTML(langObj.mobilePresortPreventNavModalHead)) || "";
  const modalText = ReactHtmlParser(decodeHTML(langObj.mobilePresortPreventNavModalText)) || "";

  const onCloseModal = () => {
    setTriggerMobilePresortPreventNavModal(false);
  };

  return (
    <Modal
      className="customModal"
      open={triggerMobilePresortPreventNavModal}
      onClose={onCloseModal}
      center
    >
      <ModalHeader>{modalHead}</ModalHeader>
      <hr />
      <ModalContent>{modalText}</ModalContent>
    </Modal>
  );
};

export default MobilePresortPreventNavModal;

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
