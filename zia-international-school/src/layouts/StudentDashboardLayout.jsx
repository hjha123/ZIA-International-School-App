import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Card,
  NavDropdown,
} from "react-bootstrap";
import {
  BsHouse,
  BsPerson,
  BsClipboardCheck,
  BsCalendarCheck,
  BsMegaphone,
  BsBoxArrowRight,
} from "react-icons/bs";
import SessionExpiredModal from "../components/SessionExpiredModal";
import useAutoLogout from "../hooks/useAutoLogout";

const StudentDashboardLayout = () => {
  const { showModal, handleModalClose } = useAutoLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("username") || "Student";
  const role = localStorage.getItem("role") || "STUDENT";

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const [menuExpanded, setMenuExpanded] = useState(true);

  const getLinkClasses = (isActive) =>
    `mb-2 d-flex align-items-center px-3 py-2 rounded ${
      isActive ? "fw-bold text-white bg-primary" : "text-dark"
    }`;

  const getLinkStyle = (isActive) =>
    isActive
      ? {}
      : {
          backgroundColor: "#eef4fb",
        };

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
        <Navbar.Brand className="fw-bold mx-auto text-white">
          🎓 ZIS Student Dashboard
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
              id="student-dropdown"
              align="end"
            >
              <NavDropdown.Item onClick={handleLogout}>
                <BsBoxArrowRight className="me-2" />
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

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
                to="/student/dashboard"
                className={getLinkClasses(
                  location.pathname === "/student/dashboard"
                )}
                style={getLinkStyle(location.pathname === "/student/dashboard")}
              >
                <BsHouse className="me-2" />
                Home
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/student/dashboard/profile"
                className={getLinkClasses(
                  location.pathname.includes("/profile")
                )}
                style={getLinkStyle(location.pathname.includes("/profile"))}
              >
                <BsPerson className="me-2" />
                My Profile
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/student/dashboard/attendance"
                className={getLinkClasses(
                  location.pathname.includes("/attendance")
                )}
                style={getLinkStyle(location.pathname.includes("/attendance"))}
              >
                <BsCalendarCheck className="me-2" />
                Attendance
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/student/dashboard/tasks"
                className={getLinkClasses(location.pathname.includes("/tasks"))}
                style={getLinkStyle(location.pathname.includes("/tasks"))}
              >
                <BsClipboardCheck className="me-2" />
                Tasks
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/student/dashboard/notices"
                className={getLinkClasses(
                  location.pathname.includes("/notices")
                )}
                style={getLinkStyle(location.pathname.includes("/notices"))}
              >
                <BsMegaphone className="me-2" />
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
            {/* Dashboard Cards */}
            {location.pathname === "/student/dashboard" && (
              <Row className="g-4">
                <Col md={3}>
                  <Card
                    className="shadow-sm border-0 text-center py-3"
                    style={{ borderRadius: "1rem", background: "#dbeafe" }}
                  >
                    <Card.Body>
                      <h5>Attendance</h5>
                      <p className="display-6 text-primary">95%</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card
                    className="shadow-sm border-0 text-center py-3"
                    style={{ borderRadius: "1rem", background: "#fef3c7" }}
                  >
                    <Card.Body>
                      <h5>Tasks Pending</h5>
                      <p className="display-6 text-warning">3</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card
                    className="shadow-sm border-0 text-center py-3"
                    style={{ borderRadius: "1rem", background: "#d1fae5" }}
                  >
                    <Card.Body>
                      <h5>Grades</h5>
                      <p className="display-6 text-success">A</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card
                    className="shadow-sm border-0 text-center py-3"
                    style={{ borderRadius: "1rem", background: "#fee2e2" }}
                  >
                    <Card.Body>
                      <h5>Notices</h5>
                      <p className="display-6 text-danger">5</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}

            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentDashboardLayout;
