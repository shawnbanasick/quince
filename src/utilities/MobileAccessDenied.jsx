import styled from "styled-components";
import useSettingsStore from "../globalState/useSettingsStore";

const getLangObj = (state) => state.langObj;

const MobileAccessDenied = () => {
  const langObj = useSettingsStore(getLangObj);

  return (
    <MobileAccessDeniedDiv>
      <h1>{langObj.preventMobileTitle}</h1>
      <p>{langObj.preventMobileMessage}</p>
    </MobileAccessDeniedDiv>
  );
};
export default MobileAccessDenied;

const MobileAccessDeniedDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  text-align: center;
`;
