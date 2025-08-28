import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUserGraduate } from "react-icons/fa";
import gradeAndSectionsService from "../../../services/gradeAndSectionsService";
import studentsService from "../../../services/studentService";

const StudentProfileSearch = () => {
  const navigate = useNavigate();

  // states
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    gradeId: "",
    sectionId: "",
    name: "",
    studentId: "",
  });
  const [loading, setLoading] = useState(false);

  // fetch grades
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await gradeAndSectionsService.getAllGrades();
        setGrades(data);
      } catch (err) {
        console.error("Error fetching grades:", err);
      }
    };
    fetchGrades();
  }, []);

  // fetch sections when grade changes
  useEffect(() => {
    const fetchSections = async () => {
      if (!filters.gradeId) {
        setSections([]);
        return;
      }
      try {
        const data = await gradeAndSectionsService.getSectionsByGrade(
          filters.gradeId
        );
        setSections(data);
      } catch (err) {
        console.error("Error fetching sections:", err);
      }
    };
    fetchSections();
  }, [filters.gradeId]);

  // fetch students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await studentsService.searchStudents(filters);
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  // handle filter change
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  return (
    <Container fluid className="mt-4">
      {/* Header */}
      <Card
        className="mb-4 shadow-lg text-white"
        style={{ background: "linear-gradient(90deg, #667eea, #764ba2)" }}
      >
        <Card.Body>
          <Row className="align-items-center">
            <Col md="auto">
              <FaUserGraduate size={40} className="me-3" />
            </Col>
            <Col>
              <h3 className="mb-0">Search & View Student Profiles</h3>
              <small>
                Filter students and view detailed profiles instantly
              </small>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Filter Section */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-light">
          <strong>Filters</strong>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="gy-2">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Grade</Form.Label>
                  <Form.Select
                    name="gradeId"
                    value={filters.gradeId}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Grade --</option>
                    {grades.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Section</Form.Label>
                  <Form.Select
                    name="sectionId"
                    value={filters.sectionId}
                    onChange={handleChange}
                    disabled={!filters.gradeId}
                  >
                    <option value="">-- Select Section --</option>
                    {sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    name="name"
                    value={filters.name}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Student ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter student ID"
                    name="studentId"
                    value={filters.studentId}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col className="text-end">
                <Button type="submit" variant="primary">
                  <FaSearch className="me-2" />
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Results */}
      <Card className="shadow-sm">
        <Card.Header
          className="d-flex justify-content-between align-items-center text-white"
          style={{ background: "linear-gradient(90deg, #36d1dc, #5b86e5)" }}
        >
          <strong>Results</strong>
          <Badge bg="light" text="dark" pill>
            {students.length}
          </Badge>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <p className="text-muted">
              No students found. Try adjusting filters.
            </p>
          ) : (
            <Row className="g-3">
              {students.map((stu) => (
                <Col key={stu.studentId} md={6} lg={4}>
                  <Card
                    className="h-100 shadow-sm border-0 rounded-3"
                    style={{
                      background:
                        "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
                    }}
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Badge bg="dark" className="px-3 py-2">
                          {stu.studentId}
                        </Badge>
                        <Badge
                          bg={
                            stu.status === "ACTIVE"
                              ? "success"
                              : stu.status === "ON_LEAVE"
                              ? "warning"
                              : "secondary"
                          }
                          className="px-3 py-2"
                        >
                          {stu.status}
                        </Badge>
                      </div>

                      <h5 className="fw-bold text-primary mb-1">
                        {stu.firstName} {stu.lastName}
                      </h5>

                      <p className="text-muted small mb-3">
                        {stu.gradeName}{" "}
                        {stu.sectionName && `- ${stu.sectionName}`}
                      </p>

                      <Button
                        variant="gradient"
                        size="sm"
                        style={{
                          background:
                            "linear-gradient(90deg, #667eea, #764ba2)",
                          border: "none",
                          color: "white",
                        }}
                        onClick={() =>
                          navigate(
                            `/admin/dashboard/students/profile/${stu.studentId}`
                          )
                        }
                      >
                        View Profile
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StudentProfileSearch;
