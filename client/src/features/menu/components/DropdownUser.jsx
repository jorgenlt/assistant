import Button from "../../../components/Button";
const DropdownUser = ({ user, logout }) => {
  const { firstName, lastName } = user;

  return (
    <div>
      <p>
        {firstName} {lastName}
      </p>
      <Button title="Logout" faIcon="FaRightFromBracket" onClick={logout} />
    </div>
  );
};

export default DropdownUser;
