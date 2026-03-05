// // src/features/auth/authSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import API from "../../api/axios";

// // Helper to safely parse JSON
// const safeJSONParse = (str) => {
//   try {
//     return str ? JSON.parse(str) : null;
//   } catch {
//     return null;
//   }
// };

// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const { data } = await API.post("/auth/login", credentials);
//       localStorage.setItem("token", data.data.token);
//       localStorage.setItem("user", JSON.stringify(data.data.user));
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Login failed");
//     }
//   }
// );

// // export const registerUser = createAsyncThunk(
// //   "auth/register",
// //   async (userData, { rejectWithValue }) => {
// //     try {
// //       const { data } = await API.post("/auth/register", userData);
// //       localStorage.setItem("token", data.data.token);
// //       localStorage.setItem("user", JSON.stringify(data.data.user));
// //       return data.data;
// //     } catch (err) {
// //       return rejectWithValue(err.response?.data?.message || "Registration failed");
// //     }
// //   }
// // );
// export const registerUser = createAsyncThunk(
//   "auth/register",
//   async (userData, { rejectWithValue }) => {
//     try {
//       const { data } = await API.post("/auth/register", userData);
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Registration failed"
//       );
//     }
//   }
// );

// export const logoutUser = createAsyncThunk("auth/logout", async () => {
//   try {
//     await API.post("/auth/logout");
//   } catch (err) {
//     console.log("Logout API error:", err);
//   }
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");
// });

// export const fetchUsers = createAsyncThunk(
//   "auth/fetchUsers",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await API.get("/auth/users");
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
//     }
//   }
// );

// // Get stored auth data
// const storedUser = safeJSONParse(localStorage.getItem("user"));
// const storedToken = localStorage.getItem("token");

// // Validate that both exist together
// const initialUser = storedUser && storedToken ? storedUser : null;
// const initialToken = storedUser && storedToken ? storedToken : null;

// // Clean up if mismatched
// if (!initialUser || !initialToken) {
//   localStorage.removeItem("user");
//   localStorage.removeItem("token");
// }

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: initialUser,
//     token: initialToken,
//     users: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearAuth: (state) => {
//       state.user = null;
//       state.token = null;
//       state.users = [];
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Login
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         state.error = null;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.user = null;
//         state.token = null;
//       })
//       // Register
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         state.error = null;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.user = null;
//         state.token = null;
//       })
//       // Logout
//       .addCase(logoutUser.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.loading = false;
//         state.user = null;
//         state.token = null;
//         state.users = [];
//         state.error = null;
//       })
//       // Fetch users
//       .addCase(fetchUsers.fulfilled, (state, action) => {
//         state.users = action.payload;
//       });
//   },
// });

// export const { clearError, clearAuth } = authSlice.actions;
// export default authSlice.reducer;
// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

// Helper to safely parse JSON
const safeJSONParse = (str) => {
  try {
    return str ? JSON.parse(str) : null;
  } catch {
    return null;
  }
};

/* ================= LOGIN ================= */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/auth/login", credentials);

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

/* ================= REGISTER (ADMIN CREATES USER) ================= */
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/auth/register", userData);
      return data.data; // only created user / message
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

/* ================= LOGOUT ================= */
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await API.post("/auth/logout");
  } catch (err) {
    console.log("Logout API error:", err);
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");
});

/* ================= FETCH USERS ================= */
export const fetchUsers = createAsyncThunk(
  "auth/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/auth/users");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

/* ================= INITIAL STATE ================= */
const storedUser = safeJSONParse(localStorage.getItem("user"));
const storedToken = localStorage.getItem("token");

const initialUser = storedUser && storedToken ? storedUser : null;
const initialToken = storedUser && storedToken ? storedToken : null;

if (!initialUser || !initialToken) {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,
    token: initialToken,
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.users = [];
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder

      /* ===== LOGIN ===== */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== REGISTER (CREATE USER ONLY) ===== */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // 🚀 DO NOT change logged-in user
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== LOGOUT ===== */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.users = [];
        state.loading = false;
        state.error = null;
      })

      /* ===== FETCH USERS ===== */
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      });
  },
});
export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/auth/users/${id}`);
      return id; // return deleted user id
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

export const { clearError, clearAuth } = authSlice.actions;
export default authSlice.reducer;