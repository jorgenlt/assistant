import { FaWorm, FaAnglesLeft } from "react-icons/fa6";

function MenuHeader({ action }) {
  return (
    <div className="mb-4 flex justify-between">
      <div
        className="mx-3 px-2 py-2 cursor-pointer w-fit rounded-xl hover:bg-[var(--hover)]"
        onClick={action}
      >
        <FaWorm className="size-5" color="#ee29f5" />
      </div>
      <div
        className="hidden mx-3 px-2 py-2 cursor-pointer w-fit rounded-xl hover:bg-[var(--hover)]"
        onClick={action}
      >
        <FaAnglesLeft className="size-5" color="gray" />
      </div>
    </div>
  );
}

export default MenuHeader;
