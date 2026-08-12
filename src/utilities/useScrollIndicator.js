import { useState, useEffect } from "react";

const useScrollIndicator = (elementRef) => {
  const [hasScrollableContent, setHasScrollableContent] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const checkScrollable = () => {
      const hasScroll = element.scrollHeight > element.clientHeight;
      const atBottom =
        element.scrollHeight - element.scrollTop <= element.clientHeight + 5;

      setHasScrollableContent(hasScroll);
      setIsAtBottom(atBottom);
      setShowIndicator(hasScroll && !atBottom);
    };

    const timeoutId = setTimeout(checkScrollable, 100);

    element.addEventListener("scroll", checkScrollable, { passive: true });

    const resizeObserver = new ResizeObserver(checkScrollable);
    resizeObserver.observe(element);

    const mutationObserver = new MutationObserver(checkScrollable);
    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      clearTimeout(timeoutId);
      element.removeEventListener("scroll", checkScrollable);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [elementRef.current]); // re-run when the actual DOM node changes, not just ref identity

  return { hasScrollableContent, isAtBottom, showIndicator };
};

export default useScrollIndicator;
