import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Row, Col, NavDropdown } from "react-bootstrap";
import {
  BsPersonBadge,
  BsPeople,
  BsBuilding,
  BsBoxArrowRight,
} from "react-icons/bs";

const AdminDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const pageTitles = {
    teachers: "Manage Teachers",
    students: "Manage Students",
    classes: "Manage Classes",
  };

  const currentPage = location.pathname.split("/").pop();

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Top Navbar */}
      <Navbar
        bg="primary"
        variant="dark"
        expand="lg"
        className="shadow-sm px-4 py-2"
        style={{
          background: "linear-gradient(90deg, #007bff 0%, #0056b3 100%)",
        }}
      >
        <Navbar.Brand className="fw-bold">ZIA Admin Dashboard</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            {/* Optional future profile dropdown */}
            {/* 
            <NavDropdown title="Admin" id="admin-dropdown" align="end">
              <NavDropdown.Item onClick={handleLogout}>
                <BsBoxArrowRight className="me-2" /> Logout
              </NavDropdown.Item>
            </NavDropdown> 
            */}
            <Nav.Link onClick={handleLogout} className="text-white fw-semibold">
              <BsBoxArrowRight className="me-1" />
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Layout */}
      <Container fluid className="flex-grow-1 px-0">
        <Row className="gx-0">
          {/* Sidebar */}
          <Col
            md={2}
            className="bg-white border-end shadow-sm pt-4 px-3"
            style={{
              minHeight: "calc(100vh - 56px)",
              position: "sticky",
              top: "56px",
            }}
          >
            <h5 className="text-primary mb-4">Menu</h5>
            <Nav className="flex-column">
              <Nav.Link
                as={Link}
                to="/admin/dashboard/teachers"
                className={`mb-2 d-flex align-items-center ${
                  location.pathname.includes("teachers")
                    ? "fw-bold text-primary bg-light border rounded px-2 py-1"
                    : "text-dark"
                }`}
              >
                <BsPersonBadge className="me-2" />
                Teachers
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/admin/dashboard/students"
                className={`mb-2 d-flex align-items-center ${
                  location.pathname.includes("students")
                    ? "fw-bold text-primary bg-light border rounded px-2 py-1"
                    : "text-dark"
                }`}
              >
                <BsPeople className="me-2" />
                Students
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/admin/dashboard/classes"
                className={`mb-2 d-flex align-items-center ${
                  location.pathname.includes("classes")
                    ? "fw-bold text-primary bg-light border rounded px-2 py-1"
                    : "text-dark"
                }`}
              >
                <BsBuilding className="me-2" />
                Classes
              </Nav.Link>
            </Nav>
          </Col>

          {/* Main Content */}
          <Col
            md={10}
            className="p-4"
            style={{
              backgroundColor: "#f3f6fc",
              minHeight: "calc(100vh - 56px)",
            }}
          >
            <div className="mb-4">
              <h4 className="fw-bold text-secondary">
                {pageTitles[currentPage] || "Dashboard"}
              </h4>
              <hr />
            </div>
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboardLayout;
