import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  Spinner,
  Modal,
  Card,
} from "react-bootstrap";
import { FaUserSlash } from "react-icons/fa";
import teacherService from "../../../services/teacherService";

export default function TeacherOffboardList() {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [remarks, setRemarks] = useState("");

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await teacherService.getAllTeachers();
        setTeachers(data);
        setFilteredTeachers(data);
      } catch (err) {
        console.error("Error fetching teachers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = teachers.filter(
      (t) =>
        t.empId.toLowerCase().includes(term) ||
        t.fullName.toLowerCase().includes(term)
    );
    setFilteredTeachers(filtered);
    setCurrentPage(1);
  }, [searchTerm, teachers]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const handleOffboardClick = (teacher) => {
    setSelectedTeacher(teacher);
    setShowModal(true);
  };

  const handleConfirmOffboard = async () => {
    try {
      await teacherService.deleteTeacherByEmpId(selectedTeacher.empId);
      setTeachers((prev) =>
        prev.map((t) =>
          t.empId === selectedTeacher.empId ? { ...t, status: "OFFBOARDED" } : t
        )
      );
      setShowModal(false);
      setRemarks("");
    } catch (err) {
      console.error("Error offboarding teacher:", err);
    }
  };

  return (
    <div
      className="container-fluid py-4"
      style={{ background: "#f0f4f8", minHeight: "100vh" }}
    >
      <Card className="shadow-sm mb-4">
        <Card.Body
          className="d-flex align-items-center"
          style={{
            background: "linear-gradient(90deg, #ff758c, #ff7eb3)",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          <FaUserSlash size={24} className="me-2" />{" "}
          <span style={{ fontSize: "1.2rem" }}>Offboard a Teacher</span>
        </Card.Body>
      </Card>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search by Emp ID or Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              borderRadius: "25px",
              padding: "10px 20px",
              border: "2px solid #ff7eb3",
            }}
          />
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <div className="mt-2 fw-bold">Loading Teachers...</div>
        </div>
      ) : (
        <Card className="shadow-sm mb-4">
          <Table
            bordered
            hover
            responsive
            className="mb-0"
            style={{
              background: "#fff",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <thead
              style={{
                background: "linear-gradient(90deg, #6a11cb, #2575fc)",
                color: "#fff",
              }}
            >
              <tr>
                <th>Emp ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentTeachers.map((t) => (
                <tr key={t.empId}>
                  <td>{t.empId}</td>
                  <td>{t.fullName}</td>
                  <td>{t.email}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleOffboardClick(t)}
                      disabled={t.status === "OFFBOARDED"}
                      style={{ fontWeight: 600, borderRadius: "25px" }}
                    >
                      Offboard
                    </Button>
                  </td>
                </tr>
              ))}
              {currentTeachers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-3">
                    No teachers found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="d-flex justify-content-end align-items-center mb-4">
          <div className="me-3 fw-bold">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="me-2"
            style={{ borderRadius: "20px" }}
          >
            Previous
          </Button>
          <Button
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            style={{ borderRadius: "20px" }}
          >
            Next
          </Button>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header
          closeButton
          style={{ background: "#ff7eb3", color: "#fff" }}
        >
          <Modal.Title>Confirm Offboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to offboard{" "}
            <strong>{selectedTeacher?.fullName}</strong>?
          </p>
          <Form.Group className="mb-3">
            <Form.Label>Remarks (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks..."
              style={{ borderRadius: "10px" }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            style={{ borderRadius: "20px" }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmOffboard}
            style={{ borderRadius: "20px" }}
          >
            Confirm Offboard
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
