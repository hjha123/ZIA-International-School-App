import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Badge, Spinner, Button } from "react-bootstrap";
import { FaMale, FaFemale, FaUser } from "react-icons/fa";
import studentService from "../../../services/studentService";

export default function StudentProfile() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await studentService.getStudentById(studentId);
        setStudent(data);
      } catch (error) {
        console.error("Error fetching student profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [studentId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(file);
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      setUploading(true);
      const updatedStudent = await studentService.uploadProfileImage(
        studentId,
        formData
      );
      setStudent(updatedStudent);
      setSelectedImage(null);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading(false);
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
        return "info";
    }
  };

  const renderGenderIcon = (gender) => {
    if (gender === "Male") return <FaMale className="text-primary me-2" />;
    if (gender === "Female") return <FaFemale className="text-pink-500 me-2" />;
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
    <div className="container mt-4">
      <Button variant="outline-primary mb-3" onClick={() => navigate(-1)}>
        ← Back to List
      </Button>

      <Card className="shadow-lg rounded-4 border-0">
        <Card.Header
          className="text-white d-flex align-items-center gap-2"
          style={{
            background: "linear-gradient(to right, #6a11cb, #2575fc)",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
          }}
        >
          {renderGenderIcon(student.gender)}
          <h4 className="mb-0">
            {student.firstName} {student.lastName}
          </h4>
        </Card.Header>

        <Card.Body>
          <Row className="mb-4 align-items-center">
            <Col md={3} className="text-center">
              <div
                className="position-relative d-inline-block group"
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
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/no-profile.png";
                  }}
                  alt="Profile"
                  className="rounded-circle shadow"
                  width={150}
                  height={150}
                  style={{ objectFit: "cover", border: "4px solid #dee2e6" }}
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
                    disabled={!selectedImage || uploading}
                    style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </div>

              <div className="mt-3">
                <Badge bg={getStatusVariant(student.status)}>
                  {student.status}
                </Badge>
                <div className="text-muted mt-1">
                  Student ID: {student.studentId}
                </div>
              </div>
            </Col>

            <Col md={9}>
              <Row>
                <Col md={6}>
                  <p>
                    <strong>Username:</strong> {student.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {student.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {student.phone}
                  </p>
                  <p>
                    <strong>Gender:</strong> {student.gender || "N/A"}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong> {student.dateOfBirth}
                  </p>
                  <p>
                    <strong>Blood Group:</strong> {student.bloodGroup || "N/A"}
                  </p>
                  <p>
                    <strong>Nationality:</strong> {student.nationality || "N/A"}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Grade:</strong>{" "}
                    {student.gradeName || "Not Assigned"}
                  </p>
                  <p>
                    <strong>Section:</strong>{" "}
                    {student.sectionName || "Not Assigned"}
                  </p>
                  <p>
                    <strong>Admission Date:</strong> {student.admissionDate}
                  </p>
                  <p>
                    <strong>Address:</strong> {student.address || "N/A"}
                  </p>
                  <p>
                    <strong>Guardian:</strong> {student.guardianName} (
                    {student.guardianPhone})
                  </p>
                  <p>
                    <strong>Emergency Contact:</strong>{" "}
                    {student.emergencyContactName} (
                    {student.emergencyContactPhone})
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}
