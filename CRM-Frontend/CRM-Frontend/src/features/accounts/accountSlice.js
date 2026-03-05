import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/accounts", { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch accounts");
    }
  }
);

export const fetchAccount = createAsyncThunk(
  "accounts/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/accounts/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch account");
    }
  }
);

export const createAccount = createAsyncThunk(
  "accounts/create",
  async (accountData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/accounts", accountData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create account");
    }
  }
);

export const updateAccount = createAsyncThunk(
  "accounts/update",
  async ({ id, ...accountData }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/accounts/${id}`, accountData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update account");
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "accounts/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/accounts/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete account");
    }
  }
);

export const fetchAccountsDropdown = createAsyncThunk(
  "accounts/dropdown",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/accounts/dropdown/list");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const accountSlice = createSlice({
  name: "accounts",
  initialState: {
    accounts: [],
    account: null,
    dropdown: [],
    pagination: null,
    loading: false,
    detailLoading: false,
    error: null,
  },
  reducers: {
    clearAccountError: (state) => {
      state.error = null;
    },
    clearCurrentAccount: (state) => {
      state.account = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAccount.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.account = action.payload;
      })
      .addCase(fetchAccount.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.accounts.unshift(action.payload);
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        const idx = state.accounts.findIndex((a) => a.id === action.payload.id);
        if (idx !== -1) state.accounts[idx] = action.payload;
        if (state.account?.id === action.payload.id) state.account = action.payload;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter((a) => a.id !== action.payload);
      })
      .addCase(fetchAccountsDropdown.fulfilled, (state, action) => {
        state.dropdown = action.payload;
      });
  },
});

export const { clearAccountError, clearCurrentAccount } = accountSlice.actions;
export default accountSlice.reducer;