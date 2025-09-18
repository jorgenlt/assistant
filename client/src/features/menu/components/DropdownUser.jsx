const DropdownUser = ({user}) => {
  const {firstName, lastName} = user;

  return (
    <div>
      <p>{firstName} {lastName}</p>
    </div>
  );
};

export default DropdownUser;
