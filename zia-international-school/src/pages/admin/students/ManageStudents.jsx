import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Table,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Modal,
  Badge,
} from "react-bootstrap";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import studentService from "../../../services/studentService";

const ManageStudents = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    gradeName: "",
    sectionName: "",
    status: "",
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await studentService.getAllStudents();
      setStudents(data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
    setLoading(false);
  };

  // Fetch grades
  const fetchGrades = async () => {
    try {
      const data = await studentService.getAllGrades();
      setGrades(data);
    } catch (err) {
      console.error("Failed to fetch grades", err);
    }
  };

  // Fetch sections for selected grade
  const fetchSections = async (gradeName) => {
    if (!gradeName) {
      setSections([]);
      return;
    }
    const grade = grades.find((g) => g.name === gradeName);
    if (!grade) return;
    try {
      const data = await studentService.getSectionsByGrade(grade.id);
      setSections(data);
    } catch (err) {
      console.error("Failed to fetch sections", err);
    }
  };

  useEffect(() => {
    fetchGrades();
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchSections(filters.gradeName);
    setFilters({ ...filters, sectionName: "" }); // reset section filter
  }, [filters.gradeName]);

  // Handle search/filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
      s.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(filters.search.toLowerCase());
    const matchesGrade =
      !filters.gradeName || s.gradeName === filters.gradeName;
    const matchesSection =
      !filters.sectionName || s.sectionName === filters.sectionName;
    const matchesStatus =
      !filters.status ||
      s.status.toUpperCase() === filters.status.toUpperCase();
    return matchesSearch && matchesGrade && matchesSection && matchesStatus;
  });

  // Get row color based on status
  const getRowVariant = (status) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "secondary";
      case "GRADUATED":
        return "info";
      default:
        return "";
    }
  };

  // Delete student
  const handleDelete = async () => {
    if (!selectedStudent) return;
    try {
      await studentService.deleteStudent(selectedStudent.studentId);
      setShowDeleteModal(false);
      fetchStudents();
    } catch (err) {
      console.error("Failed to delete student", err);
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-lg rounded-4 border-0">
        <Card.Body>
          <Row className="mb-3 align-items-center">
            <Col>
              <h4 className="text-primary mb-0">Manage Students</h4>
            </Col>
            <Col className="text-end">
              <Button
                variant="success"
                onClick={() => navigate("/admin/dashboard/students/create")}
              >
                + Add Student
              </Button>
            </Col>
          </Row>

          {/* Filters */}
          <Row className="mb-3 g-2">
            <Col md={3}>
              <Form.Control
                placeholder="Search by Name / ID"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </Col>
            <Col md={2}>
              <Form.Select
                name="gradeName"
                value={filters.gradeName}
                onChange={handleFilterChange}
              >
                <option value="">All Grades</option>
                {grades.map((g) => (
                  <option key={g.id} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                name="sectionName"
                value={filters.sectionName}
                onChange={handleFilterChange}
                disabled={!filters.gradeName}
              >
                <option value="">All Sections</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="GRADUATED">Graduated</option>
              </Form.Select>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <Table
              bordered
              hover
              responsive
              className="align-middle text-center"
            >
              <thead className="table-dark">
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Grade</th>
                  <th>Section</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Admission Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="9">No students found.</td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr
                      key={s.id}
                      className={`table-${getRowVariant(s.status)}`}
                    >
                      <td>{s.studentId}</td>
                      <td>
                        {s.firstName} {s.lastName}
                      </td>
                      <td>{s.gradeName}</td>
                      <td>{s.sectionName || "-"}</td>
                      <td>{s.email}</td>
                      <td>{s.phone}</td>
                      <td>
                        <Badge bg={getRowVariant(s.status)}>{s.status}</Badge>
                      </td>
                      <td>{s.admissionDate}</td>
                      <td className="d-flex justify-content-center gap-2">
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/admin/dashboard/students/view/${s.studentId}`
                            )
                          }
                        >
                          <FaEye />
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/admin/dashboard/students/update/${s.studentId}`
                            )
                          }
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setSelectedStudent(s);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}

          {/* View Modal */}
          <Modal
            show={showViewModal}
            onHide={() => setShowViewModal(false)}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Student Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedStudent && (
                <Row>
                  <Col md={6}>
                    <p>
                      <strong>Student ID:</strong> {selectedStudent.studentId}
                    </p>
                    <p>
                      <strong>Name:</strong> {selectedStudent.firstName}{" "}
                      {selectedStudent.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedStudent.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedStudent.phone}
                    </p>
                    <p>
                      <strong>Gender:</strong> {selectedStudent.gender}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Grade:</strong> {selectedStudent.gradeName}
                    </p>
                    <p>
                      <strong>Section:</strong>{" "}
                      {selectedStudent.sectionName || "-"}
                    </p>
                    <p>
                      <strong>Status:</strong> {selectedStudent.status}
                    </p>
                    <p>
                      <strong>Admission Date:</strong>{" "}
                      {selectedStudent.admissionDate}
                    </p>
                    <p>
                      <strong>Guardian:</strong> {selectedStudent.guardianName}{" "}
                      ({selectedStudent.guardianPhone})
                    </p>
                  </Col>
                </Row>
              )}
            </Modal.Body>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete student{" "}
              <strong>
                {selectedStudent?.firstName} {selectedStudent?.lastName}
              </strong>
              ?
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ManageStudents;
