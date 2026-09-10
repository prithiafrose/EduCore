import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authApi";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logoutUser();
      } catch (error) {
        console.error(error);
      } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
      }
    };

    performLogout();
  }, [navigate]);

  return null;
}

export default Logout;
