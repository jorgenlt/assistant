import { FaEllipsis } from "react-icons/fa6";
import { PulseLoader } from "react-spinners";
import { useSelector } from "react-redux";

function ListItem({ action, title }) {
  const isThemeDark = useSelector((state) => state.menu.isThemeDark);

  return title ? (
    <div
      className="hover:bg-[var(--hover)] group flex justify-between items-center gap-2 px-3 py-2 rounded-xl mx-2 cursor-pointer select-none"
      onClick={action}
    >
      <span className="text-sm font-medium truncate">{title}</span>
      <div className="hidden group-hover:flex">
        <FaEllipsis className="hover:text-gray-400 hover:dark:text-gray-800" />
      </div>
    </div>
  ) : (
    <div className="px-3 py-1 rounded-xl mx-2 cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-700">
      <PulseLoader size={5} color={isThemeDark ? "#fafafa" : "#121416"} />
    </div>
  );
}

export default ListItem;
