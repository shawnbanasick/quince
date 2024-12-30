import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";

const getLangObj = (state) => state.langObj;
const getTriggerModal = (state) => state.triggerMobileSortSwapModal;
const getSetTriggerModal = (state) => state.setTriggerMobileSortSwapModal;

const MobileSortSwapModal = (props) => {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  const triggerModal = useStore(getTriggerModal);
  const setTriggerModal = useStore(getSetTriggerModal);

  console.log(
    "MobileSortSwapModal targetArray: ",
    JSON.stringify(props.targetArray)
  );

  const loginHelpModalHead =
    ReactHtmlParser(decodeHTML(langObj.mobileSortSwapModalHead)) || "";
  const loginHelpModalText =
    ReactHtmlParser(decodeHTML(langObj.mobileSortSwapModalText)) || "";
  const okButtonText =
    ReactHtmlParser(decodeHTML(langObj.mobilePresortRedoModalConfirmButton)) ||
    "";
  const cancelButtonText =
    ReactHtmlParser(decodeHTML(langObj.moveTopMobileButtonCancel)) || "";

  //   console.log(JSON.stringify(props));

  // const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setTriggerModal(false);
    props.clearSelected();
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
      <StatementBox color="#e5e5e5" fontSize={2}>
        {props.selected}
      </StatementBox>
      <ButtonContainer>
        <ModalButton onClick={onCloseModal}>{cancelButtonText}</ModalButton>
        <ModalButton
          onClick={() => {
            props.clickFunction(), onCloseModal();
          }}
        >
          {okButtonText}
        </ModalButton>
      </ButtonContainer>
    </Modal>
  );
};

export default MobileSortSwapModal;

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
  margin-top: 30px;
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

const StatementBox = styled.div`
  display: flex;
  align-self: center;
  justify-self: center;
  /* background-color: #e5e5e5; */
  /* background-color: ${(props) => {
    return props.color;
  }}; */
  width: 80vw;
  height: fit-content;
  min-height: 14vh;
  /* font-size: ${(props) => {
    return `${props.fontSize}vh`;
  }}; */
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  text-align: center;
  padding: 15px 10px 15px 10px;
  border: 1px solid black;
`;
