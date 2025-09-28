import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk, signupThunk } from "./authSlice";
import { FaGithub } from "react-icons/fa6";

import { TbRobot } from "react-icons/tb";

const Login = () => {
  const authError = useSelector((state) => state.auth.error);

  const [error, setError] = useState(null);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();

  const toggleScreen = () => {
    setError(null);
    setIsSignup((prevState) => !prevState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedData = Object.fromEntries(
      Object.entries(formData).map(([k, v]) =>
        typeof v === "string" ? [k, v.trim()] : [k, v]
      )
    );

    const { email, password, ...rest } = trimmedData;

    if (isSignup) {
      if ([email, password, ...Object.values(rest)].some((v) => !v)) {
        return setError("Please fill out all fields.");
      }
      return dispatch(signupThunk(trimmedData));
    }

    if (!email || !password) {
      return setError("Please fill out email and password.");
    }

    dispatch(loginThunk({ email, password }));
  };

  return (
    <div className="h-full w-full min-h-screen flex items-center justify-center   flex-col gap-0">
      <div className="flex gap-2 items-center">
        <div>
          <TbRobot size={60} color="#ee29f5" />
        </div>
        <h1 className="text-5xl ">Assistant</h1>
      </div>

      <div className="p-4">
        <div className="bg-[var(--bg1)] rounded-xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-xl font-medium mb-6">
            Sign {isSignup ? "up" : "in"}
          </h1>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {authError && <p className="text-sm text-red-500">{authError}</p>}

            {isSignup && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    type="text"
                    autoComplete="given-name"
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
                    autoComplete="family-name"
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
                autoComplete="email"
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
                autoComplete="current-password"
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
                  autoComplete="new-password"
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

          <div className="mt-4 w-fit">
            <a
              href="https://github.com/jorgenlt/assistant"
              target="_blank"
              aria-label="Source Code"
              rel="noopener noreferrer"
            >
              <FaGithub size={33} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
