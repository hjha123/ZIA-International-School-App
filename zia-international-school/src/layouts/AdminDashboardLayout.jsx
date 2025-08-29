import React, { useEffect } from "react";
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
  BsFileText,
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
  const [studentsExpanded, setStudentsExpanded] = React.useState(
    location.pathname.includes("/students")
  );
  const [assignmentsExpanded, setAssignmentsExpanded] = React.useState(
    location.pathname.includes("/assignments")
  );
  const [gradesSectionsExpanded, setGradesSectionsExpanded] = React.useState(
    location.pathname.includes("/grades") ||
      location.pathname.includes("/sections") ||
      location.pathname.includes("/subjects")
  );

  // ✅ Minimal change: expand sidebar when coming from AdminHome "Go" buttons
  useEffect(() => {
    const expandKey = localStorage.getItem("expandSidebar");
    if (expandKey) {
      switch (expandKey) {
        case "teachers":
          setTeachersExpanded(true);
          break;
        case "students":
          setStudentsExpanded(true);
          break;
        case "leaves":
          setLeavesExpanded(true);
          break;
        case "assignments":
          setAssignmentsExpanded(true);
          break;
        case "gradesSections":
          setGradesSectionsExpanded(true);
          break;
        default:
          break;
      }
      localStorage.removeItem("expandSidebar");
    }
  }, [location.pathname]);

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
          backgroundColor: "#eef4fb",
        };

  const welcomeMessages = [
    "Let's make it productive 🚀",
    "Time to conquer your tasks today 💪",
    "Another day, another opportunity to excel 🌟",
    "Lead the way and inspire your team ✨",
    "Your leadership makes a difference 👏",
    "Keep pushing forward and achieve greatness 🏆",
    "Success is a journey, not a destination 🚀",
    "Let's make amazing things happen today 🔥",
  ];

  const randomMessage =
    welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

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
                      to="/admin/dashboard/teachers/profile"
                      className={getLinkClasses(
                        location.pathname.includes("/teachers/profile")
                      )}
                      style={getLinkStyle(
                        location.pathname.includes("/teachers/profile")
                      )}
                    >
                      <BsPersonBadge className="me-2" />
                      Teacher Directory
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

              {/* Students Section */}
              <Nav className="flex-column mb-2">
                <Nav.Item>
                  <Nav.Link
                    className={getLinkClasses(
                      location.pathname.includes("/students")
                    )}
                    style={getLinkStyle(
                      location.pathname.includes("/students")
                    )}
                    onClick={() => setStudentsExpanded(!studentsExpanded)}
                    aria-controls="students-submenu"
                    aria-expanded={studentsExpanded}
                  >
                    <BsPeople className="me-2 text-primary" />
                    Students
                  </Nav.Link>
                </Nav.Item>

                {studentsExpanded && (
                  <div
                    id="students-submenu"
                    className="ms-3 mt-2 py-2 px-2 rounded bg-light border"
                    style={{ fontSize: "0.92rem" }}
                  >
                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/students"
                      className={getLinkClasses(
                        location.pathname === "/admin/dashboard/students"
                      )}
                      style={getLinkStyle(
                        location.pathname === "/admin/dashboard/students"
                      )}
                    >
                      <BsClipboardCheck className="me-2" />
                      Manage Students
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/students/create"
                      className={getLinkClasses(
                        location.pathname.includes("/students/create")
                      )}
                      style={getLinkStyle(
                        location.pathname.includes("/students/create")
                      )}
                    >
                      <BsPersonBadge className="me-2" />
                      Onboard Student
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/students/update"
                      className={getLinkClasses(
                        location.pathname.includes("/students/update")
                      )}
                      style={getLinkStyle(
                        location.pathname.includes("/students/update")
                      )}
                    >
                      <BsPeople className="me-2" />
                      Update Student
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/students/profile"
                      className={getLinkClasses(
                        location.pathname.includes("/students/profile")
                      )}
                      style={getLinkStyle(
                        location.pathname.includes("/students/profile")
                      )}
                    >
                      <BsPersonBadge className="me-2" />
                      Student Directory
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/students/offboard"
                      className={getLinkClasses(
                        location.pathname.includes("/students/offboard")
                      )}
                      style={getLinkStyle(
                        location.pathname.includes("/students/offboard")
                      )}
                    >
                      <BsBoxArrowRight className="me-2" />
                      Offboard Student
                    </Nav.Link>
                  </div>
                )}
              </Nav>

              {/* Assignments Section */}
              <Nav className="flex-column mb-2">
                <Nav.Item>
                  <Nav.Link
                    className={getLinkClasses(
                      location.pathname.includes("/assignments")
                    )}
                    style={getLinkStyle(
                      location.pathname.includes("/assignments")
                    )}
                    onClick={() => setAssignmentsExpanded(!assignmentsExpanded)}
                    aria-controls="assignments-submenu"
                    aria-expanded={assignmentsExpanded}
                  >
                    <BsFileText className="me-2 text-primary" />
                    Assignments
                  </Nav.Link>
                </Nav.Item>

                {assignmentsExpanded && (
                  <div
                    id="assignments-submenu"
                    className="ms-3 mt-2 py-2 px-2 rounded bg-light border"
                    style={{ fontSize: "0.92rem" }}
                  >
                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/assignments"
                      className={getLinkClasses(
                        location.pathname.includes("/assignments")
                      )}
                      style={getLinkStyle(
                        location.pathname.includes("/assignments")
                      )}
                    >
                      <BsClipboardCheck className="me-2" />
                      Manage Assignments
                    </Nav.Link>

                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/assignments/create"
                      className={getLinkClasses(
                        location.pathname.includes("/assignments/create")
                      )}
                      style={getLinkStyle(
                        location.pathname.includes("/assignments/create")
                      )}
                    >
                      <BsFileText className="me-2" />
                      Create Assignment
                    </Nav.Link>
                  </div>
                )}
              </Nav>

              {/* Grades & Sections Section */}
              <Nav className="flex-column mb-2">
                <Nav.Item>
                  <Nav.Link
                    className={getLinkClasses(
                      location.pathname.includes("/grades") ||
                        location.pathname.includes("/sections")
                    )}
                    style={getLinkStyle(
                      location.pathname.includes("/grades") ||
                        location.pathname.includes("/sections")
                    )}
                    onClick={() =>
                      setGradesSectionsExpanded(!gradesSectionsExpanded)
                    }
                    aria-controls="grades-sections-submenu"
                    aria-expanded={gradesSectionsExpanded}
                  >
                    <BsBuilding className="me-2 text-primary" />
                    Classes
                  </Nav.Link>
                </Nav.Item>

                {gradesSectionsExpanded && (
                  <div
                    id="grades-sections-submenu"
                    className="ms-3 mt-2 py-2 px-2 rounded bg-light border"
                    style={{ fontSize: "0.92rem" }}
                  >
                    {/* Grades Links */}
                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/grades"
                      className={getLinkClasses(
                        location.pathname === "/admin/dashboard/grades"
                      )}
                      style={getLinkStyle(
                        location.pathname === "/admin/dashboard/grades"
                      )}
                    >
                      <BsClipboardCheck className="me-2" />
                      Manage Grades
                    </Nav.Link>

                    {/* Sections Links */}
                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/sections"
                      className={getLinkClasses(
                        location.pathname === "/admin/dashboard/sections"
                      )}
                      style={getLinkStyle(
                        location.pathname === "/admin/dashboard/sections"
                      )}
                    >
                      <BsClipboardCheck className="me-2" />
                      Manage Sections
                    </Nav.Link>

                    {/* Subjects Links */}
                    <Nav.Link
                      as={Link}
                      to="/admin/dashboard/subjects"
                      className={getLinkClasses(
                        location.pathname === "/admin/dashboard/subjects"
                      )}
                      style={getLinkStyle(
                        location.pathname === "/admin/dashboard/subjects"
                      )}
                    >
                      <BsClipboardCheck className="me-2" />
                      Manage Subjects
                    </Nav.Link>
                  </div>
                )}
              </Nav>

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
                      to="/admin/dashboard/leaves/leave-allocation"
                      className={getLinkClasses(
                        location.pathname.includes("/leaves/leave-allocation")
                      )}
                      style={getLinkStyle(
                        location.pathname.includes("/leaves/leave-allocation")
                      )}
                    >
                      <BsPeople className="me-2" />
                      Leave Allocation
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
                      Today is <strong>{currentDate}</strong>. {randomMessage}
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
