import { Container, Nav, Button, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const UserHeader = () => {
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/"); 
  };

  return (
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <strong>Library Management System</strong>
        </Navbar.Brand>
        <Nav className="ms-auto">  {/* Aligning nav items to the right */}
          <Nav.Item>
            <Nav.Link as={Link} to="/borrower" className="nav-link">New Borrower</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/book" className="nav-link">New Book</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/book_list" className="nav-link">Book List</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/borrower_list" className="nav-link">Borrower List</Nav.Link>
          </Nav.Item>

          {/* Logout Button */}
        </Nav>
      </Container>
          <Nav.Item>
            <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
          </Nav.Item>
    </Navbar>
  );
}

export default UserHeader;
