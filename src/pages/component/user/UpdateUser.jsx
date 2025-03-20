import { useEffect, useState } from "react";
import { Button, Alert, Container, Form, Row, Col, FormLabel } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const UpdateUser = () => {
  const { user_id } = useParams();
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

  // Validate the form based on new rules
  const validateForm = () => {
    const newErrors = {};

    // Validate User ID: At least 4 characters or numbers
    if (formData.userId.length < 4) newErrors.userId = "User ID must be at least 4 characters.";

    // Validate Name: At least 7 characters, contains a space, and has no numbers
    const nameRegex = /^[A-Za-z\s]+$/; // Only characters and spaces allowed
    if (formData.name.trim().length < 7) {
      newErrors.name = "Name must be at least 7 characters long.";
    } else if (!/\s/.test(formData.name)) {
      newErrors.name = "Name must contain at least one space.";
    } else if (!nameRegex.test(formData.name)) {
      newErrors.name = "Name must not contain numbers.";
    }

    // Validate Email: Must be a valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Validate other fields
    if (!formData.phone.trim()) newErrors.phone = "Phone is required.";
    if (!formData.role.trim()) newErrors.role = "Role is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error for the field being edited
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/get_user/${user_id}`);
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        setSubmitError("Failed to fetch user details.");
      }
    };
    fetchUser();
  }, [user_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(`http://localhost:8080/api/update_user/${user_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update the user. Please try again.");
      }

      navigate("/user_list");
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  const handleReset = () => {
    setFormData({
      ...formData, // Keep the existing `userId`
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
        <h1 className="text-center mb-4">Update User Data</h1>

        <Row className="align-items-center mb-3">
          <Col xs={4}>
            <FormLabel className="mb-0 m-1" style={{ fontWeight: "bold" }}>
              User ID :
            </FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Control
              id="userId"
              name="userId"
              value={formData.userId}
              placeholder="User ID (Read-Only)"
              readOnly
              className={`form-control ${errors.userId ? "is-invalid" : ""}`}
            />
            {errors.userId && <div style={alertStyle}>{errors.userId}</div>}
          </Col>
        </Row>

        <Row className="align-items-center mb-3">
          <Col xs={4}>
            <FormLabel className="mb-0 m-1" style={{ fontWeight: "bold" }}>
              Name :
            </FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Control
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
            />
            {errors.name && <div style={alertStyle}>{errors.name}</div>}
          </Col>
        </Row>

        <Row className="align-items-center mb-3">
          <Col xs={4}>
            <FormLabel className="mb-0 m-1" style={{ fontWeight: "bold" }}>
              Email :
            </FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Control
              id="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
            />
            {errors.email && <div style={alertStyle}>{errors.email}</div>}
          </Col>
        </Row>

        <Row className="align-items-center mb-3">
          <Col xs={4}>
            <FormLabel className="mb-0 m-1" style={{ fontWeight: "bold" }}>
              Phone :
            </FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Control
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleInputChange}
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            />
            {errors.phone && <div style={alertStyle}>{errors.phone}</div>}
          </Col>
        </Row>

        <Row className="align-items-center mb-3">
          <Col xs={4}>
            <FormLabel className="mb-0 m-1" style={{ fontWeight: "bold" }}>
              Role :
            </FormLabel>
          </Col>
          <Col xs={8}>
            <Form.Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className={`form-control ${errors.role ? "is-invalid" : ""}`}
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              <option value="Guest">Guest</option>
            </Form.Select>
            {errors.role && <div style={alertStyle}>{errors.role}</div>}
          </Col>
        </Row>

        <Row className="justify-content-center mt-3">
          <Col xs="auto">
            <Button
              type="submit"
              variant="primary"
              className="btn-sm"
              style={{ width: "120px", textAlign: "center" }}
            >
              Update User
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

export default UpdateUser;
