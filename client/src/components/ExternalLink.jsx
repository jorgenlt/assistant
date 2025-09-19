import { FaArrowUpRightFromSquare } from "react-icons/fa6";

const ExternalLink = ({ link, title }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="cursor-pointer hover:underline my-2 gap-2 flex items-center"
    >
      {title}
      <FaArrowUpRightFromSquare size={12} />
    </a>
  );
};

export default ExternalLink;
