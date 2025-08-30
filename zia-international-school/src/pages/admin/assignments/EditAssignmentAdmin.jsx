import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Card, Spinner, Row, Col, Badge } from "react-bootstrap";
import assignmentService from "../../../services/assignmentService";
import gradeAndSectionsService from "../../../services/gradeAndSectionsService";
import teacherService from "../../../services/teacherService";

const EditAssignmentAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newFiles, setNewFiles] = useState([]);
  const [attachmentsToDelete, setAttachmentsToDelete] = useState([]);

  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [assignTo, setAssignTo] = useState("GRADE_SECTION");

  useEffect(() => {
    loadAssignment();
    loadGrades();
    loadTeachers();
  }, [id]);

  const loadAssignment = async () => {
    try {
      const data = await assignmentService.getAssignmentById(id);
      setAssignment(data);

      // decide assign mode
      setAssignTo(data.teacherId ? "TEACHER" : "GRADE_SECTION");

      if (data.gradeId) {
        loadSections(data.gradeId);
      }
    } catch (err) {
      console.error("Failed to load assignment", err);
      alert("Could not load assignment");
    } finally {
      setLoading(false);
    }
  };

  const loadGrades = async () => {
    try {
      const data = await gradeAndSectionsService.getAllGrades();
      setGrades(data);
    } catch (err) {
      console.error("Failed to load grades", err);
    }
  };

  const loadSections = async (gradeId) => {
    try {
      const data = await gradeAndSectionsService.getSectionsByGrade(gradeId);
      setSections(data);
    } catch (err) {
      console.error("Failed to load sections", err);
    }
  };

  const loadTeachers = async () => {
    try {
      const data = await teacherService.getAllTeachers();
      setTeachers(data);
    } catch (err) {
      console.error("Failed to load teachers", err);
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
        gradeId: assignTo === "GRADE_SECTION" ? assignment.gradeId : null,
        sectionId: assignTo === "GRADE_SECTION" ? assignment.sectionId : null,
        teacherId: assignTo === "TEACHER" ? assignment.teacherId : null,
        status,
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
      navigate("/admin/dashboard/assignments/manage");
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
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  const isClosed = assignment.status === "CLOSED";
  const isPublished = assignment.status === "PUBLISHED";

  return (
    <Card className="shadow-lg border-0 rounded-4">
      <Card.Header
        className="text-white py-3 rounded-top-4"
        style={{ background: "linear-gradient(90deg,#22c55e,#16a34a)" }}
      >
        <h4 className="mb-0 fw-bold">🛠️ Edit Assignment (Admin)</h4>
      </Card.Header>

      <Card.Body className="p-4">
        <div className="d-flex justify-content-end mb-3">
          <Badge
            bg={isClosed ? "dark" : isPublished ? "success" : "secondary"}
            pill
            className="px-3 py-2 fs-6"
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

          {/* Assign To */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Assign To</Form.Label>
            <div className="d-flex gap-4">
              <Form.Check
                type="radio"
                label="Grade & Section"
                name="assignTo"
                value="GRADE_SECTION"
                checked={assignTo === "GRADE_SECTION"}
                onChange={() => setAssignTo("GRADE_SECTION")}
                disabled={isClosed}
              />
              <Form.Check
                type="radio"
                label="Individual Teacher"
                name="assignTo"
                value="TEACHER"
                checked={assignTo === "TEACHER"}
                onChange={() => setAssignTo("TEACHER")}
                disabled={isClosed}
              />
            </div>
          </Form.Group>

          {assignTo === "GRADE_SECTION" ? (
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Grade</Form.Label>
                  <Form.Select
                    value={assignment.gradeId || ""}
                    onChange={(e) => {
                      handleChange(e);
                      loadSections(e.target.value);
                    }}
                    name="gradeId"
                    disabled={isClosed}
                    className="rounded-3"
                  >
                    <option value="">Select Grade</option>
                    {grades.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Section</Form.Label>
                  <Form.Select
                    value={assignment.sectionId || ""}
                    onChange={handleChange}
                    name="sectionId"
                    disabled={isClosed}
                    className="rounded-3"
                  >
                    <option value="">Select Section</option>
                    {sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Teacher</Form.Label>
                  <Form.Select
                    value={assignment.teacherId || ""}
                    onChange={handleChange}
                    name="teacherId"
                    disabled={isClosed}
                    className="rounded-3"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.empId}>
                        {t.fullName} ({t.empId})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          )}

          {/* Files */}
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
          </Form.Group>

          {assignment.attachments?.length > 0 && (
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

          {/* Actions */}
          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/dashboard/assignments/manage")}
              className="px-4"
            >
              Cancel
            </Button>

            {!isClosed && (
              <>
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

                <Button
                  variant="success"
                  onClick={() => handleSave("PUBLISHED")}
                  disabled={saving}
                  className="px-4"
                >
                  {saving ? "Saving..." : "🚀 Publish"}
                </Button>

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

export default EditAssignmentAdmin;
