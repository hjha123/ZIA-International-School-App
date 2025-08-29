import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Badge,
  Modal,
} from "react-bootstrap";
import { FaMale, FaFemale, FaUser } from "react-icons/fa";
import studentService from "../../../services/studentService";

const StudentUpdate = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [showResultModal, setShowResultModal] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentData, gradeList] = await Promise.all([
          studentService.getStudentById(studentId),
          studentService.getAllGrades(),
        ]);
        setStudent(studentData);
        setGrades(gradeList || []);
        if (studentData.gradeName) {
          const selectedGrade = gradeList.find(
            (g) => g.name === studentData.gradeName
          );
          if (selectedGrade) {
            const sectionList = await studentService.getSectionsByGrade(
              selectedGrade.id
            );
            setSections(sectionList || []);
          } else setSections([]);
        }
      } catch (err) {
        console.error("Error fetching student data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  const handleGradeChange = async (e) => {
    const gradeName = e.target.value;
    setStudent((prev) => ({ ...prev, gradeName, sectionName: "" }));
    const selectedGrade = grades.find((g) => g.name === gradeName);
    if (selectedGrade) {
      const sectionList = await studentService.getSectionsByGrade(
        selectedGrade.id
      );
      setSections(sectionList || []);
    } else setSections([]);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(file);
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      const updatedStudent = await studentService.uploadProfileImage(
        student.studentId,
        formData
      );
      setStudent(updatedStudent);
      setSelectedImage(null);
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await studentService.updateStudent(student.studentId, student);
      setUpdateMessage("Student profile updated successfully!");
      setUpdateSuccess(true);
      setShowResultModal(true);
      setTimeout(() => setShowResultModal(false), 3000);
    } catch (err) {
      console.error("Error updating student:", err);
      setUpdateMessage("Failed to update student profile. Please try again.");
      setUpdateSuccess(false);
      setShowResultModal(true);
      setTimeout(() => setShowResultModal(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "secondary";
      case "GRADUATED":
        return "info";
      default:
        return "primary";
    }
  };

  const renderGenderIcon = (gender) => {
    if (gender === "Male") return <FaMale className="text-primary me-2" />;
    if (gender === "Female") return <FaFemale className="text-danger me-2" />;
    return <FaUser className="text-secondary me-2" />;
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <div>Loading Student Profile...</div>
      </div>
    );
  }

  if (!student) {
    return <p className="text-danger mt-4 text-center">Student not found.</p>;
  }

  return (
    <Container
      className="py-4"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #e0f7fa, #fffde7)",
      }}
    >
      <Card className="shadow-lg rounded-4 border-0">
        <Card.Header
          className="text-white d-flex align-items-center gap-3 px-4 py-3"
          style={{
            background: "linear-gradient(90deg, #00c6ff, #0072ff)",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
          }}
        >
          {renderGenderIcon(student.gender)}
          <h4 className="mb-0">
            {student.firstName} {student.lastName}
          </h4>
          <Badge bg={getStatusVariant(student.status)} className="ms-3 p-2">
            {student.status}
          </Badge>
        </Card.Header>

        <Card.Body>
          <Row className="mb-4">
            {/* Profile Image */}
            <Col md={3} className="text-center">
              <div
                className="position-relative d-inline-block"
                style={{ width: 150, height: 150 }}
              >
                <img
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : student.profileImageUrl
                      ? `${import.meta.env.VITE_IMAGE_BASE_URL}/${
                          student.profileImageUrl
                        }`
                      : "/images/no-profile.png"
                  }
                  alt="Profile"
                  className="rounded-circle shadow-sm"
                  width={150}
                  height={150}
                  style={{ objectFit: "cover", border: "4px solid #fff" }}
                />
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center rounded-circle bg-dark bg-opacity-50"
                  style={{
                    cursor: "pointer",
                    opacity: 0,
                    transition: "opacity 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control form-control-sm mb-1"
                    onChange={handleImageChange}
                    style={{ width: "80%", fontSize: "0.75rem" }}
                  />
                  <Button
                    variant="light"
                    size="sm"
                    onClick={handleImageUpload}
                    disabled={!selectedImage}
                    style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                  >
                    Upload
                  </Button>
                </div>
              </div>
              <div className="text-muted mt-2 fw-bold">
                ID: {student.studentId}
              </div>
            </Col>

            {/* Form Fields */}
            <Col md={9}>
              <Row className="g-3">
                {/* Personal Info Section */}
                <Col md={6}>
                  <Card
                    className="p-3 mb-3 shadow-sm"
                    style={{ backgroundColor: "#e3f2fd", borderRadius: "1rem" }}
                  >
                    <h6 className="text-primary mb-3">Personal Info</h6>
                    <Form.Group className="mb-2">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        name="firstName"
                        value={student.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter first name"
                        style={{ backgroundColor: "#ffffff" }}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        name="lastName"
                        value={student.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter last name"
                        style={{ backgroundColor: "#ffffff" }}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={student.email}
                        onChange={handleInputChange}
                        placeholder="Enter email"
                        style={{ backgroundColor: "#ffffff" }}
                      />
                      <Form.Text className="text-warning">
                        Changing the email will update the student's login
                        credentials. They will need to login using the new
                        email.
                      </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        name="phone"
                        value={student.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        style={{ backgroundColor: "#ffffff" }}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        name="gender"
                        value={student.gender}
                        onChange={handleInputChange}
                        style={{ backgroundColor: "#ffffff" }}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Card>
                </Col>

                {/* Academic Info Section */}
                <Col md={6}>
                  <Card
                    className="p-3 mb-3 shadow-sm"
                    style={{ backgroundColor: "#fff3e0", borderRadius: "1rem" }}
                  >
                    <h6 className="text-warning mb-3">Academic Info</h6>
                    <Form.Group className="mb-2">
                      <Form.Label>Grade</Form.Label>
                      <Form.Select
                        name="gradeName"
                        value={student.gradeName}
                        onChange={handleGradeChange}
                        style={{ backgroundColor: "#ffffff" }}
                      >
                        <option value="">Select Grade</option>
                        {grades.map((g) => (
                          <option key={g.id} value={g.name}>
                            {g.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Section</Form.Label>
                      <Form.Select
                        name="sectionName"
                        value={student.sectionName || ""}
                        onChange={handleInputChange}
                        disabled={!student.gradeName}
                        style={{ backgroundColor: "#ffffff" }}
                      >
                        <option value="">Select Section</option>
                        {sections.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={student.status}
                        onChange={handleInputChange}
                        style={{ backgroundColor: "#ffffff" }}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="GRADUATED">Graduated</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Admission Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="admissionDate"
                        value={student.admissionDate}
                        onChange={handleInputChange}
                        style={{ backgroundColor: "#ffffff" }}
                      />
                    </Form.Group>
                  </Card>

                  {/* Guardian Info Section */}
                  <Card
                    className="p-3 shadow-sm"
                    style={{ backgroundColor: "#f3e5f5", borderRadius: "1rem" }}
                  >
                    <h6 className="text-purple mb-3">Guardian Info</h6>
                    <Form.Group className="mb-2">
                      <Form.Label>Guardian Name</Form.Label>
                      <Form.Control
                        name="guardianName"
                        value={student.guardianName || ""}
                        onChange={handleInputChange}
                        style={{ backgroundColor: "#ffffff" }}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Guardian Phone</Form.Label>
                      <Form.Control
                        name="guardianPhone"
                        value={student.guardianPhone || ""}
                        onChange={handleInputChange}
                        style={{ backgroundColor: "#ffffff" }}
                      />
                    </Form.Group>
                  </Card>
                </Col>
              </Row>

              {/* Action Buttons */}
              <div className="mt-4 d-flex justify-content-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => navigate("/admin/dashboard/students/update")}
                  className="shadow-sm"
                >
                  Back to List
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={saving}
                  className="shadow-sm"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Result Modal */}
      <Modal
        show={showResultModal}
        onHide={() => setShowResultModal(false)}
        centered
      >
        <Modal.Header
          closeButton
          className={
            updateSuccess ? "bg-success text-white" : "bg-danger text-white"
          }
        >
          <Modal.Title>{updateSuccess ? "Success" : "Error"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{updateMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant={updateSuccess ? "success" : "danger"}
            onClick={() => setShowResultModal(false)}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StudentUpdate;
