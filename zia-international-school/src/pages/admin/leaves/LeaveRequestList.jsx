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
  Card,
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
      setError("⚠️ Failed to load leave requests. Please try again.");
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
    <Card className="shadow-sm p-4 border-0">
      {/* Header */}
      <h4
        className="mb-4 text-white px-4 py-2 rounded shadow-sm"
        style={{ background: "linear-gradient(90deg, #36d1dc, #5b86e5)" }}
      >
        📋 Leave Requests
      </h4>

      {error && (
        <Alert variant="danger" className="mb-3 shadow-sm">
          {error}
        </Alert>
      )}

      {/* Filter */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Select
            value={statusFilter}
            onChange={handleStatusChange}
            className="shadow-sm"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">⏳ Pending</option>
            <option value="APPROVED">✅ Approved</option>
            <option value="REJECTED">❌ Rejected</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Table or Loading */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading leave requests...</p>
        </div>
      ) : (
        <Table
          bordered
          hover
          responsive
          className="align-middle shadow-sm rounded"
        >
          <thead
            style={{
              background: "linear-gradient(90deg, #e3f2fd, #f1f8ff)",
            }}
          >
            <tr>
              <th>#</th>
              <th>Emp ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Applied On</th>
              <th>Status</th>
              <th>Reason</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center text-muted py-4">
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
                    {req.appliedOn
                      ? new Date(req.appliedOn).toLocaleDateString()
                      : "-"}
                  </td>{" "}
                  <td>
                    <Badge
                      bg={
                        req.status === "APPROVED"
                          ? "success"
                          : req.status === "REJECTED"
                          ? "danger"
                          : "warning"
                      }
                      className="px-3 py-2 rounded-pill shadow-sm"
                    >
                      {req.status}
                    </Badge>
                  </td>
                  <td>{req.reason}</td>
                  <td className="text-center">
                    {req.status === "PENDING" ? (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2 shadow-sm"
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
                          className="shadow-sm"
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
                      <span className="text-muted">—</span>
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
            {modalAction === "APPROVED" ? "✅ Approve" : "❌ Reject"} Leave
            Request
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
    </Card>
  );
};

export default LeaveRequestList;
