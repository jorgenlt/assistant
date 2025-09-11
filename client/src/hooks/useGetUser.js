import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_API_URL } from "../app/config";

const useGetUser = (userId) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const getUser = async () => {
      try {
        const url = `${BASE_API_URL}/users/${userId}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setUser(response.data);
        } else {
          console.error("Fetching user data failed:", response.data.error);
        }
      } catch (err) {
        console.error(
          "An error occurred when getting the user information",
          err.message
        );
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [userId, token]);

  return { user, isLoading, error };
};

export default useGetUser;
