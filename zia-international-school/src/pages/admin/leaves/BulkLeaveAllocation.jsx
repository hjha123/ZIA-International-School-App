import React, { useState, useEffect } from "react";
import { Form, Button, Card, Alert, Spinner, Row, Col } from "react-bootstrap";
import leaveService from "../../../services/leaveService";
import teacherService from "../../../services/teacherService";

const BulkLeaveAllocation = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [leaveDays, setLeaveDays] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [applyToAll, setApplyToAll] = useState(true);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    loadLeaveTypes();
    loadTeachers();
  }, []);

  const loadLeaveTypes = async () => {
    try {
      const data = await leaveService.getAllLeaveTypes();
      setLeaveTypes(data);
    } catch (err) {
      setErrorMsg("Failed to load leave types.");
    }
  };

  const loadTeachers = async () => {
    try {
      const data = await teacherService.getAllTeachers();
      setTeachers(data);
    } catch (err) {
      setErrorMsg("Failed to load teachers.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (
      !selectedType ||
      !leaveDays ||
      (!applyToAll && selectedTeachers.length === 0)
    ) {
      setErrorMsg("Please fill all required fields.");
      return;
    }

    const payload = {
      leaveType: selectedType,
      days: parseInt(leaveDays),
      empIds: applyToAll ? null : selectedTeachers,
    };

    try {
      setLoading(true);
      await leaveService.bulkAllocateLeaves(payload);
      setSuccessMsg("Leave allocated successfully.");
      setLeaveDays("");
      setSelectedTeachers([]);
    } catch (err) {
      setErrorMsg("Failed to allocate leave.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm p-4">
      <h4 className="mb-3">Bulk Leave Allocation</h4>

      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="leaveType">
              <Form.Label>Leave Type</Form.Label>
              <Form.Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                required
              >
                <option value="">Select Leave Type</option>
                {leaveTypes.map((type) => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="leaveDays">
              <Form.Label>Number of Days</Form.Label>
              <Form.Control
                type="number"
                value={leaveDays}
                onChange={(e) => setLeaveDays(e.target.value)}
                required
                min={1}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="applyToAll" className="mb-3">
          <Form.Check
            type="checkbox"
            label="Apply to all teachers"
            checked={applyToAll}
            onChange={() => setApplyToAll(!applyToAll)}
          />
        </Form.Group>

        {!applyToAll && (
          <Form.Group controlId="teacherSelect" className="mb-3">
            <Form.Label>Select Teachers</Form.Label>
            <Form.Select
              multiple
              value={selectedTeachers}
              onChange={(e) =>
                setSelectedTeachers(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {teachers.map((teacher) => (
                <option key={teacher.empId} value={teacher.empId}>
                  {teacher.fullName} ({teacher.empId})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? (
            <Spinner size="sm" animation="border" />
          ) : (
            "Allocate Leave"
          )}
        </Button>
      </Form>
    </Card>
  );
};

export default BulkLeaveAllocation;
