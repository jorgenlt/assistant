import { useState, useEffect } from "react";
import Modal from "../../../components/Modal";
import { FaFloppyDisk, FaXmark } from "react-icons/fa6";
import { BASE_API_URL } from "../../../app/config";
import { useSelector } from "react-redux";
import Button from "../../../components/Button";
import axios from "axios";
import ExternalLink from "../../../components/ExternalLink";

const DropdownProvidersModal = ({ open, onClose, activeProvider }) => {
  const { token, user } = useSelector((state) => state.auth);

  const userId = user._id;

  const { provider, name, pricingLink, getApiLink, usageLink } = activeProvider;

  const [apiKey, setApiKey] = useState("");
  const [apiKeyExists, setApiKeyExists] = useState(false);

  const addKey = async (provider, key, token) => {
    try {
      const url = `${BASE_API_URL}/users/${userId}/apikeys`;
      const response = await axios.patch(
        url,
        { provider, key },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        console.error(`Unexpected response status: ${response.status}`);
        return null;
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
    }
  };

  const handleAddKey = () => {
    addKey(provider, apiKey, token);

    onClose();
  };

  const hasApiKey = async (userId, token, provider) => {
    try {
      const url = `${BASE_API_URL}/users/${userId}/apiKeys/exists`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          provider: provider,
        },
      });

      if (response) setApiKeyExists(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    hasApiKey(userId, token, provider);
  }, [provider, token, userId]);

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

export default DropdownProvidersModal;
