import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";

const getLangObj = (state) => state.langObj;
const getTriggerMobileThinMoveTopModal = (state) =>
  state.triggerMobileThinMoveTopModal;
const getSetTriggerMobileThinMoveTopModal = (state) =>
  state.setTriggerMobileThinMoveTopModal;

const MobileThinTopModal = (props) => {
  // *** STATE
  const langObj = useSettingsStore(getLangObj);
  const triggerMobileThinMoveTopModal = useStore(
    getTriggerMobileThinMoveTopModal
  );
  const setTriggerMobileThinMoveTopModal = useStore(
    getSetTriggerMobileThinMoveTopModal
  );
  const moveTopMobileHead =
    ReactHtmlParser(decodeHTML(langObj.moveTopMobileHead)) || "";

  // *** LANGUAGE TRANSLATION *** //
  let moveTopMobileText = "";

  moveTopMobileText =
    ReactHtmlParser(decodeHTML(langObj.moveAllTopMobileText)) || "";

  const okButtonText =
    ReactHtmlParser(decodeHTML(langObj.moveTopMobileButtonOK)) || "";
  const cancelButtonText =
    ReactHtmlParser(decodeHTML(langObj.moveTopMobileButtonCancel)) || "";

  const onCloseModal = () => {
    setTriggerMobileThinMoveTopModal(false);
  };

  return (
    <Modal
      classNames={{ modal: "customMobileModal" }}
      open={triggerMobileThinMoveTopModal}
      onClose={onCloseModal}
      center
    >
      <ModalHeader>{moveTopMobileHead}</ModalHeader>
      <hr />
      <ModalContent>{moveTopMobileText}</ModalContent>
      <ButtonContainer>
        <ModalButton onClick={onCloseModal}>{cancelButtonText}</ModalButton>
        <ModalButton onClick={props.onClick}>{okButtonText}</ModalButton>
      </ButtonContainer>
    </Modal>
  );
};

export default MobileThinTopModal;

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

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 50px;
  justify-content: space-around;
  margin-top: 20px;
  button {
    width: 100px;
    height: 40px;
    border-radius: 5px;
    border: 1px solid #d3d3d3;
    background-color: white;
    color: black;
    font-weight: bold;
    font-size: 1.2rem;
  }
`;

const ModalButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100px;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #d3d3d3;
  background-color: #dedede;
  color: black;
  font-weight: bold;
  font-size: 1.2rem;
`;
