import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { apiFetch } from "../utils/api";
import "./Chat.css";

const SERVER = "http://localhost:5000";

export default function Chat() {
  const { ownerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const propertyId = searchParams.get("propertyId");

  const [conversations, setConversations] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadError, setLoadError] = useState(false); // tracks auth/load failure
  const socket = useRef(null);
  const scrollRef = useRef(null);
  const activeChatUserRef = useRef(activeChatUser);

  useEffect(() => {
    activeChatUserRef.current = activeChatUser;
  }, [activeChatUser]);

  // ── Socket setup ─────────────────────────────────────────────
  useEffect(() => {
    socket.current = io(SERVER, { withCredentials: true });

    socket.current.on("getMessage", (data) => {
      if (
        activeChatUserRef.current &&
        activeChatUserRef.current._id === data.senderId
      ) {
        setMessages((prev) => [...prev, data]);
        apiFetch(`${SERVER}/api/messages/mark-read/${data.senderId}`, {
          method: "PUT",
        }).catch(() => {});
      } else {
        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === data.senderId
              ? { ...conv, unreadCount: (conv.unreadCount || 0) + 1 }
              : conv
          )
        );
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  // ── Fetch user profile + conversations ───────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        setLoadError(false);

        // Register with socket
        const authRes = await apiFetch(`${SERVER}/api/auth/me`);
        if (authRes.ok) {
          const userData = await authRes.json();
          const myId = userData.user
            ? userData.user.id || userData.user._id
            : userData.id || userData._id;
          if (myId) {
            localStorage.setItem("userId", myId);
            socket.current.emit("addUser", myId);
          }
        }

        // Fetch conversations
        const res = await apiFetch(`${SERVER}/api/messages/conversations`);
        if (!res.ok) {
          setLoadError(true);
          return;
        }
        const data = await res.json();
        setConversations(data.conversations || []);

        if (ownerId) {
          const existing = (data.conversations || []).find(
            (c) => c._id === ownerId
          );
          setActiveChatUser(
            existing || { _id: ownerId, name: "New Contact", isNew: true }
          );
        } else if ((data.conversations || []).length > 0) {
          setActiveChatUser(data.conversations[0]);
        }
      } catch (err) {
        console.error("Chat init error:", err);
        setLoadError(true);
      }
    };
    init();
  }, [ownerId]);

  // ── Fetch messages when active chat changes ───────────────────
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChatUser || activeChatUser.isNew) {
        setMessages([]);
        return;
      }
      try {
        const res = await apiFetch(
          `${SERVER}/api/messages/${activeChatUser._id}`
        );
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
        await apiFetch(
          `${SERVER}/api/messages/mark-read/${activeChatUser._id}`,
          { method: "PUT" }
        );
      } catch (err) {
        console.log("fetchMessages error:", err);
      }
    };
    fetchMessages();
  }, [activeChatUser]);

  // ── Auto-scroll ───────────────────────────────────────────────
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send message ──────────────────────────────────────────────
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatUser) return;

    try {
      const bodyData = {
        receiverId: activeChatUser._id,
        text: newMessage,
      };
      if (propertyId) bodyData.propertyId = propertyId;

      const res = await apiFetch(`${SERVER}/api/messages/send`, {
        method: "POST",
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        const result = await res.json();
        const createdMessage = result.data;

        socket.current.emit("sendMessage", {
          senderId: createdMessage.senderId,
          receiverId: activeChatUser._id,
          text: newMessage,
          ...(propertyId && { propertyId }),
        });

        setMessages((prev) => [...prev, createdMessage]);
        setNewMessage("");

        if (activeChatUser.isNew) {
          setActiveChatUser((prev) => ({ ...prev, isNew: false }));
        }
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // ── If auth failed entirely, show a proper "logged out" notice ──
  if (loadError) {
    return (
      <div
        className="chat-container"
        style={{
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
          background: "#0f172a",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "#94a3b8",
            padding: 40,
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
          <h2 style={{ color: "#f1f5f9", marginBottom: 8 }}>
            Session Ended
          </h2>
          <p style={{ marginBottom: 24 }}>
            You have been logged out. Please log in again to access your
            messages.
          </p>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "12px 32px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg,#6366f1,#9333ea)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ── Normal Chat UI ────────────────────────────────────────────
  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="chat-header">
          <button
            className="chat-back-btn"
            onClick={() => navigate("/accessible-home")}
          >
            ← Home
          </button>
          <h2>Messages</h2>
        </div>
        <div className="conversations-list">
          {conversations.length === 0 && !ownerId && (
            <p
              style={{
                padding: "20px",
                color: "#64748b",
                textAlign: "center",
              }}
            >
              No open conversations yet.
            </p>
          )}

          {/* Temporary entry for new chats */}
          {activeChatUser?.isNew && (
            <div className="conversation-item active">
              <div className="conversation-avatar">👤</div>
              <div className="conversation-info">
                <h4>{activeChatUser.name}</h4>
                <p>Start a new chat</p>
              </div>
            </div>
          )}

          {conversations.map((c) => (
            <div
              key={c._id}
              className={`conversation-item ${
                activeChatUser?._id === c._id ? "active" : ""
              }`}
              onClick={() => {
                setConversations((prev) =>
                  prev.map((conv) =>
                    conv._id === c._id
                      ? { ...conv, unreadCount: 0 }
                      : conv
                  )
                );
                setActiveChatUser(c);
                navigate(`/chat/${c._id}`);
              }}
            >
              <div className="conversation-avatar">👤</div>
              <div
                className="conversation-info"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <h4
                  style={{
                    fontWeight:
                      c.unreadCount > 0 && activeChatUser?._id !== c._id
                        ? "900"
                        : "600",
                    color:
                      c.unreadCount > 0 && activeChatUser?._id !== c._id
                        ? "#0f172a"
                        : "#1e293b",
                    transition: "all 0.2s",
                  }}
                >
                  {c.name || "Unknown User"}
                </h4>
                {c.unreadCount > 0 && activeChatUser?._id !== c._id && (
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      background: "#ef4444",
                      borderRadius: "50%",
                      display: "inline-block",
                      boxShadow: "0 0 5px rgba(239,68,68,0.5)",
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {activeChatUser ? (
          <>
            <div className="chat-top-bar">
              <div className="conversation-avatar">👤</div>
              <h3>{activeChatUser.name}</h3>
            </div>

            <div className="chat-messages-area">
              {messages.length === 0 && (
                <div className="chat-empty">
                  <p>Send a message to start the conversation.</p>
                </div>
              )}
              {messages.map((m, idx) => {
                const isMine = m.senderId !== activeChatUser._id;
                return (
                  <div
                    key={idx}
                    className={`message-wrapper ${isMine ? "mine" : "theirs"}`}
                  >
                    <div className="message-bubble">
                      <p>{m.text}</p>
                      <span className="message-time">
                        {m.createdAt
                          ? new Date(m.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={!newMessage.trim()}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </>
        ) : (
          <div className="chat-unselected">
            <div className="unselected-icon">💬</div>
            <h2>Your Conversations</h2>
            <p>Select a chat from the sidebar or start a new one from a property page.</p>
          </div>
        )}
      </div>
    </div>
  );
}
