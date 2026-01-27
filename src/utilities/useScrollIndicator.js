import { useState, useEffect } from "react";

// Custom hook to detect scrollable content
const useScrollIndicator = (elementRef) => {
  const [hasScrollableContent, setHasScrollableContent] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const checkScrollable = () => {
      const hasScroll = element.scrollHeight > element.clientHeight;
      const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 5; // 5px tolerance

      setHasScrollableContent(hasScroll);
      setIsAtBottom(atBottom);
      setShowIndicator(hasScroll && !atBottom);
    };

    // Initial check
    setTimeout(checkScrollable, 100);

    // Check on scroll
    element.addEventListener("scroll", checkScrollable, { passive: true });

    // Check on resize/content changes
    const resizeObserver = new ResizeObserver(checkScrollable);
    resizeObserver.observe(element);

    const mutationObserver = new MutationObserver(checkScrollable);
    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      element.removeEventListener("scroll", checkScrollable);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [elementRef]);

  return { hasScrollableContent, isAtBottom, showIndicator };
};

export default useScrollIndicator;
