import React, { useMemo } from "react";
import ContactList from "./components/ContactList";
import useLocalStorage from "./hooks/useLocalStorage";
import { Container, Row } from "react-bootstrap";

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
}

function App() {
  const [contacts, setContacts] = useLocalStorage<Contact[]>("contacts", []);

  const handleAddContact = (name: string, phoneNumber: string) => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name,
      phoneNumber,
    };
    setContacts([...contacts, newContact]);
  };

  const handleEditContact = (id: string, name: string, phoneNumber: string) => {
    const updatedContacts = contacts.map((contact) =>
      contact.id === id ? { ...contact, name, phoneNumber } : contact
    );
    setContacts(updatedContacts);
  };

  const handleContactDelete = (contactId: string) => {
    const filteredContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );
    setContacts([...filteredContacts]);
  };

  const existingContactNames = useMemo(() => {
    return contacts.map((contact) => contact.name);
  }, [contacts]);

  const existingContactPhoneNumbers = useMemo(() => {
    return contacts.map((contact) => contact.phoneNumber);
  }, [contacts]);

  return (
    <Container>
      <Row className="p-2 mt-4">
        <h1>Phonebook App</h1>
      </Row>
      <ContactList
        contacts={contacts}
        editContact={handleEditContact}
        addNewContact={handleAddContact}
        onContactDelete={handleContactDelete}
        existingNames={existingContactNames}
        existingPhoneNumbers={existingContactPhoneNumbers}
      />
    </Container>
  );
}

export default App;
