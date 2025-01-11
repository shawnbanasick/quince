import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";
import MobileValueButton from "./MobileValueButton";
import MobileStatementBox from "./MobileStatementBox";
import { useState } from "react";

const getLangObj = (state) => state.langObj;
const getTriggerMobilePresortRedoModal = (state) =>
  state.triggerMobilePresortRedoModal;
const getSetTriggerMobilePresortRedoModal = (state) =>
  state.setTriggerMobilePresortRedoModal;

const MobilePresortRedoModal = (props) => {
  // *** STATE
  const langObj = useSettingsStore(getLangObj);
  const triggerMobilePresortRedoModal = useStore(
    getTriggerMobilePresortRedoModal
  );
  const setTriggerMobilePresortRedoModal = useStore(
    getSetTriggerMobilePresortRedoModal
  );
  const moveTopMobileHead =
    ReactHtmlParser(decodeHTML(langObj.mobilePresortRedoModalHead)) || "";

  // *** LANGUAGE TRANSLATION *** //
  let moveTopMobileText = "";
  let showStatement = true;

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
    ReactHtmlParser(decodeHTML(langObj.mobilePresortRedoModalConfirmButton)) ||
    "";
  const cancelButtonText =
    ReactHtmlParser(decodeHTML(langObj.moveTopMobileButtonCancel)) || "";
  const assignLeft =
    ReactHtmlParser(decodeHTML(langObj.mobilePresortAssignLeft)) || "";
  const assignRight =
    ReactHtmlParser(decodeHTML(langObj.mobilePresortAssignRight)) || "";

  const onCloseModal = () => {
    setCharacteristics({ backgroundColor: "#e5e5e5", value: 0 });
    setTriggerMobilePresortRedoModal(false);
  };

  return (
    <Modal
      classNames={{ modal: "customMobileModal" }}
      open={triggerMobilePresortRedoModal}
      onClose={onCloseModal}
      center
    >
      <ModalHeader>{moveTopMobileHead}</ModalHeader>
      <hr />
      <ModalContent>{moveTopMobileText}</ModalContent>
      {/* {showStatement && (
        <Statement color={props.cardId.current.color}>
          {props.cardId.current.statement}
        </Statement>
      )} */}
      <MobileStatementBox
        backgroundColor={characteristics.backgroundColor}
        statement={props.statement.current.statement}
      />
      <ButtonRowLabel>
        <AssignDiv>{assignLeft}</AssignDiv>
        <AssignDiv>{assignRight}</AssignDiv>
      </ButtonRowLabel>
      <ButtonRow>
        <MobileValueButton
          id={`-2`}
          value={-2}
          text={`-`}
          color={`#FBD5D5`}
          onClick={clickNegative}
        />
        <MobileValueButton
          id={`0`}
          value={0}
          text={`?`}
          color={`#F3F4F6`}
          onClick={clickUndecided}
        />

        <MobileValueButton
          id={`2`}
          value={2}
          text={`+`}
          color={`#BCF0DA`}
          onClick={clickPositive}
        />
      </ButtonRow>
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
    </Modal>
  );
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
