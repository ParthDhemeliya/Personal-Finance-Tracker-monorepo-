import React from "react";
import NavBar from "./NavBar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <NavBar />
      <main className="flex-1 pt-14 p-4 sm:pl-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
