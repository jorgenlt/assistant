import { useState, useEffect } from "react";
import { SpinnerCircularFixed } from "spinners-react";

const Loader = ({ isThemeDark, text }) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (!text) return;

    const timer = setTimeout(() => setShowText(true), 2000);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div className="flex flex-col justify-center items-center h-full w-full gap-8">
      <SpinnerCircularFixed
        size={80}
        thickness={60}
        speed={110}
        color={isThemeDark ? "#fafafa" : "#121416"}
        secondaryColor="rgba(0, 0, 0, 0.4)"
      />
      <div className="h-4">
        {text && showText && (
          <span className="inline-block animate-pulse text-lg">{text}</span>
        )}
      </div>
    </div>
  );
};

export default Loader;
