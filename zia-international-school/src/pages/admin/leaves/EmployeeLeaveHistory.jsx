import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Form,
  Row,
  Col,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import leaveService from "../../../services/leaveService";
import teacherService from "../../../services/teacherService";
import { BsJournalText } from "react-icons/bs";

const getBadgeVariant = (status) => {
  switch (status) {
    case "APPROVED":
      return "success";
    case "PENDING":
      return "warning";
    case "REJECTED":
      return "danger";
    default:
      return "secondary";
  }
};

const getBalanceBadgeColor = (remaining, allocated) => {
  const ratio = allocated > 0 ? remaining / allocated : 0;
  if (ratio >= 0.6) return "success";
  if (ratio >= 0.3) return "warning";
  return "danger";
};

const EmployeeLeaveHistory = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [teacherError, setTeacherError] = useState("");
  const [teacherLoading, setTeacherLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setTeacherLoading(true);
        const res = await teacherService.getAllTeachers();
        setTeachers(res);
      } catch (err) {
        console.error("Failed to load teachers:", err);
        setTeacherError("Unable to load teachers. Please try again later.");
      } finally {
        setTeacherLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const handleSelectChange = async (e) => {
    const empId = e.target.value;
    setSelectedEmpId(empId);
    setLeaveHistory([]);
    setLeaveBalance([]);
    setError("");
    if (!empId) return;

    setLoading(true);
    try {
      const [balanceRes, historyRes] = await Promise.all([
        leaveService.getLeaveBalanceByEmpId(empId),
        leaveService.getLeaveHistoryByEmpId(empId),
      ]);

      const parsedBalance = Object.entries(balanceRes.leaveBalances || {}).map(
        ([leaveType, balance]) => ({
          leaveType,
          allocated: balance.allocated,
          remaining: balance.remaining,
        })
      );

      setLeaveBalance(parsedBalance);
      setLeaveHistory(historyRes);
    } catch (err) {
      console.error("Error fetching leave data:", err);
      setError("Failed to fetch leave data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4
        className="mb-4 text-white px-4 py-2 rounded shadow-sm d-flex align-items-center"
        style={{ background: "linear-gradient(90deg, #36d1dc, #5b86e5)" }}
      >
        <BsJournalText className="me-2" size={22} /> Employee Leave History
      </h4>

      {/* Teacher fetch error */}
      {teacherError && (
        <Alert variant="danger" className="mb-3">
          {teacherError}
        </Alert>
      )}

      <Form.Group as={Row} className="mb-4">
        <Form.Label column sm={2} className="fw-bold">
          Select Employee:
        </Form.Label>
        <Col sm={6}>
          <Form.Select
            onChange={handleSelectChange}
            value={selectedEmpId}
            disabled={teacherLoading || teacherError}
          >
            <option value="">-- Select a Teacher --</option>
            {teachers.map((t) => (
              <option key={t.empId} value={t.empId}>
                {t.fullName} ({t.empId})
              </option>
            ))}
          </Form.Select>
        </Col>
        {teacherLoading && (
          <Col sm="auto" className="d-flex align-items-center">
            <Spinner animation="border" size="sm" />
          </Col>
        )}
      </Form.Group>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Fetching leave details...</p>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      {selectedEmpId && !loading && !error && (
        <>
          <Card className="mb-4 p-3 shadow-sm border-0">
            <h5 className="mb-3 text-primary">
              <i className="bi bi-bar-chart me-2"></i>Leave Balance
            </h5>
            {leaveBalance.length === 0 ? (
              <Alert variant="info" className="mb-0">
                No leave allocations found for this employee.
              </Alert>
            ) : (
              <Row>
                {leaveBalance.map((item, idx) => (
                  <Col sm={6} md={4} className="mb-3" key={idx}>
                    <div
                      className="d-flex justify-content-between align-items-center px-3 py-2 rounded shadow-sm"
                      style={{
                        backgroundColor: "#f8f9fa",
                        borderLeft: `6px solid ${
                          getBalanceBadgeColor(
                            item.remaining,
                            item.allocated
                          ) === "success"
                            ? "#28a745"
                            : getBalanceBadgeColor(
                                item.remaining,
                                item.allocated
                              ) === "warning"
                            ? "#ffc107"
                            : "#dc3545"
                        }`,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "1rem",
                          fontWeight: "600",
                          color: "#343a40",
                        }}
                      >
                        {item.leaveType}
                      </div>
                      <div>
                        <span
                          className={`badge bg-${getBalanceBadgeColor(
                            item.remaining,
                            item.allocated
                          )} rounded-pill`}
                          style={{
                            fontSize: "0.95rem",
                            padding: "0.5em 0.9em",
                          }}
                        >
                          {item.remaining} / {item.allocated}
                        </span>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </Card>

          <Card className="p-3 shadow-sm border-0">
            <h5 className="mb-3">
              <i className="bi bi-clock-history me-2"></i>Leave History
            </h5>
            {leaveHistory.length === 0 ? (
              <Alert variant="info">
                No leave records found for this employee.
              </Alert>
            ) : (
              <Table striped bordered hover responsive>
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
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
                      <td>
                        <Badge bg={getBadgeVariant(leave.status)}>
                          {leave.status}
                        </Badge>
                      </td>
                      <td>{leave.reason}</td>
                      <td>{leave.adminRemarks || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default EmployeeLeaveHistory;
