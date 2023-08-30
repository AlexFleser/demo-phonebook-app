import React, { useState } from "react";
import {
  ListGroup,
  Row,
  Col,
  Stack,
  Button,
  Container,
  Form,
  Card,
} from "react-bootstrap";
import EditContactModal from "./ContactModal";

interface ContactListProps {
  contacts: Contact[];
  onContactDelete: (id: string) => void;
  addNewContact: (name: string, phoneNumber: string) => void;
  existingNames: string[];
  existingPhoneNumbers: string[];
  editContact: (id: string, name: string, phoneNumber: string) => void;
}

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
}

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  onContactDelete,
  addNewContact,
  existingNames,
  existingPhoneNumbers,
  editContact,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchByPhoneNumber, setSearchByPhoneNumber] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedContact, setEditedContact] = useState<Contact | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedPhoneNumber, setEditedPhoneNumber] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [isNewContact, setIsNewContact] = useState(true);
  const [isViewForm, setIsViewForm] = useState(false);
  const [nameError, setNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleSearchMode = () => {
    setSearchByPhoneNumber(!searchByPhoneNumber);
    setSearchTerm("");
  };

  const openEditModal = (contact: Contact | null) => {
    if (contact) {
      // enter this sequence for edited contacts
      setEditedContact(contact);
      setEditedName(contact.name);
      setEditedPhoneNumber(contact.phoneNumber);
    } else {
      const newContact: Contact = {
        id: "",
        name: "",
        phoneNumber: "",
      };
      setEditedContact(newContact);
    }
    setIsDirty(false);
    setShowEditModal(true);
  };

  const handleNameChange = (value: string) => {
    setEditedName(value);

    // allow save only if an actual change was made for existing contact name
    if (editedContact?.name !== value) {
      setNameError("");
      setIsDirty(true);
    } else {
      setNameError("Name is the same as before");
      setIsDirty(false);
    }

    const nameAlreadyExist = existingNames.includes(value);

    // new contact name validations
    if (isNewContact) {
      if (!value) {
        setNameError("Name is required");
      } else if (!nameAlreadyExist) {
        setNameError(
          value.length >= 2 ? "" : "Name must be at least 2 characters"
        );
      } else {
        setNameError("Name already exists in agenda");
      }
    }
  };

  const handlePhoneNumberChange = (value: string) => {
    setEditedPhoneNumber(value);

    // allow save only if an actual change was made for existing contact phone number
    if (editedContact?.phoneNumber !== value) {
      setPhoneNumberError("");
      setIsDirty(true);
    } else {
      setPhoneNumberError("Phone number is the same as before");
      setIsDirty(false);
    }

    const phoneNumberAlreadyExists = existingPhoneNumbers.includes(value);

    if (!value) {
      setPhoneNumberError("Phone number is required");
    } else if (phoneNumberAlreadyExists) {
      setPhoneNumberError("Phone number already exists");
    } else {
      // phone numbers must contain only numbers
      const isValidPhoneNumber = /^\d+$/.test(value) && value.length === 10;
      setPhoneNumberError(
        isValidPhoneNumber ? "" : "Phone number must contain exactly 10 digits"
      );
    }
  };

  // resets all of state values after modal closes
  const closeEditModal = () => {
    setEditedContact(null);
    setEditedName("");
    setEditedPhoneNumber("");
    setNameError("");
    setPhoneNumberError("");
    setShowEditModal(false);
  };

  const handleSaveEdit = () => {
    // Perform the save action here, like updating the contact in the list
    if (isNewContact) {
      addNewContact(editedName, editedPhoneNumber);
    } else if (editedContact) {
      editContact(editedContact.id, editedName, editedPhoneNumber);
    }
    closeEditModal();
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    closeEditModal();
  };

  const filteredContacts = contacts.filter((contact) => {
    if (searchByPhoneNumber) {
      return contact.phoneNumber.includes(searchTerm);
    } else {
      return contact.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  return (
    <Container>
      <Row className="pb-4 align-items-center">
        <Col>
          <Form.Control
            type="text"
            placeholder={
              searchByPhoneNumber ? "Search by Phone Number" : "Search by Name"
            }
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={toggleSearchMode}>
            {searchByPhoneNumber ? "Search by Name" : "Search by Phone Number"}
          </Button>
        </Col>
        <Col xs="auto">
          <Button
            variant="primary"
            onClick={() => {
              setIsNewContact(true);
              openEditModal(null);
            }}
          >
            Add contact
          </Button>
        </Col>
      </Row>
      <ListGroup>
        {filteredContacts.map((contact) => (
          <ListGroup.Item key={contact.id} action>
            <Row className="align-items-center">
              <Col className="p-2">
                <Card>
                  <Card.Body>
                    <Card.Title>Name: {contact.name}</Card.Title>
                    <Card.Text>Phone Number: {contact.phoneNumber}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs="auto">
                <Stack gap={2} direction="horizontal">
                  <Button
                    variant="primary"
                    onClick={() => {
                      setIsViewForm(true);
                      openEditModal(contact);
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setIsNewContact(false);
                      openEditModal(contact);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => {
                      onContactDelete(contact.id);
                    }}
                  >
                    Delete
                  </Button>
                </Stack>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <EditContactModal
        show={showEditModal}
        onClose={handleCloseModal}
        onSave={handleSaveEdit}
        editedName={editedName}
        editedPhoneNumber={editedPhoneNumber}
        onNameChange={handleNameChange}
        onPhoneNumberChange={handlePhoneNumberChange}
        isDirty={isDirty}
        isNewContact={isNewContact}
        nameError={nameError}
        phoneNumberError={phoneNumberError}
        isViewForm={isViewForm}
      />
    </Container>
  );
};

export default ContactList;
