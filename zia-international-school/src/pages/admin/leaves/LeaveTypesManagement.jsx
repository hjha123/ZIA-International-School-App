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
} from "react-bootstrap";
import leaveService from "../../../services/leaveService";

const LeaveTypesManagement = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [newLeaveType, setNewLeaveType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

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
      setSuccessMsg("Leave type added successfully.");
      fetchLeaveTypes();
    } catch (err) {
      setErrorMsg("Failed to add leave type.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave type?"))
      return;

    try {
      await leaveService.deleteLeaveType(id);
      setSuccessMsg("Leave type deleted.");
      fetchLeaveTypes();
    } catch (err) {
      setErrorMsg("Failed to delete leave type.");
    }
  };

  return (
    <Card className="shadow-sm p-4">
      <h4 className="mb-3">Manage Leave Types</h4>

      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      <Form onSubmit={handleAddLeaveType} className="mb-4">
        <Row>
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
                "Add Leave Type"
              )}
            </Button>
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Leave Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveTypes.map((type, index) => (
            <tr key={type.id}>
              <td>{index + 1}</td>
              <td>{type.name}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(type.id)}
                >
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
    </Card>
  );
};

export default LeaveTypesManagement;
