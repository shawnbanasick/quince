import { useCallback, useRef } from "react";
import ReactModal from "react-modal";
import styled from "styled-components";
import useStore from "../globalState/useStore";
import debounce from "lodash/debounce";
import ScrollableContainer from "./ScrollableContainer";

const getSetHasScrolledToBottom = (state) => state.setM_hasScrolledBottom;

const MobileModal = (props) => {
  // STATE
  const triggerModal = props.trigger; // useStore(getTriggerModal);
  const setTriggerModal = props.setTrigger; // useStore(getSetTriggerModal);
  const setHasScrolledToBottom = useStore(getSetHasScrolledToBottom);
  const contentRef = useRef(null);

  // LANGUAGE
  const modalHead = props.head;
  const modalText = props.text;
  const modalHeight = props.height;

  let threshold = 50;
  // ignore the warning about inlining the function
  const handleScroll = useCallback(
    debounce((event) => {
      const target = event.target;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      if (distanceFromBottom <= threshold) {
        setHasScrolledToBottom(true);
      }
    }, 100), // Debounce delay in milliseconds
    [setHasScrolledToBottom, threshold]
  );

  const onCloseModal = () => {
    setTriggerModal(false);
    setHasScrolledToBottom(false);
  };

  // presort help modal css settings
  const customStyles = {
    content: {
      display: "flex",
      justifySelf: "center",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      padding: "0px",
      // width: "90%",
      height: "fit-content",
      maxHeight: "80vh",
      paddingBottom: "10px",
      WebkitOverflowScrolling: "touch",
    },
  };

  // console.log(isOverflow);
  // hasOverflow = true;

  return (
    <Container>
      <ReactModal
        id="presortHelpModal"
        isOpen={triggerModal}
        onClose={onCloseModal}
        style={customStyles}
        overlayClassName="Overlay"
        ariaHideApp={false}
      >
        <CloseDiv>
          <CloseButton onClick={onCloseModal}>X</CloseButton>
        </CloseDiv>
        <ModalHeader>
          {modalHead}
          <hr />
        </ModalHeader>
        <ContentContainer ref={contentRef}>
          <ScrollableContainer height={modalHeight}>
            <ModalContent onScroll={handleScroll}>{modalText}</ModalContent>
          </ScrollableContainer>
        </ContentContainer>
      </ReactModal>
    </Container>
  );
};

export default MobileModal;

const ModalHeader = styled.div`
  font-size: 20px;
  width: 100%;
  border-radius: 10px;
  padding: 10px;
  line-height: 1.42;
  padding: 10px;
  margin-top: 0px;
  color: black;
  hr {
    color: black;
  }
`;

const ModalContent = styled.div`
  // inner
  padding: 0px;
  padding-top: 15px;
  color: ${(props) => props.theme.mobileText};
  min-height: 8vh;
  overflow-y: scroll;
`;

const ContentContainer = styled.div`
  // outer
  width: 90%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 60vh;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
`;

// const OverlayTriangle = styled.div`
//   position: absolute;
//   left: 50%;
//   top: 96%; /* Adjust as needed */
//   transform: translate(-50%, -50%);
//   z-index: 2;
//   pointer-events: none; /* So clicks pass through */
// `;

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
