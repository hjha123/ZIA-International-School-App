import React, { useEffect, useState } from "react";
import { Card, Table, Form, Row, Col, Spinner } from "react-bootstrap";
import leaveService from "../../../services/leaveService";
import teacherService from "../../../services/teacherService";

const EmployeeLeaveHistory = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      const res = await teacherService.getAllTeachers();
      setTeachers(res);
    };
    fetchTeachers();
  }, []);

  const handleSelectChange = async (e) => {
    const empId = e.target.value;
    setSelectedEmpId(empId);
    setLoading(true);
    try {
      const [balanceRes, historyRes] = await Promise.all([
        leaveService.getLeaveBalanceByEmpId(empId),
        leaveService.getLeaveHistoryByEmpId(empId),
      ]);
      setLeaveBalance(balanceRes);
      setLeaveHistory(historyRes);
    } catch (error) {
      console.error("Error fetching leave history:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h4 className="mb-4">Employee Leave History</h4>

      <Form.Group as={Row} className="mb-4">
        <Form.Label column sm={2}>
          Select Employee:
        </Form.Label>
        <Col sm={6}>
          <Form.Select onChange={handleSelectChange} value={selectedEmpId}>
            <option value="">-- Select a Teacher --</option>
            {teachers.map((t) => (
              <option key={t.empId} value={t.empId}>
                {t.fullName} ({t.empId})
              </option>
            ))}
          </Form.Select>
        </Col>
      </Form.Group>

      {loading && <Spinner animation="border" variant="primary" />}

      {selectedEmpId && !loading && (
        <>
          <Card className="mb-4 p-3">
            <h5 className="mb-3">Leave Balance</h5>
            <Row>
              {leaveBalance.map((item, idx) => (
                <Col sm={4} key={idx}>
                  <strong>{item.leaveType}:</strong> {item.remaining} /{" "}
                  {item.allocated}
                </Col>
              ))}
            </Row>
          </Card>

          <Card className="p-3">
            <h5 className="mb-3">Leave History</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {leaveHistory.map((leave, idx) => (
                  <tr key={leave.id}>
                    <td>{idx + 1}</td>
                    <td>{leave.leaveType}</td>
                    <td>{leave.startDate}</td>
                    <td>{leave.endDate}</td>
                    <td>{leave.days}</td>
                    <td>{leave.status}</td>
                    <td>{leave.reason}</td>
                    <td>{leave.remarks || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </>
      )}
    </div>
  );
};

export default EmployeeLeaveHistory;
