const parseContent = (content) => {
  const parts = content.split(/```/);
  const result = [];

  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      // it's a code block
      const lines = part.split("\n");
      const lang = lines[0].trim();
      const code = lines.slice(1).join("\n");
      result.push({ type: "code", lang, code });
    } else {
      // it's normal markdown text
      result.push({ type: "text", text: part });
    }
  });

  return result;
};

export default parseContent;
