import React from "react";
import { Modal, Button } from "react-bootstrap";

function SessionExpiredModal({ show, onClose }) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>Session Expired</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p>Your session has expired due to inactivity.</p>
        <p>Please login again to continue.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onClose}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SessionExpiredModal;
