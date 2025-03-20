import { useState } from "react";
import axios from "axios";
import {
  Button,
  Alert,
  Form,
  FormLabel,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const UserForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    email: "",
    phone: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const validateForm = () => {
    const newErrors = {};
    // Validation logic
    if (!formData.userId.trim()) {
      newErrors.userId = "User ID is required.";
    } else if (
      formData.userId.length < 4 ||
      !/^[a-zA-Z0-9]+$/.test(formData.userId)
    ) {
      newErrors.userId =
        "User ID must be at least 4 characters (letters or numbers).";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (
      formData.name.length < 7 ||
      !formData.name.includes(" ") ||
      /\d/.test(formData.name)
    ) {
      newErrors.name =
        "Name must be at least 7 characters, contain a space, and have no numbers.";
    }
    if (
      !formData.email.trim() ||
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
    ) {
      newErrors.email = "Valid email is required.";
    }
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Valid 10-digit phone number is required.";
    }
    if (!formData.role) {
      newErrors.role = "Please select a role.";
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
        "http://localhost:8080/api/save_user",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("User registered:", response.data);
      navigate("/user_list");
    } catch (err) {
      console.error("Error registering user:", err.message);
      setSubmitError("Failed to register user. Please try again later.");
    } finally {
    }
  };

  const handleReset = () => {
    setFormData({
      userId: "",
      name: "",
      email: "",
      phone: "",
      role: "",
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
        <h1 className="text-center mb-4">User Registration</h1>

        {/* User ID */}
        <Row className="align-items-center mb-3">
          <Col xs={4}>
            <FormLabel className="mb-0 m-1" style={{ fontWeight: "bold" }}>
              User ID :
            </FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Control
              className={`form-control ${errors.userId ? "is-invalid" : ""}`}
              id="userId"
              name="userId"
              placeholder="Enter Your User ID"
              value={formData.userId}
              onChange={handleInputChange}
            />
          </Col>
          {errors.userId && (
            <Alert variant="danger" style={alertStyle}>
              {errors.userId}
            </Alert>
          )}
        </Row>

        {/* Name */}
        <Row className="align-items-center mb-3">
          <Col xs={4}>
            <FormLabel className="mb-0 m-1" style={{ fontWeight: "bold" }}>
              Name :
            </FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Control
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              id="name"
              name="name"
              placeholder="Enter Your Name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </Col>
          {errors.name && (
            <Alert variant="danger" style={alertStyle}>
              {errors.name}
            </Alert>
          )}
        </Row>

        {/* Email */}
        <Row className="align-items-center mb-3">
          <Col xs={4}>
            <FormLabel className="mb-0 m-1" style={{ fontWeight: "bold" }}>
              Email :
            </FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Control
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              id="email"
              name="email"
              placeholder="Enter Your Email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </Col>
          {errors.email && (
            <Alert variant="danger" style={alertStyle}>
              {errors.email}
            </Alert>
          )}
        </Row>

        {/* Phone */}
        <Row className="align-items-center mb-3">
          <Col xs={4}>
            <FormLabel className="mb-0 m-1" style={{ fontWeight: "bold" }}>
              Phone :
            </FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Control
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              id="phone"
              name="phone"
              placeholder="Enter Your Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </Col>
          {errors.phone && (
            <Alert variant="danger" style={alertStyle}>
              {errors.phone}
            </Alert>
          )}
        </Row>

        {/* Role */}
        <Row className="align-items-center mb-3">
          <Col xs={4}>
            <FormLabel className="mb-0 m-1" style={{ fontWeight: "bold" }}>
              Role :
            </FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Select
              className={`form-control ${errors.role ? "is-invalid" : ""}`}
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              <option value="Guest">Guest</option>
            </Form.Select>
          </Col>
          {errors.role && (
            <Alert variant="danger" style={alertStyle}>
              {errors.role}
            </Alert>
          )}
        </Row>

        {/* Buttons */}
        <Row className="justify-content-center mt-3">
          <Col xs="auto">
            <Button
              type="submit"
              variant="primary"
              className="btn-sm"
              style={{ width: "120px", textAlign: "center" }}
            >
              Save User
            </Button>
          </Col>
          <Col xs="auto">
            <Button
              type="button"
              variant="danger"
              className="btn-sm"
              onClick={handleReset}
              style={{
                width: "120px",
                backgroundColor: "red",
                color: "white",
                textAlign: "center",
              }}
            >
              Reset
            </Button>
          </Col>
        </Row>
      
      </Form>
    </Container>
  );
};

export default UserForm;
