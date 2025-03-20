import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Alert, Row, Col, FormLabel, Form, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const BorrowForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    borrowedBook: "",
    issuedDate: "",
    servedBy: "",
  });
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/get_books");
        setBooks(response.data);
      } catch (err) {
        console.error("Error fetching books:", err.message);
        setSubmitError("Failed to fetch books. Please try again later.");
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/get_users");
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err.message);
      }
    };

    fetchBooks();
    fetchUsers();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentId.trim()) {
      newErrors.studentId = "Student ID is required.";
    } else if (formData.studentId.includes(" ") || formData.studentId.length < 4) {
      newErrors.studentId = "Student ID must be at least 4 characters long without spaces.";
    }

    if (!formData.studentName.trim()) {
      newErrors.studentName = "Student Name is required.";
    } else if (formData.studentName.length < 6 || !formData.studentName.includes(" ")) {
      newErrors.studentName =
        "Student Name must be at least 6 characters long and contain a space.";
    }

    if (!formData.borrowedBook) {
      newErrors.borrowedBook = "Please select a book.";
    }

    if (!formData.issuedDate) {
      newErrors.issuedDate = "Issued Date is required.";
    }

    if (!formData.servedBy) {
      newErrors.servedBy = "Please select a user.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/save_student",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Student registered:", response.data);
      navigate("/borrower_list");
    } catch (err) {
      console.error("Error registering student:", err.message);
      setSubmitError("Failed to register student. Please try again later.");
    }
  };

  const handleReset = () => {
    setFormData({
      studentId: "",
      studentName: "",
      borrowedBook: "",
      issuedDate: "",
      servedBy: "",
    });
    setErrors({});
    setSubmitError("");
  };

  const alertStyle = {
    fontSize: "0.875rem",
    padding: "0.2rem 2rem",
    color: "red",
  };

  return (
    <Container className="container mt-5">
      {submitError && <Alert variant="danger">{submitError}</Alert>}

      <Form
        onSubmit={handleSubmit}
        className="shadow p-4 rounded bg-light mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <h1 className="text-center mb-4">Register Borrower</h1>

        {/* Student ID */}
        <Row className="align-items-center mb-3">
          <Col xs={4}>
            <FormLabel style={{ fontWeight: "bold" }}>Student ID:</FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Control
              className={errors.studentId ? "is-invalid" : ""}
              id="studentId"
              name="studentId"
              placeholder="Enter Student ID"
              value={formData.studentId}
              onChange={handleInputChange}
            />
            {errors.studentId && <Alert variant="danger" style={alertStyle}>{errors.studentId}</Alert>}
          </Col>
        </Row>

        {/* Student Name */}
        <Row className="align-items-center mb-3">
          <Col xs={4}>
            <FormLabel style={{ fontWeight: "bold" }}>Student Name:</FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Control
              className={errors.studentName ? "is-invalid" : ""}
              id="studentName"
              name="studentName"
              placeholder="Enter Student Name"
              value={formData.studentName}
              onChange={handleInputChange}
            />
            {errors.studentName && <Alert variant="danger" style={alertStyle}>{errors.studentName}</Alert>}
          </Col>
        </Row>

        {/* Borrowed Book */}
        <Row className="align-items-center mb-3">
          <Col xs={4}>
            <FormLabel style={{ fontWeight: "bold" }}>Borrowed Book:</FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Select
              id="borrowedBook"
              name="borrowedBook"
              value={formData.borrowedBook}
              onChange={handleInputChange}
              className={errors.borrowedBook ? "is-invalid" : ""}
            >
              <option value="">Select a Book</option>
              {books.map((book) => (
                <option key={book.bookId} value={book.bookName}>
                  {book.bookName}
                </option>
              ))}
            </Form.Select>
            {errors.borrowedBook && <Alert variant="danger" style={alertStyle}>{errors.borrowedBook}</Alert>}
          </Col>
        </Row>

        {/* Issued Date */}
        <Row className="align-items-center mb-3">
          <Col xs={4}>
            <FormLabel style={{ fontWeight: "bold" }}>Issued Date:</FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Control
              type="date"
              id="issuedDate"
              name="issuedDate"
              value={formData.issuedDate}
              onChange={handleInputChange}
              className={errors.issuedDate ? "is-invalid" : ""}
            />
            {errors.issuedDate && <Alert variant="danger" style={alertStyle}>{errors.issuedDate}</Alert>}
          </Col>
        </Row>

        {/* Served By */}
        <Row className="align-items-center mb-3">
          <Col xs={4}>
            <FormLabel style={{ fontWeight: "bold" }}>Served By:</FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Select
              id="servedBy"
              name="servedBy"
              value={formData.servedBy}
              onChange={handleInputChange}
              className={errors.servedBy ? "is-invalid" : ""}
            >
              <option value="">Select a User</option>
              {users.map((user) => (
                <option key={user.id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </Form.Select>
            {errors.servedBy && <Alert variant="danger" style={alertStyle}>{errors.servedBy}</Alert>}
          </Col>
        </Row>

        {/* Buttons */}
        <Row className="justify-content-center mt-3">
          <Col xs="auto">
            <Button
              type="submit"
              variant="primary"
              style={{ width: "120px", textAlign: "center" }}
            >
              Submit
            </Button>
          </Col>
          <Col xs="auto">
            <Button
              type="button"
              variant="danger"
              style={{
                width: "120px",
                backgroundColor: "red",
                color: "white",
                textAlign: "center",
              }}
              onClick={handleReset}
            >
              Reset
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default BorrowForm;
