import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";

const getLangObj = (state) => state.langObj;
const getTriggerMobileThinPreventNavModal = (state) =>
  state.triggerMobileThinPreventNavModal;
const getSetTriggerMobileThinPreventNavModal = (state) =>
  state.setTriggerMobileThinPreventNavModal;

const ThinningPreventNavModal = () => {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  const triggerMobileThinPreventNavModal = useStore(
    getTriggerMobileThinPreventNavModal
  );
  const setTriggerMobileThinPreventNavModal = useStore(
    getSetTriggerMobileThinPreventNavModal
  );

  const modalHead =
    ReactHtmlParser(decodeHTML(langObj.mobileThinPreventNavModalHead)) || "";
  const modalText =
    ReactHtmlParser(decodeHTML(langObj.mobileThinPreventNavModalText)) || "";

  const onCloseModal = () => {
    setTriggerMobileThinPreventNavModal(false);
  };

  return (
    <Modal
      className="customModal"
      open={triggerMobileThinPreventNavModal}
      onClose={onCloseModal}
      center
    >
      <ModalHeader>{modalHead}</ModalHeader>
      <hr />
      <ModalContent>{modalText}</ModalContent>
    </Modal>
  );
};

export default ThinningPreventNavModal;

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
