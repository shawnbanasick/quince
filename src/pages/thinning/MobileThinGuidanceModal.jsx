import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import styled from "styled-components";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";

const getLangObj = (state) => state.langObj;
const getTriggerModal = (state) => state.triggerMobileThinGuidanceModal;
const getSetTriggerModal = (state) => state.setTriggerMobileThinGuidanceModal;

const MobileThinGuidanceModal = (props) => {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  const triggerModal = useStore(getTriggerModal);
  const setTriggerModal = useStore(getSetTriggerModal);

  const ModalHead = props.modalHead || "";
  const ModalText = props.modalText || "";

  const onCloseModal = () => {
    setTriggerModal(false);
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
      <ModalContent>{ModalText}</ModalContent>
    </Modal>
  );
};

export default MobileThinGuidanceModal;

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
