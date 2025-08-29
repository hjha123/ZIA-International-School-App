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
import { FaSearch, FaChalkboardTeacher } from "react-icons/fa";
import gradeAndSectionsService from "../../../services/gradeAndSectionsService";
import teacherService from "../../../services/teacherService";

const TeacherProfileSearch = () => {
  const navigate = useNavigate();

  // states
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [filters, setFilters] = useState({
    gradeId: "",
    sectionId: "",
    name: "",
    empId: "",
    teacherType: "",
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

  // fetch teachers
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const activeFilters = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== "" && filters[key] !== null) {
          activeFilters[key] = filters[key];
        }
      });

      const data = await teacherService.searchTeachers(activeFilters);
      console.log("Teachers fetched:", data);
      setTeachers(data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
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
    fetchTeachers();
  };

  return (
    <Container fluid className="mt-4">
      {/* Header */}
      <Card
        className="mb-4 shadow-lg text-white"
        style={{ background: "linear-gradient(90deg, #11998e, #38ef7d)" }}
      >
        <Card.Body>
          <Row className="align-items-center">
            <Col md="auto">
              <FaChalkboardTeacher size={40} className="me-3" />
            </Col>
            <Col>
              <h3 className="mb-0">Search & View Teacher Profiles</h3>
              <small>
                Find teachers by grade, section, or expertise and view details
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
              <Col md={2}>
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

              <Col md={2}>
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

              <Col md={2}>
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

              <Col md={2}>
                <Form.Group>
                  <Form.Label>Emp ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Emp ID"
                    name="empId"
                    value={filters.empId}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>
                  <Form.Label>Teacher Type</Form.Label>
                  <Form.Select
                    name="teacherType"
                    value={filters.teacherType}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Type --</option>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="VISITING">Visiting</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={2} className="d-flex align-items-end">
                <Button type="submit" variant="success" className="w-100">
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
          style={{ background: "linear-gradient(90deg, #11998e, #38ef7d)" }}
        >
          <strong>Results</strong>
          <Badge bg="light" text="dark" pill>
            {teachers.length}
          </Badge>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
              <p className="mt-2">Loading teachers...</p>
            </div>
          ) : teachers.length === 0 ? (
            <p className="text-muted">
              No teachers found. Try adjusting filters.
            </p>
          ) : (
            <Row className="g-3">
              {teachers.map((t) => (
                <Col key={t.empId} md={6} lg={4}>
                  <Card
                    className="h-100 shadow-sm border-0 rounded-3"
                    style={{
                      background:
                        "linear-gradient(135deg, #f9f9f9 0%, #e6f4f1 100%)",
                    }}
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Badge bg="dark" className="px-3 py-2">
                          {t.empId}
                        </Badge>
                        <Badge
                          bg={
                            t.status === "ACTIVE"
                              ? "success"
                              : t.status === "ON_LEAVE"
                              ? "warning"
                              : "secondary"
                          }
                          className="px-3 py-2"
                        >
                          {t.status}
                        </Badge>
                      </div>

                      <h5 className="fw-bold text-success mb-1">
                        {t.fullName}
                      </h5>
                      <p className="text-muted small mb-1">
                        {t.gradeName} {t.sectionName && `- ${t.sectionName}`}
                      </p>
                      <p className="small mb-2">
                        <strong>Subjects:</strong>{" "}
                        {t.subjects && t.subjects.length > 0
                          ? t.subjects.join(", ")
                          : "N/A"}
                      </p>
                      <p className="small mb-3">
                        <strong>Type:</strong> {t.teacherType || "N/A"}
                      </p>

                      {/* Enhanced View Profile Button */}
                      <Button
                        size="sm"
                        style={{
                          background:
                            "linear-gradient(90deg, #0f766e, #14b8a6)",
                          border: "none",
                          color: "white",
                          fontWeight: "600",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                          transition: "transform 0.2s, box-shadow 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow =
                            "0 6px 12px rgba(0,0,0,0.25)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 8px rgba(0,0,0,0.15)";
                        }}
                        onClick={() =>
                          navigate(
                            `/admin/dashboard/teachers/profile/${t.empId}`,
                            { state: { fromSearch: true } } // <-- pass state
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

export default TeacherProfileSearch;
