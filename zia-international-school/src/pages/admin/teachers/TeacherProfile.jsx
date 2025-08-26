import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Badge, Spinner, Button } from "react-bootstrap";
import { FaMale, FaFemale, FaUser } from "react-icons/fa";
import teacherService from "../../../services/teacherService";

export default function TeacherProfile() {
  const { empId } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const data = empId
          ? await teacherService.getTeacherByEmpId(empId)
          : await teacherService.getMyProfile();
        setTeacher(data);
      } catch (error) {
        console.error("Error fetching teacher profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [empId]);

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
      // Use URL param empId if present (admin), otherwise use the loaded teacher.empId (self view)
      const targetEmpId = empId || teacher?.empId;
      if (!targetEmpId) throw new Error("No employee ID available for upload.");

      const updatedTeacher = await teacherService.uploadProfileImage(
        targetEmpId,
        formData
      );
      setTeacher(updatedTeacher);
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
      case "ON_LEAVE":
        return "warning";
      case "INACTIVE":
        return "secondary";
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
        <div>Loading Teacher Profile...</div>
      </div>
    );
  }

  if (!teacher) {
    return <p className="text-danger mt-4 text-center">Teacher not found.</p>;
  }

  return (
    <div className="container mt-4">
      {empId && (
        <Button variant="outline-primary mb-3" onClick={() => navigate(-1)}>
          ← Back to List
        </Button>
      )}

      <Card className="shadow-lg rounded-4 border-0">
        <Card.Header
          className="text-white d-flex align-items-center gap-2"
          style={{
            background: "linear-gradient(to right, #6a11cb, #2575fc)",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
          }}
        >
          {renderGenderIcon(teacher.gender)}
          <h4 className="mb-0">{teacher.fullName}</h4>
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
                      : teacher.profileImageUrl
                      ? `${import.meta.env.VITE_IMAGE_BASE_URL}/${
                          teacher.profileImageUrl
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
                <Badge bg={getStatusVariant(teacher.status)}>
                  {teacher.status}
                </Badge>
                <div className="text-muted mt-1">Emp ID: {teacher.empId}</div>
              </div>
            </Col>

            <Col md={9}>
              <Row>
                <Col md={6}>
                  <p>
                    <strong>Username:</strong> {teacher.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {teacher.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {teacher.phone}
                  </p>
                  <p>
                    <strong>Gender:</strong> {teacher.gender || "N/A"}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong> {teacher.dateOfBirth}
                  </p>
                  <p>
                    <strong>Qualification:</strong> {teacher.qualification}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <strong>Joining Date:</strong> {teacher.joiningDate}
                  </p>
                  <p>
                    <strong>Experience:</strong> {teacher.experienceYears} yrs
                  </p>
                  <p>
                    <strong>Grade:</strong>{" "}
                    {teacher.gradeName || "Not Assigned"}
                  </p>
                  <p>
                    <strong>Section:</strong>{" "}
                    {teacher.sectionName || "Not Assigned"}
                  </p>
                  <p>
                    <strong>Teacher Type:</strong>{" "}
                    {teacher.teacherType || "N/A"}
                  </p>
                  <p>
                    <strong>Address:</strong> {teacher.address || "N/A"}
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={4}>
              <p>
                <strong>Marital Status:</strong>{" "}
                {teacher.maritalStatus || "N/A"}
              </p>
            </Col>
            <Col md={4}>
              <p>
                <strong>Nationality:</strong> {teacher.nationality || "N/A"}
              </p>
            </Col>
            <Col md={4}>
              <p>
                <strong>Blood Group:</strong> {teacher.bloodGroup || "N/A"}
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <p>
                <strong>Emergency Contact:</strong>{" "}
                {teacher.emergencyContactInfo || "N/A"}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Aadhar No:</strong> {teacher.aadharNumber || "N/A"}
              </p>
            </Col>
          </Row>
        </Card.Body>

        {!empId && (
          <div className="text-end p-3">
            <Button
              variant="primary"
              onClick={() => navigate("/teacher/dashboard/profile/edit")}
            >
              ✏️ Edit My Profile
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
