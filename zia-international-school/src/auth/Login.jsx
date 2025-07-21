import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";

function Login() {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { role } = await authService.login(formData);

      // ✅ Set the activity timestamp immediately after successful login
      localStorage.setItem("lastActivityTime", Date.now().toString());

      // ✅ Navigate based on role
      if (role === "ADMIN") navigate("/admin/dashboard");
      else if (role === "STUDENT") navigate("/student/dashboard");
      else if (role === "TEACHER") navigate("/teacher/dashboard");
      else if (role === "PARENT") navigate("/parent/dashboard");
      else navigate("/");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f2f4f7",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <Card
        className="p-4 shadow-sm border-0 rounded"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <h3 className="text-center mb-3 text-primary">
          ZIA International School
        </h3>
        <h5 className="text-center mb-4">Login</h5>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email or Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter email or username"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {error && <p className="text-danger text-center">{error}</p>}

          <div className="d-grid mb-3">
            <Button variant="primary" type="submit">
              Login
            </Button>
          </div>

          <div className="d-flex justify-content-between">
            <Link to="/signup">New User? Signup</Link>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
