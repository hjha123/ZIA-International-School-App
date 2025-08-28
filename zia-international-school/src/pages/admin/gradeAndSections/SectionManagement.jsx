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

const SectionManagement = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedGrade, setSelectedGrade] = useState(null);
  const [sections, setSections] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [createGradeId, setCreateGradeId] = useState(""); // grade selected in modal

  const [selectedSection, setSelectedSection] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch all grades on page load
  const fetchGrades = async () => {
    setLoading(true);
    try {
      const data = await gradeService.getAllGrades();
      setGrades(data);
      if (data.length > 0) setSelectedGrade(data[0]);
    } catch (err) {
      console.error("Failed to fetch grades", err);
    }
    setLoading(false);
  };

  // Fetch sections for selected grade
  const fetchSections = async (grade) => {
    if (!grade) return;
    setLoading(true);
    try {
      const data = await gradeService.getSimpleSectionsByGradeName(grade.name);
      setSections(data);
    } catch (err) {
      console.error("Failed to fetch sections", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  useEffect(() => {
    if (selectedGrade) fetchSections(selectedGrade);
  }, [selectedGrade]);

  // Create new section
  const handleCreateSection = async () => {
    if (!newSectionName.trim() || !createGradeId) return;

    const gradeObj = grades.find((g) => g.id === parseInt(createGradeId));
    if (!gradeObj) return;

    try {
      await gradeService.createSection({
        name: newSectionName,
        gradeName: gradeObj.name,
      });
      setShowCreateModal(false);
      setNewSectionName("");
      setCreateGradeId("");
      if (selectedGrade?.id === gradeObj.id) {
        // refresh only if same grade selected
        fetchSections(gradeObj);
      }
    } catch (err) {
      console.error("Failed to create section", err);
    }
  };

  // Delete section
  const handleDeleteSection = async () => {
    if (!selectedSection || !selectedGrade) return;
    try {
      await gradeService.deleteSection(
        selectedGrade.name,
        selectedSection.name
      );
      setShowDeleteModal(false);
      fetchSections(selectedGrade);
    } catch (err) {
      console.error("Failed to delete section", err);
    }
  };

  return (
    <Card className="shadow-sm border-0 rounded-3">
      <Card.Body>
        <Row className="mb-3 align-items-center">
          <Col>
            <h4 className="text-primary mb-0">Sections Management</h4>
          </Col>
          <Col className="text-end">
            <Button
              variant="success"
              onClick={() => setShowCreateModal(true)}
              disabled={grades.length === 0}
            >
              + Create Section
            </Button>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            {/* Grade Selector */}
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Select Grade:
              </Form.Label>
              <Col sm={4}>
                <Form.Select
                  value={selectedGrade?.id || ""}
                  onChange={(e) =>
                    setSelectedGrade(
                      grades.find((g) => g.id === parseInt(e.target.value))
                    )
                  }
                >
                  {grades.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>

            <Table
              bordered
              hover
              responsive
              className="align-middle text-center"
            >
              <thead className="table-dark">
                <tr>
                  <th>Section Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sections.length === 0 ? (
                  <tr>
                    <td colSpan="2">No sections found for this grade.</td>
                  </tr>
                ) : (
                  sections.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setSelectedSection(s);
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
          </>
        )}

        {/* Create Section Modal */}
        <Modal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Create New Section</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Select Grade</Form.Label>
              <Form.Select
                value={createGradeId}
                onChange={(e) => setCreateGradeId(e.target.value)}
              >
                <option value="">-- Select Grade --</option>
                {grades.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Section Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter section name"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
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
            <Button variant="success" onClick={handleCreateSection}>
              Create
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Section Modal */}
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete section{" "}
            <strong>{selectedSection?.name}</strong> from grade{" "}
            <strong>{selectedGrade?.name}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteSection}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default SectionManagement;
