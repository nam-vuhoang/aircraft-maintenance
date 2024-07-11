import { RefObject } from 'react';

interface UseScrollParams {
  containerRef: RefObject<HTMLDivElement>;
}

/**
 * Provides methods for scrolling a container to the right, left, top, bottom, or by a specified amount.
 * @param param0
 * @returns
 */
const useScroll = ({ containerRef }: UseScrollParams) => {
  const scrollToRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: containerRef.current.scrollWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollToLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const scrollByAmount = (amount: { x?: number; y?: number }) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: amount.x || 0,
        top: amount.y || 0,
        behavior: 'smooth',
      });
    }
  };

  return {
    scrollToRight,
    scrollToLeft,
    scrollToTop,
    scrollToBottom,
    scrollByAmount,
  };
};

export default useScroll;
