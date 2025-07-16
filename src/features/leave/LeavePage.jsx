import React from "react";

const LeavePage = () => {
  return (
    <div className="container mx-auto p-2 sm:p-4 w-full max-w-3xl">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Leave Management</h1>
      {/* Leave Application Form will go here */}
      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Apply for Leave
        </h2>
        {/* TODO: Leave application form */}
      </div>
      {/* Leave Requests List for Admin/HR */}
      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Leave Requests
        </h2>
        {/* TODO: Leave requests table/list - wrap in overflow-x-auto and use min-w-full for table */}
      </div>
      {/* Leave Balances */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2">
          Leave Balances
        </h2>
        {/* TODO: Leave balances display */}
      </div>
    </div>
  );
};

export default LeavePage;
