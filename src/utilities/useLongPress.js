import { useState, useRef, useEffect } from "react";

export default function useLongPress(threshold = 500) {
  const [action, setAction] = useState();

  const timerRef = useRef();
  const isLongPress = useRef(false);

  // Make sure a pending timer never fires setState after unmount.
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  function startPressTimer() {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      setAction("longpress");
    }, threshold);
  }

  function clearPressTimer() {
    clearTimeout(timerRef.current);
  }

  function handleOnClick() {
    console.log("handleOnClick");
    if (isLongPress.current) {
      console.log("Is long press - not continuing.");
      return;
    }
    setAction("click");
  }

  function handleOnMouseDown() {
    console.log("handleOnMouseDown");
    startPressTimer();
  }

  function handleOnMouseUp() {
    console.log("handleOnMouseUp");
    clearPressTimer();
  }

  function handleOnMouseLeave() {
    console.log("handleOnMouseLeave");
    clearPressTimer();
  }

  function handleOnTouchStart() {
    console.log("handleOnTouchStart");
    startPressTimer();
  }

  function handleOnTouchEnd() {
    console.log("handleOnTouchEnd");
    clearPressTimer();

    // Use the ref, not the (async) state, so this matches handleOnClick's
    // logic exactly and isn't affected by a stale `action` from a prior press.
    if (isLongPress.current) {
      console.log("Is long press - not continuing.");
      return;
    }
    setAction("click");
  }

  function handleOnTouchCancel() {
    console.log("handleOnTouchCancel");
    clearPressTimer();
    isLongPress.current = false;
  }

  return {
    action,
    handlers: {
      onClick: handleOnClick,
      onMouseDown: handleOnMouseDown,
      onMouseUp: handleOnMouseUp,
      onMouseLeave: handleOnMouseLeave,
      onTouchStart: handleOnTouchStart,
      onTouchEnd: handleOnTouchEnd,
      onTouchCancel: handleOnTouchCancel,
    },
  };
}
