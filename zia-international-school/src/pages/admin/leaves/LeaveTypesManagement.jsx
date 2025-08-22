import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Form,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
  Modal,
} from "react-bootstrap";
import { FaTrashAlt, FaPlusCircle, FaClipboardList } from "react-icons/fa";
import leaveService from "../../../services/leaveService";

const LeaveTypesManagement = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [newLeaveType, setNewLeaveType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      const data = await leaveService.getAllLeaveTypes();
      setLeaveTypes(data);
    } catch (err) {
      setErrorMsg("Failed to load leave types.");
    }
  };

  const handleAddLeaveType = async (e) => {
    e.preventDefault();
    if (!newLeaveType.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await leaveService.createLeaveType({ name: newLeaveType });
      setNewLeaveType("");
      setSuccessMsg("✅ Leave type added successfully.");
      fetchLeaveTypes();
    } catch (err) {
      setErrorMsg("❌ Failed to add leave type.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (type) => {
    setSelectedType(type);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedType) return;

    try {
      await leaveService.deleteLeaveType(selectedType.id);
      setSuccessMsg(`🗑️ "${selectedType.name}" deleted.`);
      fetchLeaveTypes();
    } catch (err) {
      setErrorMsg("❌ Failed to delete leave type.");
    } finally {
      setShowDeleteModal(false);
      setSelectedType(null);
    }
  };

  return (
    <Card className="shadow-sm p-4">
      <h4
        className="mb-4 text-white px-4 py-2 rounded shadow-sm d-flex align-items-center"
        style={{ background: "linear-gradient(90deg, #36d1dc, #5b86e5)" }}
      >
        <FaClipboardList className="me-2" />
        Manage Leave Types
      </h4>

      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      <Form onSubmit={handleAddLeaveType} className="mb-4">
        <Row className="align-items-center">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Enter new leave type"
              value={newLeaveType}
              onChange={(e) => setNewLeaveType(e.target.value)}
              required
            />
          </Col>
          <Col md={3}>
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? (
                <Spinner size="sm" animation="border" />
              ) : (
                <>
                  <FaPlusCircle className="me-2" />
                  Add Leave Type
                </>
              )}
            </Button>
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover responsive>
        <thead className="table-primary">
          <tr>
            <th style={{ width: "5%" }}>#</th>
            <th style={{ width: "60%" }}>Leave Type</th>
            <th style={{ width: "120px", textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveTypes.map((type, index) => (
            <tr key={type.id}>
              <td>{index + 1}</td>
              <td style={{ whiteSpace: "nowrap" }}>{type.name}</td>
              <td className="text-center">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => confirmDelete(type)}
                >
                  <FaTrashAlt className="me-1" />
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          {leaveTypes.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">
                No leave types found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Beautified Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>⚠️ Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedType?.name}</strong>?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <FaTrashAlt className="me-2" />
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default LeaveTypesManagement;
