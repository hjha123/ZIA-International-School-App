import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Card,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { BsPencil, BsTrash, BsPlusCircle } from "react-icons/bs";
import subjectService from "../../../services/subjectService";

const SubjectsManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectName, setSubjectName] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSubjectId, setDeleteSubjectId] = useState(null);

  // Fetch subjects from backend
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await subjectService.getAllSubjects();
      setSubjects(data);
    } catch (error) {
      toast.error("Failed to fetch subjects");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setEditingSubject(null);
    setSubjectName("");
  };

  const handleShow = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);
      setSubjectName(subject.name);
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!subjectName.trim()) {
      toast.error("Subject name cannot be empty");
      return;
    }

    try {
      if (editingSubject) {
        await subjectService.updateSubject(editingSubject.id, {
          name: subjectName,
        });
        toast.success("Subject updated successfully");
      } else {
        await subjectService.createSubject({ name: subjectName });
        toast.success("Subject created successfully");
      }
      fetchSubjects();
      handleClose();
    } catch (error) {
      toast.error("Error saving subject");
      console.error(error);
    }
  };

  const confirmDelete = (id) => {
    setDeleteSubjectId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await subjectService.deleteSubject(deleteSubjectId);
      toast.success("Subject deleted successfully");
      fetchSubjects();
    } catch (error) {
      toast.error("Error deleting subject");
      console.error(error);
    } finally {
      setShowDeleteModal(false);
      setDeleteSubjectId(null);
    }
  };

  return (
    <div>
      <Card className="shadow-sm mb-4">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Manage Subjects</h4>
          <Button variant="primary" onClick={() => handleShow()}>
            <BsPlusCircle className="me-2" />
            Add Subject
          </Button>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Card className="shadow-sm">
          <Table
            striped
            hover
            responsive
            className="mb-0 align-middle text-center"
          >
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Subject Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-3">
                    No subjects found.
                  </td>
                </tr>
              ) : (
                subjects.map((subject, index) => (
                  <tr key={subject.id}>
                    <td>{index + 1}</td>
                    <td className="text-start ps-4">{subject.name}</td>
                    <td>
                      <OverlayTrigger overlay={<Tooltip>Edit Subject</Tooltip>}>
                        <Button
                          size="sm"
                          variant="warning"
                          className="me-2"
                          onClick={() => handleShow(subject)}
                        >
                          <BsPencil />
                        </Button>
                      </OverlayTrigger>

                      <OverlayTrigger
                        overlay={<Tooltip>Delete Subject</Tooltip>}
                      >
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => confirmDelete(subject.id)}
                        >
                          <BsTrash />
                        </Button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>
      )}

      {/* Modal for Create/Edit */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingSubject ? "Edit Subject" : "Add Subject"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="subjectName">
              <Form.Label>Subject Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter subject name"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editingSubject ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this subject?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SubjectsManagement;
