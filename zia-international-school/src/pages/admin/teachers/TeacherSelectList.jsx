import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Container,
  Card,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import teacherService from "../../../services/teacherService";

const TeacherSelectList = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await teacherService.getAllTeachers();
        const teacherList = Array.isArray(data) ? data : data.data;
        setTeachers(teacherList);
        setFilteredTeachers(teacherList); // initialize filter list
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = teachers.filter(
      (teacher) =>
        teacher.empId.toLowerCase().includes(value) ||
        teacher.fullName.toLowerCase().includes(value)
    );
    setFilteredTeachers(filtered);
  };

  const handleSelect = (empId) => {
    navigate(`/admin/dashboard/teachers/update/${empId}`);
  };

  return (
    <div
      style={{
        background: "linear-gradient(to right, #f8f9fa, #e9f5ff)",
        minHeight: "100vh",
        paddingTop: "30px",
      }}
    >
      <Container>
        <Card className="shadow-sm">
          <Card.Body>
            <h3 className="mb-4 text-primary">Select a Teacher to Update</h3>

            {/* Search Filter */}
            <Form className="mb-4">
              <Row>
                <Col md={6}>
                  <Form.Control
                    type="text"
                    placeholder="Search by Emp ID or Name"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </Col>
              </Row>
            </Form>

            <Table
              striped
              bordered
              hover
              responsive
              className="text-center"
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <thead className="table-primary text-white">
                <tr>
                  <th>Emp ID</th>
                  <th>Full Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher, index) => (
                    <tr
                      key={teacher.empId}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#f6fafd" : "#ffffff",
                      }}
                    >
                      <td>{teacher.empId}</td>
                      <td>{teacher.fullName}</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="text-white"
                          onClick={() => handleSelect(teacher.empId)}
                        >
                          Update
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No matching teachers found.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default TeacherSelectList;
