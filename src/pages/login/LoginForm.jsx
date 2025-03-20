import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Alert, Card } from "react-bootstrap"; // React Bootstrap for layout and styling
import axios from "axios"; // Using axios for API calls

const LoginForm = ({ setAuth }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: "",
    username: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`http://localhost:8080/api/get_user/${formData.userId}`);

      if (response.status === 200) {
        const data = response.data;
// data.name= formData.username 
        // Check role and navigate based on role
        if (data.role === "Admin") {
          setAuth({ role: "Admin", isAuthenticated: true });
          navigate("/user"); // Redirect to admin page
        } else if ( data.role === "User") {
          setAuth({ role: "User", isAuthenticated: true });
          navigate("/borrower"); // Redirect to user page
        } else {
          throw new Error("Unknown role");
        }
      }
    } catch (err) {
      setError("Invalid userId or password");
    }
  };

  const handleGuestLogin = () => {
    // Directly navigate to the guest's page (adjust based on your needs)
    setAuth({ role: "Guest", isAuthenticated: true });
    navigate("/guest");
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh", backgroundColor: "#f0f4f8" }}>
      <Card className="p-5" style={{ width: "100%", maxWidth: "400px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
        <Card.Body>
          <h2 className="text-center mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '600', color: "#333" }}>
            User Login
          </h2>
          {error && <Alert variant="danger">{error}</Alert>} {/* Display error if any */}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUserId" className="mb-3">
              <Form.Label style={{ fontWeight: "500", color: "#555" }}>UserId</Form.Label>
              <Form.Control
                type="text"
                name="userId"
                placeholder="Enter UserId"
                value={formData.userId}
                onChange={handleInputChange}
                required
                style={{ borderRadius: "8px", boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)", fontSize: "14px" }}
              />
            </Form.Group>

            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label style={{ fontWeight: "500", color: "#555" }}>Username</Form.Label>
              <Form.Control
                type="Password"
                name="username"
                placeholder="Enter Username"
                value={formData.username}
                onChange={handleInputChange}
                required
                style={{ borderRadius: "8px", boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)", fontSize: "14px" }}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3" style={{ borderRadius: "8px", padding: "10px", backgroundColor: "#0056b3", border: "none" }}>
              Login
            </Button>

            {/* Continue as Guest Button as normal text */}
            <div className="text-center mt-3">
              <Button variant="link" onClick={handleGuestLogin} style={{ color: "#007bff", fontSize: "14px", textDecoration: "none" }}>
                Continue as Guest
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>

  );
};

export default LoginForm;
