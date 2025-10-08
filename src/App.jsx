import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/Sidebar";
import Footer from "./components/Layout/Footer";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import History from "./pages/History";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";

import useAuth from "./hooks/useAuth";

export default function App() {
  const { user } = useAuth();

  // Add or remove body classes based on user login status
  React.useEffect(() => {
    if (user) {
      document.body.classList.remove("login", "register");
    } else {
      // Determine if current path is login or register to add class
      const path = window.location.pathname;
      if (path === "/login") {
        document.body.classList.add("login");
        document.body.classList.remove("register");
      } else if (path === "/register") {
        document.body.classList.add("register");
        document.body.classList.remove("login");
      } else {
        document.body.classList.remove("login", "register");
      }
    }
  }, [user]);

  return (
    <div className="flex min-h-screen bg-theme transition-colors duration-500">
        {/* Sidebar always visible on md+ screens */}
        {user && <Sidebar />}

        <div className="flex flex-col flex-1 min-h-screen">
          {/* Navbar always visible */}
          {user && <Navbar />}

          <main className="flex-grow p-6">
            <Routes>
              {/* Public routes */}
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/dashboard" />}
              />
              <Route
                path="/register"
                element={!user ? <Register /> : <Navigate to="/dashboard" />}
              />

              {/* Protected routes */}
              <Route
                path="/"
                element={user ? <Home /> : <Navigate to="/login" />}
              />
              <Route
                path="/dashboard"
                element={user ? <Dashboard /> : <Navigate to="/login" />}
              />
              <Route
                path="/settings"
                element={user ? <Settings /> : <Navigate to="/login" />}
              />
              <Route
                path="/history"
                element={user ? <History /> : <Navigate to="/login" />}
              />
              <Route
                path="/about"
                element={user ? <About /> : <Navigate to="/login" />}
              />

              {/* Catch-all */}
              <Route
                path="*"
                element={<Navigate to={user ? "/dashboard" : "/login"} />}
              />
            </Routes>
          </main>

          {user && <Footer />}
        </div>
      </div>
  );
}
