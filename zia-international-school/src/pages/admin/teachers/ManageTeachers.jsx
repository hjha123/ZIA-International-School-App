import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  Spinner,
  Modal,
  OverlayTrigger,
  Tooltip,
  Pagination,
} from "react-bootstrap";
import {
  FaSearch,
  FaEye,
  FaEdit,
  FaUserSlash,
  FaChalkboardTeacher,
} from "react-icons/fa";
import teacherService from "../../../services/teacherService";
import { useNavigate } from "react-router-dom";

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 10;

  const navigate = useNavigate();

  // Fetch teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const data = await teacherService.getAllTeachers();
        setTeachers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  // Reset page when searchTerm changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter by name, empId, or subject
  const filtered = teachers.filter((t) => {
    const search = searchTerm.toLowerCase();
    const subjects = t.subjects ? t.subjects.join(" ").toLowerCase() : "";
    return (
      `${t.fullName} ${t.empId}`.toLowerCase().includes(search) ||
      subjects.includes(search)
    );
  });

  // Pagination logic
  const indexOfLast = currentPage * teachersPerPage;
  const indexOfFirst = indexOfLast - teachersPerPage;
  const currentTeachers = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / teachersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = (teacher) => {
    setSelectedTeacher(teacher);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (selectedTeacher) {
      await teacherService.deleteTeacherByEmpId(selectedTeacher.empId);
      setTeachers((prev) =>
        prev.filter((t) => t.empId !== selectedTeacher.empId)
      );
      setShowModal(false);
      setSelectedTeacher(null);
    }
  };

  const getRowClass = (status) => {
    if (status === "ACTIVE") return "table-success";
    if (status === "ON_LEAVE") return "table-warning";
    if (status === "INACTIVE") return "table-secondary";
    return "";
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <h3
        className="mb-4 text-white px-4 py-2 rounded shadow-sm d-flex align-items-center justify-content-between"
        style={{ background: "linear-gradient(90deg, #ff7e5f, #feb47b)" }}
      >
        <span className="d-flex align-items-center">
          <FaChalkboardTeacher className="me-2" size={24} />
          Manage Teachers
        </span>
      </h3>

      {/* Search */}
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text style={{ backgroundColor: "#ffe0b2" }}>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by name, employee ID, or subject"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="shadow-sm"
            />
          </InputGroup>
        </Col>
      </Row>

      {/* Table */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table
          bordered
          hover
          responsive
          className="rounded shadow-sm"
          style={{ backgroundColor: "#f9f9f9" }}
        >
          <thead
            style={{
              background: "linear-gradient(90deg, #6a11cb, #2575fc)",
              color: "#fff",
            }}
          >
            <tr>
              <th>Emp ID</th>
              <th>Name</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Joining Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTeachers.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted">
                  No teachers found.
                </td>
              </tr>
            )}
            {currentTeachers.map((teacher) => (
              <tr key={teacher.empId} className={getRowClass(teacher.status)}>
                <td>{teacher.empId}</td>
                <td>{teacher.fullName}</td>
                <td>
                  {teacher.subjects && teacher.subjects.length > 0 ? (
                    teacher.subjects.map((subj, i) => (
                      <span
                        key={i}
                        className="badge rounded-pill bg-info text-dark me-1"
                      >
                        {subj}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted">No subjects</span>
                  )}
                </td>
                <td>
                  <span
                    className={`badge ${
                      teacher.status === "ACTIVE"
                        ? "bg-success"
                        : teacher.status === "ON_LEAVE"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    }`}
                  >
                    {teacher.status}
                  </span>
                </td>
                <td>{teacher.joiningDate}</td>
                <td>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>View Teacher Details</Tooltip>}
                  >
                    <Button
                      size="sm"
                      variant="info"
                      className="me-2"
                      onClick={() =>
                        navigate(`/admin/dashboard/teachers/${teacher.empId}`)
                      }
                    >
                      <FaEye />
                    </Button>
                  </OverlayTrigger>

                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Edit Teacher</Tooltip>}
                  >
                    <Button
                      size="sm"
                      variant="warning"
                      className="me-2"
                      onClick={() =>
                        navigate(
                          `/admin/dashboard/teachers/update/${teacher.empId}`
                        )
                      }
                    >
                      <FaEdit />
                    </Button>
                  </OverlayTrigger>

                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Offboard Teacher</Tooltip>}
                  >
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(teacher)}
                    >
                      <FaUserSlash />
                    </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-3">
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      {/* Offboard Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirm Offboarding</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTeacher && (
            <div className="text-danger">
              <strong>You're about to offboard the following teacher:</strong>
              <br />
              Name: <strong>{selectedTeacher.fullName}</strong>
              <br />
              Emp ID: <strong>{selectedTeacher.empId}</strong>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Offboard
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageTeachers;
