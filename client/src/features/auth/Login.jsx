import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLogin } from "./authSlice";
import axios from "axios";
import { BASE_API_URL } from "../../app/config";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const toggleScreen = () => {
    setError(null);
    setIsSignup((prevState) => !prevState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const login = async () => {
    try {
      const url = `${BASE_API_URL}/auth/login`;

      const response = await axios.post(url, {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;
        dispatch(setLogin({ token, user }));
      }
    } catch (err) {
      setError("Wrong email or password");
      console.error("An error occurred during login:", err.message);
    }
  };

  const signup = async () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields");
      return;
    }

    // Password validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    } else if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const url = `${BASE_API_URL}/auth/register`;
      const response = await axios.post(url, formData);

      if (response.status === 201) {
        login();
      }
    } catch (err) {
      console.error("An error occurred during signup:", err.message);
      setError(`An error occurred during signup: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup) {
      setError(null);

      await signup();
    } else {
      await login();
    }
  };

  return (
    <div className="h-full w-full min-h-screen flex items-center justify-center">
      <div className="bg-[var(--bg1)] rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-xl font-medium mb-6">
          Sign {isSignup ? "up" : "in"}
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && <p className="text-sm text-red-500">{error}</p>}

          {isSignup && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 rounded-xl bg-[var(--bg3)]"
                />
              </div>
              <div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 rounded-xl bg-[var(--bg3)]"
                />
              </div>
            </div>
          )}

          <div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 rounded-xl bg-[var(--bg3)]"
            />
          </div>

          <div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 rounded-xl bg-[var(--bg3)]"
            />
          </div>

          {isSignup && (
            <div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 rounded-xl bg-[var(--bg3)]"
              />
            </div>
          )}

          <button
            type="submit"
            className="cursor-pointer mt-2 w-full py-2 px-4 rounded-xl bg-[var(--bg2)] hover:bg-[var(--hover)] hover:text-[var(--text-hover)]"
          >
            Sign {isSignup ? "up" : "in"}
          </button>
        </form>

        <div className="text-sm text-center mt-4">
          <button
            type="button"
            onClick={toggleScreen}
            className="cursor-pointer hover:underline"
          >
            {isSignup
              ? "Already have an account? Sign in"
              : "Don't have an account? Click here to sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
