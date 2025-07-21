import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "../api/axios"; // Use configured axios instance

function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    role: "STUDENT", // default role
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/signup", formData);
      setSuccess("Signup successful! You can now login.");
      setError("");
    } catch (err) {
      setError("Signup failed. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f2f4f7",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
      }}
    >
      <Card
        className="p-4 shadow-sm border-0 rounded"
        style={{ width: "100%", maxWidth: "480px" }}
      >
        <h3 className="text-center mb-3 text-primary">
          ZIA International School
        </h3>
        <h5 className="text-center mb-4">Signup</h5>

        <Form onSubmit={handleSignup}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter full name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Choose a username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Create password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Register As</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="STUDENT">Student</option>
              <option value="PARENT">Parent</option>
            </Form.Select>
          </Form.Group>

          {error && <p className="text-danger text-center">{error}</p>}
          {success && <p className="text-success text-center">{success}</p>}

          <div className="d-grid mb-3">
            <Button variant="primary" type="submit">
              Signup
            </Button>
          </div>

          <div className="text-center">
            <Link to="/login">Already have an account? Login</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default Signup;
