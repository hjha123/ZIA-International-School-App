import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  BsPersonCheck,
  BsBookHalf,
  BsPeople,
  BsCalendarCheck,
  BsClipboardCheck,
  BsMegaphone,
} from "react-icons/bs";

const cardData = [
  {
    title: "Manage Teachers",
    text: "Onboard, update or remove teacher records.",
    icon: <BsPersonCheck size={32} />,
    link: "/admin/dashboard/teachers",
    gradient: "linear-gradient(135deg, #6a11cb, #2575fc)",
    buttonVariant: "light",
    sidebarKey: "teachers",
  },
  {
    title: "Manage Students",
    text: "Manage student data, enrollments, and profiles.",
    icon: <BsPeople size={32} />,
    link: "/admin/dashboard/students",
    gradient: "linear-gradient(135deg, #11998e, #38ef7d)",
    buttonVariant: "light",
    sidebarKey: "students",
  },
  {
    title: "Class Management",
    text: "Configure grades, sections, and assign subjects.",
    icon: <BsBookHalf size={32} />,
    link: "/admin/dashboard/grades",
    gradient: "linear-gradient(135deg, #f7971e, #ffd200)",
    buttonVariant: "light",
    sidebarKey: "classes",
  },
  {
    title: "Manage Leaves",
    text: "Allocate leaves or review and approve teacher and staff leave requests.",
    icon: <BsCalendarCheck size={32} />,
    link: "/admin/dashboard/leaves",
    gradient: "linear-gradient(135deg, #56ccf2, #2f80ed)",
    buttonVariant: "light",
    sidebarKey: "leaves",
  },
  {
    title: "Assign Tasks",
    text: "Assign tasks to teachers or to students of a specific grade and section.",
    icon: <BsClipboardCheck size={32} />,
    link: "/admin/dashboard/assignments/create",
    gradient: "linear-gradient(135deg, #ff416c, #ff4b2b)",
    buttonVariant: "light",
  },
  {
    title: "Notices",
    text: "Post important announcements for staff or students.",
    icon: <BsMegaphone size={32} />,
    link: "/admin/dashboard/notices",
    gradient: "linear-gradient(135deg, #bdc3c7, #2c3e50)",
    buttonVariant: "light",
  },
];

const AdminHome = () => {
  const handleGoClick = (sidebarKey) => {
    if (sidebarKey) {
      localStorage.setItem("expandSidebar", sidebarKey);
    }
  };

  return (
    <div className="container mt-4">
      <Row className="g-4">
        {cardData.map((card, idx) => (
          <Col md={4} key={idx}>
            <Card
              className="shadow-lg border-0 rounded-4 text-white"
              style={{
                background: card.gradient,
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.1)";
              }}
            >
              <Card.Body className="d-flex flex-column align-items-start">
                <div className="mb-3">{card.icon}</div>
                <Card.Title className="fw-bold">{card.title}</Card.Title>
                <Card.Text>{card.text}</Card.Text>
                <Button
                  as={Link}
                  to={card.link}
                  variant={card.buttonVariant}
                  size="sm"
                  className="mt-auto text-dark fw-semibold"
                  style={{
                    borderRadius: "25px",
                    background: "#fff",
                    border: "none",
                  }}
                  onClick={() => handleGoClick(card.sidebarKey)}
                >
                  Go
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AdminHome;
