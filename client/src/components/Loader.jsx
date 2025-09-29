import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";

const Loader = ({ isThemeDark, text }) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (!text) return;

    const timer = setTimeout(() => setShowText(true), 2000);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div className="flex flex-col justify-center items-center h-full w-full gap-8">
      <ClipLoader size={80} color={isThemeDark ? "#fafafa" : "#121416"} />
      <div className="h-4">
        {text && showText && (
          <span className="inline-block animate-pulse text-lg">{text}</span>
        )}
      </div>
    </div>
  );
};

export default Loader;
