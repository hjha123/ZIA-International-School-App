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
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import teacherService from "../../services/teacherService";
import {
  FaUserPlus,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaIdBadge,
  FaCalendarAlt,
  FaUserTie,
} from "react-icons/fa";

const TeacherForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subjectIds: [],
    gender: "",
    dateOfBirth: "",
    qualification: "",
    address: "",
    joiningDate: "",
    experienceYears: 0,
    maritalStatus: "",
    emergencyContactInfo: "",
    bloodGroup: "",
    nationality: "",
    aadharNumber: "",
    profileImageUrl: "",
    teacherType: "",
    gradeName: "",
    sectionName: "",
  });

  const [subjects, setSubjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({
    loading: false,
    success: "",
    error: "",
  });
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedStaffId, setGeneratedStaffId] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjectList = await teacherService.getAllSubjects();
        setSubjects(subjectList);
      } catch (err) {
        console.error("Failed to fetch subjects", err);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const gradeList = await teacherService.getAllGrades();
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
        const data = await teacherService.getSectionsByGrade(selectedGrade.id);
        setSections(data);
      } catch (err) {
        console.error("Failed to fetch sections", err);
      }
    };
    fetchSections();
  }, [formData.gradeName, grades]);

  const validate = () => {
    const errs = {};
    if (!formData.fullName) errs.fullName = "Full name is required";
    if (!formData.email) errs.email = "Email is required";
    if (!formData.phone.match(/^[0-9]{10}$/))
      errs.phone = "Valid phone is required";
    if (formData.subjectIds.length === 0)
      errs.subjectIds = "Select at least one subject";
    if (!formData.gender) errs.gender = "Gender is required";
    if (!formData.dateOfBirth) errs.dateOfBirth = "Date of birth is required";
    if (!formData.qualification)
      errs.qualification = "Qualification is required";
    if (!formData.joiningDate) errs.joiningDate = "Joining date is required";
    if (!formData.teacherType) errs.teacherType = "Teacher type is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "select-multiple") {
      const options = Array.from(e.target.selectedOptions, (o) =>
        Number(o.value)
      );
      setFormData({ ...formData, [name]: options });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus({ loading: true, success: "", error: "" });
    try {
      const response = await teacherService.createTeacher(formData);
      const staffId = response?.staffId || response?.empId || "N/A";
      setGeneratedStaffId(staffId);
      setStatus({
        loading: false,
        success: `Teacher created successfully. Employee ID: ${staffId}`,
        error: "",
      });
      setShowSuccessModal(true);
      setTimeout(() => navigate("/admin/dashboard/teachers"), 5000);
    } catch (err) {
      let errorMessage = "Failed to create teacher";
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setStatus({ loading: false, error: errorMessage, success: "" });
    }
  };

  return (
    <Container className="bg-white p-5 rounded shadow-lg">
      {/* Header */}
      <div
        className="text-center px-4 py-4 rounded shadow-sm mb-4 d-flex justify-content-center align-items-center gap-2"
        style={{
          background: "linear-gradient(135deg, #6a11cb, #2575fc)",
          color: "#fff",
          fontWeight: "600",
          letterSpacing: "0.5px",
        }}
      >
        <FaUserPlus size={28} />
        <span style={{ fontSize: "1.8rem" }}>Teacher Onboarding Form</span>
      </div>

      {status.error && <Alert variant="danger">{status.error}</Alert>}

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
        size="md"
        backdrop="static"
        keyboard={false}
        contentClassName="p-0 overflow-hidden shadow-lg"
      >
        <div
          style={{
            background: "linear-gradient(135deg, #28a745, #218838)",
            color: "#fff",
            padding: "1rem 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: "600",
            fontSize: "1.25rem",
            borderTopLeftRadius: "0.5rem",
            borderTopRightRadius: "0.5rem",
          }}
        >
          <FaUserPlus size={24} />
          Teacher Onboarding Successful
        </div>
        <Modal.Body className="text-center py-4">
          <div
            className="mb-3"
            style={{
              fontSize: "3rem",
              color: "#28a745",
            }}
          >
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <p className="mb-0" style={{ fontSize: "1.1rem" }}>
            Teacher created successfully.
            <br />
            <strong>Employee ID: {generatedStaffId}</strong>
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center pb-3">
          <Button
            variant="success"
            onClick={() => setShowSuccessModal(false)}
            className="px-4 py-2 shadow-sm"
            style={{ fontWeight: "600" }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Form onSubmit={handleSubmit}>
        {/* Full Name & Email */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="fullName">
              <Form.Label className="text-primary fw-bold">
                <FaIdBadge className="me-2" />
                Full Name *
              </Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                isInvalid={!!errors.fullName}
                className="shadow-sm border-primary"
              />
              <Form.Control.Feedback type="invalid">
                {errors.fullName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="email">
              <Form.Label className="text-danger fw-bold">
                <FaEnvelope className="me-2" />
                Email *
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
                className="shadow-sm border-danger"
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* Phone & Gender */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="phone">
              <Form.Label className="text-success fw-bold">
                <FaPhone className="me-2" />
                Phone *
              </Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                isInvalid={!!errors.phone}
                className="shadow-sm border-success"
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="gender">
              <Form.Label className="text-warning fw-bold">Gender *</Form.Label>
              <Form.Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                isInvalid={!!errors.gender}
                className="shadow-sm border-warning"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.gender}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* Date of Birth & Joining Date */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="dateOfBirth">
              <Form.Label className="text-warning fw-bold">
                <FaCalendarAlt className="me-2" />
                Date of Birth *
              </Form.Label>
              <Form.Control
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                isInvalid={!!errors.dateOfBirth}
                className="shadow-sm border-warning"
              />
              <Form.Control.Feedback type="invalid">
                {errors.dateOfBirth}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="joiningDate">
              <Form.Label className="text-info fw-bold">
                <FaUserTie className="me-2" />
                Joining Date *
              </Form.Label>
              <Form.Control
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                isInvalid={!!errors.joiningDate}
                className="shadow-sm border-info"
              />
              <Form.Control.Feedback type="invalid">
                {errors.joiningDate}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* Qualification & Experience */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="qualification">
              <Form.Label className="text-secondary fw-bold">
                <FaGraduationCap className="me-2" />
                Qualification *
              </Form.Label>
              <Form.Control
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                isInvalid={!!errors.qualification}
                className="shadow-sm border-secondary"
              />
              <Form.Control.Feedback type="invalid">
                {errors.qualification}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="experienceYears">
              <Form.Label className="fw-bold">Experience (Years)</Form.Label>
              <Form.Control
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                className="shadow-sm"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Subjects */}
        <Form.Group className="mb-3" controlId="subjectIds">
          <Form.Label className="text-primary fw-bold">Subjects *</Form.Label>
          <Form.Select
            name="subjectIds"
            multiple
            value={formData.subjectIds}
            onChange={handleChange}
            isInvalid={!!errors.subjectIds}
            className="shadow-sm border-primary"
          >
            {subjects.map((subj) => (
              <option key={subj.id} value={subj.id}>
                {subj.name}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.subjectIds}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Address & Teacher Type */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="address">
              <Form.Label className="fw-bold">Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="shadow-sm"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="teacherType">
              <Form.Label className="text-success fw-bold">
                Teacher Type *
              </Form.Label>
              <Form.Select
                name="teacherType"
                value={formData.teacherType}
                onChange={handleChange}
                isInvalid={!!errors.teacherType}
                className="shadow-sm border-success"
              >
                <option value="">Select</option>
                <option value="FULL_TIME">FULL_TIME</option>
                <option value="PART_TIME">PART_TIME</option>
                <option value="GUEST">GUEST</option>
                <option value="VISITING">VISITING</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.teacherType}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        {/* Grade & Section */}
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group controlId="gradeName">
              <Form.Label className="fw-bold">Grade</Form.Label>
              <Form.Select
                name="gradeName"
                value={formData.gradeName}
                onChange={handleChange}
                className="shadow-sm"
              >
                <option value="">Select Grade</option>
                {grades.map((grade) => (
                  <option key={grade.id} value={grade.name}>
                    {grade.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="sectionName">
              <Form.Label className="fw-bold">Section</Form.Label>
              <Form.Select
                name="sectionName"
                value={formData.sectionName}
                onChange={handleChange}
                disabled={!formData.gradeName}
                className="shadow-sm"
              >
                <option value="">Select Section</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.name}>
                    {section.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Button
          variant="success"
          type="submit"
          disabled={status.loading}
          className="shadow-sm me-2"
          style={{ fontWeight: "600" }}
        >
          {status.loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Onboard Teacher"
          )}
        </Button>
        <Button
          variant="secondary"
          className="shadow-sm"
          onClick={() => navigate("/admin/dashboard/teachers")}
        >
          Cancel
        </Button>
      </Form>
    </Container>
  );
};

export default TeacherForm;
