import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Button, Row, Col, Spinner, Alert } from "react-bootstrap";
import leaveService from "../../../services/leaveService";
import teacherService from "../../../services/teacherService";

const AllocateLeavesToEmployee = () => {
  const { empId } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [allocations, setAllocations] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherRes, leaveTypesRes] = await Promise.all([
          teacherService.getTeacherByEmpId(empId),
          leaveService.getAllLeaveTypes(),
        ]);
        setTeacher(teacherRes);
        setLeaveTypes(leaveTypesRes);

        const initialAllocations = {};
        leaveTypesRes.forEach((type) => {
          initialAllocations[type.name] = 0;
        });
        setAllocations(initialAllocations);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };
    fetchData();
  }, [empId]);

  const handleChange = (e, typeName) => {
    const val = parseInt(e.target.value, 10);
    setAllocations({
      ...allocations,
      [typeName]: isNaN(val) || val < 0 ? 0 : val,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const data = {
        empId,
        allocations: Object.entries(allocations).map(([leaveType, days]) => ({
          leaveType,
          days,
        })),
      };
      await leaveService.allocateLeave([data]);
      setMessage({ type: "success", text: "Leaves allocated successfully." });
    } catch (err) {
      setMessage({ type: "danger", text: "Failed to allocate leaves." });
      console.error(err);
    }
    setSubmitting(false);
  };

  if (!teacher || leaveTypes.length === 0) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <div>
      <h4 className="mb-4">Allocate Leaves to Employee</h4>
      <Card className="p-4">
        <h5>
          {teacher.fullName} ({teacher.empId})
        </h5>
        <Form onSubmit={handleSubmit}>
          {leaveTypes.map((type) => (
            <Form.Group as={Row} key={type.name} className="mb-3">
              <Form.Label column sm={4}>
                {type.name} Leave Days:
              </Form.Label>
              <Col sm={4}>
                <Form.Control
                  type="number"
                  min="0"
                  value={allocations[type.name]}
                  onChange={(e) => handleChange(e, type.name)}
                  required
                />
              </Col>
            </Form.Group>
          ))}
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Allocating..." : "Allocate Leaves"}
          </Button>
        </Form>

        {message && (
          <Alert variant={message.type} className="mt-3">
            {message.text}
          </Alert>
        )}
      </Card>
    </div>
  );
};

export default AllocateLeavesToEmployee;
