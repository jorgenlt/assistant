import { ClipLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <ClipLoader size={80} color="#121416" />
    </div>
  );
};

export default Loader;
