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

const AdminHome = () => {
  return (
    <div className="container mt-4">
      <Row className="g-4">
        {/* TEACHERS */}
        <Col md={4}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body>
              <BsPersonCheck size={28} className="text-primary mb-2" />
              <Card.Title className="fw-semibold">Manage Teachers</Card.Title>
              <Card.Text className="text-muted">
                Onboard, update or remove teacher records.
              </Card.Text>
              <Button
                as={Link}
                to="/admin/dashboard/teachers"
                variant="outline-primary"
                size="sm"
              >
                Go to Teachers
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* STUDENTS */}
        <Col md={4}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body>
              <BsPeople size={28} className="text-success mb-2" />
              <Card.Title className="fw-semibold">Student Directory</Card.Title>
              <Card.Text className="text-muted">
                Manage student data, enrollments, and profiles.
              </Card.Text>
              <Button
                as={Link}
                to="/admin/dashboard/students"
                variant="outline-success"
                size="sm"
              >
                Go to Students
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* CLASSES */}
        <Col md={4}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body>
              <BsBookHalf size={28} className="text-warning mb-2" />
              <Card.Title className="fw-semibold">Class Management</Card.Title>
              <Card.Text className="text-muted">
                Configure grades, sections, and assign subjects.
              </Card.Text>
              <Button
                as={Link}
                to="/admin/dashboard/classes"
                variant="outline-warning"
                size="sm"
              >
                Go to Classes
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* LEAVES */}
        <Col md={4}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body>
              <BsCalendarCheck size={28} className="text-info mb-2" />
              <Card.Title className="fw-semibold">Leave Requests</Card.Title>
              <Card.Text className="text-muted">
                View and approve teacher/staff leave applications.
              </Card.Text>
              <Button
                as={Link}
                to="/admin/dashboard/leaves"
                variant="outline-info"
                size="sm"
              >
                Manage Leaves
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* TASKS */}
        <Col md={4}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body>
              <BsClipboardCheck size={28} className="text-danger mb-2" />
              <Card.Title className="fw-semibold">Assign Tasks</Card.Title>
              <Card.Text className="text-muted">
                Allocate duties or assignments to teachers.
              </Card.Text>
              <Button
                as={Link}
                to="/admin/dashboard/tasks"
                variant="outline-danger"
                size="sm"
              >
                View Tasks
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* NOTICES */}
        <Col md={4}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body>
              <BsMegaphone size={28} className="text-secondary mb-2" />
              <Card.Title className="fw-semibold">Notices</Card.Title>
              <Card.Text className="text-muted">
                Post important announcements for staff or students.
              </Card.Text>
              <Button
                as={Link}
                to="/admin/dashboard/notices"
                variant="outline-secondary"
                size="sm"
              >
                View Notices
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminHome;
