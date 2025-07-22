import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { sendResetLink } from "../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await sendResetLink(email);
      setMessage("✅ " + res);
    } catch (err) {
      setMessage("❌ " + (err.response?.data || "Failed to send reset email"));
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "400px", padding: "20px" }}>
        <Card.Body>
          <h3 className="text-center mb-4">Forgot Password</h3>
          {message && <div className="alert alert-info">{message}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Enter Your Registered Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" className="w-100">
              Send Reset Link
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
