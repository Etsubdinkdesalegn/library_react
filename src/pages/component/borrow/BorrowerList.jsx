import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BorrowerList = () => {
  const [borrowedRecords, setBorrowedRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Function to fetch the latest borrowed records
  const fetchBorrowedRecords = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/get_students");
      setBorrowedRecords(response.data);
      setFilteredRecords(response.data);
    } catch (error) {
      console.error("Error fetching borrowed records:", error.message);
    }
  };

  // Fetch borrowed records on component mount
  useEffect(() => {
    fetchBorrowedRecords();
  }, []);

  // Filter records based on the search query
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredRecords(borrowedRecords);
    } else {
      const lowercasedSearchQuery = searchQuery.toLowerCase();
      const filtered = borrowedRecords.filter(
        (record) =>
          record.studentName.toLowerCase().includes(lowercasedSearchQuery) ||
          record.borrowedBook.toLowerCase().includes(lowercasedSearchQuery)
      );
      setFilteredRecords(filtered);
    }
  }, [searchQuery, borrowedRecords]);

  // Open confirmation dialog
  const openConfirmationDialog = (recordId) => {
    setSelectedRecordId(recordId);
    setShowConfirmModal(true);
  };

  // Close confirmation dialog
  const closeConfirmationDialog = () => {
    setSelectedRecordId(null);
    setShowConfirmModal(false);
  };

  // Close message modal
  const closeMessageModal = () => {
    setShowMessageModal(false);
    setModalMessage("");
    setIsError(false);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedRecordId) return;

    try {
      const response = await axios.delete(`http://localhost:8080/api/delete_student/${selectedRecordId}`);
      if (response.status === 200) {
        setModalMessage(`Student with ID ${selectedRecordId} deleted successfully.`);
        // Refetch the latest data from the server
        await fetchBorrowedRecords();
      }
    } catch (error) {
      if (error.response) {
        setModalMessage(`Failed to delete student: ${error.response.data}`);
      } else {
        setModalMessage("An unexpected error occurred while deleting the student.");
      }
      setIsError(true);
    } finally {
      setShowConfirmModal(false);
      setShowMessageModal(true);
    }
  };

  // Navigate to the update page
  const handleUpdate = (recordId) => {
    navigate(`/update_borrower/${recordId}`);
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1 className="text-center mb-4">Borrower List & Borrowed Books</h1>

          {/* Search Field */}
          <Form.Control
            type="text"
            placeholder="Search by student name or borrowed book"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Borrowed Book</th>
                <th>Issued Date</th>
                <th>Librarian</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.studentId}>
                    <td>{record.studentId}</td>
                    <td>{record.studentName}</td>
                    <td>{record.borrowedBook}</td>
                    <td>{record.issuedDate}</td>
                    <td>{record.servedBy}</td>
                    <td>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleUpdate(record.studentId)}
                      >
                        Update
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => openConfirmationDialog(record.studentId)}
                      >
                        Return
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={closeConfirmationDialog} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the borrower record with ID{" "}
          <b>{selectedRecordId}</b>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeConfirmationDialog}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Message Modal */}
      <Modal show={showMessageModal} onHide={closeMessageModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isError ? "Error" : "Success"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={closeMessageModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BorrowerList;
