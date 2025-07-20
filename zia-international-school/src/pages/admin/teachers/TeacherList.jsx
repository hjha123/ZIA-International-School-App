import React, { useEffect, useState } from "react";
import teacherService from "../../../services/teacherService";
import "./TeacherList.css";
import {
  Table,
  Spinner,
  Alert,
  Button,
  Badge,
  Container,
  Pagination,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [teachersPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const data = await teacherService.getAllTeachers();
      setTeachers(data);
    } catch (err) {
      setError("Failed to fetch teachers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusRowClass = (status) => {
    switch (status) {
      case "ACTIVE":
        return "table-success";
      case "ON_LEAVE":
        return "table-warning";
      case "INACTIVE":
        return "table-secondary";
      default:
        return "";
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "ON_LEAVE":
        return "warning";
      case "INACTIVE":
        return "secondary";
      default:
        return "dark";
    }
  };

  const getTeacherTypeVariant = (type) => {
    switch (type) {
      case "FULL_TIME":
        return "success";
      case "PART_TIME":
        return "info";
      case "GUEST":
        return "warning";
      case "VISITING":
        return "secondary";
      default:
        return "dark";
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const search = searchTerm.toLowerCase();
    return (
      teacher.fullName.toLowerCase().includes(search) ||
      teacher.empId?.toLowerCase().includes(search)
    );
  });

  const indexOfLast = currentPage * teachersPerPage;
  const indexOfFirst = indexOfLast - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

  return (
    <Container fluid className="py-4">
      {/* Header row with title, search, and add button */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
        <h3 className="fw-bold text-secondary mb-0 text-nowrap">
          Teachers Directory
        </h3>

        <div className="d-flex flex-column flex-md-row align-items-md-center gap-2 w-100 justify-content-md-end">
          <Form.Control
            type="text"
            placeholder="Search by name or employee ID..."
            style={{ maxWidth: "300px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="success"
            onClick={() => navigate("/admin/dashboard/teachers/create")}
          >
            + Add Teacher
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <div className="table-responsive w-100">
            <Table bordered hover className="teacher-table w-100">
              <thead className="table-dark text-nowrap">
                <tr>
                  <th>Employee ID</th>
                  <th>Name / Username</th>
                  <th>Email / Phone</th>
                  <th>Subjects</th>
                  <th>Gender</th>
                  <th className="dob">DOB</th>
                  <th>Qualification</th>
                  <th>Address</th>
                  <th className="joining-date">Joining Date</th>
                  <th>Experience</th>
                  <th>Grade / Section</th>
                  <th className="text-nowrap emp-type-col">Employment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTeachers.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className={getStatusRowClass(teacher.status)}
                  >
                    <td className="fw-bold text-primary text-nowrap">
                      {teacher.empId}
                    </td>
                    <td className="text-wrap">
                      <div>{teacher.fullName}</div>
                      <small className="text-muted">{teacher.username}</small>
                    </td>
                    <td className="text-wrap">
                      <div>{teacher.email}</div>
                      <div>{teacher.phone}</div>
                    </td>
                    <td className="text-wrap">
                      {teacher.subjects?.join(", ")}
                    </td>
                    <td>{teacher.gender}</td>
                    <td className="dob">{teacher.dateOfBirth}</td>
                    <td>{teacher.qualification}</td>
                    <td className="text-wrap">{teacher.address}</td>
                    <td className="joining-date">{teacher.joiningDate}</td>
                    <td>{teacher.experienceYears} yrs</td>
                    <td>
                      {teacher.gradeName || "-"} / {teacher.sectionName || "-"}
                    </td>
                    <td>
                      <Badge bg={getTeacherTypeVariant(teacher.teacherType)}>
                        {teacher.teacherType?.replace("_", " ")}
                      </Badge>
                    </td>

                    <td>
                      <Badge bg={getStatusBadgeVariant(teacher.status)}>
                        {teacher.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <Button variant="primary" size="sm">
                          View
                        </Button>
                        <Button variant="danger" size="sm">
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="justify-content-end">
              {[...Array(totalPages).keys()].map((page) => (
                <Pagination.Item
                  key={page}
                  active={page + 1 === currentPage}
                  onClick={() => setCurrentPage(page + 1)}
                >
                  {page + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default TeacherList;
