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

  // ✅ Expand sidebar when coming from AdminHome "Go" buttons
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
        case "classes":
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
    `mb-2 d-flex align-items-center px-2 py-2 rounded transition-all ${
      isActive ? "fw-bold text-white" : "text-dark fw-semibold hover-shadow-sm"
    }`;

  // 🎨 Color palette by functionality
  const linkColors = {
    dashboard: "#0ea5e9", // cyan-blue
    teachers: "#2563eb", // blue
    students: "#16a34a", // green
    assignments: "#9333ea", // purple
    classes: "#f59e0b", // amber
    leaves: "#10b981", // teal
    tasks: "#f97316", // orange
    notices: "#dc2626", // red
    default: "#1e293b", // slate
  };

  const getColoredStyle = (isActive, key) => {
    const baseColor = linkColors[key] || linkColors.default;
    if (isActive) {
      return {
        background: `linear-gradient(90deg, ${baseColor} 0%, #1e293b 100%)`,
        color: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      };
    }
    return {
      background: "linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%)",
      color: baseColor,
      transition: "all 0.2s ease-in-out",
    };
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
            className="border-end shadow-sm pt-4 px-3"
            style={{
              minHeight: "calc(100vh - 56px)",
              position: "sticky",
              top: "56px",
              background: "linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 100%)", // 🎨 soft gradient blue
            }}
          >
            <h5 className="text-primary mb-4">Menu</h5>
            <Nav className="flex-column">
              {/* Dashboard */}
              <Nav.Link
                as={Link}
                to="/admin/dashboard"
                className={getLinkClasses(
                  location.pathname === "/admin/dashboard"
                )}
                style={getColoredStyle(
                  location.pathname === "/admin/dashboard",
                  "dashboard"
                )}
              >
                <BsHouse
                  className="me-2"
                  style={{ color: linkColors.dashboard }}
                />
                Dashboard
              </Nav.Link>

              {/* Teachers Section */}
              <Nav.Item>
                <Nav.Link
                  className={getLinkClasses(
                    location.pathname.includes("/teachers")
                  )}
                  style={getColoredStyle(
                    location.pathname.includes("/teachers"),
                    "teachers"
                  )}
                  onClick={() => setTeachersExpanded(!teachersExpanded)}
                >
                  <BsPersonBadge
                    className="me-2"
                    style={{ color: linkColors.teachers }}
                  />
                  Teachers
                </Nav.Link>
              </Nav.Item>
              {teachersExpanded && (
                <div className="ms-3 mt-2 py-2 px-2 rounded bg-light border">
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard/teachers"
                    className={getLinkClasses(
                      location.pathname === "/admin/dashboard/teachers"
                    )}
                    style={getColoredStyle(
                      location.pathname === "/admin/dashboard/teachers",
                      "teachers"
                    )}
                  >
                    <BsClipboardCheck
                      className="me-2"
                      style={{ color: linkColors.teachers }}
                    />
                    Manage Teachers
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard/teachers/create"
                    className={getLinkClasses(
                      location.pathname.includes("/teachers/create")
                    )}
                    style={getColoredStyle(
                      location.pathname.includes("/teachers/create"),
                      "teachers"
                    )}
                  >
                    <BsPersonBadge
                      className="me-2"
                      style={{ color: linkColors.teachers }}
                    />
                    Onboard Teacher
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard/teachers/select"
                    className={getLinkClasses(
                      location.pathname.includes("/teachers/select") ||
                        location.pathname.includes("/teachers/update")
                    )}
                    style={getColoredStyle(
                      location.pathname.includes("/teachers/select") ||
                        location.pathname.includes("/teachers/update"),
                      "teachers"
                    )}
                  >
                    <BsPeople
                      className="me-2"
                      style={{ color: linkColors.teachers }}
                    />
                    Update Teacher
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard/teachers/profile"
                    className={getLinkClasses(
                      location.pathname.includes("/teachers/profile")
                    )}
                    style={getColoredStyle(
                      location.pathname.includes("/teachers/profile"),
                      "teachers"
                    )}
                  >
                    <BsPersonBadge
                      className="me-2"
                      style={{ color: linkColors.teachers }}
                    />
                    Teacher Directory
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard/teachers/offboard"
                    className={getLinkClasses(
                      location.pathname.includes("/teachers/offboard")
                    )}
                    style={getColoredStyle(
                      location.pathname.includes("/teachers/offboard"),
                      "teachers"
                    )}
                  >
                    <BsBoxArrowRight
                      className="me-2"
                      style={{ color: linkColors.teachers }}
                    />
                    Offboard Teacher
                  </Nav.Link>
                </div>
              )}

              {/* Students Section */}
              <Nav.Item>
                <Nav.Link
                  className={getLinkClasses(
                    location.pathname.includes("/students")
                  )}
                  style={getColoredStyle(
                    location.pathname.includes("/students"),
                    "students"
                  )}
                  onClick={() => setStudentsExpanded(!studentsExpanded)}
                >
                  <BsPeople
                    className="me-2"
                    style={{ color: linkColors.students }}
                  />
                  Students
                </Nav.Link>
              </Nav.Item>
              {studentsExpanded && (
                <div className="ms-3 mt-2 py-2 px-2 rounded bg-light border">
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard/students"
                    className={getLinkClasses(
                      location.pathname === "/admin/dashboard/students"
                    )}
                    style={getColoredStyle(
                      location.pathname === "/admin/dashboard/students",
                      "students"
                    )}
                  >
                    <BsClipboardCheck
                      className="me-2"
                      style={{ color: linkColors.students }}
                    />
                    Manage Students
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard/students/create"
                    className={getLinkClasses(
                      location.pathname.includes("/students/create")
                    )}
                    style={getColoredStyle(
                      location.pathname.includes("/students/create"),
                      "students"
                    )}
                  >
                    <BsPersonBadge
                      className="me-2"
                      style={{ color: linkColors.students }}
                    />
                    Onboard Student
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard/students/update"
                    className={getLinkClasses(
                      location.pathname.includes("/students/update")
                    )}
                    style={getColoredStyle(
                      location.pathname.includes("/students/update"),
                      "students"
                    )}
                  >
                    <BsPeople
                      className="me-2"
                      style={{ color: linkColors.students }}
                    />
                    Update Student
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard/students/profile"
                    className={getLinkClasses(
                      location.pathname.includes("/students/profile")
                    )}
                    style={getColoredStyle(
                      location.pathname.includes("/students/profile"),
                      "students"
                    )}
                  >
                    <BsPersonBadge
                      className="me-2"
                      style={{ color: linkColors.students }}
                    />
                    Student Directory
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard/students/offboard"
                    className={getLinkClasses(
                      location.pathname.includes("/students/offboard")
                    )}
                    style={getColoredStyle(
                      location.pathname.includes("/students/offboard"),
                      "students"
                    )}
                  >
                    <BsBoxArrowRight
                      className="me-2"
                      style={{ color: linkColors.students }}
                    />
                    Offboard Student
                  </Nav.Link>
                </div>
              )}

              {/* Assignments */}
              <Nav.Item>
                <Nav.Link
                  className={getLinkClasses(
                    location.pathname.includes("/assignments")
                  )}
                  style={getColoredStyle(
                    location.pathname.includes("/assignments"),
                    "assignments"
                  )}
                  onClick={() => setAssignmentsExpanded(!assignmentsExpanded)}
                >
                  <BsFileText
                    className="me-2"
                    style={{ color: linkColors.assignments }}
                  />
                  Assignments
                </Nav.Link>
              </Nav.Item>
              {assignmentsExpanded && (
                <div className="ms-3 mt-2 py-2 px-2 rounded bg-light border">
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard/assignments/manage"
                    className={getLinkClasses(
                      location.pathname.includes("/assignments/manage")
                    )}
                    style={getColoredStyle(
                      location.pathname.includes("/assignments/manage"),
                      "assignments"
                    )}
                  >
                    <BsClipboardCheck
                      className="me-2"
                      style={{ color: linkColors.assignments }}
                    />
                    Manage Assignments
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard/assignments/create"
                    className={getLinkClasses(
                      location.pathname.includes("/assignments/create")
                    )}
                    style={getColoredStyle(
                      location.pathname.includes("/assignments/create"),
                      "assignments"
                    )}
                  >
                    <BsFileText
                      className="me-2"
                      style={{ color: linkColors.assignments }}
                    />
                    Create Assignment
                  </Nav.Link>
                </div>
              )}

              {/* Classes */}
              <Nav.Item>
                <Nav.Link
                  className={getLinkClasses(
                    location.pathname.includes("/grades") ||
                      location.pathname.includes("/sections")
                  )}
                  style={getColoredStyle(
                    location.pathname.includes("/grades") ||
                      location.pathname.includes("/sections"),
                    "classes"
                  )}
                  onClick={() =>
                    setGradesSectionsExpanded(!gradesSectionsExpanded)
                  }
                >
                  <BsBuilding
                    className="me-2"
                    style={{ color: linkColors.classes }}
                  />
                  Classes
                </Nav.Link>
              </Nav.Item>
              {gradesSectionsExpanded && (
                <div className="ms-3 mt-2 py-2 px-2 rounded bg-light border">
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard/grades"
                    className={getLinkClasses(
                      location.pathname === "/admin/dashboard/grades"
                    )}
                    style={getColoredStyle(
                      location.pathname === "/admin/dashboard/grades",
                      "classes"
                    )}
                  >
                    <BsClipboardCheck
                      className="me-2"
                      style={{ color: linkColors.classes }}
                    />
                    Manage Grades
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard/sections"
                    className={getLinkClasses(
                      location.pathname === "/admin/dashboard/sections"
                    )}
                    style={getColoredStyle(
                      location.pathname === "/admin/dashboard/sections",
                      "classes"
                    )}
                  >
                    <BsClipboardCheck
                      className="me-2"
                      style={{ color: linkColors.classes }}
                    />
                    Manage Sections
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard/subjects"
                    className={getLinkClasses(
                      location.pathname === "/admin/dashboard/subjects"
                    )}
                    style={getColoredStyle(
                      location.pathname === "/admin/dashboard/subjects",
                      "classes"
                    )}
                  >
                    <BsClipboardCheck
                      className="me-2"
                      style={{ color: linkColors.classes }}
                    />
                    Manage Subjects
                  </Nav.Link>
                </div>
              )}

              {/* Leaves */}
              <Nav.Item>
                <Nav.Link
                  className={getLinkClasses(
                    location.pathname.includes("/leaves")
                  )}
                  style={getColoredStyle(
                    location.pathname.includes("/leaves"),
                    "leaves"
                  )}
                  onClick={() => setLeavesExpanded(!leavesExpanded)}
                >
                  <BsCalendar2Check
                    className="me-2"
                    style={{ color: linkColors.leaves }}
                  />
                  Leaves
                </Nav.Link>
              </Nav.Item>
              {leavesExpanded && (
                <div className="ms-3 mt-2 py-2 px-2 rounded bg-light border">
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard/leaves"
                    className={getLinkClasses(
                      location.pathname === "/admin/dashboard/leaves"
                    )}
                    style={getColoredStyle(
                      location.pathname === "/admin/dashboard/leaves",
                      "leaves"
                    )}
                  >
                    <BsClipboardCheck
                      className="me-2"
                      style={{ color: linkColors.leaves }}
                    />
                    Approve Requests
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard/leaves/leave-allocation"
                    className={getLinkClasses(
                      location.pathname.includes("/leaves/leave-allocation")
                    )}
                    style={getColoredStyle(
                      location.pathname.includes("/leaves/leave-allocation"),
                      "leaves"
                    )}
                  >
                    <BsPeople
                      className="me-2"
                      style={{ color: linkColors.leaves }}
                    />
                    Leave Allocation
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard/leaves/types"
                    className={getLinkClasses(
                      location.pathname.includes("/leaves/types")
                    )}
                    style={getColoredStyle(
                      location.pathname.includes("/leaves/types"),
                      "leaves"
                    )}
                  >
                    <BsClipboardCheck
                      className="me-2"
                      style={{ color: linkColors.leaves }}
                    />
                    Leave Types
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard/leaves/history"
                    className={getLinkClasses(
                      location.pathname.includes("/leaves/history")
                    )}
                    style={getColoredStyle(
                      location.pathname.includes("/leaves/history"),
                      "leaves"
                    )}
                  >
                    <BsClockHistory
                      className="me-2"
                      style={{ color: linkColors.leaves }}
                    />
                    Leave History
                  </Nav.Link>
                </div>
              )}

              {/* Tasks */}
              <Nav.Link
                as={Link}
                to="/admin/dashboard/tasks"
                className={getLinkClasses(location.pathname.includes("tasks"))}
                style={getColoredStyle(
                  location.pathname.includes("tasks"),
                  "tasks"
                )}
              >
                <BsClipboardCheck
                  className="me-2"
                  style={{ color: linkColors.tasks }}
                />
                Tasks
              </Nav.Link>

              {/* Notices */}
              <Nav.Link
                as={Link}
                to="/admin/dashboard/notices"
                className={getLinkClasses(
                  location.pathname.includes("notices")
                )}
                style={getColoredStyle(
                  location.pathname.includes("notices"),
                  "notices"
                )}
              >
                <BsMegaphone
                  className="me-2"
                  style={{ color: linkColors.notices }}
                />
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
