import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Card, Spinner, Row, Col, Badge } from "react-bootstrap";
import assignmentService from "../../../services/assignmentService";

const EditAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newFiles, setNewFiles] = useState([]);
  const [attachmentsToDelete, setAttachmentsToDelete] = useState([]);

  useEffect(() => {
    loadAssignment();
  }, [id]);

  const loadAssignment = async () => {
    try {
      const data = await assignmentService.getAssignmentById(id);
      setAssignment(data);
    } catch (err) {
      console.error("Failed to load assignment", err);
      alert("Could not load assignment");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setAssignment({ ...assignment, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNewFiles(Array.from(e.target.files));
  };

  const handleDeleteAttachment = (fileUrl) => {
    setAttachmentsToDelete((prev) => [...prev, fileUrl]);
    setAssignment((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((f) => f !== fileUrl),
    }));
  };

  const handleSave = async (status) => {
    setSaving(true);
    try {
      const formData = new FormData();

      const requestObj = {
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        gradeId: assignment.gradeId,
        sectionId: assignment.sectionId,
        subjectId: assignment.subjectId,
        status: status,
        deletedAttachments: attachmentsToDelete,
      };

      formData.append(
        "request",
        new Blob([JSON.stringify(requestObj)], { type: "application/json" })
      );

      newFiles.forEach((file) => {
        formData.append("files", file);
      });

      await assignmentService.updateAssignment(id, formData);

      navigate("/teacher/dashboard/assignments/manage");
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update assignment");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const isClosed = assignment.status === "CLOSED";
  const isPublished = assignment.status === "PUBLISHED";

  return (
    <Card className="shadow-lg border-0 rounded-4">
      {/* Header - cleaner, no status badge here */}
      <Card.Header className="bg-primary text-white py-3 rounded-top-4">
        <h4 className="mb-0 fw-bold">✏️ Edit Assignment</h4>
      </Card.Header>

      <Card.Body className="p-4">
        {/* Show status badge above form */}
        <div className="d-flex justify-content-end mb-3">
          <Badge
            bg={isClosed ? "dark" : isPublished ? "success" : "secondary"}
            pill
            className="px-3 py-2"
          >
            {assignment.status}
          </Badge>
        </div>

        <Form encType="multipart/form-data">
          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Title</Form.Label>
                <Form.Control
                  name="title"
                  value={assignment.title || ""}
                  onChange={handleChange}
                  placeholder="Enter assignment title"
                  disabled={isClosed}
                  className="rounded-3"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Due Date</Form.Label>
                <Form.Control
                  type="date"
                  name="dueDate"
                  value={
                    assignment.dueDate ? assignment.dueDate.split("T")[0] : ""
                  }
                  onChange={handleChange}
                  disabled={isClosed}
                  className="rounded-3"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={5}
              value={assignment.description || ""}
              onChange={handleChange}
              placeholder="Enter assignment details"
              disabled={isClosed}
              className="rounded-3"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              Attach Additional Files
            </Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={handleFileChange}
              disabled={isClosed}
              className="rounded-3"
            />
            <Form.Text className="text-muted">
              You can upload multiple files at once.
            </Form.Text>
          </Form.Group>

          {assignment.attachments && assignment.attachments.length > 0 && (
            <div className="mb-4">
              <h6 className="fw-semibold mb-3">📎 Existing Attachments</h6>
              <ul className="list-group rounded-3 shadow-sm">
                {assignment.attachments.map((file, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <a href={file} target="_blank" rel="noreferrer">
                      {file.split("_").pop()}
                    </a>
                    {!isClosed && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteAttachment(file)}
                      >
                        Remove
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button
              variant="secondary"
              onClick={() => navigate("/teacher/dashboard/assignments/manage")}
              className="px-4"
            >
              Cancel
            </Button>

            {!isClosed && (
              <>
                {/* Show Draft button only if not already published */}
                {!isPublished && (
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleSave("DRAFT")}
                    disabled={saving}
                    className="px-4"
                  >
                    {saving ? "Saving..." : "💾 Save as Draft"}
                  </Button>
                )}

                {/* Publish option available in Draft OR Published */}
                <Button
                  variant="success"
                  onClick={() => handleSave("PUBLISHED")}
                  disabled={saving}
                  className="px-4"
                >
                  {saving ? "Saving..." : "🚀 Publish"}
                </Button>

                {/* Close option available only if Published */}
                {isPublished && (
                  <Button
                    variant="dark"
                    onClick={() => handleSave("CLOSED")}
                    disabled={saving}
                    className="px-4"
                  >
                    {saving ? "Saving..." : "🚫 Close Assignment"}
                  </Button>
                )}
              </>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EditAssignment;
