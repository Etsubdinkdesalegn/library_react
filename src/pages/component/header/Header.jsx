import { Container, Nav, Button } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom"; 
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = () => {
    // Clear user data or token, typically from local storage/session
    localStorage.removeItem("auth");  // If you are using localStorage to store tokens
    // or clear session data like sessionStorage.removeItem('authToken');
    // Redirect to login page
    navigate("/");  // Assuming you have a login page route set up
  };

  return (
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <strong>Library Management System</strong>
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/user" className="nav-link">New User</Nav.Link>
          <Nav.Link as={Link} to="/borrower" className="nav-link">New Borrower</Nav.Link>
          <Nav.Link as={Link} to="/book" className="nav-link">New Book</Nav.Link>
          <Nav.Link as={Link} to="/user_list" className="nav-link">User</Nav.Link>
          <Nav.Link as={Link} to="/book_list" className="nav-link">Book List</Nav.Link>
          <Nav.Link as={Link} to="/borrower_list" className="nav-link">Borrower List</Nav.Link>
          
        </Nav>
      </Container>
          {/* Logout Button */}
          <Nav.Link className="nav-link">
            <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
          </Nav.Link>
    </Navbar>
  );
};

export default Header;
