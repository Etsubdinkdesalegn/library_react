import axios from "axios";
import { useState } from "react";
import { Button, Alert, Row, Col, FormLabel, Form, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // Install with `npm install uuid`

const BookForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bookId: "",
    bookName: "",
    author: "",
    publishedDate: "",
    quantity: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bookId.trim())
      newErrors.bookId = "Book ID is required.";
    else if (formData.bookId.trim().length < 4)
      newErrors.bookId = "Book ID must be at least 4 characters.";

    if (!formData.bookName.trim())
      newErrors.bookName = "Book name is required.";
    else if (formData.bookName.trim().length < 4)
      newErrors.bookName = "Book name must be at least 4 characters.";

    if (!formData.author.trim())
      newErrors.author = "Author name is required.";
    else if (formData.author.trim().length < 4)
      newErrors.author = "Author name must be at least 4 characters.";

    if (!formData.publishedDate)
      newErrors.publishedDate = "Published date is required.";

    if (!formData.quantity.trim())
      newErrors.quantity = "Quantity is required.";
    else if (isNaN(formData.quantity) || parseInt(formData.quantity, 10) <= 0)
      newErrors.quantity = "Quantity must be a positive number.";

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
      [name]: "", // Clear error for the field being edited
    });
  };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const updatedFormData = {
            ...formData,
            bookId: formData.bookId || uuidv4(),
            quantity: parseInt(formData.quantity, 10),
        };

        console.log("Submitting:", updatedFormData);

        try {
            // Make a POST request using axios
            const response = await axios.post("http://localhost:8080/api/save_book", updatedFormData, {
                headers: { "Content-Type": "application/json" }, // Set the request headers
            });

            console.log("Book created", response.data);

            // Navigate to the book list
            navigate("/book_list");

        } catch (error) {
            // Handle errors gracefully
            setSubmitError(error.response ? error.response.data : error.message);
        }
    };

    const handleReset = () => {
    setFormData({
      bookId: "",
      bookName: "",
      author: "",
      publishedDate: "",
      quantity: "",
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
        <h1 className="text-center mb-4">Register New Book</h1>

        <Row className="align-items-center  mb-3">
          <Col xs={4}>
            <FormLabel className="mb-0 m-1" style={{ fontWeight: "bold" }}>
              Book ID :
            </FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Group controlId="bookId">
              <Form.Control
                className={`form-control ${errors.bookId ? "is-invalid" : ""}`}
                name="bookId"
                placeholder="Enter Book ID"
                value={formData.bookId}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          {errors.bookId && (
            <Alert variant="danger" style={alertStyle}>
              {errors.bookId}
            </Alert>
          )}
        </Row>

        <Row className="align-items-center  mb-3">
          <Col xs={4}>
            <FormLabel className="mb-0 m-1" style={{ fontWeight: "bold" }}>
              Book Name :
            </FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Group controlId="bookName">
              <Form.Control
                className={`form-control ${errors.bookName ? "is-invalid" : ""}`}
                name="bookName"
                placeholder="Enter Book Name"
                value={formData.bookName}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          {errors.bookName && (
            <Alert variant="danger" style={alertStyle}>
              {errors.bookName}
            </Alert>
          )}
        </Row>

        <Row className="align-items-center  mb-3">
          <Col xs={4}>
            <FormLabel className="mb-0 m-1" style={{ fontWeight: "bold" }}>
              Author Name :
            </FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Group controlId="author">
              <Form.Control
                className={`form-control ${errors.author ? "is-invalid" : ""}`}
                name="author"
                placeholder="Enter Author Name"
                value={formData.author}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          {errors.author && (
            <Alert variant="danger" style={alertStyle}>
              {errors.author}
            </Alert>
          )}
        </Row>

        <Row className="align-items-center  mb-3">
          <Col xs={4}>
            <FormLabel className="mb-0 m-1" style={{ fontWeight: "bold" }}>
              Published Date :
            </FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Group controlId="publishedDate">
              <Form.Control
                type="date"
                className={`form-control ${errors.publishedDate ? "is-invalid" : ""}`}
                name="publishedDate"
                value={formData.publishedDate}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          {errors.publishedDate && (
            <Alert variant="danger" style={alertStyle}>
              {errors.publishedDate}
            </Alert>
          )}
        </Row>

        <Row className="align-items-center  mb-3">
          <Col xs={4}>
            <FormLabel className="mb-0 m-1" style={{ fontWeight: "bold" }}>
              Quantity :
            </FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Group controlId="quantity">
              <Form.Control
                type="number"
                className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
                name="quantity"
                placeholder="Enter Quantity"
                value={formData.quantity}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          {errors.quantity && (
            <Alert variant="danger" style={alertStyle}>
              {errors.quantity}
            </Alert>
          )}
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

export default BookForm;
