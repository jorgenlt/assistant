import { useSelector } from "react-redux";
import { PropagateLoader } from "react-spinners";

const ConversationLoader = () => {
  const isThemeDark = useSelector((state) => state.sidebar.isThemeDark);
  return (
    <div className="flex justify-center align-start">
      <div>
        <PropagateLoader
          size={12}
          color={isThemeDark ? "#fafafa" : "#121416"}
        />
      </div>
    </div>
  );
};

export default ConversationLoader;
