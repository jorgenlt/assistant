import { FaEllipsis } from "react-icons/fa6";

function ListItem({ action, title }) {
  return (
    <div
      className="group flex justify-between items-center gap-2 px-3 py-2 rounded-xl mx-2 cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-700"
      onClick={action}
    >
      <span className="text-sm font-medium truncate">{title}</span>
      <div className="hidden group-hover:flex">
        <FaEllipsis className="hover:text-gray-400 hover:dark:text-gray-800" />
      </div>
    </div>
  );
}

export default ListItem;
