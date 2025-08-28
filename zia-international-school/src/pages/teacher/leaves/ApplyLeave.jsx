import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane, FaTimesCircle } from "react-icons/fa";
import leaveService from "../../../services/leaveService";
import teacherService from "../../../services/teacherService";

const ApplyLeave = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    empId: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Employee ID & Name from backend
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await teacherService.getMyEmpIdAndName();
        if (response && response.employeeId) {
          setFormData((prev) => ({
            ...prev,
            empId: response.employeeId,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch employee details", err);
      }
    };
    fetchEmployeeDetails();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.empId) newErrors.empId = "Employee ID is required";
    if (!formData.leaveType) newErrors.leaveType = "Leave type is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    else if (formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = "End date must be after start date";
    }
    if (!formData.reason.trim()) newErrors.reason = "Reason is required";
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMsg("");

    try {
      const response = await leaveService.applyLeave(formData, {
        headers: { "Content-Type": "application/json" },
      });
      setSuccessMsg("Leave applied successfully ✅");
      setTimeout(() => navigate("/teacher/dashboard/leaves/requests"), 1500);
    } catch (err) {
      console.error(err);

      // Check for insufficient leave balance error from backend
      if (
        err.response?.data?.message &&
        err.response.data.message.includes("Insufficient leave balance")
      ) {
        setErrors({ api: err.response.data.message });
      } else {
        setErrors({ api: "Failed to apply leave. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-lg border-0 rounded-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0">📝 Apply for Leave</h3>
          </div>

          {successMsg && <Alert variant="success">{successMsg}</Alert>}
          {errors.api && <Alert variant="danger">{errors.api}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Employee ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="empId"
                    value={formData.empId}
                    readOnly
                  />
                  {errors.empId && (
                    <Form.Text className="text-danger">
                      {errors.empId}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Leave Type</Form.Label>
                  <Form.Select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Leave Type --</option>
                    <option value="CASUAL">Casual Leave</option>
                    <option value="SICK">Sick Leave</option>
                    <option value="EARNED">Earned Leave</option>
                    <option value="UNPAID">Unpaid Leave</option>
                    <option value="EMERGENCY">Emergency Leave</option>
                  </Form.Select>
                  {errors.leaveType && (
                    <Form.Text className="text-danger">
                      {errors.leaveType}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                  {errors.startDate && (
                    <Form.Text className="text-danger">
                      {errors.startDate}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                  {errors.endDate && (
                    <Form.Text className="text-danger">
                      {errors.endDate}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Provide reason for leave"
              />
              {errors.reason && (
                <Form.Text className="text-danger">{errors.reason}</Form.Text>
              )}
            </Form.Group>

            <div className="text-end">
              <Button
                type="submit"
                variant="success"
                disabled={loading}
                className="px-4 me-2 d-inline-flex align-items-center"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="me-2" /> Apply
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline-danger"
                className="px-4 d-inline-flex align-items-center"
                onClick={() => navigate("/teacher/dashboard")}
              >
                <FaTimesCircle className="me-2" /> Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ApplyLeave;
