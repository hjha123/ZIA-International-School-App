import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Row,
  Col,
  Form,
  Spinner,
  Modal,
} from "react-bootstrap";
import gradeService from "../../../services/gradeAndSectionsService";
import { useNavigate } from "react-router-dom";

const GradeManagement = () => {
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGradeName, setNewGradeName] = useState("");
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch grades
  const fetchGrades = async () => {
    setLoading(true);
    try {
      const data = await gradeService.getAllGrades();
      setGrades(data);
    } catch (err) {
      console.error("Failed to fetch grades", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  // Create new grade
  const handleCreateGrade = async () => {
    if (!newGradeName.trim()) return;
    try {
      await gradeService.createGrade({ name: newGradeName });
      setShowCreateModal(false);
      setNewGradeName("");
      fetchGrades();
    } catch (err) {
      console.error("Failed to create grade", err);
    }
  };

  // Delete grade
  const handleDeleteGrade = async () => {
    if (!selectedGrade) return;
    try {
      await gradeService.deleteGrade(selectedGrade.name);
      setShowDeleteModal(false);
      fetchGrades();
    } catch (err) {
      console.error("Failed to delete grade", err);
    }
  };

  return (
    <Card className="shadow-sm border-0 rounded-3">
      <Card.Body>
        <Row className="mb-3 align-items-center">
          <Col>
            <h4 className="text-primary mb-0">Grades Management</h4>
          </Col>
          <Col className="text-end">
            <Button variant="success" onClick={() => setShowCreateModal(true)}>
              + Create Grade
            </Button>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table bordered hover responsive className="align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Grade Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {grades.length === 0 ? (
                <tr>
                  <td colSpan="2">No grades found.</td>
                </tr>
              ) : (
                grades.map((g) => (
                  <tr key={g.id}>
                    <td>{g.name}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            navigate(`/admin/dashboard/grades/${g.id}`)
                          }
                        >
                          View
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setSelectedGrade(g);
                            setShowDeleteModal(true);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}

        {/* Create Grade Modal */}
        <Modal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Create New Grade</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Grade Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter grade name"
                value={newGradeName}
                onChange={(e) => setNewGradeName(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button variant="success" onClick={handleCreateGrade}>
              Create
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Grade Modal */}
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete grade{" "}
            <strong>{selectedGrade?.name}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteGrade}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default GradeManagement;
