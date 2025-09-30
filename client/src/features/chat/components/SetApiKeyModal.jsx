import { useState, useEffect } from "react";
import Modal from "../../../components/Modal";
import { FaFloppyDisk, FaXmark } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { addApiKeyThunk } from "../../providers/providersSlice";
import Button from "../../../components/Button";
import ExternalLink from "../../../components/ExternalLink";

const SetApiKeyModal = ({ open, onClose, activeProvider, apiKeys }) => {
  const { token, user } = useSelector((state) => state.auth);
  const userId = user._id;

  const dispatch = useDispatch();

  const { provider, name, pricingLink, getApiLink, usageLink } = activeProvider;

  const [apiKey, setApiKey] = useState("");
  const [apiKeyExists, setApiKeyExists] = useState(false);

  const handleAddKey = () => {
    dispatch(addApiKeyThunk({ provider, key: apiKey, userId, token }));
    onClose();
  };

  useEffect(() => {
    setApiKeyExists(apiKeys?.includes(provider));
  }, [provider, apiKeys]);

  return (
    <Modal open={open} onClose={onClose} title={`Set API key for ${name}`}>
      <div className="p-4">
        <form className="space-y-4">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={
              apiKeyExists
                ? "The key is stored in the database. To update it, save again."
                : "Enter your API key"
            }
            className="w-full rounded-xl px-3 py-2 text-sm outline-none bg-[var(--bg3)] text-[var(--text)]"
            required
          />
          <div className="flex justify-end gap-2">
            <Button onClick={onClose} title="Cancel" Icon={FaXmark} />
            <Button onClick={handleAddKey} title="Save" Icon={FaFloppyDisk} />
          </div>
        </form>

        <div className="flex flex-col w-fit">
          <ExternalLink link={usageLink} title={`${name} usage`} />
          <ExternalLink link={pricingLink} title={`${name} API pricing`} />
          <ExternalLink link={getApiLink} title={`Get ${name} API key`} />
        </div>
      </div>
    </Modal>
  );
};

export default SetApiKeyModal;
