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
  const [teachersExpanded, setTeachersExpanded] = React.useState(
    location.pathname.includes("/teachers")
  );

  const username = localStorage.getItem("username") || "Admin";
  const role = localStorage.getItem("role") || "ADMIN";

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const isDashboardHome =
    location.pathname === "/admin/dashboard" ||
    location.pathname === "/admin/dashboard/";

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getLinkClasses = (isActive) =>
    `mb-2 d-flex align-items-center px-2 py-1 rounded ${
      isActive ? "fw-bold text-white bg-primary" : "text-dark"
    }`;

  const getLinkStyle = (isActive) =>
    isActive
      ? {}
      : {
          backgroundColor: "#eef4fb", // ✨ light blue-gray background for non-active links
        };

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
          style={{ fontSize: "1.5rem" }}
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
                className={getLinkClasses(
                  location.pathname === "/admin/dashboard"
                )}
                style={getLinkStyle(location.pathname === "/admin/dashboard")}
              >
                <BsHouse className="me-2" />
                Dashboard
              </Nav.Link>

              {/* Teachers Section */}
              <Nav className="flex-column mb-2">
                <Nav.Item>
                  <Nav.Link
                    className={getLinkClasses(
                      location.pathname.includes("/teachers")
                    )}
                    style={getLinkStyle(
                      location.pathname.includes("/teachers")
                    )}
                    onClick={() => setTeachersExpanded(!teachersExpanded)}
                    aria-controls="teachers-submenu"
                    aria-expanded={teachersExpanded}
                  >
                    <BsPersonBadge className="me-2 text-primary" />
                    Teachers
                  </Nav.Link>
                </Nav.Item>

                {teachersExpanded && (
                  <div
                    id="teachers-submenu"
                    className="ms-3 mt-2 py-2 px-2 rounded bg-light border"
                    style={{ fontSize: "0.92rem" }}
                  >
                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/teachers"
                      className={getLinkClasses(
                        location.pathname === "/admin/dashboard/teachers"
                      )}
                      style={getLinkStyle(
                        location.pathname === "/admin/dashboard/teachers"
                      )}
                    >
                      <BsClipboardCheck className="me-2" />
                      Manage Teachers
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/teachers/create"
                      className={getLinkClasses(
                        location.pathname.includes("/teachers/create")
                      )}
                      style={getLinkStyle(
                        location.pathname.includes("/teachers/create")
                      )}
                    >
                      <BsPersonBadge className="me-2" />
                      Onboard Teacher
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/teachers/select"
                      className={getLinkClasses(
                        location.pathname.includes("/teachers/select") ||
                          location.pathname.includes("/teachers/update")
                      )}
                      style={getLinkStyle(
                        location.pathname.includes("/teachers/select") ||
                          location.pathname.includes("/teachers/update")
                      )}
                    >
                      <BsPeople className="me-2" />
                      Update Teacher
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/teachers/list"
                      className={getLinkClasses(
                        location.pathname.includes("/teachers/list") ||
                          location.pathname.includes("/teachers/profile")
                      )}
                      style={getLinkStyle(
                        location.pathname.includes("/teachers/profile")
                      )}
                    >
                      <BsPersonBadge className="me-2" />
                      View Profile
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/teachers/offboard"
                      className={getLinkClasses(
                        location.pathname.includes("/teachers/offboard")
                      )}
                      style={getLinkStyle(
                        location.pathname.includes("/teachers/offboard")
                      )}
                    >
                      <BsBoxArrowRight className="me-2" />
                      Offboard Teacher
                    </Nav.Link>
                  </div>
                )}
              </Nav>

              <Nav.Link
                as={Link}
                to="/admin/dashboard/students"
                className={getLinkClasses(
                  location.pathname.includes("students")
                )}
                style={getLinkStyle(location.pathname.includes("students"))}
              >
                <BsPeople className="me-2" />
                Students
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/admin/dashboard/classes"
                className={getLinkClasses(
                  location.pathname.includes("classes")
                )}
                style={getLinkStyle(location.pathname.includes("classes"))}
              >
                <BsBuilding className="me-2" />
                Classes
              </Nav.Link>

              {/* Leaves Section */}
              <Nav className="flex-column mb-2">
                <Nav.Item>
                  <Nav.Link
                    className={getLinkClasses(
                      location.pathname.includes("/leaves")
                    )}
                    style={getLinkStyle(location.pathname.includes("/leaves"))}
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
                      className={getLinkClasses(
                        location.pathname === "/admin/dashboard/leaves"
                      )}
                      style={getLinkStyle(
                        location.pathname === "/admin/dashboard/leaves"
                      )}
                    >
                      <BsClipboardCheck className="me-2" />
                      Approve Requests
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/leaves/bulk-allocation"
                      className={getLinkClasses(
                        location.pathname.includes("/leaves/bulk-allocation")
                      )}
                      style={getLinkStyle(
                        location.pathname.includes("/leaves/bulk-allocation")
                      )}
                    >
                      <BsPeople className="me-2" />
                      Bulk Allocation
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/leaves/allocate"
                      className={getLinkClasses(
                        location.pathname.includes("/leaves/allocate")
                      )}
                      style={getLinkStyle(
                        location.pathname.includes("/leaves/allocate")
                      )}
                    >
                      <BsPersonBadge className="me-2" />
                      Allocate to Employee
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/leaves/types"
                      className={getLinkClasses(
                        location.pathname.includes("/leaves/types")
                      )}
                      style={getLinkStyle(
                        location.pathname.includes("/leaves/types")
                      )}
                    >
                      <BsClipboardCheck className="me-2" />
                      Leave Types
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/leaves/history"
                      className={getLinkClasses(
                        location.pathname.includes("/leaves/history")
                      )}
                      style={getLinkStyle(
                        location.pathname.includes("/leaves/history")
                      )}
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
                className={getLinkClasses(location.pathname.includes("tasks"))}
                style={getLinkStyle(location.pathname.includes("tasks"))}
              >
                <BsClipboardCheck className="me-2 text-warning" />
                Tasks
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/admin/dashboard/notices"
                className={getLinkClasses(
                  location.pathname.includes("notices")
                )}
                style={getLinkStyle(location.pathname.includes("notices"))}
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
