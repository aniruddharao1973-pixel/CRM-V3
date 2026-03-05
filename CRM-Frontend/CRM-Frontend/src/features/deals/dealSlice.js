// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import API from "../../api/axios";

// export const fetchDeals = createAsyncThunk(
//   "deals/fetchAll",
//   async (params, { rejectWithValue }) => {
//     try {
//       const { data } = await API.get("/deals", { params });
//       return data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to fetch deals");
//     }
//   }
// );

// export const fetchDeal = createAsyncThunk(
//   "deals/fetchOne",
//   async (id, { rejectWithValue }) => {
//     try {
//       const { data } = await API.get(`/deals/${id}`);
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to fetch deal");
//     }
//   }
// );

// export const createDeal = createAsyncThunk(
//   "deals/create",
//   async (dealData, { rejectWithValue }) => {
//     try {
//       const { data } = await API.post("/deals", dealData);
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to create deal");
//     }
//   }
// );

// export const updateDeal = createAsyncThunk(
//   "deals/update",
//   async ({ id, ...dealData }, { rejectWithValue }) => {
//     try {
//       const { data } = await API.put(`/deals/${id}`, dealData);
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to update deal");
//     }
//   }
// );

// export const deleteDeal = createAsyncThunk(
//   "deals/delete",
//   async (id, { rejectWithValue }) => {
//     try {
//       await API.delete(`/deals/${id}`);
//       return id;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to delete deal");
//     }
//   }
// );

// export const fetchPipelineStats = createAsyncThunk(
//   "deals/pipeline",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await API.get("/deals/pipeline/stats");
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message);
//     }
//   }
// );

// const dealSlice = createSlice({
//   name: "deals",
//   initialState: {
//     deals: [],
//     deal: null,
//     pipelineStats: null,
//     pagination: null,
//     loading: false,
//     detailLoading: false,
//     error: null,
//   },
//   reducers: {
//     clearDealError: (state) => {
//       state.error = null;
//     },
//     clearCurrentDeal: (state) => {
//       state.deal = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchDeals.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchDeals.fulfilled, (state, action) => {
//         state.loading = false;
//         state.deals = action.payload.data;
//         state.pagination = action.payload.pagination;
//       })
//       .addCase(fetchDeals.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(fetchDeal.pending, (state) => {
//         state.detailLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchDeal.fulfilled, (state, action) => {
//         state.detailLoading = false;
//         state.deal = action.payload;
//       })
//       .addCase(fetchDeal.rejected, (state, action) => {
//         state.detailLoading = false;
//         state.error = action.payload;
//       })
//       .addCase(createDeal.fulfilled, (state, action) => {
//         state.deals.unshift(action.payload);
//       })
//       .addCase(updateDeal.fulfilled, (state, action) => {
//         const idx = state.deals.findIndex((d) => d.id === action.payload.id);
//         if (idx !== -1) state.deals[idx] = action.payload;
//         if (state.deal?.id === action.payload.id) state.deal = action.payload;
//       })
//       .addCase(deleteDeal.fulfilled, (state, action) => {
//         state.deals = state.deals.filter((d) => d.id !== action.payload);
//       })
//       .addCase(fetchPipelineStats.fulfilled, (state, action) => {
//         state.pipelineStats = action.payload;
//       });
//   },
// });

// export const { clearDealError, clearCurrentDeal } = dealSlice.actions;
// export default dealSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

/* ================= FETCH ALL ================= */
export const fetchDeals = createAsyncThunk(
  "deals/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/deals", { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch deals");
    }
  }
);

/* ================= FETCH ONE ================= */
export const fetchDeal = createAsyncThunk(
  "deals/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/deals/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch deal");
    }
  }
);

/* ================= CREATE ================= */
export const createDeal = createAsyncThunk(
  "deals/create",
  async (dealData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/deals", dealData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create deal");
    }
  }
);

/* ================= UPDATE ================= */
export const updateDeal = createAsyncThunk(
  "deals/update",
  async ({ id, ...dealData }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/deals/${id}`, dealData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update deal");
    }
  }
);

/* ⭐ QUICK STAGE UPDATE (for progress bar click) */
export const updateDealStage = createAsyncThunk(
  "deals/updateStage",
  async ({ id, stage }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/deals/${id}`, { stage });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update stage");
    }
  }
);

/* ================= DELETE ================= */
export const deleteDeal = createAsyncThunk(
  "deals/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/deals/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete deal");
    }
  }
);

/* ================= PIPELINE ================= */
export const fetchPipelineStats = createAsyncThunk(
  "deals/pipeline",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/deals/pipeline/stats");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

/* ======================================================= */

const dealSlice = createSlice({
  name: "deals",
  initialState: {
    deals: [],
    deal: null,
    pipelineStats: null,
    pagination: null,

    loading: false,
    detailLoading: false,
    actionLoading: false,

    error: null,
  },

  reducers: {
    clearDealError: (state) => {
      state.error = null;
    },
    clearCurrentDeal: (state) => {
      state.deal = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ================= FETCH LIST ================= */
      .addCase(fetchDeals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= FETCH ONE ================= */
      .addCase(fetchDeal.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(fetchDeal.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.deal = action.payload;
      })
      .addCase(fetchDeal.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })

      /* ================= CREATE ================= */
      .addCase(createDeal.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(createDeal.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.deals.unshift(action.payload);
      })
      .addCase(createDeal.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      /* ================= UPDATE ================= */
      .addCase(updateDeal.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateDeal.fulfilled, (state, action) => {
        state.actionLoading = false;

        const idx = state.deals.findIndex((d) => d.id === action.payload.id);
        if (idx !== -1) state.deals[idx] = action.payload;

        if (state.deal?.id === action.payload.id) {
          state.deal = action.payload;
        }
      })
      .addCase(updateDeal.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      /* ⭐ STAGE QUICK UPDATE */
      .addCase(updateDealStage.fulfilled, (state, action) => {
        state.deal = action.payload;
      })

      /* ================= DELETE ================= */
      .addCase(deleteDeal.fulfilled, (state, action) => {
        state.deals = state.deals.filter((d) => d.id !== action.payload);
      })

      /* ================= PIPELINE ================= */
      .addCase(fetchPipelineStats.fulfilled, (state, action) => {
        state.pipelineStats = action.payload;
      });
  },
});

export const { clearDealError, clearCurrentDeal } = dealSlice.actions;
export default dealSlice.reducer;