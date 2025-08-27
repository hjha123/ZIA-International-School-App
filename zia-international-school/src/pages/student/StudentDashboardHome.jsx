import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Badge,
  Image,
} from "react-bootstrap";
import {
  BsCalendarCheck,
  BsClipboardCheck,
  BsMegaphone,
  BsAward,
} from "react-icons/bs";
import studentService from "../../services/studentService";

const motivationalQuotes = [
  "Believe you can and you're halfway there.",
  "Your potential is endless. Keep pushing!",
  "Success is the sum of small efforts repeated daily.",
  "Dream big, work hard, stay focused.",
  "Mistakes are proof that you are trying.",
];

const StudentDashboardHome = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const data = await studentService.getMyProfile();
        setStudent(data);
      } catch (err) {
        console.error("Error fetching student data:", err);
      } finally {
        setLoading(false);
      }
    };

    // Pick a random quote
    setQuote(
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    );

    fetchStudentData();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <div>Loading Dashboard...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <p className="text-danger text-center mt-5">Student profile not found!</p>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Welcome Card */}
      <Card
        className="mb-4 shadow-lg border-0"
        style={{
          background: "linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%)",
          borderRadius: "1.5rem",
        }}
      >
        <Card.Body className="d-flex flex-column flex-md-row align-items-center">
          <div className="me-md-4 mb-3 mb-md-0">
            <Image
              src={
                student.profileImageUrl
                  ? `${import.meta.env.VITE_IMAGE_BASE_URL}/${
                      student.profileImageUrl
                    }`
                  : "/images/no-profile.png"
              }
              roundedCircle
              width={100}
              height={100}
              style={{ objectFit: "cover", border: "4px solid #2563eb" }}
            />
          </div>
          <div>
            <h4 className="fw-bold mb-1" style={{ color: "#1e3a8a" }}>
              Welcome back, {student.firstName} {student.lastName}!
            </h4>
            <p className="mb-1 text-muted" style={{ fontSize: "0.95rem" }}>
              Grade: <strong>{student.gradeName}</strong>, Section:{" "}
              <strong>{student.sectionName}</strong>
            </p>
            <Badge
              bg={student.status === "ACTIVE" ? "success" : "secondary"}
              className="mb-2"
            >
              {student.status}
            </Badge>
            <p
              className="fst-italic mb-2"
              style={{ fontSize: "1rem", color: "#0c4a6e" }}
            >
              "{quote}"
            </p>
            <p className="mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
              Here's your dashboard to stay on top of your classes, tasks, and
              notices 🚀
            </p>
          </div>
        </Card.Body>
      </Card>

      {/* Dashboard Cards */}
      <Row className="g-4">
        <Col md={3}>
          <Card
            className="shadow-sm border-0 text-white"
            style={{
              background: "linear-gradient(135deg, #4ade80, #16a34a)",
              borderRadius: "1rem",
              cursor: "pointer",
            }}
            onClick={() =>
              (window.location.href = "/student/dashboard/attendance")
            }
          >
            <Card.Body className="d-flex align-items-center">
              <BsCalendarCheck style={{ fontSize: "2rem" }} className="me-3" />
              <div>
                <h6 className="mb-0">Attendance</h6>
                <small className="opacity-75">Check your attendance</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card
            className="shadow-sm border-0 text-white"
            style={{
              background: "linear-gradient(135deg, #facc15, #b45309)",
              borderRadius: "1rem",
              cursor: "pointer",
            }}
            onClick={() => (window.location.href = "/student/dashboard/grades")}
          >
            <Card.Body className="d-flex align-items-center">
              <BsAward style={{ fontSize: "2rem" }} className="me-3" />
              <div>
                <h6 className="mb-0">Grades</h6>
                <small className="opacity-75">View your performance</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card
            className="shadow-sm border-0 text-white"
            style={{
              background: "linear-gradient(135deg, #60a5fa, #1e40af)",
              borderRadius: "1rem",
              cursor: "pointer",
            }}
            onClick={() => (window.location.href = "/student/dashboard/tasks")}
          >
            <Card.Body className="d-flex align-items-center">
              <BsClipboardCheck style={{ fontSize: "2rem" }} className="me-3" />
              <div>
                <h6 className="mb-0">Tasks</h6>
                <small className="opacity-75">Check assignments & tasks</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card
            className="shadow-sm border-0 text-white"
            style={{
              background: "linear-gradient(135deg, #f472b6, #be185d)",
              borderRadius: "1rem",
              cursor: "pointer",
            }}
            onClick={() =>
              (window.location.href = "/student/dashboard/notices")
            }
          >
            <Card.Body className="d-flex align-items-center">
              <BsMegaphone style={{ fontSize: "2rem" }} className="me-3" />
              <div>
                <h6 className="mb-0">Notices</h6>
                <small className="opacity-75">Important updates & info</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDashboardHome;
