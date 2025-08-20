// components/ColumnHeader.jsx
import styled from "styled-components";

const ColumnHeader = ({
  color,
  shouldDisplayEmojis,
  shouldDisplayNums,
  shouldDisplayText,
  emoji,
  value,
  textHeader,
}) => {
  return (
    <ColorBarDiv color={color}>
      <ContentWrapper>
        {shouldDisplayEmojis && <EmojiDiv>{emoji}</EmojiDiv>}
        <TextDiv>
          {shouldDisplayNums && <HeaderNumber>{value}</HeaderNumber>}
          {shouldDisplayText && <HeaderText>{textHeader}</HeaderText>}
        </TextDiv>
        {shouldDisplayEmojis && <EmojiDiv>{emoji}</EmojiDiv>}
      </ContentWrapper>
    </ColorBarDiv>
  );
};

export default ColumnHeader;

const ColorBarDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding-right: 4px;
  padding-left: 4px;
  background-color: ${(props) => props.color};
  width: 100%;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding-right: 2px;
  padding-left: 2px;
`;

const HeaderNumber = styled.span`
  font-weight: bold;
  font-size: 16px;
  line-height: 1;
`;

const EmojiDiv = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderText = styled.div`
  display: flex;
  padding-top: 2px;
  justify-content: center;
  flex-wrap: wrap;
  text-align: center;
  font-size: 4vw;
  text-align: center;
  line-height: 0.8rem;
`;

const TextDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
`;
