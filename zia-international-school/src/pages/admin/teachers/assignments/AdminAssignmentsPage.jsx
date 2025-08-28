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
} from "react-bootstrap";
import { BsEye, BsFileArrowDown } from "react-icons/bs";
import assignmentService from "../../../../services/assignmentService";

const AdminAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [adminRemark, setAdminRemark] = useState("");

  useEffect(() => {
    const loadAssignments = async () => {
      setLoading(true);
      try {
        const data = await assignmentService.getAllAssignmentsAdmin();
        // Show PUBLISHED and CLOSED assignments
        setAssignments(
          data.filter((a) => ["PUBLISHED", "CLOSED"].includes(a.status))
        );
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

  const getStatusVariant = (status) => {
    switch (status) {
      case "PUBLISHED":
        return "success";
      case "CLOSED":
        return "danger";
      default:
        return "secondary";
    }
  };

  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setAdminRemark(assignment.adminRemark || ""); // Load existing remark if any
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
      // Call backend API
      const updatedAssignment = await assignmentService.updateAdminRemarks(
        selectedAssignment.id,
        adminRemark
      );

      // Update state locally
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

  return (
    <div>
      <h3 className="mb-4 text-success fw-bold">📌 Assignments Overview</h3>

      {/* Search Card */}
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
            <Table hover responsive className="mb-0 align-middle">
              <thead
                style={{
                  background: "linear-gradient(90deg,#22c55e,#16a34a)",
                  color: "#fff",
                }}
              >
                <tr>
                  <th>Title</th>
                  <th>Grade</th>
                  <th>Section</th>
                  <th>Created By</th>
                  <th>Created At</th>
                  <th>Updated At</th>
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
                  filteredAssignments.map((a) => (
                    <tr key={a.id}>
                      <td className="fw-semibold text-primary">{a.title}</td>
                      <td>{a.gradeName || "-"}</td>
                      <td>{a.sectionName || "-"}</td>
                      <td className="text-info">{a.createdByTeacherId}</td>
                      <td>{new Date(a.createdAt).toLocaleString()}</td>
                      <td>
                        {a.updatedAt
                          ? new Date(a.updatedAt).toLocaleString()
                          : "-"}
                      </td>
                      <td>
                        <Badge
                          bg={getStatusVariant(a.status)}
                          className="py-2 px-2"
                        >
                          {a.status}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-success"
                          className="d-flex align-items-center"
                          onClick={() => handleViewAssignment(a)}
                        >
                          <BsEye className="me-1" />
                          View
                        </Button>
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
                <span className="fw-bold text-primary">Description:</span>{" "}
                <span className="text-dark">
                  {selectedAssignment.description || "-"}
                </span>
              </p>
              <p>
                <span className="fw-bold text-success">Grade:</span>{" "}
                {selectedAssignment.gradeName || "-"} |{" "}
                <span className="fw-bold text-success">Section:</span>{" "}
                {selectedAssignment.sectionName || "-"}
              </p>
              <p>
                <span className="fw-bold text-warning">Created By:</span>{" "}
                {selectedAssignment.createdByTeacherId} <br />
                <span className="fw-bold text-warning">Created At:</span>{" "}
                {new Date(selectedAssignment.createdAt).toLocaleString()} <br />
                <span className="fw-bold text-warning">Updated At:</span>{" "}
                {selectedAssignment.updatedAt
                  ? new Date(selectedAssignment.updatedAt).toLocaleString()
                  : "-"}
              </p>
              <p>
                <span className="fw-bold text-danger">Status:</span>{" "}
                <Badge bg={getStatusVariant(selectedAssignment.status)}>
                  {selectedAssignment.status}
                </Badge>
              </p>

              {/* Admin Remarks Section */}
              <div className="mt-3">
                <Form.Label className="fw-bold text-info">
                  Admin Remarks:
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Add remarks for this assignment..."
                  value={adminRemark}
                  onChange={(e) => setAdminRemark(e.target.value)}
                />
              </div>

              {/* Attachments */}
              <div className="mt-3">
                <span className="fw-bold text-info">Attachments:</span>
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
    </div>
  );
};

export default AdminAssignmentsPage;
