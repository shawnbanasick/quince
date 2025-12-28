import ReactModal from "react-modal";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import MobileValueButton from "./MobileValueButton";
import MobileStatementBox from "./MobileStatementBox";
import { useState } from "react";
import PropTypes from "prop-types";
import EmojiN3 from "../../assets/emojiN3.svg?react";
import Emoji0 from "../../assets/emoji0.svg?react";
import Emoji3 from "../../assets/emoji3.svg?react";

const getLangObj = (state) => state.langObj;
const getMapObj = (state) => state.mapObj;
const getTriggerMobilePresortRedoModal = (state) => state.triggerMobilePresortRedoModal;
const getSetTriggerMobilePresortRedoModal = (state) => state.setTriggerMobilePresortRedoModal;

const MobilePresortRedoModal = (props) => {
  // *** STATE
  const langObj = useSettingsStore(getLangObj);
  const mapObj = useSettingsStore(getMapObj);
  const triggerMobilePresortRedoModal = useStore(getTriggerMobilePresortRedoModal);
  const setTriggerMobilePresortRedoModal = useStore(getSetTriggerMobilePresortRedoModal);
  const moveTopMobileHead = ReactHtmlParser(decodeHTML(langObj.mobilePresortRedoModalHead)) || "";

  // Emoji display
  const useColLabelEmojiPresort = mapObj.useColLabelEmojiPresort;

  // *** LANGUAGE TRANSLATION *** //
  let moveTopMobileText = "";
  // let showStatement = true;

  let [characteristics, setCharacteristics] = useState({
    backgroundColor: "#e5e5e5",
    value: 0,
  });

  const clickPositive = () => {
    setCharacteristics({ backgroundColor: "#BCF0DA", value: 2 });
  };

  const clickNegative = () => {
    setCharacteristics({ backgroundColor: "#FBD5D5", value: -2 });
  };

  const clickUndecided = () => {
    setCharacteristics({ backgroundColor: "#F3F4F6", value: 0 });
  };

  const okButtonText =
    ReactHtmlParser(decodeHTML(langObj.mobilePresortRedoModalConfirmButton)) || "";
  const cancelButtonText = ReactHtmlParser(decodeHTML(langObj.mobileModalButtonCancel)) || "";
  const assignLeft = ReactHtmlParser(decodeHTML(langObj.mobilePresortAssignLeft)) || "";
  const assignRight = ReactHtmlParser(decodeHTML(langObj.mobilePresortAssignRight)) || "";

  const onCloseModal = () => {
    setCharacteristics({ backgroundColor: "#e5e5e5", value: 0 });
    setTriggerMobilePresortRedoModal(false);
  };

  const MainButtonRow =
    useColLabelEmojiPresort[0] === "true" ? (
      <ButtonRow>
        <MobileValueButton
          id={`-2`}
          value={-2}
          color={`#FBD5D5`}
          onClick={clickNegative}
          child={
            <EmojiDiv>
              {" "}
              <EmojiN3 />{" "}
            </EmojiDiv>
          }
        />
        <MobileValueButton
          id={`0`}
          value={0}
          color={`#F3F4F6`}
          onClick={clickUndecided}
          child={
            <EmojiDiv>
              {" "}
              <Emoji0 />{" "}
            </EmojiDiv>
          }
        />

        <MobileValueButton
          id={`2`}
          value={2}
          color={`#BCF0DA`}
          onClick={clickPositive}
          child={
            <EmojiDiv>
              {" "}
              <Emoji3 />{" "}
            </EmojiDiv>
          }
        />
      </ButtonRow>
    ) : (
      <ButtonRow>
        <MobileValueButton
          id={`-2`}
          value={-2}
          // text={`-`}
          color={`#FBD5D5`}
          child={<div>-</div>}
          onClick={clickNegative}
        />
        <MobileValueButton
          id={`0`}
          value={0}
          // text={`?`}
          child={<div>?</div>}
          color={`#F3F4F6`}
          onClick={clickUndecided}
        />

        <MobileValueButton
          id={`2`}
          value={2}
          child={<div>+</div>}
          // text={`+`}
          color={`#BCF0DA`}
          onClick={clickPositive}
        />
      </ButtonRow>
    );

  const customStyles = {
    content: {
      display: "flex",
      justifySelf: "center",
      flexDirection: "column",
      // justifyContent: "center",
      alignItems: "center",
      // border: "2px solid gray",
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      padding: "0px",
      paddingBottom: "10px",
      width: "90vw",
      maxHeight: "60vh",
      overflowY: "scroll",
      WebkitOverflowScrolling: "touch",
    },
  };

  return (
    <ReactModal
      isOpen={triggerMobilePresortRedoModal}
      onClose={onCloseModal}
      center
      style={customStyles}
      overlayClassName="Overlay"
    >
      <CloseDiv>
        <CloseButton onClick={onCloseModal}>X</CloseButton>
      </CloseDiv>

      <ModalHeader>{moveTopMobileHead}</ModalHeader>
      <hr />
      <ModalContent>{moveTopMobileText}</ModalContent>
      <MobileStatementBox
        backgroundColor={characteristics.backgroundColor}
        statement={props.statement.current.statement}
      />
      <ButtonRowLabel>
        <AssignDiv>{assignLeft}</AssignDiv>
        <AssignDiv>{assignRight}</AssignDiv>
      </ButtonRowLabel>
      {MainButtonRow}
      <ButtonContainer>
        <ModalButton onClick={onCloseModal}>{cancelButtonText}</ModalButton>
        <ModalButton
          onClick={() => {
            props.clickFunction(characteristics.value), onCloseModal();
          }}
        >
          {okButtonText}
        </ModalButton>
      </ButtonContainer>
    </ReactModal>
  );
};

MobilePresortRedoModal.propTypes = {
  clickFunction: PropTypes.func.isRequired,
  statement: PropTypes.object.isRequired,
};

export default MobilePresortRedoModal;

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
    color: ${(props) => {
      return props.theme.mobileText;
    }};
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
  color: ${(props) => {
    return props.theme.mobileText;
  }};
  font-weight: bold;
  font-size: 1.2rem;
`;

const ButtonRowLabel = styled.div`
  display: flex;
  justify-self: center;
  justify-content: space-between;
  width: 85vw;
  min-height: 6vh;
  margin-top: 5px;
  align-items: flex-end;
  font-size: 2.5vh;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 20px;
  width: 85vw;
  height: 30px;
  justify-self: center;
`;

const AssignDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1.5vh;
  width: 28vw;
`;

const CloseButton = styled.button`
  background-color: red;
  float: right;
  color: white;
  border: none;
  border-radius: 5px;
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

const EmojiDiv = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
  }
`;
