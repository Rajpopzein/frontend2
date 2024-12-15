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
    return !isAuthenticated() ? children : <Navigate to="/chat" />;
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
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
