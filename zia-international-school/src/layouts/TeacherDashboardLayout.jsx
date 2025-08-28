import React, { useState, useEffect } from "react";
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
  BsBoxArrowRight,
  BsHouse,
  BsClipboardCheck,
  BsMegaphone,
  BsCalendar2Check,
  BsPerson,
  BsCheckSquare,
  BsBook,
} from "react-icons/bs";

const TeacherDashboardLayout = () => {
  const { showModal, handleModalClose } = useAutoLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("username") || "Teacher";
  const role = localStorage.getItem("role") || "TEACHER";

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const isDashboardHome =
    location.pathname === "/teacher/dashboard" ||
    location.pathname === "/teacher/dashboard/";

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getLinkClasses = (isActive) =>
    `mb-2 d-flex align-items-center px-2 py-1 rounded ${
      isActive ? "fw-bold text-white bg-success" : "text-dark"
    }`;

  const getLinkStyle = (isActive) =>
    isActive
      ? {}
      : {
          backgroundColor: "#eefbf1", // ✨ soft green for teacher
        };

  // 🔹 State for collapsible My Leaves menu
  const [openLeaves, setOpenLeaves] = useState(false);
  const [openAssignments, setOpenAssignments] = useState(false);

  // Auto-expand if any child is active
  useEffect(() => {
    if (location.pathname.includes("/leaves")) {
      setOpenLeaves(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.includes("/assignments")) {
      setOpenAssignments(true);
    }
  }, [location.pathname]);

  // Inside TeacherDashboardLayout, before return
  const teacherMessages = [
    "Let’s inspire your students 🚀",
    "Time to spark curiosity and learning ✨",
    "Another day to make a difference 🌟",
    "Teach, guide, and empower your students 💡",
    "Your dedication shapes the future 👏",
    "Engage minds and ignite creativity 🎨",
    "Every lesson is a step towards success 🏆",
    "Learning today, leading tomorrow 🚀",
  ];

  // Get a consistent message based on current date
  const todayString = new Date().toISOString().slice(0, 10);
  const hashCode = todayString
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const randomTeacherMessage =
    teacherMessages[hashCode % teacherMessages.length];

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <SessionExpiredModal show={showModal} onClose={handleModalClose} />

      {/* 🔹 Top Navbar */}
      <Navbar
        bg="success"
        variant="dark"
        expand="lg"
        className="shadow-sm px-4 py-2"
        style={{
          background: "linear-gradient(90deg, #22c55e 0%, #15803d 100%)",
        }}
      >
        <Navbar.Brand
          className="fw-bold mx-auto text-white"
          style={{ fontSize: "1.5rem" }}
        >
          🚀 ZIS Teacher Dashboard
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
              id="teacher-dropdown"
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

      {/* 🔹 Layout */}
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
            <h5 className="text-success mb-4">Menu</h5>
            <Nav className="flex-column">
              <Nav.Link
                as={Link}
                to="/teacher/dashboard"
                className={getLinkClasses(
                  location.pathname === "/teacher/dashboard"
                )}
                style={getLinkStyle(location.pathname === "/teacher/dashboard")}
              >
                <BsHouse className="me-2" />
                Dashboard
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/teacher/dashboard/classes"
                className={getLinkClasses(
                  location.pathname.includes("/classes")
                )}
                style={getLinkStyle(location.pathname.includes("/classes"))}
              >
                <BsBook className="me-2 text-primary" />
                My Classes
              </Nav.Link>

              <div
                onClick={() => setOpenAssignments(!openAssignments)}
                className="d-flex align-items-center mb-2 ms-2 fw-bold text-warning"
                style={{ cursor: "pointer" }}
              >
                <BsClipboardCheck className="me-2" />
                Assignments
                <span className="ms-auto me-2">
                  {openAssignments ? "▾" : "▸"}
                </span>
              </div>

              {openAssignments && (
                <div className="ms-4">
                  <Nav.Link
                    as={Link}
                    to="/teacher/dashboard/assignments/create"
                    className={getLinkClasses(
                      location.pathname.includes("/assignments/create")
                    )}
                    style={getLinkStyle(
                      location.pathname.includes("/assignments/create")
                    )}
                  >
                    📝 Create Assignment
                  </Nav.Link>

                  <Nav.Link
                    as={Link}
                    to="/teacher/dashboard/assignments/manage"
                    className={getLinkClasses(
                      location.pathname.includes("/assignments/manage")
                    )}
                    style={getLinkStyle(
                      location.pathname.includes("/assignments/manage")
                    )}
                  >
                    📋 Manage Assignments
                  </Nav.Link>

                  <Nav.Link
                    as={Link}
                    to="/teacher/dashboard/assignments/submissions"
                    className={getLinkClasses(
                      location.pathname.includes("/assignments/submissions")
                    )}
                    style={getLinkStyle(
                      location.pathname.includes("/assignments/submissions")
                    )}
                  >
                    🏆 Submissions
                  </Nav.Link>
                </div>
              )}

              <Nav.Link
                as={Link}
                to="/teacher/dashboard/attendance"
                className={getLinkClasses(
                  location.pathname.includes("/attendance")
                )}
                style={getLinkStyle(location.pathname.includes("/attendance"))}
              >
                <BsCheckSquare className="me-2 text-info" />
                Attendance
              </Nav.Link>

              {/* 🔹 Collapsible My Leaves */}
              <div
                onClick={() => setOpenLeaves(!openLeaves)}
                className="d-flex align-items-center mb-2 ms-2 fw-bold text-primary"
                style={{ cursor: "pointer" }}
              >
                <BsCalendar2Check className="me-2" />
                My Leaves
                <span className="ms-auto me-2">{openLeaves ? "▾" : "▸"}</span>
              </div>

              {openLeaves && (
                <div className="ms-4">
                  <Nav.Link
                    as={Link}
                    to="/teacher/dashboard/leaves/entitlements"
                    className={getLinkClasses(
                      location.pathname.includes("/leaves/entitlements")
                    )}
                    style={getLinkStyle(
                      location.pathname.includes("/leaves/entitlements")
                    )}
                  >
                    📊 My Entitlements
                  </Nav.Link>

                  <Nav.Link
                    as={Link}
                    to="/teacher/dashboard/leaves/apply"
                    className={getLinkClasses(
                      location.pathname.includes("/leaves/apply")
                    )}
                    style={getLinkStyle(
                      location.pathname.includes("/leaves/apply")
                    )}
                  >
                    📝 Apply Leave
                  </Nav.Link>

                  <Nav.Link
                    as={Link}
                    to="/teacher/dashboard/leaves/requests"
                    className={getLinkClasses(
                      location.pathname.includes("/leaves/requests")
                    )}
                    style={getLinkStyle(
                      location.pathname.includes("/leaves/requests")
                    )}
                  >
                    📋 Leave Requests
                  </Nav.Link>
                </div>
              )}

              <Nav.Link
                as={Link}
                to="/teacher/dashboard/tasks"
                className={getLinkClasses(location.pathname.includes("/tasks"))}
                style={getLinkStyle(location.pathname.includes("/tasks"))}
              >
                <BsClipboardCheck className="me-2 text-success" />
                Tasks
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/teacher/dashboard/notices"
                className={getLinkClasses(
                  location.pathname.includes("/notices")
                )}
                style={getLinkStyle(location.pathname.includes("/notices"))}
              >
                <BsMegaphone className="me-2 text-danger" />
                Notices
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/teacher/dashboard/profile"
                className={getLinkClasses(
                  location.pathname.includes("/profile")
                )}
                style={getLinkStyle(location.pathname.includes("/profile"))}
              >
                <BsPerson className="me-2 text-secondary" />
                My Profile
              </Nav.Link>
            </Nav>
          </Col>

          {/* Main Content */}
          <Col
            md={10}
            className="p-4"
            style={{
              backgroundColor: "#f3fdf6",
              minHeight: "calc(100vh - 56px)",
            }}
          >
            {isDashboardHome && (
              <Card
                className="mb-4 shadow-sm border-0"
                style={{
                  background:
                    "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                  borderRadius: "1rem",
                }}
              >
                <Card.Body className="d-flex align-items-center">
                  <div
                    className="me-3"
                    style={{ fontSize: "2.5rem", color: "#16a34a" }}
                  >
                    👋
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1" style={{ color: "#14532d" }}>
                      Welcome back, {username}!
                    </h5>
                    <p
                      className="mb-0 text-muted"
                      style={{ fontSize: "0.95rem" }}
                    >
                      Today is <strong>{currentDate}</strong>.{" "}
                      {randomTeacherMessage}
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

export default TeacherDashboardLayout;
