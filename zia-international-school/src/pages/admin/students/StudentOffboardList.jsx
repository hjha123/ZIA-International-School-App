import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Spinner,
  Badge,
  Container,
  Card,
  Modal,
  Alert,
} from "react-bootstrap";
import studentService from "../../../services/studentService";

const StudentOffboardList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offboardingStudent, setOffboardingStudent] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await studentService.getAllStudents();
      setStudents(data || []);
    } catch (err) {
      console.error("Error fetching students:", err);
      setAlert({
        show: true,
        message: "Failed to load students.",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOffboardClick = (student) => {
    setOffboardingStudent(student);
    setShowConfirmModal(true);
  };

  const confirmOffboard = async () => {
    try {
      setLoading(true);
      await studentService.offboardStudent(offboardingStudent.studentId);
      setAlert({
        show: true,
        message: `${offboardingStudent.firstName} ${offboardingStudent.lastName} has been offboarded successfully.`,
        variant: "success",
      });
      setShowConfirmModal(false);
      fetchStudents();
    } catch (err) {
      console.error("Error offboarding student:", err);
      setAlert({
        show: true,
        message: "Failed to offboard student. Please try again.",
        variant: "danger",
      });
      setShowConfirmModal(false);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <div className="mt-2">Loading Students...</div>
      </div>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow-lg rounded-4 border-0">
        <Card.Header
          className="text-white"
          style={{
            background: "linear-gradient(90deg, #ff416c, #ff4b2b)",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
          }}
        >
          <h5 className="mb-0">Offboard Students</h5>
        </Card.Header>

        <Card.Body>
          {alert.show && (
            <Alert
              variant={alert.variant}
              onClose={() => setAlert({ show: false })}
              dismissible
            >
              {alert.message}
            </Alert>
          )}

          {students.length === 0 ? (
            <p className="text-center text-muted">No students found.</p>
          ) : (
            <Table responsive hover className="align-middle text-center mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Grade</th>
                  <th>Section</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={student.studentId}>
                    <td>{idx + 1}</td>
                    <td>
                      {student.firstName} {student.lastName}
                    </td>
                    <td>{student.gradeName || "-"}</td>
                    <td>{student.sectionName || "-"}</td>
                    <td>
                      <Badge bg={getStatusVariant(student.status)}>
                        {student.status}
                      </Badge>
                    </td>
                    <td>
                      {student.status === "ACTIVE" ? (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleOffboardClick(student)}
                        >
                          Offboard
                        </Button>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Offboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to offboard{" "}
          <strong>
            {offboardingStudent?.firstName} {offboardingStudent?.lastName}
          </strong>
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmOffboard}>
            Offboard
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StudentOffboardList;
