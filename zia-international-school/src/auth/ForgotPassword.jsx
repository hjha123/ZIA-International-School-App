import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { Envelope } from "react-bootstrap-icons";
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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #f8fbff, #e6f0fa)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "16px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          padding: "30px",
        }}
      >
        <Card.Body>
          <div className="text-center mb-4">
            <Envelope size={40} className="mb-2 text-primary" />
            <h3 className="mb-2">Forgot Password</h3>
            <p className="text-muted" style={{ fontSize: "0.9rem" }}>
              Enter your registered email address and we’ll send you a password
              reset link.
            </p>
          </div>

          {message && (
            <div
              className={`alert ${
                message.startsWith("✅") ? "alert-success" : "alert-danger"
              }`}
            >
              {message}
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              type="submit"
              className="w-100"
              style={{ fontWeight: "500", padding: "10px 0" }}
            >
              Send Reset Link
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ForgotPassword;
