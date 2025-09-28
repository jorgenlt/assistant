import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_API_URL } from "../../app/config";
import axios from "axios";

const initialState = {
  token: null,
  user: null,
  isAuth: false,
  authStatus: "idle",
  error: null,
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const url = `${BASE_API_URL}/auth/login`;

      const response = await axios.post(url, {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;
        return { token, user };
      }

      return rejectWithValue("Invalid login response");
    } catch (error) {
      const msg =
        error?.response?.data?.message || error?.message || "Login failed";
      return rejectWithValue(msg);
    }
  }
);

export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (formData, { dispatch, rejectWithValue }) => {
    console.log(formData);
    try {
      const url = `${BASE_API_URL}/auth/register`;

      const response = await axios.post(url, formData);

      if (response.status === 201) {
        await dispatch(
          loginThunk({ email: formData.email, password: formData.password })
        );
        return;
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message || error?.message || "Signup failed";
      return rejectWithValue(msg);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Logging out the user
    setLogout: () => {
      return initialState;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginThunk.pending, (state) => {
        state.authStatus = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.error = null;
        state.authStatus = "idle";

        const { token, user } = action.payload;

        state.token = token;
        state.user = user;
        state.isAuth = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.authStatus = "failed";
        state.error = action.payload ?? action.error?.message ?? "Login failed";
      })
      // Signup
      .addCase(signupThunk.pending, (state) => {
        state.authStatus = "loading";
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state) => {
        state.authStatus = "idle";
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.authStatus = "failed";
        state.error =
          action.payload ?? action.error?.message ?? "Signup failed";
      });
  },
});

// Exporting action from auth slice
export const { setLogout, setError } = authSlice.actions;

// Exporting auth slice reducer function
export default authSlice.reducer;
