import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./Chat.css";

export default function Chat() {
  const { ownerId } = useParams(); // If we navigated from a property details page
  const location = useLocation();
  const navigate = useNavigate();
  // Get propertyId from URL if any
  const searchParams = new URLSearchParams(location.search);
  const propertyId = searchParams.get("propertyId");

  const [conversations, setConversations] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef(null);
  const scrollRef = useRef(null);
  const activeChatUserRef = useRef(activeChatUser);

  useEffect(() => {
    activeChatUserRef.current = activeChatUser;
  }, [activeChatUser]);

  const currentUserId = localStorage.getItem("userId") || ""; // Needed to identify me. Wait, checking if userId is stored in localStorage.
  
  // Set up socket connection
  useEffect(() => {
    socket.current = io("http://localhost:5000");
    
    // We need our actual user ID. Assuming there's a /api/auth/me or similar, 
    // but the backend stores user inside req.user from JWT.
    // If not in localStorage, we might need a way to get my ID. For now let's hope socket connects smoothly.

    socket.current.on("getMessage", (data) => {
      // Check if message is from the active chat user
      if (activeChatUserRef.current && activeChatUserRef.current._id === data.senderId) {
        setMessages((prev) => [...prev, data]);
        
        // Mark as read immediately since we are viewing it
        fetch(`http://localhost:5000/api/messages/mark-read/${data.senderId}`, {
            method: "PUT",
            credentials: "include"
        }).catch(err => console.error(err));
      } else {
        // Not active, so increment unread count
        setConversations(prev => prev.map(conv => {
            if (conv._id === data.senderId) {
                return { ...conv, unreadCount: (conv.unreadCount || 0) + 1 };
            }
            return conv;
        }));
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  // Fetch my profile / ID and notify socket
  useEffect(() => {
    const fetchUserAndConversations = async () => {
        try {
            // First get my info to register with socket
            const authRes = await fetch("http://localhost:5000/api/auth/me", { credentials: "include" });
            if (authRes.ok) {
                const userData = await authRes.json();
                const myId = userData.user ? (userData.user.id || userData.user._id) : (userData.id || userData._id);
                if(myId) {
                    socket.current.emit("addUser", myId);
                }
            }

            // Fetch conversations
            const res = await fetch("http://localhost:5000/api/messages/conversations", {
                credentials: "include"
            });
            if (res.ok) {
                const data = await res.json();
                setConversations(data.conversations);
                
                // If ownerId is in URL, let's set it as active chat
                if (ownerId) {
                    // Check if owner is already in conversations list
                    const existingUser = data.conversations.find((c) => c._id === ownerId);
                    if (existingUser) {
                        setActiveChatUser(existingUser);
                    } else {
                        // User not in history, create a temp object
                        setActiveChatUser({ _id: ownerId, name: "New Contact", isNew: true });
                    }
                } else if (data.conversations.length > 0) {
                    setActiveChatUser(data.conversations[0]);
                }
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    };
    fetchUserAndConversations();
  }, [ownerId]);

  // Fetch messages when active user changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChatUser || activeChatUser.isNew === true) {
          setMessages([]);
          return;
      }
      try {
        const res = await fetch(`http://localhost:5000/api/messages/${activeChatUser._id}`, {
            credentials: "include"
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages);
        }

        // Mark messages as read
        await fetch(`http://localhost:5000/api/messages/mark-read/${activeChatUser._id}`, {
            method: "PUT",
            credentials: "include"
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchMessages();
  }, [activeChatUser]);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatUser) return;

    try {
        const bodyData = {
            receiverId: activeChatUser._id,
            text: newMessage,
        };
        if (propertyId) bodyData.propertyId = propertyId;

        const res = await fetch("http://localhost:5000/api/messages/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(bodyData)
        });

        if (res.ok) {
            const result = await res.json();
            const createdMessage = result.data;
            
            // Send to socket
            socket.current.emit("sendMessage", {
                senderId: createdMessage.senderId,
                receiverId: activeChatUser._id,
                text: newMessage,
                propertyId: propertyId ? propertyId : undefined,
            });

            setMessages((prev) => [...prev, createdMessage]);
            setNewMessage("");

            // If activeChatUser was new, fetch conversations again to update list
            if (activeChatUser.isNew) {
                // remove isNew flag and re-fetch list for simplicity, or just update state
                setActiveChatUser(prev => ({...prev, isNew: false}));
            }
        }
    } catch (err) {
        console.error("Failed to send message", err);
    }
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="chat-header">
          <button className="chat-back-btn" onClick={() => navigate("/accessible-home")}>← Home</button>
          <h2>Messages</h2>
        </div>
        <div className="conversations-list">
          {conversations.length === 0 && !ownerId && (
            <p style={{ padding: "20px", color: "#64748b", textAlign: "center" }}>No open conversations yet.</p>
          )}
          {/* Temporary user if we just clicked 'Chat with Owner' and no past msgs */}
          {activeChatUser && activeChatUser.isNew && (
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
              className={`conversation-item ${activeChatUser?._id === c._id ? 'active' : ''}`}
              onClick={() => {
                // Instantly clear unread count locally when clicked
                setConversations(prev => prev.map(conv => conv._id === c._id ? { ...conv, unreadCount: 0 } : conv));
                setActiveChatUser(c);
                navigate(`/chat/${c._id}`);
              }}
            >
              <div className="conversation-avatar">👤</div>
              <div className="conversation-info" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <h4 style={{ 
                  fontWeight: (c.unreadCount > 0 && activeChatUser?._id !== c._id) ? "900" : "600",
                  color: (c.unreadCount > 0 && activeChatUser?._id !== c._id) ? "#0f172a" : "#1e293b",
                  transition: "all 0.2s"
                }}>
                  {c.name || "Unknown User"}
                </h4>
                {c.unreadCount > 0 && activeChatUser?._id !== c._id && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
                    <span style={{
                      width: "10px",
                      height: "10px",
                      background: "#ef4444",
                      borderRadius: "50%",
                      display: "inline-block",
                      boxShadow: "0 0 5px rgba(239, 68, 68, 0.5)"
                    }}></span>
                  </div>
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
                      <div key={idx} className={`message-wrapper ${isMine ? 'mine' : 'theirs'}`}>
                          <div className="message-bubble">
                              <p>{m.text}</p>
                              <span className="message-time">
                                  {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                              </span>
                          </div>
                      </div>
                  )
              })}
              <div ref={scrollRef}></div>
            </div>

            <form className="chat-input-area" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="chat-send-btn" disabled={!newMessage.trim()}>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </form>
          </>
        ) : (
          <div className="chat-unselected">
             <div className="unselected-icon">💬</div>
             <h2>Welcome to Conversations</h2>
             <p>Select a chat from the sidebar or start a new one from a property page.</p>
          </div>
        )}
      </div>
    </div>
  );
}
