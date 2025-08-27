import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Alert,
  Spinner,
  Modal,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import studentService from "../../../services/studentService";
import { FaUserPlus } from "react-icons/fa";

const StudentCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "MALE",
    dateOfBirth: "",
    gradeName: "",
    sectionName: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    bloodGroup: "",
    nationality: "",
    profileImageUrl: "",
    guardianName: "",
    guardianPhone: "",
    admissionDate: new Date().toISOString().split("T")[0],
  });

  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [createdStudentId, setCreatedStudentId] = useState("");

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const gradeList = await studentService.getAllGrades();
        setGrades(gradeList);
      } catch (err) {
        console.error("Failed to fetch grades", err);
      }
    };
    fetchGrades();
  }, []);

  useEffect(() => {
    const fetchSections = async () => {
      if (!formData.gradeName || grades.length === 0) {
        setSections([]);
        return;
      }
      const selectedGrade = grades.find((g) => g.name === formData.gradeName);
      if (!selectedGrade) return;
      try {
        const data = await studentService.getSectionsByGrade(selectedGrade.id);
        setSections(data);
      } catch (err) {
        console.error("Failed to fetch sections", err);
      }
    };
    fetchSections();
  }, [formData.gradeName, grades]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName) errs.firstName = "First name is required";
    if (!formData.lastName) errs.lastName = "Last name is required";
    if (!formData.email) errs.email = "Email is required";
    if (!formData.phone.match(/^[0-9]{10}$/))
      errs.phone = "Valid phone number is required";
    if (!formData.gender) errs.gender = "Gender is required";
    if (!formData.dateOfBirth) errs.dateOfBirth = "Date of birth is required";
    if (!formData.gradeName) errs.gradeName = "Grade is required";
    if (!formData.guardianName) errs.guardianName = "Guardian name is required";
    if (!formData.guardianPhone.match(/^[0-9]{10}$/))
      errs.guardianPhone = "Valid guardian phone is required";
    if (!formData.admissionDate)
      errs.admissionDate = "Admission date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus({ loading: true, error: "", success: "" });

    try {
      const payload = { ...formData };
      if (!payload.sectionName) {
        delete payload.sectionName;
        delete payload.sectionId;
      }

      const response = await studentService.onboardStudent(payload);

      // Capture the returned studentId from backend
      setCreatedStudentId(response.studentId || "");

      setStatus({
        loading: false,
        success: "Student onboarded successfully!",
        error: "",
      });
      setShowSuccessModal(true);

      setTimeout(() => navigate("/admin/dashboard/students"), 3000);
    } catch (err) {
      console.error(err);

      const backendMessage =
        err.response?.data?.message ||
        "Failed to onboard student. Please check all required fields and try again.";

      setStatus({
        loading: false,
        error: backendMessage,
        success: "",
      });

      setErrors({});
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-lg rounded-4 border-0">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-3"
              style={{
                background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                color: "#fff",
                fontSize: "1.3rem",
                fontWeight: "500",
              }}
            >
              <FaUserPlus size={24} />
              Student Onboarding Form
            </div>
          </div>

          {status.error && <Alert variant="danger">{status.error}</Alert>}

          <Modal
            show={showSuccessModal}
            onHide={() => setShowSuccessModal(false)}
            centered
          >
            <Modal.Header
              closeButton
              style={{ backgroundColor: "#d4edda", color: "#155724" }}
            >
              <Modal.Title>✅ Student Onboarded</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <div className="mb-3">
                <h5 className="text-success">{status.success}</h5>
                {createdStudentId && (
                  <p>
                    🎓 <strong>Student ID:</strong> {createdStudentId}
                  </p>
                )}
              </div>
              <Button
                variant="success"
                onClick={() => setShowSuccessModal(false)}
              >
                Close
              </Button>
            </Modal.Body>
          </Modal>

          <Form onSubmit={handleSubmit}>
            {/* --- Personal Details --- */}
            <h5 className="mb-3 text-primary">Personal Details</h5>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    isInvalid={!!errors.firstName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    isInvalid={!!errors.lastName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Phone *</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    isInvalid={!!errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Gender *</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    isInvalid={!!errors.gender}
                    style={{ backgroundColor: "#f0f8ff" }}
                  >
                    <option value="">Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.gender}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date of Birth *</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    isInvalid={!!errors.dateOfBirth}
                    style={{ backgroundColor: "#f0f8ff" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dateOfBirth}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* --- Academic Details --- */}
            <h5 className="mb-3 text-success mt-4">Academic Details</h5>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Grade *</Form.Label>
                  <Form.Select
                    name="gradeName"
                    value={formData.gradeName}
                    onChange={handleChange}
                    isInvalid={!!errors.gradeName}
                    style={{ backgroundColor: "#fff7e6" }}
                  >
                    <option value="">Select Grade</option>
                    {grades.map((g) => (
                      <option key={g.id} value={g.name}>
                        {g.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.gradeName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Section</Form.Label>
                  <Form.Select
                    name="sectionName"
                    value={formData.sectionName}
                    onChange={handleChange}
                    disabled={!formData.gradeName}
                    isInvalid={!!errors.sectionName}
                    style={{ backgroundColor: "#fff7e6" }}
                  >
                    <option value="">Select Section</option>
                    {sections.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.sectionName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* --- Guardian Info --- */}
            <h5 className="mb-3 text-warning mt-4">Guardian Info</h5>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Guardian Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleChange}
                    isInvalid={!!errors.guardianName}
                    style={{ backgroundColor: "#fff0f6" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.guardianName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Guardian Phone *</Form.Label>
                  <Form.Control
                    type="text"
                    name="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={handleChange}
                    isInvalid={!!errors.guardianPhone}
                    style={{ backgroundColor: "#fff0f6" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.guardianPhone}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Optional Fields */}
            <h5 className="mb-3 text-info mt-4">Optional Info</h5>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Emergency Contact Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Emergency Contact Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Blood Group</Form.Label>
                  <Form.Control
                    type="text"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nationality</Form.Label>
                  <Form.Control
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Profile Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="profileImageUrl"
                    value={formData.profileImageUrl}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Admission Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="admissionDate"
                    value={formData.admissionDate}
                    onChange={handleChange}
                    isInvalid={!!errors.admissionDate}
                    style={{ backgroundColor: "#e6fff7" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.admissionDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <Button variant="success" type="submit" disabled={status.loading}>
                {status.loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Onboard Student"
                )}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/admin/dashboard/students")}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StudentCreate;
