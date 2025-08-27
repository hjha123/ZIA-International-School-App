import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Spinner,
  Badge,
  Container,
  Card,
  Form,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import studentService from "../../../services/studentService";

const StudentUpdateList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await studentService.getAllStudents();
        setStudents(data || []);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "secondary";
      case "GRADUATED":
        return "info";
      default:
        return "primary";
    }
  };

  const filteredStudents = students.filter((s) =>
    `${s.firstName} ${s.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <div className="mt-2">Loading Students...</div>
      </div>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow-lg rounded-4 border-0">
        <Card.Header
          className="text-white d-flex justify-content-between align-items-center"
          style={{
            background: "linear-gradient(90deg, #6a11cb, #2575fc)",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
          }}
        >
          <h5 className="mb-0">Update Students</h5>
          <InputGroup style={{ width: "250px" }}>
            <Form.Control
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="sm"
            />
          </InputGroup>
        </Card.Header>

        <Card.Body>
          {filteredStudents.length === 0 ? (
            <p className="text-center text-muted">No students found.</p>
          ) : (
            <Table
              responsive
              hover
              striped
              className="align-middle text-center mb-0"
            >
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Grade</th>
                  <th>Section</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, idx) => (
                  <tr key={student.studentId}>
                    <td>{idx + 1}</td>
                    <td>
                      {student.firstName} {student.lastName}
                    </td>
                    <td>{student.gradeName || "-"}</td>
                    <td>{student.sectionName || "-"}</td>
                    <td>
                      <Badge bg={getStatusVariant(student.status)}>
                        {student.status}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/admin/dashboard/students/update/${student.studentId}`
                          )
                        }
                      >
                        Update
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StudentUpdateList;
