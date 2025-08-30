import React, { useState, useEffect } from "react";
import {
  Table,
  Spinner,
  Card,
  Form,
  Row,
  Col,
  Button,
  Badge,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { BsFileArrowDown } from "react-icons/bs";
import assignmentService from "../../../services/assignmentService";

const AdminAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [adminRemark, setAdminRemark] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadAssignments = async () => {
      setLoading(true);
      try {
        const data = await assignmentService.getAllAssignmentsAdmin();
        setAssignments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAssignments();
  }, []);

  const filteredAssignments = assignments.filter((a) => {
    const search = searchTerm.toLowerCase();
    return (
      a.title.toLowerCase().includes(search) ||
      a.createdByTeacherId.toLowerCase().includes(search) ||
      (a.gradeName?.toLowerCase().includes(search) ?? false) ||
      (a.sectionName?.toLowerCase().includes(search) ?? false)
    );
  });

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

  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setAdminRemark(assignment.adminRemark || "");
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setSelectedAssignment(null);
    setShowViewModal(false);
    setAdminRemark("");
  };

  const handleSaveRemark = async () => {
    if (!selectedAssignment) return;

    try {
      const updatedAssignment = await assignmentService.updateAdminRemarks(
        selectedAssignment.id,
        adminRemark
      );

      setAssignments((prev) =>
        prev.map((a) =>
          a.id === selectedAssignment.id
            ? { ...a, adminRemarks: updatedAssignment.adminRemarks }
            : a
        )
      );

      alert("Admin remark saved successfully!");
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save admin remark:", err);
      alert("Error saving remark. Please try again.");
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

  return (
    <div>
      <h3 className="mb-4 text-success fw-bold">
        📌 Manage Assignments (Admin)
      </h3>

      {/* Search */}
      <Card className="mb-4 shadow-sm border-0 rounded-4">
        <Card.Body>
          <Row className="align-items-center gy-2">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search by title, teacher, grade, section"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Card className="shadow-sm border-0 rounded-4">
          <Card.Body className="p-0">
            <Table
              responsive
              bordered
              hover
              striped
              className="align-middle text-center mb-0"
            >
              <thead
                style={{
                  background: "linear-gradient(90deg,#22c55e,#16a34a)",
                  color: "#fff",
                }}
              >
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Grade</th>
                  <th>Section</th>
                  <th>Created By</th>
                  <th>Created At</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-3 text-muted">
                      No assignments found.
                    </td>
                  </tr>
                ) : (
                  filteredAssignments.map((a, idx) => (
                    <tr key={a.id} className={getRowClass(a.status)}>
                      <td>{idx + 1}</td>
                      <td className="fw-semibold text-primary">{a.title}</td>
                      <td>
                        <Badge bg="info">{a.gradeName || "-"}</Badge>
                      </td>
                      <td>
                        <Badge bg="secondary">{a.sectionName || "-"}</Badge>
                      </td>
                      <td className="text-info">{a.createdByTeacherId}</td>
                      <td>
                        {a.createdAt
                          ? new Date(a.createdAt).toLocaleString()
                          : "-"}
                      </td>
                      <td>{getStatusBadge(a.status)}</td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>View Assignment</Tooltip>}
                          >
                            <Button
                              size="sm"
                              variant="outline-info"
                              onClick={() => handleViewAssignment(a)}
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
                                  `/admin/dashboard/assignments/edit/${a.id}`
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
                              onClick={() => confirmDelete(a)}
                            >
                              <FaTrash />
                            </Button>
                          </OverlayTrigger>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* View Assignment Modal */}
      <Modal show={showViewModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header
          closeButton
          style={{ background: "#22c55e", color: "#fff" }}
        >
          <Modal.Title className="fw-bold fs-4">
            {selectedAssignment?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAssignment && (
            <div className="p-2">
              <p>
                <strong>Description:</strong>{" "}
                {selectedAssignment.description || "-"}
              </p>
              <p>
                <strong>Grade:</strong> {selectedAssignment.gradeName || "-"} |{" "}
                <strong>Section:</strong>{" "}
                {selectedAssignment.sectionName || "-"}
              </p>
              <p>
                <strong>Created By:</strong>{" "}
                {selectedAssignment.createdByTeacherId}
                <br />
                <strong>Created At:</strong>{" "}
                {new Date(selectedAssignment.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {getStatusBadge(selectedAssignment.status)}
              </p>

              {/* Admin Remarks */}
              <div className="mt-3">
                <Form.Label>Admin Remarks:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={adminRemark}
                  onChange={(e) => setAdminRemark(e.target.value)}
                  placeholder="Add remarks for this assignment..."
                />
              </div>

              {/* Attachments */}
              <div className="mt-3">
                <span className="fw-bold">Attachments:</span>
                {selectedAssignment.attachments?.length > 0 ? (
                  <ul>
                    {selectedAssignment.attachments.map((file, idx) => (
                      <li key={idx}>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none text-primary"
                        >
                          <BsFileArrowDown className="me-1" />
                          {file.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No attachments</p>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleSaveRemark}>
            Save Remark
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

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
          <strong className="text-danger">{assignmentToDelete?.title}</strong>?
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

export default AdminAssignmentsPage;
