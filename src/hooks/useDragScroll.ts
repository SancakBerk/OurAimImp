import { useRef, useEffect } from 'react';

export const useDragScroll = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let isDown = false;
    let startY = 0;
    let startX = 0;
    let scrollTop = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      element.classList.add('drag-scroll-active');
      element.style.userSelect = 'none';
      startY = e.pageY - element.offsetTop;
      startX = e.pageX - element.offsetLeft;
      scrollTop = element.scrollTop;
      scrollLeft = element.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      element.classList.remove('drag-scroll-active');
      element.style.userSelect = '';
    };

    const handleMouseUp = () => {
      isDown = false;
      element.classList.remove('drag-scroll-active');
      element.style.userSelect = '';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const y = e.pageY - element.offsetTop;
      const x = e.pageX - element.offsetLeft;
      const walkY = (y - startY) * 2;
      const walkX = (x - startX) * 2;
      element.scrollTop = scrollTop - walkY;
      element.scrollLeft = scrollLeft - walkX;
    };

    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('mousemove', handleMouseMove);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mouseup', handleMouseUp);
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return ref;
};
