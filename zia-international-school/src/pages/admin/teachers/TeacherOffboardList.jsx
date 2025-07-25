import React, { useEffect, useState } from "react";
import { Table, Button, Form, Row, Col, Spinner, Modal } from "react-bootstrap";
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
    <div className="container-fluid">
      <div className="mb-4 px-2">
        <h3
          className="text-white px-4 py-2 rounded shadow-sm"
          style={{
            background: "linear-gradient(90deg, #c0392b, #e74c3c)", // industry-style soft red
            width: "100%",
            fontSize: "20px",
          }}
        >
          <FaUserSlash className="me-2" /> Offboard a Teacher
        </h3>
      </div>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search by Emp ID or Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
          <div>Loading Teachers...</div>
        </div>
      ) : (
        <Table bordered hover responsive className="bg-white">
          <thead className="table-light">
            <tr>
              <th>Emp ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentTeachers.map((t) => (
              <tr
                key={t.empId}
                className={t.status === "OFFBOARDED" ? "table-secondary" : ""}
              >
                <td>{t.empId}</td>
                <td>{t.fullName}</td>
                <td>{t.email}</td>
                <td>{t.status}</td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleOffboardClick(t)}
                    disabled={t.status === "OFFBOARDED"}
                  >
                    Offboard
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {totalPages > 1 && (
        <div className="d-flex justify-content-end">
          <div className="mt-2">
            <strong>
              Page {currentPage} of {totalPages}
            </strong>
            <div>
              <Button
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="me-2"
              >
                Previous
              </Button>
              <Button
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
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
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmOffboard}>
            Confirm Offboard
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
