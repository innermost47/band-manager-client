import { useState } from "react";

const UserForm = ({ user, onSave, onCancel }) => {
  const availableRoles = [
    "ROLE_GUITARIST",
    "ROLE_ARRANGEUR",
    "ROLE_SINGER",
    "ROLE_DRUMMER",
    "ROLE_MANAGER",
    "ROLE_BASSIST",
  ];

  const [email, setEmail] = useState(user?.email || "");
  const [roles, setRoles] = useState(user?.roles || []);

  const handleRoleChange = (role) => {
    if (roles.includes(role)) {
      setRoles(roles.filter((r) => r !== role));
    } else {
      setRoles([...roles, role]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ email, roles });
  };

  return (
    <div className="card mt-3 shadow">
      <div className="card-body">
        <h3>{user ? "Edit User" : "Add User"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Roles</label>
            <div>
              {availableRoles.map((role) => (
                <div key={role} className="form-check">
                  <input
                    type="checkbox"
                    id={role}
                    className="form-check-input"
                    checked={roles.includes(role)}
                    onChange={() => handleRoleChange(role)}
                  />
                  <label htmlFor={role} className="form-check-label">
                    {role.replace("ROLE_", "").toLowerCase()}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-pencil-square me-1"></i> Save
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
