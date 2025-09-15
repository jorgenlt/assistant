import { useState } from "react";
import Modal from "../../../components/Modal";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

const DropdownModal = ({
  open,
  onClose,
  providerName,
  providerPricingLink,
  providerApiLink,
  handleAddKey,
  hasKey,
}) => {
  const [apiKey, setApiKey] = useState("");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Set API key for ${providerName}`}
    >
      <form className="space-y-4">
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={
            hasKey
              ? "The key is stored in the database. To update it, save again."
              : "Enter your API key"
          }
          className="w-full rounded-xl px-3 py-2 text-sm outline-none bg-[var(--bg3)] text-[var(--text)]"
          required
        />
        <div className="flex justify-end gap-2">
          <div
            onClick={onClose}
            className="cursor-pointer rounded-xl px-4 py-2 text-sm hover:bg-[var(--hover)] hover:text-[var(--text-hover)]"
          >
            Cancel
          </div>
          <div
            onClick={() => handleAddKey(apiKey)}
            className="cursor-pointer rounded-xl px-4 py-2 text-sm bg-[var(--bg2)] hover:bg-[var(--hover)] hover:text-[var(--text-hover)]"
          >
            Save
          </div>
        </div>
      </form>

      <div className="flex flex-col w-fit">
        <a
          href={providerPricingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer hover:underline my-2 gap-2 flex items-center"
        >
          {providerName} API pricing
          <FaArrowUpRightFromSquare size={12} />
        </a>
        <a
          href={providerApiLink}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer hover:underline my-2 gap-2 flex items-center"
        >
          Get {providerName} API key
          <FaArrowUpRightFromSquare size={12} />
        </a>
      </div>
    </Modal>
  );
};

export default DropdownModal;
