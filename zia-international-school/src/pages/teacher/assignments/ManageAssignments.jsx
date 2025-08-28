import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Spinner,
  Card,
  Row,
  Col,
  Badge,
  OverlayTrigger,
  Tooltip,
  Modal,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import assignmentService from "../../../services/assignmentService";
import studentService from "../../../services/studentService";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const ManageAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [sectionFilter, setSectionFilter] = useState("ALL");

  // Grades and Sections
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
    fetchGrades();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const data = await assignmentService.getMyAssignments();
      setAssignments(data || []);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setError("Failed to load assignments.");
    } finally {
      setLoading(false);
    }
  };

  const fetchGrades = async () => {
    try {
      const gradeList = await studentService.getAllGrades();
      setGrades(gradeList || []);
    } catch (err) {
      console.error("Error fetching grades:", err);
    }
  };

  const fetchSections = async (gradeId) => {
    try {
      const sectionList = await studentService.getSectionsByGrade(gradeId);
      setSections(sectionList || []);
    } catch (err) {
      console.error("Error fetching sections:", err);
    }
  };

  const handleGradeChange = async (e) => {
    const selectedGrade = e.target.value;
    setGradeFilter(selectedGrade);
    setSectionFilter("ALL");

    if (selectedGrade !== "ALL") {
      const gradeObj = grades.find((g) => g.name === selectedGrade);
      if (gradeObj) {
        await fetchSections(gradeObj.id);
      } else {
        setSections([]);
      }
    } else {
      setSections([]);
    }
  };

  const confirmDelete = (assignment) => {
    setAssignmentToDelete(assignment);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!assignmentToDelete) return;

    try {
      await assignmentService.deleteAssignment(assignmentToDelete.id);
      setAssignments(assignments.filter((a) => a.id !== assignmentToDelete.id));
      setShowDeleteModal(false);
      setAssignmentToDelete(null);
    } catch (err) {
      console.error("Error deleting assignment:", err);
      alert("Failed to delete assignment.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge bg="success">Published</Badge>;
      case "DRAFT":
        return <Badge bg="warning">Draft</Badge>;
      case "CLOSED":
        return <Badge bg="dark">Closed</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getRowClass = (status) => {
    switch (status) {
      case "PUBLISHED":
        return "table-success";
      case "DRAFT":
        return "table-warning";
      case "CLOSED":
        return "table-secondary";
      default:
        return "";
    }
  };

  // Apply filters
  const filteredAssignments = assignments.filter((a) => {
    return (
      (statusFilter === "ALL" || a.status === statusFilter) &&
      (gradeFilter === "ALL" || a.gradeName === gradeFilter) &&
      (sectionFilter === "ALL" || a.sectionName === sectionFilter)
    );
  });

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <h3 className="fw-bold">📚 Manage Assignments</h3>
          <p className="text-muted">
            Create, edit, and track assignments for your students.
          </p>
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            className="shadow-sm"
            onClick={() => navigate("/teacher/dashboard/assignments/create")}
          >
            + Create Assignment
          </Button>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="CLOSED">Closed</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select value={gradeFilter} onChange={handleGradeChange}>
            <option value="ALL">All Grades</option>
            {grades.map((g) => (
              <option key={g.id} value={g.name}>
                {g.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            disabled={gradeFilter === "ALL"}
          >
            <option value="ALL">All Sections</option>
            {sections.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <Card className="shadow-sm rounded-3 border-0">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : filteredAssignments.length === 0 ? (
            <p className="text-muted text-center">No assignments found.</p>
          ) : (
            <Table
              responsive
              bordered
              hover
              striped
              className="align-middle text-center"
            >
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Grade</th>
                  <th>Section</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((assignment, idx) => (
                  <tr
                    key={assignment.id}
                    className={getRowClass(assignment.status)}
                  >
                    <td>{idx + 1}</td>
                    <td className="fw-semibold">{assignment.title}</td>
                    <td>
                      <Badge bg="info" className="px-3 py-2">
                        {assignment.gradeName}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg="secondary" className="px-3 py-2">
                        {assignment.sectionName}
                      </Badge>
                    </td>
                    <td>
                      {assignment.dueDate
                        ? new Date(assignment.dueDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{getStatusBadge(assignment.status)}</td>
                    <td>
                      {assignment.createdAt
                        ? new Date(assignment.createdAt).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>View Assignment</Tooltip>}
                        >
                          <Button
                            size="sm"
                            variant="outline-info"
                            onClick={() =>
                              navigate(
                                `/teacher/dashboard/assignments/view/${assignment.id}`
                              )
                            }
                          >
                            <FaEye />
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Edit Assignment</Tooltip>}
                        >
                          <Button
                            size="sm"
                            variant="outline-warning"
                            onClick={() =>
                              navigate(
                                `/teacher/dashboard/assignments/edit/${assignment.id}`
                              )
                            }
                          >
                            <FaEdit />
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Delete Assignment</Tooltip>}
                        >
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => confirmDelete(assignment)}
                          >
                            <FaTrash />
                          </Button>
                        </OverlayTrigger>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <span className="fw-bold text-danger">
            {assignmentToDelete?.title}
          </span>
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageAssignments;
