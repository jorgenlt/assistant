import { ClipLoader } from "react-spinners";

const Loader = ({ isThemeDark }) => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <ClipLoader size={80} color={isThemeDark ? "#fafafa" : "#121416"} />
    </div>
  );
};

export default Loader;
