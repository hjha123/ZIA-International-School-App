import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col, Alert, Spinner } from "react-bootstrap";
import teacherService from "../../services/teacherService";

export default function TeacherUpdateSelf() {
  const [formData, setFormData] = useState({
    maritalStatus: "",
    emergencyContactInfo: "",
    bloodGroup: "",
    nationality: "",
    aadharNumber: "",
    experienceYears: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 🔹 Load current teacher profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await teacherService.getMyProfile();
        console.log("Profile API response:", res);

        const profile = res.data ? res.data : res;

        if (profile) {
          setFormData({
            maritalStatus: profile.maritalStatus
              ? profile.maritalStatus.toUpperCase()
              : "",
            emergencyContactInfo: profile.emergencyContactInfo || "",
            bloodGroup: profile.bloodGroup || "",
            nationality: profile.nationality || "",
            aadharNumber: profile.aadharNumber || "",
            experienceYears: profile.experienceYears || "",
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setMessage({ type: "danger", text: "Failed to load profile." });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await teacherService.updateMyProfile(formData);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage({ type: "danger", text: "Update failed. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="info" />
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <Card className="shadow-lg border-0 rounded-4 mt-4">
      <Card.Header
        className="text-center text-white fw-bold"
        style={{ background: "linear-gradient(90deg, #4facfe, #00f2fe)" }}
      >
        ✨ Update My Profile
      </Card.Header>
      <Card.Body className="p-4">
        {message.text && (
          <Alert variant={message.type} className="text-center">
            {message.text}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Marital Status</Form.Label>
                <Form.Select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="SINGLE">Single</option>
                  <option value="MARRIED">Married</option>
                  <option value="DIVORCED">Divorced</option>
                  <option value="WIDOWED">Widowed</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Blood Group</Form.Label>
                <Form.Select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                    (bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    )
                  )}
                </Form.Select>
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
                  placeholder="Enter nationality"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Emergency Contact Info</Form.Label>
                <Form.Control
                  type="text"
                  name="emergencyContactInfo"
                  value={formData.emergencyContactInfo}
                  onChange={handleChange}
                  placeholder="Enter emergency contact"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Aadhar Number</Form.Label>
                <Form.Control
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  maxLength={12}
                  pattern="\d{12}"
                  placeholder="Enter 12-digit Aadhar"
                />
                <Form.Text className="text-muted">
                  Must be a 12-digit number
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Experience (Years)</Form.Label>
                <Form.Control
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  min={0}
                  placeholder="Enter years of experience"
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="text-center mt-4">
            <Button
              type="button"
              className="px-5 py-2 rounded-pill shadow fw-bold"
              style={{
                background: "linear-gradient(90deg, #ff758c, #ff7eb3)",
                border: "none",
                color: "white",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(255, 126, 179, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
              }}
              onClick={() => window.history.back()}
            >
              ❌ Cancel
            </Button>
            <Button
              variant="success"
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-pill shadow"
              style={{
                background: "linear-gradient(90deg, #43e97b, #38f9d7)",
                border: "none",
              }}
            >
              {saving ? (
                <>
                  <Spinner animation="border" size="sm" /> Saving...
                </>
              ) : (
                "💾 Save Changes"
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
