import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Modal,
  Alert,
  Spinner,
} from "react-bootstrap";
import assignmentService from "../../../services/assignmentService";
import studentService from "../../../services/studentService";
import teacherService from "../../../services/teacherService";

const AssignmentCreatePage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    gradeId: "",
    sectionId: "",
    subjectId: "",
    teacherId: "",
    dueDate: "",
    attachments: [],
    targetType: "GRADE",
  });

  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [feedback, setFeedback] = useState({
    show: false,
    type: "",
    message: "",
  });

  // ---- Fetch Grades on load ----
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await studentService.getAllGrades();
        setGrades(data);
      } catch (err) {
        console.error("Failed to fetch grades:", err);
      }
    };
    fetchGrades();

    if (role === "ADMIN") {
      const fetchTeachers = async () => {
        try {
          const data = await teacherService.getAllTeachers();
          setTeachers(data);
        } catch (err) {
          console.error("Failed to fetch teachers:", err);
        }
      };
      fetchTeachers();
    }
  }, [role]);

  // ---- Fetch Sections & Subjects when grade changes ----
  useEffect(() => {
    const fetchSectionsSubjects = async () => {
      if (!form.gradeId) {
        setSections([]);
        setSubjects([]);
        return;
      }
      try {
        const secs = await studentService.getSectionsByGrade(form.gradeId);
        const subs = await studentService.getSubjects(form.gradeId);
        setSections(secs);
        setSubjects(subs);
      } catch (err) {
        console.error("Failed to fetch sections/subjects:", err);
      }
    };
    if (form.targetType === "GRADE") {
      fetchSectionsSubjects();
    }
  }, [form.gradeId, form.targetType]);

  // ---- Edit Mode: Load Assignment ----
  useEffect(() => {
    if (!assignmentId) return;

    const fetchAssignment = async () => {
      try {
        const data = await assignmentService.getAssignmentById(assignmentId);
        setForm({
          title: data.title,
          description: data.description,
          gradeId: data.gradeId,
          sectionId: data.sectionId,
          subjectId: data.subjectId,
          teacherId: data.teacherId || "",
          dueDate: data.dueDate ? data.dueDate.split("T")[0] : "",
          attachments: data.attachments || [],
          targetType: data.teacherId ? "TEACHER" : "GRADE",
        });
      } catch (err) {
        console.error("Failed to load assignment:", err);
      }
    };
    fetchAssignment();
  }, [assignmentId]);

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, attachments: [...form.attachments, ...files] });
  };

  const showFeedback = (type, message, shouldRedirect = false) => {
    setFeedback({ show: true, type, message });
    setTimeout(() => {
      setFeedback({ show: false, type: "", message: "" });
      if (shouldRedirect) {
        navigate(
          role === "ADMIN"
            ? "/admin/dashboard/assignments/manage"
            : "/teacher/dashboard/assignments/manage"
        );
      }
    }, 2000);
  };

  const handleSave = async (status) => {
    // ---- Validation ----
    if (role === "ADMIN" && form.targetType === "TEACHER") {
      if (!form.teacherId) {
        alert("⚠️ Please select a Teacher before saving.");
        return;
      }
    } else {
      if (!form.gradeId) {
        alert("⚠️ Please select a Grade before saving.");
        return;
      }
      if (!form.subjectId) {
        alert("⚠️ Please select a Subject before saving.");
        return;
      }
    }

    if (new Date(form.dueDate) < new Date()) {
      alert("⚠️ Due date must be in the future.");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();

      const requestObj = {
        title: form.title,
        description: form.description,
        dueDate: form.dueDate,
        status,
        gradeId: form.targetType === "GRADE" ? form.gradeId : 0,
        sectionId: form.targetType === "GRADE" ? form.sectionId : 0,
        subjectId: form.targetType === "GRADE" ? form.subjectId : null,
        teacherId: form.targetType === "TEACHER" ? form.teacherId : null,
      };

      data.append(
        "request",
        new Blob([JSON.stringify(requestObj)], { type: "application/json" })
      );

      form.attachments.forEach((file) => {
        if (file instanceof File) {
          data.append("files", file);
        }
      });

      if (assignmentId) {
        await assignmentService.updateAssignment(assignmentId, data);
      } else {
        if (role === "ADMIN") {
          await assignmentService.createAssignmentAsAdmin(data);
        } else {
          await assignmentService.createAssignmentAsTeacher(data);
        }
      }

      showFeedback(
        status === "DRAFT" ? "secondary" : "success",
        status === "DRAFT"
          ? "✅ Assignment saved as draft successfully!"
          : "🚀 Assignment published successfully!",
        true
      );
    } catch (err) {
      console.error("Error saving assignment:", err);
      showFeedback("danger", "❌ Error saving assignment!", false);
    } finally {
      setLoading(false);
    }
  };

  const handleShowConfirm = (type) => {
    setActionType(type);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    handleSave(actionType === "draft" ? "DRAFT" : "PUBLISHED");
    setShowConfirm(false);
  };

  const handleCancel = () =>
    navigate(
      role === "ADMIN"
        ? "/admin/dashboard/assignments/manage"
        : "/teacher/dashboard/assignments/manage"
    );

  return (
    <div className="container mt-4">
      {feedback.show && (
        <Alert
          variant={feedback.type}
          className="position-fixed top-0 end-0 m-3 shadow-lg fade show"
          style={{
            zIndex: 2000,
            minWidth: "280px",
            borderRadius: 12,
            fontWeight: 500,
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
              <Form.Group className="mb-3">
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
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Due Date *</Form.Label>
                <Form.Control
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => handleChange("dueDate", e.target.value)}
                  required
                  className="rounded-3"
                  min={new Date().toISOString().split("T")[0]}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
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

          {/* ---- Admin Target Selector ---- */}
          {role === "ADMIN" && (
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Assignment Target *
                  </Form.Label>
                  <Form.Select
                    value={form.targetType}
                    onChange={(e) => handleChange("targetType", e.target.value)}
                    className="rounded-3"
                  >
                    <option value="GRADE">Grade & Section</option>
                    <option value="TEACHER">Individual Teacher</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          )}

          {/* ---- Grade / Section / Subject (Teacher OR Admin GRADE) ---- */}
          {(role === "TEACHER" || form.targetType === "GRADE") && (
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Grade *</Form.Label>
                  <Form.Select
                    value={form.gradeId}
                    onChange={(e) => handleChange("gradeId", e.target.value)}
                    required
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

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Section *</Form.Label>
                  <Form.Select
                    value={form.sectionId}
                    onChange={(e) => handleChange("sectionId", e.target.value)}
                    required
                    className="rounded-3"
                    disabled={!sections.length}
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

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Subject *</Form.Label>
                  <Form.Select
                    value={form.subjectId}
                    onChange={(e) => handleChange("subjectId", e.target.value)}
                    required
                    className="rounded-3"
                    disabled={!subjects.length}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          )}

          {role === "ADMIN" && form.targetType === "TEACHER" && (
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Assign to Teacher *
                  </Form.Label>
                  <Form.Select
                    value={form.teacherId}
                    onChange={(e) => handleChange("teacherId", e.target.value)}
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

          <Form.Group className="mb-4">
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

      {loading && (
        <Spinner
          animation="border"
          className="position-fixed top-50 start-50 translate-middle"
        />
      )}
    </div>
  );
};

export default AssignmentCreatePage;
