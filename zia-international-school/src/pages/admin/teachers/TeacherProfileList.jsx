import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import teacherService from "../../../services/teacherService";
import {
  Card,
  Table,
  Button,
  Form,
  Row,
  Col,
  Spinner,
  Pagination,
} from "react-bootstrap";

export default function TeacherProfileList() {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await teacherService.getAllTeachers();
        setTeachers(data);
        setFilteredTeachers(data);
      } catch (error) {
        console.error("Error fetching teacher list:", error);
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
    setCurrentPage(1); // Reset to page 1 when search changes
  }, [searchTerm, teachers]);

  const handleViewProfile = (empId) => {
    navigate(`/admin/dashboard/teachers/${empId}`);
  };

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

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
      <Card.Header className="bg-info text-white rounded-top">
        <h5 className="mb-0">👨‍🏫 All Teachers - View Complete Profile</h5>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="🔍 Search by Emp ID or Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
        </Row>

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="info" />
            <div className="mt-2 text-muted">Loading Teachers...</div>
          </div>
        ) : (
          <>
            <Table bordered hover responsive className="table-sm align-middle">
              <thead className="table-light">
                <tr className="text-center">
                  <th>Emp ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Subjects</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentTeachers.length > 0 ? (
                  currentTeachers.map((teacher) => (
                    <tr key={teacher.empId} className="text-center">
                      <td>{teacher.empId}</td>
                      <td>{teacher.fullName}</td>
                      <td>{teacher.email}</td>
                      <td>
                        {Array.isArray(teacher.subjects)
                          ? teacher.subjects.join(", ")
                          : "N/A"}
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleViewProfile(teacher.empId)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No teachers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-end mt-3">
                <Pagination size="sm">{paginationItems}</Pagination>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
}
