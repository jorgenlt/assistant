import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_URL } from "../../app/config";

export const pingServer = createAsyncThunk(
  "server/ping",
  async (_, { rejectWithValue }) => {
    const start = Date.now();

    try {
      const res = await axios.get(`${BASE_API_URL}/ping`);

      const responseTime = Date.now() - start;

      return { data: res.data, responseTime };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const serverSlice = createSlice({
  name: "server",
  initialState: {
    status: "idle",
    responseTime: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(pingServer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(pingServer.fulfilled, (state, action) => {
        state.status = "awake";
        state.responseTime = action.payload.responseTime;
      })
      .addCase(pingServer.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || action.error.message;
      });
  },
});

export default serverSlice.reducer;
