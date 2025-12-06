import { useState } from "react";
import "react-responsive-modal/styles.css";
import ReactModal from "react-modal";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import SwapArrows from "../../assets/swapArrow.svg?react";
import { useEmojiArrays } from "./mobileSortHooks/useEmojiArrays";

const getLangObj = (state) => state.langObj;
const getMapObj = (state) => state.mapObj;
const getTriggerModal = (state) => state.triggerMobileSortSwapModal;
const getSetTriggerModal = (state) => state.setTriggerMobileSortSwapModal;

const MobileSortSwapModal = (props) => {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  const mapObj = useSettingsStore(getMapObj);
  const triggerModal = useStore(getTriggerModal);
  const setTriggerModal = useStore(getSetTriggerModal);
  const sortColHeaderNums = [...mapObj.qSortHeaderNumbers];
  const { displayArray } = useEmojiArrays(mapObj);
  const [showSuccess, setShowSuccess] = useState(false);

  // LANGUAGE
  const swapModalHead = ReactHtmlParser(decodeHTML(langObj.mobileSortSwapModalHead)) || "";
  const okButtonText = ReactHtmlParser(decodeHTML(langObj.mobileSortSwapModalConfirmButton)) || "";
  const cancelButtonText = ReactHtmlParser(decodeHTML(langObj.mobileModalButtonCancel)) || "";
  const swapSuccessMessage =
    ReactHtmlParser(decodeHTML(langObj.mobileSortSwapModalSuccessMessage)) || "";

  let targetArray = [...props.targetArray];
  if (targetArray.length === 0 || targetArray === undefined) {
    return;
  }

  // determine visibility from map.xml options
  let shouldDisplayNums;
  let displayNumbers = mapObj["useColLabelNums"][0];
  if (displayNumbers !== undefined || displayNumbers !== null) {
    if (displayNumbers === false || displayNumbers === "false") {
      shouldDisplayNums = false;
    } else {
      shouldDisplayNums = true;
    }
  }
  let shouldDisplayText;
  let displayText = mapObj["useColLabelText"][0];
  if (displayText !== undefined || displayText !== null) {
    if (displayText === false || displayText === "false") {
      shouldDisplayText = false;
    } else {
      shouldDisplayText = true;
    }
  }
  let shouldDisplayEmojis;
  let displayEmoji = mapObj["useColLabelEmoji"][0];
  if (displayEmoji !== undefined || displayEmoji !== null) {
    if (displayEmoji === false || displayEmoji === "false") {
      shouldDisplayEmojis = false;
    } else {
      shouldDisplayEmojis = true;
    }
  }

  // get appropriate emojis
  let topCardEmoji = null;
  let bottomCardEmoji = null;
  if (targetArray.length === 2) {
    // for order consistency
    targetArray.sort((a, b) => b.groupNumber - a.groupNumber);
    let topCard = targetArray[0];
    let bottomCard = targetArray[1];
    let topCardSortValue = topCard?.groupNumber;
    let bottomCardSortValue = bottomCard?.groupNumber;
    // strip "+" for conversions
    topCardSortValue = topCardSortValue.replace("+", "");
    bottomCardSortValue = bottomCardSortValue.replace("+", "");
    // get index
    let topCardIndex = sortColHeaderNums.indexOf(topCardSortValue);
    let bottomCardIndex = sortColHeaderNums.indexOf(bottomCardSortValue);
    // use index to get emoji
    topCardEmoji = displayArray[topCardIndex];
    bottomCardEmoji = displayArray[bottomCardIndex];
  }

  if (targetArray?.length > 0 && +targetArray?.[0]?.index > +targetArray?.[1]?.index) {
    targetArray = targetArray.reverse();
  }

  // const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setTriggerModal(false);
    props.clearSelected();
    setShowSuccess(false);
  };

  const handleSwap = () => {
    props.handleStatementSwap(targetArray[0].index, targetArray[1].index);
    setShowSuccess(true);
    setTimeout(() => {
      onCloseModal();
    }, 2000);
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

        <AllContentDiv>
          {showSuccess ? (
            <SuccessMessageDiv>{swapSuccessMessage}</SuccessMessageDiv>
          ) : (
            <>
              <ModalHeader>
                {swapModalHead}
                <hr />
              </ModalHeader>
              <StatementBox color={targetArray[0]?.color} fontSize={targetArray[0]?.fontSize}>
                <NumberContainer>
                  <ContentWrapper>
                    {shouldDisplayEmojis && <EmojiDiv>{topCardEmoji}</EmojiDiv>}
                    {shouldDisplayNums && (
                      <HeaderNumber>{targetArray[0]?.groupNumber}</HeaderNumber>
                    )}
                    {shouldDisplayText && <HeaderText>{targetArray[0]?.header}</HeaderText>}
                    {shouldDisplayEmojis && <EmojiDiv>{topCardEmoji}</EmojiDiv>}
                    {/* {targetArray[0]?.header} */}
                  </ContentWrapper>
                </NumberContainer>
                <CardDiv color={targetArray[0]?.color}>{targetArray[0]?.statement}</CardDiv>
              </StatementBox>

              <SwapArrows style={{ display: "flex", justifySelf: "center", height: "50px" }} />
              <StatementBox
                id="StatementBox"
                color={targetArray[1]?.color}
                fontSize={targetArray[1]?.fontSize}
              >
                <NumberContainer id="NumberContainer">
                  <ContentWrapper id="ContentWrapper">
                    {shouldDisplayEmojis && <EmojiDiv>{bottomCardEmoji}</EmojiDiv>}
                    {shouldDisplayNums && (
                      <HeaderNumber>{targetArray[1]?.groupNumber}</HeaderNumber>
                    )}
                    {shouldDisplayText && <HeaderText>{targetArray[1]?.header}</HeaderText>}
                    {shouldDisplayEmojis && <EmojiDiv>{bottomCardEmoji}</EmojiDiv>}
                  </ContentWrapper>
                </NumberContainer>
                <CardDiv id="CardDiv" color={targetArray[1]?.color}>
                  {targetArray[1]?.statement}
                </CardDiv>
              </StatementBox>

              <ButtonContainer>
                <ModalButton color={"#FBD5D5"} onClick={onCloseModal}>
                  {cancelButtonText}
                </ModalButton>
                <ModalButton color={"#BCF0DA"} onClick={handleSwap}>
                  {okButtonText}
                </ModalButton>
              </ButtonContainer>
            </>
          )}
        </AllContentDiv>
      </ReactModal>
    </Container>
  );
};

export default MobileSortSwapModal;

const ModalHeader = styled.div`
  font-size: 24px;
  line-height: 1.42;
  padding: 20px 0px 10px 0px;
  margin-bottom: 20px;
  padding-left: 5px;
  padding-right: 5px;
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
  /* padding: 15px 10px 15px 10px; */
  border: 1px solid black;
`;

const NumberContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  text-align: center;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 4px;
  padding-bottom: 5px;
  /* color: ${(props) => {
    return props.theme.mobileText;
  }}; */
  background-color: ${(props) => {
    return props.color;
  }};

  height: 25px;
  font-size: 14px;
  padding-bottom: 3px;
  outline: 1px solid black;
`;

const CardDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 78px;
  margin-top: 25px;
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

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  gap: 10px;
  padding-right: 2px;
  padding-left: 2px;
  /* height: 100%; */
`;

const EmojiDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 2.5px;
  width: 20px;
  height: 20px;
  /* svg {
    width: 100%;
    height: 100%;
  } */
`;

const HeaderNumber = styled.span`
  font-weight: bold;
  font-size: 16px;
  line-height: 1;
`;

const HeaderText = styled.div`
  display: flex;
  padding-top: 2px;
  justify-content: center;
  flex-wrap: wrap;
  text-align: center;
  font-size: clamp(1rem, 1vw, 1.5rem);
  text-align: center;
  line-height: 0.8rem;
`;

const SuccessMessageDiv = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: clamp(1rem, 6vw, 10rem);
  /* font-size: 6vw; */
  text-align: center;
  line-height: 1.4rem;
  margin-top: 30px;
  margin-bottom: 30px;
`;

const AllContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
`;
