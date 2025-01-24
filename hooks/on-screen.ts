import { RefObject, useEffect, useMemo, useState } from "react";

export function isOnScreen(ref: RefObject<any>): boolean {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIntersecting(entry.isIntersecting)
      ),
    [ref]
  );

  useEffect(() => {
    if (!ref.current) return;

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return isIntersecting;
}
