// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   leaveRequests: [], // { id, userId, type, startDate, endDate, reason, status, appliedAt, reviewedBy, reviewedAt }
//   leaveBalances: {}, // { [userId]: { sick: number, casual: number, earned: number } }
//   leaveTypes: ["sick", "casual", "earned"],
// };

// const leaveSlice = createSlice({
//   name: "leave",
//   initialState,
//   reducers: {
//     applyLeave: (state, action) => {
//       const { userId, type, startDate, endDate, reason } = action.payload;
//       const id = Date.now();
//       state.leaveRequests.push({
//         id,
//         userId,
//         type,
//         startDate,
//         endDate,
//         reason,
//         status: "Pending",
//         appliedAt: new Date().toISOString(),
//         reviewedBy: null,
//         reviewedAt: null,
//       });
//     },
//     approveLeave: (state, action) => {
//       const { requestId, adminId } = action.payload;
//       const req = state.leaveRequests.find((r) => r.id === requestId);
//       if (req && req.status === "Pending") {
//         req.status = "Approved";
//         req.reviewedBy = adminId;
//         req.reviewedAt = new Date().toISOString();
//         // Calculate days
//         const days =
//           (new Date(req.endDate) - new Date(req.startDate)) /
//             (1000 * 60 * 60 * 24) +
//           1;
//         if (!state.leaveBalances[req.userId]) {
//           state.leaveBalances[req.userId] = { sick: 0, casual: 0, earned: 0 };
//         }
//         state.leaveBalances[req.userId][req.type] =
//           (state.leaveBalances[req.userId][req.type] || 0) - days;
//       }
//     },
//     rejectLeave: (state, action) => {
//       const { requestId, adminId } = action.payload;
//       const req = state.leaveRequests.find((r) => r.id === requestId);
//       if (req && req.status === "Pending") {
//         req.status = "Rejected";
//         req.reviewedBy = adminId;
//         req.reviewedAt = new Date().toISOString();
//       }
//     },
//     setLeaveBalance: (state, action) => {
//       const { userId, balances } = action.payload;
//       state.leaveBalances[userId] = balances;
//     },
//   },
// });

// export const { applyLeave, approveLeave, rejectLeave, setLeaveBalance } =
//   leaveSlice.actions;
// export default leaveSlice.reducer;



import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  leaveRequests: [], // { id, userId, type, startDate, endDate, reason, status, appliedAt, reviewedBy, reviewedAt }
  leaveBalances: {}, // { [userId]: { sick: number, casual: number, earned: number } }
  leaveTypes: ["sick", "casual", "earned"],
};

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    applyLeave: (state, action) => {
      const { userId, type, startDate, endDate, reason } = action.payload;
      // Ensure id and userId are strings
      const id = String(Date.now()); 
      state.leaveRequests.push({
        id,
        userId: String(userId), // Store as string
        type,
        startDate,
        endDate,
        reason,
        status: "Pending",
        appliedAt: new Date().toISOString(),
        reviewedBy: null,
        reviewedAt: null,
      });
    },
    approveLeave: (state, action) => {
      const { requestId, adminId } = action.payload;
      // Ensure requestId is string for comparison
      const req = state.leaveRequests.find((r) => String(r.id) === String(requestId));
      if (req && req.status === "Pending") {
        req.status = "Approved";
        req.reviewedBy = adminId;
        req.reviewedAt = new Date().toISOString();
        // Calculate days
        const days =
          (new Date(req.endDate) - new Date(req.startDate)) /
            (1000 * 60 * 60 * 24) +
          1;
        if (!state.leaveBalances[req.userId]) {
          state.leaveBalances[req.userId] = { sick: 0, casual: 0, earned: 0 };
        }
        state.leaveBalances[req.userId][req.type] =
          (state.leaveBalances[req.userId][req.type] || 0) - days;
      }
    },
    rejectLeave: (state, action) => {
      const { requestId, adminId } = action.payload;
      // Ensure requestId is string for comparison
      const req = state.leaveRequests.find((r) => String(r.id) === String(requestId));
      if (req && req.status === "Pending") {
        req.status = "Rejected";
        req.reviewedBy = adminId;
        req.reviewedAt = new Date().toISOString();
      }
    },
    setLeaveBalance: (state, action) => {
      const { userId, balances } = action.payload;
      state.leaveBalances[String(userId)] = balances; // Store key as string
    },
  },
});

export const { applyLeave, approveLeave, rejectLeave, setLeaveBalance } =
  leaveSlice.actions;
export default leaveSlice.reducer;