import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./component/pages/LoginPage.jsx";
import { lazy, Suspense } from "react";

const Chat = lazy(() => import("./component/pages/ChatPage.jsx"));



const Router = () => {
  const isAuthenticated = () => !!localStorage.getItem("token");

  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/" />;
  };

  const PublicRoute = ({ children }) => {
    return !isAuthenticated() ? children : <Navigate to="/dashboard" />;
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <h1>Home</h1>
          </PublicRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <Chat />
            </Suspense>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default Router;
