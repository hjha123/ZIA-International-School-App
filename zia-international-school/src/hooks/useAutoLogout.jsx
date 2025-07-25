import { useEffect, useState } from "react";

export default function useAutoLogout(timeoutMinutes = 10) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timeoutMillis = timeoutMinutes * 60 * 1000;

    const logout = () => {
      setShowModal(true);
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

    // Add listeners
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) =>
      window.addEventListener(event, updateActivityTime)
    );
    const interval = setInterval(checkInactivity, 60 * 1000);

    // Initialize
    updateActivityTime();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, updateActivityTime)
      );
      clearInterval(interval);
    };
  }, [timeoutMinutes]);

  const handleModalClose = () => {
    localStorage.clear();
    window.location.href = "/login"; // force reload
  };

  return { showModal, handleModalClose };
}
