import { useEffect } from 'react';

interface UseScrollByDraggingParams {
  containerRef: React.RefObject<HTMLDivElement>;
  scrollX?: boolean;
  scrollY?: boolean;
  grabCursor?: string;
  grabbingCursor?: string;
}

/**
 * Provides the ability to scroll a container by dragging it.
 * @param param0 
 */
const useScrollByDragging = ({
  containerRef,
  scrollX = false,
  scrollY = false,
  grabCursor = 'grab',
  grabbingCursor = 'grabbing',
}: UseScrollByDraggingParams) => {
  useEffect(() => {
    const isDragging = { current: false };
    const startX = { current: 0 };
    const startY = { current: 0 };
    const scrollLeft = { current: 0 };
    const scrollTop = { current: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current) {
        isDragging.current = true;
        startX.current = e.pageX - containerRef.current.offsetLeft;
        startY.current = e.pageY - containerRef.current.offsetTop;
        scrollLeft.current = containerRef.current.scrollLeft;
        scrollTop.current = containerRef.current.scrollTop;
        containerRef.current.style.cursor = grabbingCursor;
      }
    };

    const handleMouseLeave = () => {
      isDragging.current = false;
      if (containerRef.current) {
        containerRef.current.style.cursor = grabCursor;
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      if (containerRef.current) {
        containerRef.current.style.cursor = grabCursor;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      e.preventDefault();
      const x = e.pageX - containerRef.current.offsetLeft;
      const y = e.pageY - containerRef.current.offsetTop;
      const walkX = x - startX.current; // Calculate the horizontal distance moved
      const walkY = y - startY.current; // Calculate the vertical distance moved
      if (scrollX) containerRef.current.scrollLeft = scrollLeft.current - walkX;
      if (scrollY) containerRef.current.scrollTop = scrollTop.current - walkY;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [containerRef, scrollX, scrollY, grabCursor, grabbingCursor]);
};

export default useScrollByDragging;
