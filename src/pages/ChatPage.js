import React from "react";
import GlobalChat from "../components/ProjectChat";

const ChatPage = () => {
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
          <i className="bi bi-chat-dots fs-2 text-primary"></i>
        </div>
        <h2 className="mb-3">Project Messages</h2>
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <p className="mb-3">
              Stay connected with your team members across all your projects.
              Chat in real-time, share updates, and collaborate efficiently with
              your project partners in a dedicated communication space.
            </p>
          </div>
        </div>
      </div>
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <GlobalChat />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
