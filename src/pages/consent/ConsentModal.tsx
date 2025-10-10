import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import styled from "styled-components";
import ReactHtmlParser from "html-react-parser";
import decodeHTML from "../../utilities/decodeHTML";
import useSettingsStore from "../../globalState/useSettingsStore";
import useStore from "../../globalState/useStore";

// Type definitions for store selectors
interface SettingsState {
  langObj: {
    consentHelpModalHead?: string;
    consentHelpModalText?: string;
  };
}

interface StoreState {
  triggerConsentModal: boolean;
  setTriggerConsentModal: (value: boolean) => void;
}

interface ConsentModalProps extends React.PropsWithChildren {
  className: string;
}

const getLangObj = (state: SettingsState) => state.langObj;
const getTriggerConsentModal = (state: StoreState) => state.triggerConsentModal;
const getSetTriggerConsentModal = (state: StoreState) => state.setTriggerConsentModal;

const ConsentModal: React.FC<ConsentModalProps> = () => {
  // STATE
  const langObj = useSettingsStore(getLangObj);
  const triggerConsentModal = useStore(getTriggerConsentModal);
  const setTriggerConsentModal = useStore(getSetTriggerConsentModal);

  const consentHelpModalHead = ReactHtmlParser(decodeHTML(langObj.consentHelpModalHead)) || "";
  const consentHelpModalText = ReactHtmlParser(decodeHTML(langObj.consentHelpModalText)) || "";

  const onCloseModal = (): void => {
    setTriggerConsentModal(false);
  };

  return (
    <Modal
      classNames={{ modal: "customModal" }}
      open={triggerConsentModal}
      onClose={onCloseModal}
      center
    >
      <ModalHeader>{consentHelpModalHead}</ModalHeader>
      <hr />
      <ModalContent>{consentHelpModalText}</ModalContent>
    </Modal>
  );
};

export default ConsentModal;

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
