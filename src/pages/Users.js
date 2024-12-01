import { useEffect, useState } from "react";
import { userService } from "../api/userService";
import UserForm from "../components/UserForm";
import { confirmAlert } from "react-confirm-alert";
import Toast from "../components/Toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserFormVisible, setIsUserFormVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserFormVisible(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsUserFormVisible(true);
  };

  const handleCancelForm = () => {
    setIsUserFormVisible(false);
    setSelectedUser(null);
  };

  const refreshUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error refreshing users:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    confirmAlert({
      title: "Delete User",
      message: "Are you sure you want to delete this user?",
      buttons: [
        {
          label: "Yes, Delete",
          onClick: async () => {
            try {
              await userService.deleteUser(userId);
              refreshUsers();
              showToast("User deleted successfully", "success");
            } catch (error) {
              console.error("Error deleting user:", error);
              showToast("Error deleting user.", "error");
            }
          },
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };

  const handleSaveUser = async (user) => {
    try {
      if (selectedUser) {
        await userService.updateUser(selectedUser.id, user);
        showToast("User updated successfully!", "success");
      } else {
        await userService.createUser(user);
        showToast("User created successfully!", "success");
      }
      setIsUserFormVisible(false);
      refreshUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      showToast("Error saving user", "error");
    }
  };

  if (!users) {
    return (
      <div className="container mt-5">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-3">User Management</h2>
      <div className="card shadow mb-3">
        <div className="card-body">
          <h3 className="mb-3">Users</h3>
          <p>
            Manage your application's users. You can add, edit, or delete users
            to keep your system organized.
          </p>
          <button className="btn btn-success" onClick={handleAddUser}>
            <i className="bi bi-plus-circle me-2"></i> Add User
          </button>
        </div>
      </div>

      {users.length > 0 ? (
        <ul className="list-group">
          {users.map((user) => (
            <li
              key={user.id}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center">
                <i className="bi bi-person me-2 text-primary"></i>
                <span>{user.email}</span>
              </div>
              <div>
                <button
                  className="btn btn-sm btn-danger me-2"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <i className="bi bi-trash-fill"></i> Delete
                </button>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => handleEditUser(user)}
                >
                  <i className="bi bi-pencil-square me-1"></i> Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">No users available yet.</p>
      )}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />

      {isUserFormVisible && (
        <UserForm
          user={selectedUser}
          onSave={handleSaveUser}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
};

export default Users;
