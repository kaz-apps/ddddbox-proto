import { useEffect, useRef } from 'react';

export const useAutoScroll = (scrollContainerRef: React.RefObject<HTMLDivElement>) => {
  const scrollIntervalRef = useRef<number>();
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // ガントチャートのバーをクリックした時のみドラッグ状態にする
      if ((e.target as HTMLElement).closest('.bar-wrapper')) {
        isDraggingRef.current = true;
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      if (scrollIntervalRef.current) {
        window.clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = undefined;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const scrollSpeed = 30; // スクロール速度を上げる
      const scrollTriggerArea = 150; // スクロールを開始する範囲を広げる

      // 右端の自動スクロール
      if (e.clientX > containerRect.right - scrollTriggerArea) {
        if (!scrollIntervalRef.current) {
          scrollIntervalRef.current = window.setInterval(() => {
            const speed = Math.min(
              scrollSpeed,
              Math.max(10, (scrollTriggerArea - (containerRect.right - e.clientX)) / 2)
            );
            container.scrollLeft += speed;
          }, 16);
        }
      }
      // 左端の自動スクロール
      else if (e.clientX < containerRect.left + scrollTriggerArea) {
        if (!scrollIntervalRef.current) {
          scrollIntervalRef.current = window.setInterval(() => {
            const speed = Math.min(
              scrollSpeed,
              Math.max(10, (scrollTriggerArea - (e.clientX - containerRect.left)) / 2)
            );
            container.scrollLeft -= speed;
          }, 16);
        }
      }
      // スクロール停止
      else if (scrollIntervalRef.current) {
        window.clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = undefined;
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
      if (scrollIntervalRef.current) {
        window.clearInterval(scrollIntervalRef.current);
      }
    };
  }, [scrollContainerRef]);
}; 