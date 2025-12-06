import styled from "styled-components";
import headersDivStyle from "./headersDivStyle";
import useStore from "../../globalState/useStore";

/* eslint react/prop-types: 0 */

const getColumnId = (state) => state.draggingOverColumnId;
const getMapObj = (state) => state.mapObj;

const Headers = (props) => {
  const { qSortHeaders, qSortHeaderNumbers, headerColorsArray, columnWidth } = props;

  const highlightedColHeader = useStore(getColumnId);
  const mapObj = useStore(getMapObj);

  let shouldDisplayNums;
  let displayNumbers = mapObj?.useColLabelNumsDesktop;
  if (displayNumbers !== undefined || displayNumbers !== null) {
    if (displayNumbers === false || displayNumbers === "false") {
      shouldDisplayNums = false;
    } else {
      shouldDisplayNums = true;
    }
  }

  return (
    <div className="headersContainer">
      {qSortHeaderNumbers.map((headerItem, index) => (
        <HeaderDiv
          style={headersDivStyle(
            index,
            columnWidth,
            headerColorsArray,
            qSortHeaders,
            highlightedColHeader
          )}
          key={headerItem}
        >
          {shouldDisplayNums ? headerItem : ""}
        </HeaderDiv>
      ))}
    </div>
  );
};

export default Headers;

const HeaderDiv = styled.div``;
