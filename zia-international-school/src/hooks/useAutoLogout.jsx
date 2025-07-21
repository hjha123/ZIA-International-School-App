import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function useAutoLogout(timeoutMinutes = 2) {
  const navigate = useNavigate();
  const timeoutMillis = timeoutMinutes * 60 * 1000;

  useEffect(() => {
    const logout = () => {
      alert(
        "⚠️ Your session has expired due to inactivity. You will be logged out."
      );
      localStorage.clear();
      navigate("/login");
    };

    const updateActivityTime = () => {
      localStorage.setItem("lastActivityTime", Date.now().toString());
    };

    const checkInactivity = () => {
      const lastActivity = parseInt(
        localStorage.getItem("lastActivityTime"),
        10
      );
      const now = Date.now();

      if (!isNaN(lastActivity) && now - lastActivity >= timeoutMillis) {
        logout();
      }
    };

    // ✅ Reset activity timestamp on user interaction
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) =>
      window.addEventListener(event, updateActivityTime)
    );

    // ✅ Check inactivity every 1 min
    const interval = setInterval(checkInactivity, 60 * 1000);

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, updateActivityTime)
      );
      clearInterval(interval);
    };
  }, [navigate, timeoutMillis]);
}

export default useAutoLogout;
