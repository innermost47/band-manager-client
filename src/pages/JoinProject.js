import { userService } from "../api/userService";
import JoinProjectForm from "../components/JoinProjectForm";

const JoinProjectPage = () => {
  const handleJoinProject = async (code) => {
    return await userService.joinWithCode({ code });
  };

  return (
    <div className="container mt-5 mb-3">
      <div className="text-center mb-4">
        <div
          className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
          style={{
            width: "64px",
            height: "64px",
            minWidth: "64px",
          }}
        >
          <i className="bi bi-box-arrow-in-right fs-2 text-primary"></i>
        </div>
        <h2 className="text-center mb-3">Join a Project</h2>
        <p className="text-muted">
          Enter your invitation code to join a project
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <JoinProjectForm onJoin={handleJoinProject} />
        </div>
      </div>
    </div>
  );
};

export default JoinProjectPage;
