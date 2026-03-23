import { useDispatch, useSelector } from "react-redux";
import ToggleSwitch from "./ToggleSwitch";
import { toggleEnterIsSend } from "../sidebarSlice";

const Settings = () => {
  const { isEnterSend } = useSelector((state) => state.sidebar);

  const dispatch = useDispatch();

  const handleToggleEnterIsSend = () => {
    dispatch(toggleEnterIsSend());
  };

  return (
    <div>
      <div className="p-4 flex">
        <ToggleSwitch
          id="enter-is-send"
          label="Enter is send"
          checked={isEnterSend}
          onChange={handleToggleEnterIsSend}
        />
      </div>
    </div>
  );
};

export default Settings;
