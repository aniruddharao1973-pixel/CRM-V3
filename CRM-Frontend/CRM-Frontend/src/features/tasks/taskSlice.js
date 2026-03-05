import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";
import toast from "react-hot-toast";

const initialState = {
  tasks: [],
  task: null,
  loading: false,
  pagination: {},
};

/* ================= FETCH TASKS ================= */

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/tasks", { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= GET SINGLE TASK ================= */

export const getTask = createAsyncThunk(
  "tasks/getTask",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/tasks/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= CREATE TASK ================= */

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/tasks", formData);
      toast.success("Task created successfully");
      return data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= UPDATE TASK ================= */

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/tasks/${id}`, formData);
      toast.success("Task updated");
      return data.data;
    } catch (err) {
      toast.error("Update failed");
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= DELETE TASK ================= */

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/tasks/${id}`);
      toast.success("Task deleted");
      return id;
    } catch (err) {
      toast.error("Delete failed");
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= SLICE ================= */

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTask: (state) => {
      state.task = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.loading = false;
      })

      /* GET ONE */
      .addCase(getTask.fulfilled, (state, action) => {
        state.task = action.payload;
      })

      /* CREATE */
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state) => {
        state.loading = false;
      })

      /* UPDATE */
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (t) => t.id === action.payload.id
        );
        if (index !== -1) state.tasks[index] = action.payload;
      })

      /* DELETE */
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(
          (t) => t.id !== action.payload
        );
      });
  },
});

export const { clearTask } = taskSlice.actions;

export default taskSlice.reducer;