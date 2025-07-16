import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  records: [], // { userId, date, checkInTime, checkOutTime, status, workingHours, method }
  holidays: [], // array of date strings
  weekends: [0, 6], // Sunday (0) and Saturday (6) by default
  loadingHolidays: false,
  holidayError: null,
};

export const fetchHolidays = createAsyncThunk(
  "attendance/fetchHolidays",
  async (_, { rejectWithValue }) => {
    const calendarId = import.meta.env.VITE_GOOGLE_CALENDAR_ID;
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    const year = new Date().getFullYear();
    const timeMin = `${year}-01-01T00:00:00Z`;
    const timeMax = `${year}-12-31T23:59:59Z`;
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error?.message || "Failed to fetch holidays");
      // Extract holiday dates
      const holidays = (data.items || [])
        .filter((item) => item.start && item.start.date)
        .map((item) => item.start.date);
      return holidays;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    checkIn: (state, action) => {
      const { userId, date, time, method } = action.payload;
      const record = state.records.find(
        (r) => r.userId === userId && r.date === date
      );
      if (!record) {
        state.records.push({
          userId,
          date,
          checkInTime: time,
          checkOutTime: null,
          status: "Present",
          workingHours: 0,
          method,
        });
      }
    },
    checkOut: (state, action) => {
      const { userId, date, time } = action.payload;
      const record = state.records.find(
        (r) => r.userId === userId && r.date === date
      );
      if (record && !record.checkOutTime) {
        record.checkOutTime = time;
        // Calculate working hours
        const checkIn = new Date(`${date}T${record.checkInTime}`);
        const checkOut = new Date(`${date}T${time}`);
        const diff = (checkOut - checkIn) / (1000 * 60 * 60); // hours
        record.workingHours = diff;
        // Mark status based on working hours
        if (diff < 4) record.status = "Half-day";
        else if (diff < 8) record.status = "Late";
        else record.status = "Present";
      }
    },
    setHoliday: (state, action) => {
      state.holidays = action.payload; // array of date strings
    },
    setWeekends: (state, action) => {
      state.weekends = action.payload; // array of weekday numbers
    },
    markAbsent: (state, action) => {
      const { userId, date } = action.payload;
      const record = state.records.find(
        (r) => r.userId === userId && r.date === date
      );
      if (!record) {
        state.records.push({
          userId,
          date,
          checkInTime: null,
          checkOutTime: null,
          status: "Absent",
          workingHours: 0,
          method: "auto",
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolidays.pending, (state) => {
        state.loadingHolidays = true;
        state.holidayError = null;
      })
      .addCase(fetchHolidays.fulfilled, (state, action) => {
        state.loadingHolidays = false;
        state.holidays = action.payload;
      })
      .addCase(fetchHolidays.rejected, (state, action) => {
        state.loadingHolidays = false;
        state.holidayError = action.payload;
      });
  },
});

export const { checkIn, checkOut, setHoliday, setWeekends, markAbsent } =
  attendanceSlice.actions;
export default attendanceSlice.reducer;
