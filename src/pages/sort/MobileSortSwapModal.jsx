import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import SwapArrows from "../../assets/swapArrow.svg?react";

const getLangObj = (state) => state.langObj;
const getTriggerModal = (state) => state.triggerMobileSortSwapModal;
const getSetTriggerModal = (state) => state.setTriggerMobileSortSwapModal;

const MobileSortSwapModal = (props) => {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  const triggerModal = useStore(getTriggerModal);
  const setTriggerModal = useStore(getSetTriggerModal);

  let targetArray = [...props.targetArray];

  if (
    targetArray?.length > 0 &&
    +targetArray?.[0]?.index > +targetArray?.[1]?.index
  ) {
    targetArray = targetArray.reverse();
  }

  const loginHelpModalHead =
    ReactHtmlParser(decodeHTML(langObj.mobileSortSwapModalHead)) || "";
  const loginHelpModalText =
    ReactHtmlParser(decodeHTML(langObj.mobileSortSwapModalText)) || "";
  const okButtonText =
    ReactHtmlParser(decodeHTML(langObj.mobileSortSwapModalConfirmButton)) || "";
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
      <hr style={{ marginBottom: "30px" }} />
      {/* <ModalContent>{loginHelpModalText}</ModalContent> */}

      <StatementBox
        color={targetArray[0]?.color}
        fontSize={targetArray[0]?.fontSize}
      >
        <NumberContainer>
          {targetArray[0]?.groupNumber}&nbsp;&nbsp;
          {targetArray[0]?.header}
        </NumberContainer>
        {targetArray[0]?.statement}
      </StatementBox>

      <SwapArrows
        style={{ display: "flex", justifySelf: "center", height: "50px" }}
      />
      <StatementBox
        color={targetArray[1]?.color}
        fontSize={targetArray[1]?.fontSize}
      >
        <NumberContainer>
          {targetArray[1]?.groupNumber}&nbsp;&nbsp;
          {targetArray[1]?.header}
        </NumberContainer>
        {targetArray[1]?.statement}
      </StatementBox>

      <ButtonContainer>
        <ModalButton color={"#FBD5D5"} onClick={onCloseModal}>
          {cancelButtonText}
        </ModalButton>
        <ModalButton
          color={"#BCF0DA"}
          onClick={() => {
            props.handleStatementSwap(
              targetArray[0].index,
              targetArray[1].index
            ),
              onCloseModal();
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
  padding: 30px 0px 10px 0px;

  hr {
    color: black;
  }
`;

const ModalContent = styled.div`
  margin-top: 15px;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 50px;
  justify-content: space-around;
  margin-top: 30px;
  border-radius: 3px;
  /* button {
    width: 100px;
    height: 40px;
    border-radius: 5px;
    border: 1px solid #d3d3d3;
    background-color: white;
    color: black;
    font-weight: bold;
    font-size: 1.2rem;
  } */
`;

const ModalButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 40px;
  border-radius: 5px;
  /* border: ${(props) => `5px solid ${props.color}`}; */
  /* outline: 1px solid lightgray; */
  /* color: black; */
  background: #337ab7;
  border-color: #2e6da4;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
`;

const StatementBox = styled.div`
  display: flex;
  align-self: center;
  justify-self: center;
  position: relative;
  /* background-color: #e5e5e5; */
  background-color: ${(props) => {
    return props.color;
  }};
  width: 80vw;
  height: fit-content;
  min-height: 14vh;
  font-size: ${(props) => {
    return `${props.fontSize}vh`;
  }};
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  text-align: center;
  padding: 15px 10px 15px 10px;
  border: 1px solid black;
`;

const NumberContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: fit-content;
  text-align: left;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 2px;
  padding-bottom: 2px;
  color: gray;
  height: 16px;
  font-size: 12px;
  padding-bottom: 3px;
  background-color: #e3e3e3;
  outline: 1px solid black;
  border-bottom-right-radius: 3px;
  /* margin-right: 5px; */
`;
