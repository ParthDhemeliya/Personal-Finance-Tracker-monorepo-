import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, fetchUser, logout } from "./authThunk";

interface AuthState {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  hasFetchedUser: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null, // token is now unused, but keep for type compatibility
  loading: false,
  error: null,
  hasFetchedUser: false,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Remove the logout reducer to avoid confusion
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        // Only update user email if available; rest will be filled by fetchUser
        state.user = action.payload?.email
          ? {
              id: action.payload.id || "", // Use id from payload if present
              email: action.payload.email,
              first_name: "",
              last_name: "",
            }
          : null;
        state.token = null; // No token in payload
        state.hasFetchedUser = false; // Trigger fetchUser
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // Only update user info if available
        state.user = action.payload?.email
          ? {
              id: "", // Will be filled by fetchUser
              email: action.payload.email,
              first_name: action.payload.first_name || "",
              last_name: action.payload.last_name || "",
            }
          : null;
        state.token = null; // No token in payload
        state.hasFetchedUser = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        const user = action.payload;
        state.loading = false;
        state.user = {
          id: user._id || user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
        };
        state.hasFetchedUser = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
        state.hasFetchedUser = true; // Prevent infinite retry loop
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

// Remove export const { logout } = authSlice.actions;
export default authSlice.reducer;
