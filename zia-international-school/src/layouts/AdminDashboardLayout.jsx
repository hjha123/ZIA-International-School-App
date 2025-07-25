import React from "react";
import useAutoLogout from "../hooks/useAutoLogout";
import SessionExpiredModal from "../components/SessionExpiredModal";
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
  BsClipboardCheck,
  BsCalendar2Check,
  BsMegaphone,
  BsHouse,
  BsClockHistory,
} from "react-icons/bs";

const AdminDashboardLayout = () => {
  const { showModal, handleModalClose } = useAutoLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const [leavesExpanded, setLeavesExpanded] = React.useState(
    location.pathname.includes("/leaves")
  );

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
      <SessionExpiredModal show={showModal} onClose={handleModalClose} />
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
        <Navbar.Brand
          className="fw-bold mx-auto text-white"
          style={{
            fontSize: "1.5rem",
            textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            letterSpacing: "0.5px",
          }}
        >
          🚀 ZIS Admin Dashboard
        </Navbar.Brand>

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
                to="/admin/dashboard"
                className={`mb-2 d-flex align-items-center ${
                  location.pathname === "/admin/dashboard"
                    ? "fw-bold text-primary bg-light border rounded px-2 py-1"
                    : "text-dark"
                }`}
              >
                <BsHouse className="me-2" />
                Dashboard
              </Nav.Link>

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

              <Nav className="flex-column mb-2">
                <Nav.Item>
                  <Nav.Link
                    className={`d-flex align-items-center ${
                      location.pathname.includes("/leaves")
                        ? "fw-bold text-primary bg-light border rounded px-2 py-1"
                        : "text-dark"
                    }`}
                    onClick={() => setLeavesExpanded(!leavesExpanded)}
                    aria-controls="leaves-submenu"
                    aria-expanded={leavesExpanded}
                  >
                    <BsCalendar2Check className="me-2 text-success" />
                    Leaves
                  </Nav.Link>
                </Nav.Item>

                {leavesExpanded && (
                  <div
                    id="leaves-submenu"
                    className="ms-3 mt-2 py-2 px-2 rounded bg-light border"
                    style={{ fontSize: "0.92rem" }}
                  >
                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/leaves"
                      className={`d-flex align-items-center mb-2 ${
                        location.pathname === "/admin/dashboard/leaves"
                          ? "fw-semibold text-primary"
                          : "text-dark"
                      }`}
                    >
                      <BsClipboardCheck className="me-2" />
                      Approve Requests
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/leaves/bulk-allocation"
                      className={`d-flex align-items-center mb-2 ${
                        location.pathname.includes("/leaves/bulk-allocation")
                          ? "fw-semibold text-primary"
                          : "text-dark"
                      }`}
                    >
                      <BsPeople className="me-2" />
                      Bulk Allocation
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/leaves/allocate"
                      className={`d-flex align-items-center mb-2 ${
                        location.pathname.includes("/leaves/allocate")
                          ? "fw-semibold text-primary"
                          : "text-dark"
                      }`}
                    >
                      <BsPersonBadge className="me-2" />
                      Allocate to Employee
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/leaves/types"
                      className={`d-flex align-items-center mb-2 ${
                        location.pathname.includes("/leaves/types")
                          ? "fw-semibold text-primary"
                          : "text-dark"
                      }`}
                    >
                      <BsClipboardCheck className="me-2" />
                      Leave Types
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/leaves/history"
                      className={`d-flex align-items-center mb-2 ${
                        location.pathname.includes("/leaves/history")
                          ? "fw-semibold text-primary"
                          : "text-dark"
                      }`}
                    >
                      <BsClockHistory className="me-2" />
                      Leave History
                    </Nav.Link>
                  </div>
                )}
              </Nav>

              <Nav.Link
                as={Link}
                to="/admin/dashboard/tasks"
                className={`mb-2 d-flex align-items-center ${
                  location.pathname.includes("tasks")
                    ? "fw-bold text-primary bg-light border rounded px-2 py-1"
                    : "text-dark"
                }`}
              >
                <BsClipboardCheck className="me-2 text-warning" />
                Tasks
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/admin/dashboard/notices"
                className={`mb-2 d-flex align-items-center ${
                  location.pathname.includes("notices")
                    ? "fw-bold text-primary bg-light border rounded px-2 py-1"
                    : "text-dark"
                }`}
              >
                <BsMegaphone className="me-2 text-danger" />
                Notices
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
                style={{
                  background:
                    "linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)",
                  borderRadius: "1rem",
                }}
              >
                <Card.Body className="d-flex align-items-center">
                  <div
                    className="me-3"
                    style={{ fontSize: "2.5rem", color: "#2563eb" }}
                  >
                    👋
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1" style={{ color: "#1e3a8a" }}>
                      Welcome back, {username}!
                    </h5>
                    <p
                      className="mb-0 text-muted"
                      style={{ fontSize: "0.95rem" }}
                    >
                      Today is <strong>{currentDate}</strong>. Let’s make it
                      productive 🚀
                    </p>
                  </div>
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
