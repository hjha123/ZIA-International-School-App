import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import teacherService from "../../services/teacherService";

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

      // Redirect to Teacher List page after 2 seconds
      setTimeout(() => navigate("/admin/dashboard/teachers"), 5000);
    } catch (err) {
      setStatus({
        loading: false,
        error: "Failed to create teacher",
        success: "",
      });
    }
  };

  return (
    <Container className="bg-white p-4 rounded shadow-sm">
      <h4 className="mb-4 text-primary">Teacher Onboarding Form</h4>

      {status.error && <Alert variant="danger">{status.error}</Alert>}
      {status.success && <Alert variant="success">{status.success}</Alert>}

      <Form onSubmit={handleSubmit}>
        {/* --- FORM FIELDS --- */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="fullName">
              <Form.Label>Full Name *</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                isInvalid={!!errors.fullName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fullName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="email">
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
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="phone">
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
          <Col md={6}>
            <Form.Group controlId="gender">
              <Form.Label>Gender *</Form.Label>
              <Form.Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                isInvalid={!!errors.gender}
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

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="dateOfBirth">
              <Form.Label>Date of Birth *</Form.Label>
              <Form.Control
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                isInvalid={!!errors.dateOfBirth}
              />
              <Form.Control.Feedback type="invalid">
                {errors.dateOfBirth}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="joiningDate">
              <Form.Label>Joining Date *</Form.Label>
              <Form.Control
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                isInvalid={!!errors.joiningDate}
              />
              <Form.Control.Feedback type="invalid">
                {errors.joiningDate}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="qualification">
              <Form.Label>Qualification *</Form.Label>
              <Form.Control
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                isInvalid={!!errors.qualification}
              />
              <Form.Control.Feedback type="invalid">
                {errors.qualification}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="experienceYears">
              <Form.Label>Experience (Years)</Form.Label>
              <Form.Control
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="subjectIds">
          <Form.Label>Subjects *</Form.Label>
          <Form.Select
            name="subjectIds"
            multiple
            value={formData.subjectIds}
            onChange={handleChange}
            isInvalid={!!errors.subjectIds}
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

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="teacherType">
              <Form.Label>Teacher Type</Form.Label>
              <Form.Select
                name="teacherType"
                value={formData.teacherType}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="FULL_TIME">FULL_TIME</option>
                <option value="PART_TIME">PART_TIME</option>
                <option value="GUEST">GUEST</option>
                <option value="VISITING">VISITING</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Optional fields */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="gradeName">
              <Form.Label>Grade</Form.Label>
              <Form.Select
                name="gradeName"
                value={formData.gradeName}
                onChange={handleChange}
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
              <Form.Label>Section</Form.Label>
              <Form.Select
                name="sectionName"
                value={formData.sectionName}
                onChange={handleChange}
                disabled={!formData.gradeName}
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

        <Button variant="primary" type="submit" disabled={status.loading}>
          {status.loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Create Teacher"
          )}
        </Button>
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => navigate("/admin/dashboard/teachers")}
        >
          Cancel
        </Button>
      </Form>
    </Container>
  );
};

export default TeacherForm;
