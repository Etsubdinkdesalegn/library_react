import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/get_books");
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error.message);
      }
    };
    fetchBooks();
  }, []);





  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1 className="text-center mb-4">Library Book List</h1>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Book ID</th>
                <th>Book Name</th>
                <th>Author</th>
                <th>Published Date</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {books.length > 0 ? (
                books.map((book) => (
                  <tr key={book.bookId}>
                    <td>{book.bookId}</td>
                    <td>{book.bookName}</td>
                    <td>{book.author}</td>
                    <td>{book.publishedDate}</td>
                    <td>{book.quantity}</td>
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
    </Container>
  );
};

export default BookList;
