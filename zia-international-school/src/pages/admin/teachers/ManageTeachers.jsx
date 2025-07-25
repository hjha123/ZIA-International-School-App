import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { FaSearch, FaEye, FaEdit, FaUserSlash } from "react-icons/fa";
import teacherService from "../../../services/teacherService";
import { useNavigate } from "react-router-dom";

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      const data = await teacherService.getAllTeachers();
      setTeachers(data);
      setLoading(false);
    };
    fetchTeachers();
  }, []);

  const filtered = teachers.filter((t) =>
    `${t.fullName} ${t.empId}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (empId) => {
    if (window.confirm("Are you sure you want to offboard this teacher?")) {
      await teacherService.deleteTeacherByEmpId(empId);
      setTeachers((prev) => prev.filter((t) => t.empId !== empId));
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
      <h3
        className="mb-4 text-white px-4 py-2 rounded shadow-sm"
        style={{ background: "linear-gradient(90deg, #4e54c8, #8f94fb)" }}
      >
        Manage Teachers
      </h3>

      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by name or employee ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table bordered hover responsive className="rounded shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Emp ID</th>
              <th>Name</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Joining Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((teacher, index) => (
              <tr key={teacher.empId} className={getRowClass(teacher.status)}>
                <td>{index + 1}</td>
                <td>{teacher.empId}</td>
                <td>{teacher.fullName}</td>
                <td>
                  {teacher.subjects && teacher.subjects.length > 0 ? (
                    teacher.subjects.map((subj, i) => (
                      <span
                        key={i}
                        className="badge rounded-pill bg-primary me-1"
                      >
                        {subj}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted">No subjects</span>
                  )}
                </td>

                <td>{teacher.status}</td>
                <td>{teacher.joiningDate}</td>
                <td>
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
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(teacher.empId)}
                  >
                    <FaUserSlash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ManageTeachers;
