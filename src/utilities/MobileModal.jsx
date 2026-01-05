import { useCallback, useRef } from "react";
import ReactModal from "react-modal";
import styled from "styled-components";
import useStore from "../globalState/useStore";
import debounce from "lodash/debounce";

// SELECTORS
const getSetHasScrolledToBottom = (state) => state.setM_hasScrolledBottom;
// Adjust this to match your exact store variable name
const getHasScrolledToBottomValue = (state) => state.m_hasScrolledBottom;

const MobileModal = (props) => {
  // STATE
  const triggerModal = props.trigger;
  const setTriggerModal = props.setTrigger;
  const setHasScrolledToBottom = useStore(getSetHasScrolledToBottom);
  const hasScrolledToBottom = useStore(getHasScrolledToBottomValue);
  const contentRef = useRef(null);

  // LANGUAGE
  const modalHead = props.head;
  const modalText = props.text;

  let threshold = 20;

  const handleScroll = useCallback(
    debounce((event) => {
      const target = event.target;
      const bottomPosition = Math.ceil(target.scrollTop + target.clientHeight);
      const totalHeight = Math.ceil(target.scrollHeight);

      if (totalHeight - bottomPosition <= threshold) {
        if (!hasScrolledToBottom) setHasScrolledToBottom(true);
      } else {
        if (hasScrolledToBottom) setHasScrolledToBottom(false);
      }
    }, 50),
    [hasScrolledToBottom, setHasScrolledToBottom, threshold]
  );

  const onCloseModal = () => {
    setTriggerModal(false);
    setHasScrolledToBottom(false);
  };

  const customStyles = {
    content: {
      position: "absolute",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "0",
      border: "none",
      background: "transparent",
      width: "90%",
      maxWidth: "500px",

      // CRITICAL: We let the content dictate height, up to a max
      height: "auto",
      maxHeight: "85vh",

      display: "flex",
      flexDirection: "column",
      overflow: "visible", // Allow the shadow/corners to render nicely
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      zIndex: 1000,
    },
  };

  return (
    <ReactModal
      id="presortHelpModal"
      isOpen={triggerModal}
      onClose={onCloseModal}
      style={customStyles}
      ariaHideApp={false}
      bodyOpenClassName="modal-open"
    >
      <StyledModalContainer>
        <CloseDiv>
          <CloseButton onClick={onCloseModal}>X</CloseButton>
        </CloseDiv>

        <ModalHeader>
          {modalHead}
          <hr />
        </ModalHeader>

        <ContentWrapper>
          <ScrollableArea ref={contentRef} onScroll={handleScroll}>
            {modalText}
            {/* Spacer to ensure text clears the fade at the very bottom */}
            <BottomSpacer />
          </ScrollableArea>

          {/* The fade sits ON TOP of the scroll area */}
          <BottomFadeOverlay $isAtBottom={hasScrolledToBottom} />
        </ContentWrapper>
      </StyledModalContainer>
    </ReactModal>
  );
};

export default MobileModal;

// --- STYLED COMPONENTS ---

const StyledModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 12px;
  width: 100%;

  /* This ensures the container shrinks to fit short text, 
     but stops growing at the max-height set by ReactModal */
  height: 100%;
  max-height: 85vh;

  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const ModalHeader = styled.div`
  flex-shrink: 0;
  width: 100%;
  padding: 5px 20px 15px 20px;
  color: black;
  font-weight: 600;
  font-size: 20px;

  hr {
    margin-top: 15px;
    border: 0;
    border-top: 1px solid #eee;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0; /* CRITICAL: Allows flex child to scroll properly */
  flex-grow: 1; /* Fills the rest of the modal height */
`;

const ScrollableArea = styled.div`
  /* We removed position: absolute. 
     Now it acts like a normal block that overflows when it gets too big */
  overflow-y: auto;
  padding: 0 20px;

  /* Mobile momentum scrolling */
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  overscroll-behavior-y: contain;
  -webkit-overflow-scrolling: touch;

  color: ${(props) => props.theme.mobileText || "#444"};
  line-height: 1.6;

  /* Hide scrollbars */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`;

const BottomSpacer = styled.div`
  height: 60px; /* Ensures the last line of text isn't hidden behind the fade */
  width: 100%;
  flex-shrink: 0;
`;

const BottomFadeOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
  pointer-events: none;
  transition: opacity 0.3s ease-in-out;
  opacity: ${(props) => (props.$isAtBottom ? 0 : 1)};
  z-index: 2;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`;

const CloseButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-bottom-left-radius: 12px;
  width: 50px;
  height: 44px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #cc0000;
  }
`;

const CloseDiv = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;
