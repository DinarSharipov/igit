import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  return localStorage.getItem("token") ? children : <Navigate to="/login" replace />;
};