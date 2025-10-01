const ConversationDate = ({ created }) => {
  return (
    <div className="w-full text-center mt-20 mb-10 select-none">
      <span className="text-gray-400">{created}</span>
    </div>
  );
};

export default ConversationDate;
