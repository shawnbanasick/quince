import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";

// Selectors
const getLangObj = (state) => state.langObj;
const getTriggerMobileThinMoveTopModal = (state) => state.triggerMobileThinMoveTopModal;
const getSetTriggerMobileThinMoveTopModal = (state) => state.setTriggerMobileThinMoveTopModal;

const MobileThinTopModal = ({ onClick }) => {
  // *** STATE
  const langObj = useSettingsStore(getLangObj);
  const triggerMobileThinMoveTopModal = useStore(getTriggerMobileThinMoveTopModal);
  const setTriggerMobileThinMoveTopModal = useStore(getSetTriggerMobileThinMoveTopModal);

  // *** LANGUAGE TRANSLATIONS
  const moveTopMobileHead = ReactHtmlParser(decodeHTML(langObj.moveTopMobileHead)) || "";
  const moveTopMobileText = ReactHtmlParser(decodeHTML(langObj.moveAllTopMobileText)) || "";
  const okButtonText = ReactHtmlParser(decodeHTML(langObj.moveTopMobileButtonOK)) || "";
  const cancelButtonText = ReactHtmlParser(decodeHTML(langObj.mobileModalButtonCancel)) || "";

  // *** HANDLERS
  const handleCloseModal = () => {
    setTriggerMobileThinMoveTopModal(false);
  };

  const handleConfirm = () => {
    onClick?.();
    handleCloseModal();
  };

  const customCloseIcon = (
    <CloseIconContainer>
      <CloseIcon onClick={handleCloseModal} aria-label="Close modal">
        ×
      </CloseIcon>
    </CloseIconContainer>
  );

  return (
    <Modal
      open={triggerMobileThinMoveTopModal}
      onClose={handleCloseModal}
      center
      closeIcon={customCloseIcon}
      classNames={{
        modal: "custom-move-all-modal-height",
        // modal: "mobile-thin-modal",
        overlay: "mobile-thin-modal-overlay",
      }}
      styles={{
        // modal: {
        //   margin: "0",
        //   padding: "0",
        //   maxWidth: "90vw",
        //   width: "100%",
        //   maxHeight: "50vh",
        //   borderRadius: "12px",
        //   overflow: "hidden",
        //   boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        //   position: "relative",
        // },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <ModalContainer data-testid="mobileThinMoveTopModalDiv">
        <ModalHeader>
          <HeaderText>{moveTopMobileHead}</HeaderText>
          <HeaderDivider />
        </ModalHeader>

        <ModalBody>
          <ContentText>{moveTopMobileText}</ContentText>

          <ButtonGroup>
            <CancelButton onClick={handleCloseModal}>{cancelButtonText}</CancelButton>
            <ConfirmButton onClick={handleConfirm}>{okButtonText}</ConfirmButton>
          </ButtonGroup>
        </ModalBody>
      </ModalContainer>
    </Modal>
  );
};

export default MobileThinTopModal;

// *** STYLED COMPONENTS ***

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  height: 100%;
  max-height: 40vh;
  min-height: 200px;
  width: 100%;
  position: relative;
  overflow: hidden;
`;

const ModalHeader = styled.header`
  padding: 16px 20px 0 20px;
  text-align: center;
  background: white;
  flex-shrink: 0;
`;

const HeaderText = styled.h2`
  margin: 0 0 12px 0;
  font-size: clamp(1.1rem, 4vw, 1.3rem);
  font-weight: 600;
  color: #1f2937;
  line-height: 1.3;
`;

const HeaderDivider = styled.div`
  height: 2px;
  background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
  margin: 0 -20px;
`;

const ModalBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px 20px 20px;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  min-height: 0;
`;

const ContentText = styled.div`
  font-size: clamp(1rem, 3.5vw, 1.125rem);
  line-height: 1.6;
  color: #4b5563;
  text-align: center;
  margin: 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 280px;
`;

const BaseButton = styled.button`
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const CancelButton = styled(BaseButton)`
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;

  &:hover:not(:disabled) {
    background: #e5e7eb;
    color: #4b5563;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ConfirmButton = styled(BaseButton)`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  }
`;

const CloseIconContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
`;

const CloseIcon = styled.div`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  width: 44px;
  height: 44px;
  font-size: 24px;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom-left-radius: 8px;
  border-top-right-radius: 12px;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);

  &:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus {
    outline: 2px solid #fca5a5;
    outline-offset: 2px;
  }
`;
