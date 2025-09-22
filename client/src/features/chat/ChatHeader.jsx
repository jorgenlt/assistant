import DropdownProviders from "./components/DropdownProviders";
import { useWindowSize } from "react-use";
import { FaBars } from "react-icons/fa6";
import { setIsMenuOpen } from "../menu/menuSlice";
import { useDispatch } from "react-redux";

const ChatHeader = () => {
  const dispatch = useDispatch();

  const isMobile = useWindowSize().width < 767;

  return (
    <div className="border-b border-[#83838326] flex items-center justify-between">
      {isMobile && (
        <div className="cursor-pointer ml-2" onClick={() => dispatch(setIsMenuOpen(true))}>
          <FaBars size={30} />
        </div>
      )}
      <DropdownProviders />
    </div>
  );
};

export default ChatHeader;
