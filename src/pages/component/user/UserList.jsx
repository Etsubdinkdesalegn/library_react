import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [messageModal, setMessageModal] = useState({ show: false, message: "", isError: false });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/get_users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };
    fetchUsers();
  }, []);

  // Open confirmation dialog
  const openConfirmationDialog = (userId) => {
    setSelectedUserId(userId);
    setShowConfirmModal(true);
  };

  // Close confirmation dialog
  const closeConfirmationDialog = () => {
    setSelectedUserId(null);
    setShowConfirmModal(false);
  };

  // Close message modal
  const closeMessageModal = () => {
    setMessageModal({ show: false, message: "", isError: false });
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedUserId) return;

    try {
      const response = await axios.delete(`http://localhost:8080/api/delete_user/${selectedUserId}`);
      if (response.status === 200) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== selectedUserId));
        setMessageModal({ show: true, message: `User with ID ${selectedUserId} deleted successfully.`, isError: false });
      }
    } catch (error) {
      if (error.response) {
        setMessageModal({ show: true, message: error.response.data, isError: true });
      } else {
        setMessageModal({ show: true, message: "An unexpected error occurred while deleting the user.", isError: true });
      }
    } finally {
      closeConfirmationDialog();
    }
  };

  // Navigate to the update page
  const handleUpdate = (userId) => {
    navigate(`/update_user/${userId}`);
  };

  return (
    <>
      <Container className="mt-5">
        <Row>
          <Col>
            <h1 className="text-center">User List</h1>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.userId}>
                      <td>{user.userId}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.role}</td>
                      <td>
                        <Button
                          variant="outline-secondary"
                          onClick={() => handleUpdate(user.userId)}
                          className="me-2"
                        >
                          Update
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => openConfirmationDialog(user.userId)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No users found.
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
            Are you sure you want to delete the user with ID <b>{selectedUserId}</b>? This action cannot be undone.
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
    </>
  );
};

export default UserList;
