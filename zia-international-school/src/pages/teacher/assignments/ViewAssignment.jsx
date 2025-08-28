import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Spinner, Badge } from "react-bootstrap";
import assignmentService from "../../../services/assignmentService";

const ViewAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      const data = await assignmentService.getAssignmentById(id);
      setAssignment(data);
    } catch (err) {
      console.error("Error fetching assignment:", err);
      setError("Failed to load assignment.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <p className="text-danger text-center">{error}</p>;
  }

  if (!assignment) {
    return <p className="text-muted text-center">Assignment not found.</p>;
  }

  return (
    <div>
      <Button variant="secondary" className="mb-3" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <Card className="shadow-sm border-0 rounded-3">
        <Card.Body>
          <h3 className="fw-bold mb-3">{assignment.title}</h3>
          <p className="text-muted">{assignment.description}</p>

          <div className="mb-3">
            <Badge bg="info" className="me-2">
              Grade: {assignment.gradeName}
            </Badge>
            <Badge bg="secondary">
              Section: {assignment.sectionName || "-"}
            </Badge>
          </div>

          <p>
            <strong>Due Date:</strong>{" "}
            {assignment.dueDate
              ? new Date(assignment.dueDate).toLocaleDateString()
              : "-"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <Badge
              bg={
                assignment.status === "ACTIVE"
                  ? "success"
                  : assignment.status === "DRAFT"
                  ? "warning"
                  : assignment.status === "CLOSED"
                  ? "dark"
                  : "secondary"
              }
            >
              {assignment.status}
            </Badge>
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {assignment.createdAt
              ? new Date(assignment.createdAt).toLocaleString()
              : "-"}
          </p>
          <p>
            <strong>Last Updated At:</strong>{" "}
            {assignment.updatedAt
              ? new Date(assignment.updatedAt).toLocaleString()
              : "-"}
          </p>

          {/* Admin Remarks - only for PUBLISHED or CLOSED */}
          {(assignment.status === "PUBLISHED" ||
            assignment.status === "CLOSED") &&
            assignment.adminRemarks && (
              <p>
                <strong>Admin Remarks:</strong> {assignment.adminRemarks}
              </p>
            )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ViewAssignment;
