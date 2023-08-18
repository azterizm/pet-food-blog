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
