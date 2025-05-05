import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";

const getLangObj = (state) => state.langObj;
const getTriggerThinningPreventNavModal = (state) => state.triggerThinningPreventNavModal;
const getSetTriggerThinningPreventNavModal = (state) => state.setTriggerThinningPreventNavModal;

const ThinningPreventNavModal = () => {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  const triggerThinningPreventNavModal = useStore(getTriggerThinningPreventNavModal);
  const setTriggerThinningPreventNavModal = useStore(getSetTriggerThinningPreventNavModal);

  const thinningModalHead = ReactHtmlParser(decodeHTML(langObj.thinningPreventNavModalHead)) || "";
  const thinningModalText = ReactHtmlParser(decodeHTML(langObj.thinningPreventNavModalText)) || "";

  const onCloseModal = () => {
    setTriggerThinningPreventNavModal(false);
  };

  return (
    <Modal
      className="customModal"
      open={triggerThinningPreventNavModal}
      onClose={onCloseModal}
      center
    >
      <ModalHeader>{thinningModalHead}</ModalHeader>
      <hr />
      <ModalContent>{thinningModalText}</ModalContent>
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
  font-size: calc(12px + 0.9vw);
  padding: 15px;
`;

// react-responsive-modal-overlay
