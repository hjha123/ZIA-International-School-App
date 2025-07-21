import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email");
      return;
    }

    // Simulate API call
    setSubmitted(true);
    setError("");
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
        <h4 className="text-center mb-3 text-primary">Forgot Password</h4>

        {submitted ? (
          <Alert variant="success" className="text-center">
            If the email exists, a reset link has been sent.
          </Alert>
        ) : (
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit">
                Send Reset Link
              </Button>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
