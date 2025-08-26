import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Badge, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Mock assignment data
const mockAssignments = [
  {
    id: "1",
    title: "Math Homework 1",
    gradeName: "Grade 10",
    sectionName: "A",
    subjectName: "Math",
    dueDate: "2025-09-05T17:00",
    status: "PUBLISHED",
  },
  {
    id: "2",
    title: "Science Project",
    gradeName: "Grade 10",
    sectionName: "A",
    subjectName: "Science",
    dueDate: "2025-09-10T17:00",
    status: "DRAFT",
  },
];

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Replace with API call
    setAssignments(mockAssignments);
  }, []);

  const handleEdit = (id) => {
    navigate(`/teacher/dashboard/assignments/edit/${id}`);
  };

  const handleViewStudents = (id) => {
    navigate(`/teacher/dashboard/assignments/${id}/students`);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // TODO: Call delete API
    setAssignments(assignments.filter((a) => a.id !== deleteId));
    setShowDeleteModal(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge bg="success">Published</Badge>;
      case "DRAFT":
        return <Badge bg="secondary">Draft</Badge>;
      case "CLOSED":
        return <Badge bg="danger">Closed</Badge>;
      default:
        return <Badge bg="dark">{status}</Badge>;
    }
  };

  return (
    <div>
      <Card className="shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">📚 My Assignments</h3>
          <Button
            variant="primary"
            onClick={() => navigate("/teacher/dashboard/assignments/create")}
          >
            + Create Assignment
          </Button>
        </div>

        <Table bordered hover responsive className="align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Grade / Section</th>
              <th>Subject</th>
              <th>Due Date</th>
              <th>Status</th>
              <th style={{ minWidth: "220px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td className="fw-semibold">{assignment.title}</td>
                  <td>
                    {assignment.gradeName} / {assignment.sectionName}
                  </td>
                  <td>{assignment.subjectName}</td>
                  <td>{new Date(assignment.dueDate).toLocaleString()}</td>
                  <td>{getStatusBadge(assignment.status)}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleViewStudents(assignment.id)}
                    >
                      👨‍🎓 Students
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(assignment.id)}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(assignment.id)}
                    >
                      🗑️ Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  No assignments found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">⚠️ Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to <b>delete this assignment</b>? <br />
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AssignmentList;
