// hooks/useEmojiArrays.js
import { useMemo } from "react";
import { v4 as uuid } from "uuid";
import EmojiN5 from "../../../assets/emojiN5.svg?react";
import EmojiN4 from "../../../assets/emojiN4.svg?react";
import EmojiN3 from "../../../assets/emojiN3.svg?react";
import EmojiN2 from "../../../assets/emojiN2.svg?react";
import EmojiN1 from "../../../assets/emojiN1.svg?react";
import Emoji0 from "../../../assets/emoji0.svg?react";
import Emoji1 from "../../../assets/emoji1.svg?react";
import Emoji2 from "../../../assets/emoji2.svg?react";
import Emoji3 from "../../../assets/emoji3.svg?react";
import Emoji4 from "../../../assets/emoji4.svg?react";
import Emoji5 from "../../../assets/emoji5.svg?react";

export const useEmojiArrays = (mapObj) => {
  const emojiArrays = useMemo(() => {
    const emoji5Array = [
      <EmojiN5 key={uuid()} />,
      <EmojiN4 key={uuid()} />,
      <EmojiN3 key={uuid()} />,
      <EmojiN2 key={uuid()} />,
      <EmojiN1 key={uuid()} />,
      <Emoji0 key={uuid()} />,
      <Emoji1 key={uuid()} />,
      <Emoji2 key={uuid()} />,
      <Emoji3 key={uuid()} />,
      <Emoji4 key={uuid()} />,
      <Emoji5 key={uuid()} />,
    ];

    const emoji4Array = [
      <EmojiN5 key={uuid()} />,
      <EmojiN3 key={uuid()} />,
      <EmojiN2 key={uuid()} />,
      <EmojiN1 key={uuid()} />,
      <Emoji0 key={uuid()} />,
      <Emoji1 key={uuid()} />,
      <Emoji2 key={uuid()} />,
      <Emoji3 key={uuid()} />,
      <Emoji5 key={uuid()} />,
    ];

    const emoji3Array = [
      <EmojiN3 key={uuid()} />,
      <EmojiN2 key={uuid()} />,
      <EmojiN1 key={uuid()} />,
      <Emoji0 key={uuid()} />,
      <Emoji1 key={uuid()} />,
      <Emoji2 key={uuid()} />,
      <Emoji3 key={uuid()} />,
    ];

    const emoji2Array = [
      <EmojiN2 key={uuid()} />,
      <EmojiN1 key={uuid()} />,
      <Emoji0 key={uuid()} />,
      <Emoji1 key={uuid()} />,
      <Emoji2 key={uuid()} />,
    ];

    return {
      emoji5Array,
      emoji4Array,
      emoji3Array,
      emoji2Array,
    };
  }, []);

  const displayArray = useMemo(() => {
    const emojiArrayType = mapObj?.emojiArrayType?.[0];
    if (!emojiArrayType) return [];

    return emojiArrays[emojiArrayType] || [];
  }, [mapObj, emojiArrays]);

  return { displayArray };
};
