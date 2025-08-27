import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Alert, Badge } from "react-bootstrap";
import { FaChartBar } from "react-icons/fa";
import leaveService from "../../../services/leaveService";

const LeaveEntitlements = () => {
  const [entitlements, setEntitlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntitlements = async () => {
      try {
        const data = await leaveService.myLeaveEntitlements();
        setEntitlements(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEntitlements();
  }, []);

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  if (error)
    return (
      <Alert variant="danger" className="mt-4">
        {error}
      </Alert>
    );

  return (
    <Card className="shadow-sm mt-4">
      <Card.Header className="bg-primary text-white d-flex align-items-center">
        <FaChartBar className="me-2" />
        My Leave Entitlements
      </Card.Header>
      <Card.Body>
        {entitlements.length === 0 ? (
          <Alert variant="info">No leave entitlements available.</Alert>
        ) : (
          <Table
            striped
            bordered
            hover
            responsive
            className="align-middle text-center"
          >
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Leave Type</th>
                <th>Total Allocated</th>
                <th>Used Leaves</th>
                <th>Remaining Leaves</th>
              </tr>
            </thead>
            <tbody>
              {entitlements.map((item, index) => (
                <tr key={item.leaveType}>
                  <td>{index + 1}</td>
                  <td>{item.leaveType}</td>
                  <td>
                    <Badge bg="secondary">{item.totalAllocated}</Badge>
                  </td>
                  <td>
                    <Badge bg={item.usedLeaves > 0 ? "danger" : "success"}>
                      {item.usedLeaves}
                    </Badge>
                  </td>
                  <td>
                    <Badge
                      bg={item.remainingLeaves > 0 ? "success" : "warning"}
                    >
                      {item.remainingLeaves}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default LeaveEntitlements;
