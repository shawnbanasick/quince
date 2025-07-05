import "react-responsive-modal/styles.css";
// import { Modal } from "react-responsive-modal";
import ReactModal from "react-modal";

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

  if (targetArray?.length > 0 && +targetArray?.[0]?.index > +targetArray?.[1]?.index) {
    targetArray = targetArray.reverse();
  }

  const swapModalHead = ReactHtmlParser(decodeHTML(langObj.mobileSortSwapModalHead)) || "";
  // const loginHelpModalText =
  //   ReactHtmlParser(decodeHTML(langObj.mobileSortSwapModalText)) || "";
  const okButtonText = ReactHtmlParser(decodeHTML(langObj.mobileSortSwapModalConfirmButton)) || "";
  const cancelButtonText = ReactHtmlParser(decodeHTML(langObj.mobileModalButtonCancel)) || "";

  //   console.log(JSON.stringify(props));

  // const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setTriggerModal(false);
    props.clearSelected();
  };
  const customStyles = {
    content: {
      display: "flex",
      justifySelf: "center",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      padding: "0px",
      width: "96vw",
      height: "fit-content",
      maxHeight: "80vh",
      paddingBottom: "10px",
      WebkitOverflowScrolling: "touch",
    },
  };

  return (
    <Container>
      <ReactModal
        id="sortSwapModal"
        isOpen={triggerModal}
        onClose={onCloseModal}
        style={customStyles}
        overlayClassName="Overlay"
        // className="ModalContentFade"
        ariaHideApp={false}
      >
        <CloseDiv>
          <CloseButton onClick={onCloseModal}>X</CloseButton>
        </CloseDiv>
        <ModalHeader>
          {swapModalHead}
          <hr />
        </ModalHeader>
        <StatementBox color={targetArray[0]?.color} fontSize={targetArray[0]?.fontSize}>
          <NumberContainer>
            {targetArray[0]?.groupNumber}&nbsp;&nbsp;
            {/* {targetArray[0]?.header} */}
          </NumberContainer>
          <CardDiv color={targetArray[0]?.color}>{targetArray[0]?.statement}</CardDiv>
        </StatementBox>

        <SwapArrows style={{ display: "flex", justifySelf: "center", height: "50px" }} />
        <StatementBox color={targetArray[1]?.color} fontSize={targetArray[1]?.fontSize}>
          <NumberContainer>
            {targetArray[1]?.groupNumber}&nbsp;&nbsp;
            {/* {targetArray[1]?.header} */}
          </NumberContainer>
          <CardDiv color={targetArray[1]?.color}>{targetArray[1]?.statement}</CardDiv>
        </StatementBox>

        <ButtonContainer>
          <ModalButton color={"#FBD5D5"} onClick={onCloseModal}>
            {cancelButtonText}
          </ModalButton>
          <ModalButton
            color={"#BCF0DA"}
            onClick={() => {
              props.handleStatementSwap(targetArray[0].index, targetArray[1].index), onCloseModal();
            }}
          >
            {okButtonText}
          </ModalButton>
        </ButtonContainer>
      </ReactModal>
    </Container>
  );
};

export default MobileSortSwapModal;

const ModalHeader = styled.div`
  font-size: 24px;
  line-height: 1.42;
  padding: 30px 0px 10px 0px;
  color: ${(props) => {
    return props.theme.mobileText;
  }};
  hr {
    color: black;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 50px;
  justify-content: space-around;
  margin-top: 30px;
  border-radius: 3px;
`;

const ModalButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 40px;
  border-radius: 5px;
  color: ${(props) => {
    return props.theme.mobileText;
  }};
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
  padding-bottom: 5px;
  color: ${(props) => {
    return props.theme.mobileText;
  }};
  height: 18px;
  font-size: 14px;
  font-weight: bold;
  padding-bottom: 3px;
  background-color: #e3e3e3;
  outline: 1px solid black;
  border-bottom-right-radius: 3px;
  border-top-left-radius: 3px;
`;

const CardDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 80px;
  margin-top: 10px;
  background-color: ${(props) => {
    return props.color;
  }};
  border-radius: 3px;
  text-align: center;
  padding: 15px 10px 15px 10px;
`;

const CloseButton = styled.button`
  background-color: red;
  float: right;
  color: white;
  border: none;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 5px;
  padding: 10px;
  width: 40px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #555;
  }
`;

const CloseDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 0px;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
`;
