import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Container,
  Card,
  Form,
  Row,
  Col,
  Pagination,
  InputGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import teacherService from "../../../services/teacherService";
import { FaChalkboardTeacher, FaEdit, FaSearch } from "react-icons/fa";

const TeacherSelectList = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await teacherService.getAllTeachers();
        const teacherList = Array.isArray(data) ? data : data.data;
        setTeachers(teacherList);
        setFilteredTeachers(teacherList);
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
    setCurrentPage(1);
  };

  const handleSelect = (empId) => {
    navigate(`/admin/dashboard/teachers/update/${empId}`);
  };

  // Pagination logic
  const indexOfLast = currentPage * teachersPerPage;
  const indexOfFirst = indexOfLast - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => paginate(number)}
          style={{
            backgroundColor: number === currentPage ? "#4caf50" : "#e0e0e0",
            color: number === currentPage ? "#fff" : "#333",
            border: "none",
            margin: "0 3px",
            fontWeight: "500",
            boxShadow:
              number === currentPage ? "0px 2px 6px rgba(0,0,0,0.2)" : "none",
          }}
        >
          {number}
        </Pagination.Item>
      );
    }
    return (
      <Pagination className="justify-content-end mt-3">{items}</Pagination>
    );
  };

  return (
    <div
      style={{
        background: "linear-gradient(to right, #f0f4f8, #d1e3ff)",
        minHeight: "100vh",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >
      <Container>
        <Card className="shadow-lg rounded-4 border-0">
          <Card.Body>
            {/* Header */}
            <div
              className="mb-4 p-3 rounded-4 d-flex align-items-center"
              style={{
                background: "linear-gradient(90deg, #6a11cb, #2575fc)",
                color: "#fff",
                boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
              }}
            >
              <FaChalkboardTeacher size={28} className="me-3" />
              <h3 className="mb-0 flex-grow-1">Select a Teacher to Update</h3>
              <FaEdit size={22} />
            </div>

            {/* Search */}
            <Form className="mb-4">
              <Row>
                <Col md={6}>
                  <InputGroup>
                    <InputGroup.Text
                      style={{
                        backgroundColor: "#ffe6f0",
                        border: "none",
                        color: "#d81b60",
                        fontWeight: "600",
                      }}
                    >
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search by Emp ID or Name"
                      value={searchTerm}
                      onChange={handleSearch}
                      className="shadow-sm border-0"
                      style={{
                        backgroundColor: "#fff0f5",
                        fontWeight: "500",
                        color: "#880e4f",
                      }}
                    />
                  </InputGroup>
                </Col>
              </Row>
            </Form>

            {/* Table */}
            <Table
              hover
              responsive
              className="text-center align-middle shadow-sm"
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #c5cae9",
              }}
            >
              <thead
                style={{
                  background: "linear-gradient(90deg, #ff512f, #dd2476)",
                  color: "#fff",
                  fontSize: "1rem",
                }}
              >
                <tr>
                  <th>Emp ID</th>
                  <th>Full Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentTeachers.length > 0 ? (
                  currentTeachers.map((teacher, index) => (
                    <tr
                      key={teacher.empId}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#fff0f5" : "#f0f5ff",
                        transition: "all 0.3s ease",
                      }}
                      className="table-row-hover"
                    >
                      <td style={{ color: "#1a237e", fontWeight: "500" }}>
                        {teacher.empId}
                      </td>
                      <td style={{ color: "#283593", fontWeight: "500" }}>
                        {teacher.fullName}
                      </td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="text-white px-4 py-1 shadow-sm"
                          onClick={() => handleSelect(teacher.empId)}
                          style={{
                            background:
                              "linear-gradient(90deg, #ff6a00, #ee0979)",
                            border: "none",
                            transition: "all 0.3s ease",
                          }}
                        >
                          Update
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-muted py-3">
                      No matching teachers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && renderPagination()}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default TeacherSelectList;
