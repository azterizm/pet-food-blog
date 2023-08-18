import { RefObject, useEffect, useMemo, useState } from "react";

export function useUndefinedParam(...arg: any[]) {
  useEffect(() => {
    const available = arg.find((r) => typeof r === "undefined" || r === null);
    if (available) window.location.href = "/";
  }, []);
}

export default function useOnScreen(
  ref: RefObject<HTMLElement>,
  onChange?: (arg: Boolean) => void,
) {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = useMemo(() =>
    new IntersectionObserver(
      (
        [entry],
      ) => (setIntersecting(entry.isIntersecting),
        onChange && onChange(entry.isIntersecting)),
      { threshold: 1 },
    ), [ref]);

  useEffect(() => {
    if (!ref.current) return;
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return isIntersecting;
}

export function makeMouseScrollable(boxRef: RefObject<HTMLElement>) {
  useEffect(() => {
    if (!boxRef.current) return
    const box = boxRef.current

    let isDown = false
    let startX: number = 0
    let startY: number = 0
    let scrollLeft: number = 0
    let scrollTop: number = 0

    function onMouseMove(this: Document, e: MouseEvent) {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - box.offsetLeft
      const y = e.pageY - box.offsetTop
      const walkX = (x - startX) * 1 // Change this number to adjust the scroll speed
      const walkY = (y - startY) * 1 // Change this number to adjust the scroll speed
      box.scrollLeft = scrollLeft - walkX
      box.scrollTop = scrollTop - walkY
    }

    function onMouseDown(this: HTMLElement, e: MouseEvent) {
      isDown = true
      startX = e.pageX - box.offsetLeft
      startY = e.pageY - box.offsetTop
      scrollLeft = box.scrollLeft
      scrollTop = box.scrollTop
      box.style.cursor = 'grabbing'
    }

    function onMouseLeave() {
      isDown = false
      box.style.cursor = 'grab'
    }

    function onMouseUp() {
      isDown = false
      box.style.cursor = 'grab'
    }

    box.addEventListener('mousedown', onMouseDown)
    box.addEventListener('mouseleave', onMouseLeave)
    box.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousemove', onMouseMove)

    return () => {
      box.removeEventListener('mousedown', onMouseDown)
      box.removeEventListener('mouseleave', onMouseLeave)
      box.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [boxRef])
}
