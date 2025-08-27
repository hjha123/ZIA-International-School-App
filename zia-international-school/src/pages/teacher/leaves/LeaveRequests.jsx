import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Card, Badge } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";
import leaveService from "../../../services/leaveService";

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const data = await leaveService.myLeaveRequests();
        setLeaveRequests(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "danger";
      default:
        return "warning"; // PENDING or other
    }
  };

  // Calculate number of days between two dates (inclusive)
  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Format date in readable format
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  if (error)
    return (
      <Alert variant="danger" className="mt-4">
        {error}
      </Alert>
    );

  return (
    <Card className="shadow-lg mt-4 rounded-4">
      <Card.Header className="bg-primary text-white d-flex align-items-center">
        <FaCalendarAlt className="me-2" />
        <h5 className="mb-0">My Leave Requests</h5>
      </Card.Header>
      <Card.Body>
        {leaveRequests.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <FaCalendarAlt size={48} className="mb-3 opacity-25" />
            <div>No leave requests submitted yet.</div>
          </div>
        ) : (
          <div className="table-responsive">
            <Table
              striped
              bordered
              hover
              responsive
              className="align-middle mb-0"
            >
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>No. of Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Applied On</th>
                  <th>Admin Remarks</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((leave, index) => (
                  <tr key={leave.leaveId}>
                    <td>{index + 1}</td>
                    <td>{leave.leaveType}</td>
                    <td>{formatDate(leave.startDate)}</td>
                    <td>{formatDate(leave.endDate)}</td>
                    <td>
                      <Badge pill bg="info" text="dark" className="px-3 py-2">
                        {calculateDays(leave.startDate, leave.endDate)}
                      </Badge>
                    </td>
                    <td>{leave.reason}</td>
                    <td>
                      <Badge
                        pill
                        bg={getStatusVariant(leave.status)}
                        className="px-3 py-2"
                      >
                        {leave.status}
                      </Badge>
                    </td>
                    <td>{formatDate(leave.appliedOn)}</td>
                    <td>{leave.adminRemarks || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default LeaveRequests;
