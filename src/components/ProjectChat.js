import React, { useState, useEffect, useRef } from "react";
import { chatService } from "../api/chatService";
import { userService } from "../api/userService";
import MentionInput from "./MentionInput";

const GlobalChat = () => {
  const [projects, setProjects] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const pollingInterval = useRef(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await userService.getMyProjects();
        const projectsWithChannels = await Promise.all(
          response.data.map(async (project) => {
            const channelResponse = await chatService.getOrCreateProjectChannel(
              project.id
            );
            return {
              ...project,
              channel: channelResponse.data,
            };
          })
        );
        setProjects(projectsWithChannels);
        if (projectsWithChannels.length > 0) {
          setActiveChannel(projectsWithChannels[0].channel);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const checkScreenSize = () => {
    setIsSmallScreen(window.innerWidth < 768);
    setSidebarVisible(window.innerWidth > 768);
  };

  useEffect(() => {
    const handleResize = () => {
      checkScreenSize();
    };
    window.addEventListener("resize", handleResize);
    checkScreenSize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (activeChannel) {
      setMessages([]);
      setLastMessageTimestamp(null);
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }

      const init = async () => {
        await fetchMessages();
        startPolling();
      };

      init();
      setSidebarVisible(!isSmallScreen);

      return () => {
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current);
        }
      };
    }
  }, [activeChannel?.id]);

  const startPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
    }

    pollingInterval.current = setInterval(async () => {
      try {
        if (!lastMessageTimestamp) {
          console.log("No timestamp, skipping");
          return;
        }

        const timestamp = lastMessageTimestamp;
        const response = await chatService.getNewMessages(
          activeChannel.id,
          timestamp
        );

        if (response?.data?.length > 0) {
          const newMessages = response.data.filter(
            (newMsg) =>
              !messages.some((existingMsg) => existingMsg.id === newMsg.id)
          );
          if (newMessages.length > 0) {
            setMessages((prev) => [...prev, ...newMessages]);
            const lastNewMessage = newMessages[newMessages.length - 1];
            setLastMessageTimestamp(
              new Date(lastNewMessage.createdAt).toISOString()
            );
          }
        }
      } catch (error) {
        console.error("Error polling messages:", error);
      }
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
      setMessages([]);
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await chatService.getMessages(activeChannel.id);
      const sortedMessages = response.data.reverse();
      setMessages(sortedMessages);
      if (sortedMessages && sortedMessages.length > 0) {
        const lastMessage = sortedMessages[sortedMessages.length - 1];
        setLastMessageTimestamp(new Date(lastMessage.createdAt).toISOString());
      } else {
        setLastMessageTimestamp(new Date(0).toISOString());
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLastMessageTimestamp(new Date(0).toISOString());
    }
  };

  const scrollToBottom = (chatContainer, chatMessageElement = null) => {
    if (!chatContainer) return;

    let scrollTop;
    if (chatMessageElement) {
      const messageRect = chatMessageElement.getBoundingClientRect();
      const containerRect = chatContainer.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(chatMessageElement);
      const marginBottom = parseFloat(computedStyle.marginBottom);
      scrollTop =
        messageRect.bottom -
        containerRect.bottom +
        chatContainer.scrollTop +
        marginBottom +
        10;
    } else {
      scrollTop = chatContainer.scrollHeight;
    }
    chatContainer.scrollTo({ top: scrollTop, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(messagesEndRef.current);
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await chatService.postMessage(activeChannel.id, {
        content: newMessage,
      });

      setNewMessage("");
      setMessages((prev) => [...prev, response.data]);
      const messageTimestamp = new Date(response.data.createdAt);
      setLastMessageTimestamp(messageTimestamp.toISOString());
      scrollToBottom(messagesEndRef.current);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading messages...</span>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => {
    if (isSmallScreen) {
      setSidebarVisible(!sidebarVisible);
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        <div
          className={`col-md-3 col-lg-2 bg-body sidebar ${
            sidebarVisible ? "" : "d-none"
          }`}
        >
          <div
            className={`d-flex flex-column h-100 ${
              isSmallScreen ? "border-bottom" : "border-end"
            }`}
          >
            <div className="p-3 border-bottom">
              <h5 className="mb-0">My Projects</h5>
            </div>

            <div className="overflow-auto flex-grow-1">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setActiveChannel(project.channel)}
                  className={`btn btn-link text-decoration-none text-start w-100 px-3 py-2 
                            d-flex align-items-center 
                            ${
                              activeChannel?.id === project.channel.id
                                ? "active bg-secondary bg-opacity-25"
                                : ""
                            }`}
                >
                  <i className="bi bi-hash me-1"></i>
                  <span className="text-truncate">{project.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col">
          <div className="d-flex flex-column">
            {activeChannel ? (
              <>
                <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
                  <h5 className="mb-0">
                    {" "}
                    <i className="bi bi-hash me-1"></i>
                    {activeChannel.project?.name || activeChannel.name}
                  </h5>
                  <button
                    className="btn btn-primary me-2 d-md-none"
                    onClick={toggleSidebar}
                  >
                    <i className="bi bi-list fs-5"></i>
                  </button>
                </div>
                <div
                  className="flex-grow-1 overflow-auto p-3 bg-body vh-100"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                  ref={messagesEndRef}
                >
                  {messages.map((message) => (
                    <div key={message.id} className="mb-3">
                      <div className="d-flex align-items-start">
                        <div className="me-2">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                              message.author.username
                            )}&background=random`}
                            alt=""
                            className="rounded-circle"
                            width="30"
                            height="30"
                          />
                        </div>

                        <div className="flex-grow-1">
                          <div className="d-flex align-items-baseline">
                            <span className="fw-bold me-2">
                              {message.author.username}
                            </span>
                            <small className="text-muted">
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </small>
                          </div>
                          <div className="mt-1">
                            {message.content
                              .split(/(\s+|@[^\s]+)/)
                              .map((word, i) => {
                                const isUrl = /^(http|https):\/\/[^\s]+$/.test(
                                  word
                                );
                                const isMention = /^@[^\s]+$/.test(word);
                                if (isUrl) {
                                  return (
                                    <React.Fragment key={i}>
                                      <a
                                        href={word}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {word}
                                      </a>{" "}
                                    </React.Fragment>
                                  );
                                }
                                if (isMention) {
                                  return (
                                    <span key={i} className="text-primary">
                                      {word}{" "}
                                    </span>
                                  );
                                }
                                return word;
                              })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-top p-3 bg-body">
                  <form onSubmit={sendMessage} className="position-relative">
                    <MentionInput
                      value={newMessage}
                      onChange={setNewMessage}
                      project={projects.find(
                        (p) => p.channel.id === activeChannel.id
                      )}
                      placeholder={`Message #${
                        activeChannel.project?.name || activeChannel.name
                      }`}
                    />
                  </form>
                </div>
              </>
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                <div className="text-center">
                  <i className="bi bi-chat-dots fs-1 mb-2"></i>
                  <p>Select a project to start discussing</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalChat;
