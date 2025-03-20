import { useEffect, useState } from "react";
import { Button, Alert, Container, Form, Row, Col, FormLabel } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const UpdateBook = () => {
  const { book_id } = useParams();
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

  if (!formData.bookName.trim()) {
    newErrors.bookName = "Book name is required.";
  } else if (formData.bookName.length < 4) {
    newErrors.bookName = "Book name must be at least 4 characters long.";
  }

  if (!formData.author.trim()) {
    newErrors.author = "Author is required.";
  } else if (formData.author.length < 4) {
    newErrors.author = "Author name must be at least 4 characters long.";
  }

  if (!formData.publishedDate) {
    newErrors.publishedDate = "Published date is required.";
  }

  if (formData.quantity === "" || formData.quantity <= 0) {
    newErrors.quantity = "Quantity must be a positive number.";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: name === "quantity" ? Number(value) : value, // Ensure quantity is stored as a number
    });
    setErrors({
      ...errors,
      [name]: "", // Clear error for the field being edited
    });
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/get_book/${book_id}`
        );
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        setSubmitError("Failed to fetch book details.");
      }
    };
    fetchBook();
  }, [book_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/update_book/${book_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update the book. Please try again.");
      }

      const data = await response.json();
      console.log("Book updated:", data);

      navigate("/book_list");
    } catch (error) {
      setSubmitError(error.message);
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
    fontSize: '0.875rem',
    padding: '0.2rem 2rem',
    color:'red'
  };


  return (
    <Container className="container mt-5">

      {submitError && <Alert variant="danger">{submitError}</Alert>}

      <Form
        onSubmit={handleSubmit}
        className="shadow p-4 rounded bg-light mx-auto"
        style={{ maxWidth: "500px" }}
      >
      <h1 className="text-center mb-4">Update Book Data</h1>


        <Row className="align-items-center  mb-3">
          <Col xs={4}>
            <FormLabel className="mb-0 m-1" style={{ fontWeight: 'bold' }} >
               Book ID :
            </FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Group controlId="formBasicName">
              <Form.Control
                className={`form-control ${
                  errors.bookId ? "is-invalid" : ""
                  }`}
                readOnly
                id="bookId"
                // type="email"
                name="bookId"
                placeholder="Enter Your phone Number"
                value={formData.bookId}
                onChange={handleInputChange}
                />
            </Form.Group>
          </Col>
              {errors.bookId && (
                <Alert variant="danger" style={alertStyle}>{errors.bookId}</Alert>
              )}
        </Row>


        <Row className="align-items-center  mb-3">
          <Col xs={4}>
            <FormLabel className="mb-0 m-1" style={{ fontWeight: 'bold' }} >
               Book Name :
            </FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Group controlId="formBasicName">
              <Form.Control
                className={`form-control ${
                  errors.bookName ? "is-invalid" : ""
                }`}
                id="bookName"
                // type="email"
                name="bookName"
                placeholder="Enter Your phone Number"
                value={formData.bookName}
                onChange={handleInputChange}
                />
            </Form.Group>
          </Col>
              {errors.bookName && (
                <Alert variant="danger" style={alertStyle}>{errors.bookName}</Alert>
              )}
        </Row>



        
        <Row className="align-items-center  mb-3">
          <Col xs={4}>
            <FormLabel className="mb-0 m-1" style={{ fontWeight: 'bold' }} >
              Author Name :
            </FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Group controlId="formBasicName">
              <Form.Control
                className={`form-control ${
                  errors.author ? "is-invalid" : ""
                }`}
                id="author"
                // type="email"
                name="author"
                placeholder="Enter Your phone Number"
                value={formData.author}
                onChange={handleInputChange}
                />
            </Form.Group>
          </Col>
              {errors.author && (
                <Alert variant="danger" style={alertStyle}>{errors.author}</Alert>
              )}
        </Row>


        

        <Row className="align-items-center  mb-3">
          <Col xs={4}>
            <FormLabel className="mb-0 m-1" style={{ fontWeight: 'bold' }} >
              Published Date :
            </FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Group controlId="formBasicName">
              <Form.Control
                type="date"
                className={`form-control ${
                  errors.publishedDate ? "is-invalid" : ""
                }`}
                id="publishedDate"
                // type="email"
                name="publishedDate"
                placeholder="Enter Your phone Number"
                value={formData.publishedDate}
                onChange={handleInputChange}
                />
            </Form.Group>
          </Col>
              {errors.publishedDate && (
                <Alert variant="danger" style={alertStyle}>{errors.publishedDate}</Alert>
              )}
        </Row>


        <Row className="align-items-center  mb-3">
          <Col xs={4}>
            <FormLabel className="mb-0 m-1" style={{ fontWeight: 'bold' }} >
              Quantity :
            </FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Group controlId="formBasicName">
              <Form.Control
                type="number"
                className={`form-control ${
                  errors.quantity ? "is-invalid" : ""
                }`}
                id="quantity"
                // type="email"
                name="quantity"
                placeholder="Enter Your phone Number"
                value={formData.quantity}
                onChange={handleInputChange}
                />
            </Form.Group>
          </Col>
              {errors.quantity && (
                <Alert variant="danger" style={alertStyle}>{errors.quantity}</Alert>
              )}
        </Row>

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

export default UpdateBook;
