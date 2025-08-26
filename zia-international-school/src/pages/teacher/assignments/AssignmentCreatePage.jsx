import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Form, Button, Row, Col, Modal, Alert } from "react-bootstrap";

const AssignmentCreatePage = () => {
  const { assignmentId } = useParams(); // edit mode
  const navigate = useNavigate();

  // ---- Mock Data (replace with API calls later) ----
  const mockGrades = ["Grade 9", "Grade 10", "Grade 11"];
  const mockSections = ["A", "B", "C"];
  const mockSubjects = ["Math", "Science", "English"];

  // ---- Form State ----
  const [form, setForm] = useState({
    title: "",
    description: "",
    grade: "",
    section: "",
    subject: "",
    dueDate: "",
    attachments: [],
  });

  // ---- Modal State ----
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState(null); // "draft" or "publish"

  // ---- Feedback Alert ----
  const [feedback, setFeedback] = useState({
    show: false,
    type: "",
    message: "",
  });

  // ---- On Edit Mode, Load Existing Data ----
  useEffect(() => {
    if (assignmentId) {
      const mockAssignment = {
        id: assignmentId,
        title: "Algebra Homework",
        description: "Solve 10 problems from chapter 5",
        grade: "Grade 10",
        section: "A",
        subject: "Math",
        dueDate: "2025-09-01T23:59",
        attachments: [],
      };
      setForm(mockAssignment);
    }
  }, [assignmentId]);

  // ---- Handlers ----
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, attachments: [...form.attachments, ...files] });
  };

  const showFeedback = (type, message) => {
    setFeedback({ show: true, type, message });
    setTimeout(() => {
      setFeedback({ show: false, type: "", message: "" });
      navigate("/teacher/dashboard/assignments");
    }, 2000); // 2 seconds
  };

  const handleSaveDraft = () => {
    console.log("Saving as draft:", form);
    showFeedback("secondary", "✅ Assignment saved as draft successfully!");
  };

  const handlePublish = () => {
    console.log("Publishing:", form);
    showFeedback("success", "🚀 Assignment published successfully!");
  };

  const handleShowConfirm = (type) => {
    setActionType(type);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (actionType === "draft") {
      handleSaveDraft();
    } else if (actionType === "publish") {
      handlePublish();
    }
    setShowConfirm(false);
  };

  const handleCancel = () => {
    navigate("/teacher/dashboard/assignments"); // go back to list
  };

  return (
    <div className="container mt-4">
      {/* Floating Feedback Message */}
      {feedback.show && (
        <Alert
          variant={feedback.type}
          className="position-fixed top-0 end-0 m-3 shadow-lg fade show"
          style={{
            zIndex: 2000,
            minWidth: "280px",
            borderRadius: "12px",
            fontWeight: "500",
          }}
        >
          {feedback.message}
        </Alert>
      )}

      <Card className="shadow-lg p-4 rounded-4 border-0">
        <div className="d-flex align-items-center mb-4">
          <span className="fs-3 me-2">{assignmentId ? "✏️" : "➕"}</span>
          <h3 className="mb-0 fw-bold text-primary">
            {assignmentId ? "Edit Assignment" : "Create Assignment"}
          </h3>
        </div>

        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="title" className="mb-3">
                <Form.Label className="fw-semibold">Title *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter assignment title"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                  className="rounded-3"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="dueDate" className="mb-3">
                <Form.Label className="fw-semibold">Due Date *</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={form.dueDate}
                  onChange={(e) => handleChange("dueDate", e.target.value)}
                  required
                  className="rounded-3"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="description" className="mb-3">
            <Form.Label className="fw-semibold">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter assignment details"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="rounded-3"
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="grade">
                <Form.Label className="fw-semibold">Grade *</Form.Label>
                <Form.Select
                  value={form.grade}
                  onChange={(e) => handleChange("grade", e.target.value)}
                  required
                  className="rounded-3"
                >
                  <option value="">Select Grade</option>
                  {mockGrades.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="section">
                <Form.Label className="fw-semibold">Section *</Form.Label>
                <Form.Select
                  value={form.section}
                  onChange={(e) => handleChange("section", e.target.value)}
                  required
                  className="rounded-3"
                >
                  <option value="">Select Section</option>
                  {mockSections.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="subject">
                <Form.Label className="fw-semibold">Subject *</Form.Label>
                <Form.Select
                  value={form.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  required
                  className="rounded-3"
                >
                  <option value="">Select Subject</option>
                  {mockSubjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="attachments" className="mb-4">
            <Form.Label className="fw-semibold">Attachments</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileUpload}
              multiple
              className="rounded-3"
            />
            {form.attachments.length > 0 && (
              <Card className="mt-3 p-3 border-0 shadow-sm rounded-3 bg-light">
                <strong>📂 Uploaded Files:</strong>
                <ul className="mb-0 mt-2 ps-3">
                  {form.attachments.map((file, idx) => (
                    <li key={idx} className="small text-muted">
                      {file.name || file}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button
              variant="outline-secondary"
              className="me-2 rounded-3 px-3"
              onClick={handleCancel}
            >
              ❌ Cancel
            </Button>
            <Button
              variant="secondary"
              className="me-2 rounded-3 px-3"
              onClick={() => handleShowConfirm("draft")}
            >
              💾 Save as Draft
            </Button>
            <Button
              variant="primary"
              className="rounded-3 px-3"
              onClick={() => handleShowConfirm("publish")}
            >
              🚀 Publish
            </Button>
          </div>
        </Form>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold text-primary">
            Confirm {actionType === "draft" ? "Save Draft" : "Publish"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="fs-6">
          Are you sure you want to{" "}
          <strong>
            {actionType === "draft"
              ? "save this assignment as draft"
              : "publish this assignment"}
          </strong>
          ?
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="outline-secondary"
            className="rounded-3"
            onClick={() => setShowConfirm(false)}
          >
            Cancel
          </Button>
          <Button
            variant={actionType === "draft" ? "secondary" : "primary"}
            className="rounded-3"
            onClick={handleConfirm}
          >
            Yes, {actionType === "draft" ? "Save Draft" : "Publish"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AssignmentCreatePage;
