import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import studentService from "../../../services/studentService";
import assignmentService from "../../../services/assignmentService";

const SubmissionsPage = () => {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingStudentId, setUpdatingStudentId] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await assignmentService.getMyAssignments();
        setAssignments(data || []);
      } catch (err) {
        console.error("Failed to load assignments", err);
        setError("Failed to load assignments.");
      }
    };
    fetchAssignments();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedAssignmentId) return;

      const assignment = assignments.find(
        (a) => String(a.id) === String(selectedAssignmentId)
      );
      if (!assignment) return;

      if (!assignment.gradeName) {
        setError("Grade not found for this assignment.");
        return;
      }

      setLoading(true);
      setStudents([]);
      setError("");

      try {
        // 1. Fetch all students of this grade/section
        const studentsList = await studentService.getStudentsByGradeSection(
          assignment.gradeName,
          assignment.sectionName || ""
        );

        // 2. Fetch submissions for this assignment from backend
        const submissions =
          await assignmentService.getSubmissionsByAssignmentId(
            selectedAssignmentId
          );

        // 3. Merge student info with submission data
        const enhancedStudents = studentsList.map((s) => {
          const submission = submissions.find(
            (sub) => sub.studentId === s.studentId
          );
          return {
            ...s,
            marks: submission?.marks || "",
            feedback: submission?.feedback || "",
            submissionStatus: submission?.submissionStatus || "PENDING",
          };
        });

        setStudents(enhancedStudents);
      } catch (err) {
        console.error("Error fetching students/submissions:", err);
        setError("Failed to fetch students for this assignment.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedAssignmentId, assignments]);

  const handleStudentChange = (studentId, field, value) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === studentId
          ? {
              ...s,
              [field]: value,
            }
          : s
      )
    );
  };

  const handleUpdateStudent = async (student) => {
    setUpdatingStudentId(student.studentId);
    try {
      await assignmentService.updateSubmission(
        selectedAssignmentId,
        student.studentId,
        {
          marks: student.marks,
          feedback: student.feedback,
          submissionStatus: student.submissionStatus,
        }
      );
      setError("");
      toast.success(
        <span>
          Updated{" "}
          <strong>
            {student.firstName} {student.lastName}
          </strong>
          ’s submission
        </span>
      );
    } catch (err) {
      console.error("Failed to update student:", err);
      setError(`Failed to update ${student.firstName} ${student.lastName}.`);
      toast.error(
        <span>
          Failed to update{" "}
          <strong>
            {student.firstName} {student.lastName}
          </strong>
          ’s submission
        </span>
      );
    } finally {
      setUpdatingStudentId(null);
    }
  };

  const isEditable = (status) => status !== "PENDING";

  const statusVariant = (status) => {
    switch (status) {
      case "PENDING":
        return "secondary";
      case "SUBMITTED":
        return "info";
      case "GRADED":
        return "success";
      case "LATE":
        return "warning";
      default:
        return "light";
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="fw-bold text-primary">🏆 Assignment Submissions</h2>
          <p className="text-muted mb-0">
            Select an assignment to view students and grade submissions.
          </p>
        </Col>
        <Col className="text-end">
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/teacher/dashboard/assignments/manage")}
          >
            ← Back to Assignments
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Assignment Dropdown */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Select
            value={selectedAssignmentId}
            onChange={(e) => setSelectedAssignmentId(e.target.value)}
            className="shadow-sm"
          >
            <option value="">Select Assignment</option>
            {assignments
              .filter((a) => a.status === "PUBLISHED")
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Students Table */}
      <Card className="shadow-sm rounded-4 border-0">
        <Card.Header className="bg-primary text-white fw-semibold">
          {assignments.find(
            (a) => String(a.id) === String(selectedAssignmentId)
          )?.title || "Select an assignment"}
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : students.length === 0 ? (
            <p className="text-muted text-center py-4">
              {selectedAssignmentId
                ? "No students found for this assignment."
                : "Select an assignment to view students."}
            </p>
          ) : (
            <Table
              responsive
              hover
              className="align-middle mb-0"
              style={{ minWidth: "900px" }}
            >
              <thead className="table-light sticky-top">
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Grade</th>
                  <th>Section</th>
                  <th>Marks</th>
                  <th>Feedback</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, idx) => (
                  <tr
                    key={s.studentId}
                    className={
                      s.submissionStatus === "LATE" ? "table-warning" : ""
                    }
                  >
                    <td>{idx + 1}</td>
                    <td className="fw-semibold">
                      {s.firstName} {s.lastName}
                    </td>
                    <td>{s.gradeName}</td>
                    <td>{s.sectionName || "N/A"}</td>
                    <td>
                      <Form.Control
                        type="number"
                        min={0}
                        value={s.marks}
                        onChange={(e) =>
                          handleStudentChange(
                            s.studentId,
                            "marks",
                            e.target.value
                          )
                        }
                        disabled={!isEditable(s.submissionStatus)}
                        placeholder="Marks"
                        size="sm"
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={s.feedback}
                        onChange={(e) =>
                          handleStudentChange(
                            s.studentId,
                            "feedback",
                            e.target.value
                          )
                        }
                        disabled={!isEditable(s.submissionStatus)}
                        placeholder="Feedback"
                        size="sm"
                      />
                    </td>
                    <td>
                      <Form.Select
                        value={s.submissionStatus}
                        onChange={(e) =>
                          handleStudentChange(
                            s.studentId,
                            "submissionStatus",
                            e.target.value
                          )
                        }
                        size="sm"
                      >
                        <option value="NOT_SUBMITTED">NOT_SUBMITTED</option>
                        <option value="SUBMITTED">SUBMITTED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="LATE">LATE</option>
                      </Form.Select>
                    </td>
                    <td>
                      <Button
                        variant="success"
                        size="sm"
                        disabled={updatingStudentId === s.studentId}
                        onClick={() => handleUpdateStudent(s)}
                      >
                        {updatingStudentId === s.studentId
                          ? "Saving..."
                          : "Save"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default SubmissionsPage;
