import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  Form,
  Badge,
  Modal,
} from "react-bootstrap";
import leaveService from "../../../services/leaveService";

const LeaveRequestList = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalLeaveId, setModalLeaveId] = useState(null);
  const [modalAction, setModalAction] = useState("");
  const [adminRemarks, setAdminRemarks] = useState("");

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const data = await leaveService.getAllLeaveRequests();
      setLeaveRequests(data || []);
    } catch (err) {
      setError("Failed to load leave requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredRequests = leaveRequests.filter((req) =>
    statusFilter === "ALL" ? true : req.status === statusFilter
  );

  const handleOpenModal = (leaveId, action) => {
    setModalLeaveId(leaveId);
    setModalAction(action);
    setAdminRemarks("");
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    if (!adminRemarks.trim()) {
      alert("Please enter admin remarks before submitting.");
      return;
    }

    try {
      setActionLoading(modalLeaveId);
      await leaveService.updateLeaveStatus(
        modalLeaveId,
        modalAction,
        adminRemarks
      );
      setShowModal(false);
      fetchLeaveRequests();
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <h4 className="mb-3">Leave Requests</h4>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-3">
        <Col md={3}>
          <Form.Select value={statusFilter} onChange={handleStatusChange}>
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Emp ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">
                  No leave requests found.
                </td>
              </tr>
            ) : (
              filteredRequests.map((req, index) => (
                <tr key={req.id}>
                  <td>{index + 1}</td>
                  <td>{req.empId}</td>
                  <td>{req.empName}</td>
                  <td>{req.leaveType}</td>
                  <td>{req.startDate}</td>
                  <td>{req.endDate}</td>
                  <td>
                    <Badge
                      bg={
                        req.status === "APPROVED"
                          ? "success"
                          : req.status === "REJECTED"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {req.status}
                    </Badge>
                  </td>
                  <td>{req.reason}</td>
                  <td>
                    {req.status === "PENDING" ? (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2"
                          onClick={() => handleOpenModal(req.id, "APPROVED")}
                          disabled={actionLoading === req.id}
                        >
                          {actionLoading === req.id ? (
                            <Spinner size="sm" animation="border" />
                          ) : (
                            "Approve"
                          )}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleOpenModal(req.id, "REJECTED")}
                          disabled={actionLoading === req.id}
                        >
                          {actionLoading === req.id ? (
                            <Spinner size="sm" animation="border" />
                          ) : (
                            "Reject"
                          )}
                        </Button>
                      </>
                    ) : (
                      <span className="text-muted">No actions</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {/* Modal for admin remarks */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalAction === "APPROVED" ? "Approve" : "Reject"} Leave Request
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Admin Remarks</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={adminRemarks}
              onChange={(e) => setAdminRemarks(e.target.value)}
              placeholder="Enter your remarks here..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant={modalAction === "APPROVED" ? "success" : "danger"}
            onClick={handleModalSubmit}
            disabled={actionLoading === modalLeaveId}
          >
            {actionLoading === modalLeaveId ? (
              <Spinner size="sm" animation="border" />
            ) : modalAction === "APPROVED" ? (
              "Approve"
            ) : (
              "Reject"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LeaveRequestList;
