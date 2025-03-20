import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [messageModal, setMessageModal] = useState({ show: false, message: "", isError: false });
  const [searchQuery, setSearchQuery] = useState(""); // To store the search query
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/get_books");
        setBooks(response.data);
        setFilteredBooks(response.data); // Initially set the filteredBooks as all the books
      } catch (error) {
        console.error("Error fetching books:", error.message);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    // Filter books based on the search query
    if (searchQuery === "") {
      setFilteredBooks(books);
    } else {
      const lowercasedSearchQuery = searchQuery.toLowerCase();
      const filtered = books.filter(
        (book) =>
          book.bookName.toLowerCase().includes(lowercasedSearchQuery) ||
          book.author.toLowerCase().includes(lowercasedSearchQuery)
      );
      setFilteredBooks(filtered);
    }
  }, [searchQuery, books]);

  const openConfirmationDialog = (bookId) => {
    setSelectedBookId(bookId);
    setShowConfirmModal(true);
  };

  const closeConfirmationDialog = () => {
    setSelectedBookId(null);
    setShowConfirmModal(false);
  };

  const closeMessageModal = () => {
    setMessageModal({ show: false, message: "", isError: false });
  };

  const handleDelete = async () => {
    if (!selectedBookId) return;

    try {
      const response = await axios.delete(`http://localhost:8080/api/delete_book/${selectedBookId}`);

      if (response.status === 200) {
        setBooks((prevBooks) => prevBooks.filter((book) => book.bookId !== selectedBookId));
        setMessageModal({ show: true, message: response.data, isError: false });
      }
    } catch (err) {
      if (err.response) {
        setMessageModal({ show: true, message: err.response.data, isError: true });
      } else {
        setMessageModal({ show: true, message: "An unexpected error occurred.", isError: true });
      }
    } finally {
      closeConfirmationDialog();
    }
  };

  const handleUpdate = (bookId) => {
    navigate(`/update_book/${bookId}`);
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1 className="text-center mb-4">Library Book List</h1>

          {/* Search Field */}
          <Form.Control
            type="text"
            placeholder="Search by book name or author"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Book ID</th>
                <th>Book Name</th>
                <th>Author</th>
                <th>Published Date</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <tr key={book.bookId}>
                    <td>{book.bookId}</td>
                    <td>{book.bookName}</td>
                    <td>{book.author}</td>
                    <td>{book.publishedDate}</td>
                    <td>{book.quantity}</td>
                    <td>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleUpdate(book.bookId)}
                      >
                        Update
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => openConfirmationDialog(book.bookId)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No books found.
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
          Are you sure you want to delete the book with ID{" "}
          <b>{selectedBookId}</b>? This action cannot be undone.
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
      <Modal show={messageModal.show} onHide={closeMessageModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{messageModal.isError ? "Error" : "Success"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{messageModal.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={closeMessageModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BookList;
