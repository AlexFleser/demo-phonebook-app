import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface EditContactModalProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editedName: string;
  editedPhoneNumber: string;
  onNameChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  isDirty: boolean;
  isNewContact?: boolean;
  isViewForm: boolean;
  nameError: string;
  phoneNumberError: string;
}

const EditContactModal: React.FC<EditContactModalProps> = ({
  show,
  onClose,
  onSave,
  editedName,
  editedPhoneNumber,
  onNameChange,
  onPhoneNumberChange,
  isDirty,
  isNewContact,
  isViewForm,
  nameError,
  phoneNumberError,
}) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isNewContact ? "New Contact" : "Edit Contact"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formEditedName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              readOnly={isViewForm}
              type="text"
              value={editedName}
              onChange={(e) => onNameChange(e.target.value)}
              isInvalid={nameError !== ""}
            />
            <Form.Control.Feedback type="invalid">
              {nameError}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formEditedPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              readOnly={isViewForm}
              type="text"
              value={editedPhoneNumber}
              onChange={(e) => onPhoneNumberChange(e.target.value)}
              isInvalid={phoneNumberError !== ""}
            />
            <Form.Control.Feedback type="invalid">
              {phoneNumberError}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      {!isViewForm ? (
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onSave}
            disabled={!isDirty || phoneNumberError !== "" || nameError !== ""}
          >
            Save
          </Button>
        </Modal.Footer>
      ) : null}
    </Modal>
  );
};

export default EditContactModal;
