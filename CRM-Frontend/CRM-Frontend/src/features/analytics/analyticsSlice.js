// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import API from "../../api/axios";

// export const fetchDashboardAnalytics = createAsyncThunk(
//   "analytics/dashboard",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await API.get("/analytics/dashboard");
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to fetch analytics");
//     }
//   }
// );

// export const fetchDealsByStage = createAsyncThunk(
//   "analytics/dealsByStage",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await API.get("/analytics/deals-by-stage");
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message);
//     }
//   }
// );

// export const fetchMonthlyTrend = createAsyncThunk(
//   "analytics/monthlyTrend",
//   async (months = 6, { rejectWithValue }) => {
//     try {
//       const { data } = await API.get(`/analytics/monthly-trend?months=${months}`);
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message);
//     }
//   }
// );

// export const fetchTopPerformers = createAsyncThunk(
//   "analytics/topPerformers",
//   async (limit = 5, { rejectWithValue }) => {
//     try {
//       const { data } = await API.get(`/analytics/top-performers?limit=${limit}`);
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message);
//     }
//   }
// );

// export const fetchDealsBySource = createAsyncThunk(
//   "analytics/dealsBySource",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await API.get("/analytics/deals-by-source");
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message);
//     }
//   }
// );

// export const fetchRecentActivities = createAsyncThunk(
//   "analytics/recentActivities",
//   async (limit = 10, { rejectWithValue }) => {
//     try {
//       const { data } = await API.get(`/analytics/recent-activities?limit=${limit}`);
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message);
//     }
//   }
// );

// export const fetchDealsByIndustry = createAsyncThunk(
//   "analytics/dealsByIndustry",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await API.get("/analytics/deals-by-industry");
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message);
//     }
//   }
// );

// const analyticsSlice = createSlice({
//   name: "analytics",
//   initialState: {
//     dashboard: null,
//     dealsByStage: [],
//     monthlyTrend: [],
//     topPerformers: [],
//     dealsBySource: [],
//     dealsByIndustry: [],
//     recentActivities: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearAnalyticsError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Dashboard
//       .addCase(fetchDashboardAnalytics.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
//         state.loading = false;
//         state.dashboard = action.payload;
//       })
//       .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Deals by stage
//       .addCase(fetchDealsByStage.fulfilled, (state, action) => {
//         state.dealsByStage = action.payload;
//       })
//       // Monthly trend
//       .addCase(fetchMonthlyTrend.fulfilled, (state, action) => {
//         state.monthlyTrend = action.payload;
//       })
//       // Top performers
//       .addCase(fetchTopPerformers.fulfilled, (state, action) => {
//         state.topPerformers = action.payload;
//       })
//       // Deals by source
//       .addCase(fetchDealsBySource.fulfilled, (state, action) => {
//         state.dealsBySource = action.payload;
//       })
//       // Recent activities
//       .addCase(fetchRecentActivities.fulfilled, (state, action) => {
//         state.recentActivities = action.payload;
//       })
//       // Deals by industry
//       .addCase(fetchDealsByIndustry.fulfilled, (state, action) => {
//         state.dealsByIndustry = action.payload;
//       });
//   },
// });

// export const { clearAnalyticsError } = analyticsSlice.actions;
// export default analyticsSlice.reducer;

// features\analytics\analyticsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

/* ============================================================
   THUNKS
============================================================ */

export const fetchDashboardAnalytics = createAsyncThunk(
  "analytics/dashboard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/analytics/dashboard");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard",
      );
    }
  },
);

export const fetchDealsByStage = createAsyncThunk(
  "analytics/dealsByStage",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/analytics/deals-by-stage");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch stage data",
      );
    }
  },
);

export const fetchMonthlyTrend = createAsyncThunk(
  "analytics/monthlyTrend",
  async (months = 6, { rejectWithValue }) => {
    try {
      const { data } = await API.get(
        `/analytics/monthly-trend?months=${months}`,
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch trend data",
      );
    }
  },
);

export const fetchTopPerformers = createAsyncThunk(
  "analytics/topPerformers",
  async (limit = 5, { rejectWithValue }) => {
    try {
      const { data } = await API.get(
        `/analytics/top-performers?limit=${limit}`,
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch performers",
      );
    }
  },
);

export const fetchDealsBySource = createAsyncThunk(
  "analytics/dealsBySource",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/analytics/deals-by-source");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch source data",
      );
    }
  },
);

export const fetchRecentActivities = createAsyncThunk(
  "analytics/recentActivities",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const { data } = await API.get(
        `/analytics/recent-activities?limit=${limit}`,
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch activities",
      );
    }
  },
);

export const fetchDealsByIndustry = createAsyncThunk(
  "analytics/dealsByIndustry",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/analytics/deals-by-industry");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const fetchKpiMetrics = createAsyncThunk(
  "analytics/kpiMetrics",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/analytics/kpi-metrics");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch KPI metrics",
      );
    }
  },
);

export const fetchDealPriority = createAsyncThunk(
  "analytics/dealPriority",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/analytics/deal-priority");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch deal priority",
      );
    }
  },
);
/* ============================================================
   SLICE
============================================================ */

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    dashboard: null,
    dealsByStage: [],
    monthlyTrend: [],
    topPerformers: [],
    dealsBySource: [],
    dealsByIndustry: [],
    recentActivities: null,

    dealPriority: [],
    dealPriorityLoading: false,

    /* NEW */
    kpis: {
      pipelineValue: 0,
      winRate: 0,
      avgDealSize: 0,
      salesCycle: 0,
    },

    dashboardLoading: false,
    loading: false,
    error: null,
  },

  reducers: {
    clearAnalyticsError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ---------------- Dashboard ---------------- */
      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.dashboardLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error = action.payload;
      })

      /* ---------------- Stage ---------------- */
      .addCase(fetchDealsByStage.fulfilled, (state, action) => {
        state.dealsByStage = action.payload;
      })

      /* ---------------- Monthly Trend ---------------- */
      .addCase(fetchMonthlyTrend.fulfilled, (state, action) => {
        state.monthlyTrend = action.payload;
      })

      /* ---------------- Top Performers ---------------- */
      .addCase(fetchTopPerformers.fulfilled, (state, action) => {
        state.topPerformers = action.payload;
      })

      /* ---------------- Source ---------------- */
      .addCase(fetchDealsBySource.fulfilled, (state, action) => {
        state.dealsBySource = action.payload;
      })

      /* ---------------- Recent Activities ---------------- */
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.recentActivities = action.payload;
      })
      // Deals by industry
      .addCase(fetchDealsByIndustry.fulfilled, (state, action) => {
        state.dealsByIndustry = action.payload;
      })

      /* ---------------- KPI Metrics ---------------- */
      .addCase(fetchKpiMetrics.fulfilled, (state, action) => {
        state.kpis = action.payload;
      })
      /* ---------------- Deal Priority Engine ---------------- */

      .addCase(fetchDealPriority.pending, (state) => {
        state.dealPriorityLoading = true;
      })

      .addCase(fetchDealPriority.fulfilled, (state, action) => {
        state.dealPriorityLoading = false;
        state.dealPriority = action.payload;
      })

      .addCase(fetchDealPriority.rejected, (state, action) => {
        state.dealPriorityLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAnalyticsError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
