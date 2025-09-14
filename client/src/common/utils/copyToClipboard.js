const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    alert("Failed to copy: " + err.message);
  }
};

export default copyToClipboard;
