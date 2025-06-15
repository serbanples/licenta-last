import React from "react";
import { useNavigate } from "react-router-dom";

export const HomePage: React.FC = () => {
  // redirect to files page
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate("/files");
  }, [navigate]);

  return (
    <div>HOME</div>
  )
}