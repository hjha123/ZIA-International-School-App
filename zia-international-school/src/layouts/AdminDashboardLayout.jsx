import React from "react";
import useAutoLogout from "../hooks/useAutoLogout";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  NavDropdown,
  Card,
} from "react-bootstrap";
import {
  BsPersonBadge,
  BsPeople,
  BsBuilding,
  BsBoxArrowRight,
} from "react-icons/bs";

const AdminDashboardLayout = () => {
  useAutoLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("username") || "Admin";
  const role = localStorage.getItem("role") || "ADMIN";

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const pageTitles = {
    teachers: "Manage Teachers",
    students: "Manage Students",
    classes: "Manage Classes",
  };

  const currentPage = location.pathname.split("/").pop();

  const isDashboardHome =
    location.pathname === "/admin/dashboard" ||
    location.pathname === "/admin/dashboard/";

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
        <Navbar.Brand className="fw-bold">ZIS Admin Dashboard</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <NavDropdown
              title={
                <span>
                  {username}{" "}
                  <small style={{ color: "#e0e0e0", fontSize: "0.8rem" }}>
                    ({role})
                  </small>
                </span>
              }
              id="admin-dropdown"
              align="end"
              className="fw-semibold text-white"
            >
              <NavDropdown.Item onClick={handleLogout}>
                <BsBoxArrowRight className="me-2" />
                Logout
              </NavDropdown.Item>
            </NavDropdown>
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
            {/* Welcome Card on Dashboard Home */}
            {isDashboardHome && (
              <Card
                className="mb-4 shadow-sm border-0"
                style={{ backgroundColor: "#e9f2ff" }}
              >
                <Card.Body>
                  <h5 className="mb-1 fw-bold">Welcome back, {username}!</h5>
                  <p className="mb-0 text-muted">Today is {currentDate}</p>
                </Card.Body>
              </Card>
            )}

            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboardLayout;
