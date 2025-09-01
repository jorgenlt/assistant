import { FaSeedling } from "react-icons/fa6";

function MenuHeader({ action }) {
  return (
    <div className="cursor-pointer flex mx-2 my-2 px-3 py-2" onClick={action}>
      <FaSeedling className="size-5" />
    </div>
  );
}

export default MenuHeader;
