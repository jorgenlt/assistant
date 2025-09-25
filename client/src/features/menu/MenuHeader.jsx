import { TbRobot } from "react-icons/tb";

const MenuHeader = ({ action }) => {
  return (
    <div className="mb-4 flex">
      <div
        className="mx-3 px-2 py-2 cursor-pointer w-fit rounded-xl hover:bg-[var(--hover)]"
        onClick={action}
      >
        <TbRobot size={30} color="#ee29f5" />
      </div>
    </div>
  );
};

export default MenuHeader;
