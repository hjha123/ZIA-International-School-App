import { useEffect } from "react";
import authService from "../services/authService";

const useAutoLogout = (timeoutInMinutes = 2) => {
  useEffect(() => {
    const updateActivity = () => {
      localStorage.setItem("lastActivityTime", Date.now().toString());
    };

    const checkInactivity = () => {
      const lastActivity = localStorage.getItem("lastActivityTime");
      const now = Date.now();

      if (
        lastActivity &&
        now - parseInt(lastActivity, 10) > timeoutInMinutes * 60 * 1000
      ) {
        // Clear storage
        localStorage.removeItem("lastActivityTime");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        localStorage.removeItem("username");

        // Logout service call
        authService.logout();

        // Redirect to login
        window.location.href = "/login";
      }
    };

    const activityEvents = ["click", "mousemove", "keydown", "scroll"];
    activityEvents.forEach((event) =>
      window.addEventListener(event, updateActivity)
    );

    const intervalId = setInterval(checkInactivity, 60000); // every 1 minute

    return () => {
      clearInterval(intervalId);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, updateActivity)
      );
    };
  }, [timeoutInMinutes]);
};

export default useAutoLogout;
