import { useEffect } from "react";

const useClickOutside = (
  ref,
  handler,
  events = ["mousedown", "touchstart"]
) => {
  const eventsKey = events.join(",");

  useEffect(() => {
    const listener = (event) => {
      const el = ref.current;
      // If there's no element yet or the click is inside the element, do nothing
      if (!el || el.contains(event.target)) {
        return;
      }
      handler(event);
    };

    // Attach listeners
    events.forEach((ev) => document.addEventListener(ev, listener, true));

    // Cleanup
    return () => {
      events.forEach((ev) => document.removeEventListener(ev, listener, true));
    };
  }, [ref, handler, eventsKey, events]);
};

export default useClickOutside;
