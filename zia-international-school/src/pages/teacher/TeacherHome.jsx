import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import {
  FaChalkboardTeacher,
  FaClipboardList,
  FaCalendarCheck,
  FaBullhorn,
} from "react-icons/fa";

const TeacherHome = () => {
  // Dummy dashboard data
  const todayClasses = 4;
  const pendingAssignments = 6;
  const leaveBalance = 8;
  const newNotices = 3;

  // Card color styles (for variety)
  const cardStyles = {
    classes: "linear-gradient(135deg, #4e73df, #224abe)",
    assignments: "linear-gradient(135deg, #f6c23e, #dda20a)",
    leaves: "linear-gradient(135deg, #1cc88a, #13855c)",
    notices: "linear-gradient(135deg, #e74a3b, #be2617)",
  };

  return (
    <div>
      {/* 🔹 Dashboard Cards */}
      <Row className="g-4">
        <Col md={6} lg={3}>
          <Card
            className="shadow border-0 text-white h-100"
            style={{ background: cardStyles.classes }}
          >
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-white text-primary p-3 rounded-circle shadow-sm">
                <FaChalkboardTeacher size={28} />
              </div>
              <div>
                <h3 className="fw-bold mb-0">{todayClasses}</h3>
                <small>Today’s Classes</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card
            className="shadow border-0 text-white h-100"
            style={{ background: cardStyles.assignments }}
          >
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-white text-warning p-3 rounded-circle shadow-sm">
                <FaClipboardList size={28} />
              </div>
              <div>
                <h3 className="fw-bold mb-0">{pendingAssignments}</h3>
                <small>Pending Assignments</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card
            className="shadow border-0 text-white h-100"
            style={{ background: cardStyles.leaves }}
          >
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-white text-success p-3 rounded-circle shadow-sm">
                <FaCalendarCheck size={28} />
              </div>
              <div>
                <h3 className="fw-bold mb-0">{leaveBalance}</h3>
                <small>Leave Balance</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card
            className="shadow border-0 text-white h-100"
            style={{ background: cardStyles.notices }}
          >
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="bg-white text-danger p-3 rounded-circle shadow-sm">
                <FaBullhorn size={28} />
              </div>
              <div>
                <h3 className="fw-bold mb-0">{newNotices}</h3>
                <small>New Notices</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 🔹 Extra Info */}
      <Row className="mt-5">
        <Col md={6}>
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Header className="bg-primary text-white fw-bold">
              Upcoming Classes
            </Card.Header>
            <Card.Body>
              <ul className="mb-0">
                <li>📘 Math - Grade 7 (10:00 AM)</li>
                <li>🔬 Science - Grade 8 (11:30 AM)</li>
                <li>✍️ English - Grade 9 (2:00 PM)</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Header className="bg-danger text-white fw-bold">
              Latest Notices
            </Card.Header>
            <Card.Body>
              <ul className="mb-0">
                <li>📢 Staff meeting at 4 PM</li>
                <li>📄 Submit exam papers by Friday</li>
                <li>🏅 Sports day practice starts next week</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TeacherHome;
