const normalizeMarkdown = (content) => {
  // Avoids code pasted in the user message to be rendered as <pre> and <code>
  return content
    .split("\n")
    .map((line) => line.replace(/^[\t ]+/, "")) // strip all leading spaces/tabs
    .join("\n");
};

export default normalizeMarkdown;
