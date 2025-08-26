import React, { useState, useEffect } from "react";
import { Table, Form, Button, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

// Mock student status data
const mockStudents = [
  {
    studentId: "S001",
    name: "John Doe",
    status: "PENDING",
    marks: null,
    remarks: "",
  },
  {
    studentId: "S002",
    name: "Jane Smith",
    status: "SUBMITTED",
    marks: 8,
    remarks: "Good work",
  },
  {
    studentId: "S003",
    name: "Bob Johnson",
    status: "ABSENT",
    marks: null,
    remarks: "",
  },
];

const rowClassByStatus = (status) => {
  switch (status) {
    case "COMPLETED":
      return "table-success";
    case "SUBMITTED":
      return "table-info";
    case "LATE":
      return "table-warning";
    case "ABSENT":
      return "table-danger";
    default:
      return "";
  }
};

const AssignmentStudentStatus = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // TODO: Fetch from API
    setStudents(mockStudents);
  }, []);

  const handleStatusChange = (studentId, value) => {
    setStudents((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, status: value } : s))
    );
  };

  const handleMarksChange = (studentId, value) => {
    setStudents((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, marks: value } : s))
    );
  };

  const handleRemarksChange = (studentId, value) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === studentId ? { ...s, remarks: value } : s
      )
    );
  };

  const handleSave = (student) => {
    console.log("Update Student Status:", student);
    // TODO: Call API to update student assignment status
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-lg border-0 rounded-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="mb-0">
              <span role="img" aria-label="book">
                📘
              </span>{" "}
              Student Assignment Status
            </h3>
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/teacher/dashboard/assignments")}
              className="shadow-sm"
            >
              ← Back to Assignments
            </Button>
          </div>

          <Table bordered hover responsive className="align-middle shadow-sm">
            <thead className="table-primary">
              <tr>
                <th style={{ minWidth: 180 }}>Student Name</th>
                <th style={{ minWidth: 160 }}>Status</th>
                <th style={{ minWidth: 130 }}>Marks</th>
                <th>Remarks</th>
                <th style={{ width: 120 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.studentId}
                  className={rowClassByStatus(student.status)}
                >
                  <td className="fw-semibold">{student.name}</td>
                  <td>
                    <Form.Select
                      size="sm"
                      value={student.status}
                      onChange={(e) =>
                        handleStatusChange(student.studentId, e.target.value)
                      }
                      className="shadow-sm"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="SUBMITTED">SUBMITTED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="LATE">LATE</option>
                      <option value="ABSENT">ABSENT</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Control
                      size="sm"
                      type="number"
                      value={student.marks ?? ""}
                      onChange={(e) =>
                        handleMarksChange(student.studentId, e.target.value)
                      }
                      disabled={
                        student.status === "ABSENT" ||
                        student.status === "PENDING"
                      }
                      placeholder="Enter marks"
                      className="shadow-sm"
                    />
                  </td>
                  <td>
                    <Form.Control
                      size="sm"
                      type="text"
                      value={student.remarks}
                      onChange={(e) =>
                        handleRemarksChange(student.studentId, e.target.value)
                      }
                      placeholder="Add remarks"
                      className="shadow-sm"
                    />
                  </td>
                  <td className="text-center">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleSave(student)}
                      className="shadow-sm px-3 d-inline-flex align-items-center gap-1"
                    >
                      <span role="img" aria-label="save">
                        💾
                      </span>{" "}
                      Save
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AssignmentStudentStatus;
