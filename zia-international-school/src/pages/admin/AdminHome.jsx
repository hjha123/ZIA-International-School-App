import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { BsPersonBadge, BsPeople, BsBuilding } from "react-icons/bs";

const AdminHome = () => {
  return (
    <div>
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-white bg-primary shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <BsPersonBadge size={40} className="me-3" />
              <div>
                <Card.Title className="mb-0">50</Card.Title>
                <Card.Text>Teachers</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-white bg-success shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <BsPeople size={40} className="me-3" />
              <div>
                <Card.Title className="mb-0">400</Card.Title>
                <Card.Text>Students</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-white bg-info shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <BsBuilding size={40} className="me-3" />
              <div>
                <Card.Title className="mb-0">10</Card.Title>
                <Card.Text>Classes</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <h5 className="mb-3">📌 Quick Notes</h5>
          <p>
            Use the left menu to manage teachers, students, and classes. You can
            expand this dashboard later with charts, recent activity,
            notifications, or reports.
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminHome;
