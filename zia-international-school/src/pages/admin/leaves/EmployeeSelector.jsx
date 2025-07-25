import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import teacherService from "../../../services/teacherService";
import {
  Card,
  Table,
  Button,
  Spinner,
  Form,
  Row,
  Col,
  Pagination,
  InputGroup,
} from "react-bootstrap";
import { FaSearch, FaUserPlus } from "react-icons/fa";

const EmployeeSelector = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await teacherService.getAllTeachers();
        setTeachers(data);
        setFilteredTeachers(data);
      } catch (err) {
        console.error("Error loading teachers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = teachers.filter(
      (t) =>
        t.empId.toLowerCase().includes(term) ||
        t.fullName.toLowerCase().includes(term)
    );
    setFilteredTeachers(filtered);
    setCurrentPage(1);
  }, [searchTerm, teachers]);

  const handleAllocateClick = (empId) => {
    navigate(`/admin/dashboard/leaves/allocate/${empId}`);
  };

  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(
    indexOfFirstTeacher,
    indexOfLastTeacher
  );
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-light border-0">
        <div
          className="px-4 py-2 bg-primary text-white d-inline-block rounded-pill shadow-sm"
          style={{ fontSize: "1.1rem", fontWeight: "500", maxWidth: "100%" }}
        >
          Select Employee to Allocate Leaves
        </div>
      </Card.Header>

      <Card.Body>
        <Row className="mb-3">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text className="bg-light">
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by Emp ID or Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <Table hover responsive className="table-striped table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Emp ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Subjects</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentTeachers.map((teacher) => (
                  <tr key={teacher.empId}>
                    <td>{teacher.empId}</td>
                    <td>{teacher.fullName}</td>
                    <td>{teacher.email}</td>
                    <td>
                      {teacher.subjects && teacher.subjects.length > 0 ? (
                        teacher.subjects.map((subj, idx) => (
                          <span
                            key={idx}
                            className="badge bg-info text-dark me-1"
                          >
                            {subj}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted">N/A</span>
                      )}
                    </td>
                    <td>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleAllocateClick(teacher.empId)}
                      >
                        <FaUserPlus className="me-1" />
                        Allocate
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {totalPages > 1 && (
              <div className="d-flex justify-content-end">
                <Pagination>{paginationItems}</Pagination>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default EmployeeSelector;
