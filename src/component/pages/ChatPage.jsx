import { Input } from "@chakra-ui/react";
import ChatContactCard from "../component/ChatContactCard";
import { Avatar, AvatarGroup } from "../../components/ui/avatar";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { object } from "yup";
import { io } from "socket.io-client";
import { Button, IconButton } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import CreateGroupPopup from "../component/CreateGroupPopup";
import { MdAttachFile } from "react-icons/md";
import Popover from "@mui/material/Popover";
// import UploadFile from "../component/UploadFile";
import Management from "../component/Mangent";

const API_URL = import.meta.env.VITE_API_URL;
const socket = io(API_URL);

const ChatPage = () => {
  const [ChatHistory, setChatHistory] = useState([]);
  const [selectedContact, setSelectedContact] = useState({});
  const [selectedGroup, setSelectedGroup] = useState({});
  const [allChat, setAllChat] = useState([]);
  const [allGroupChat, setAllGroupChat] = useState([]);
  const tokendata = jwtDecode(localStorage.getItem("token"));
  const [newMessage, setNewMessage] = useState("");
  const [changeTabs, setChangeTabs] = useState("chat");
  const [allGroup, setAllgroup] = useState([]);
  const [popup, setPopup] = useState(false);
  const [upload, setUpload] = useState(false);
  const [aneve, setAnchorEl] = useState(null);
  const [url, setUrl] = useState(null);
  const [popupProfiles, setPopupProfiles] = useState(false);
  const [profileEvent, setProfileEvent] = useState(null);

  const handleProfileClose = () => {
    setPopupProfiles(false);
    setProfileEvent(null);
  };

  const UploadFile = ({ open, event, handleClose, url, handleSend }) => {
    const [anchorEl, setAnchorEl] = useState(event);
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState("");

    const [isImage, setIsImage] = useState(false);

    const handleSendMessage = () => {
      if (socket) {
        if (changeTabs === "chat") {
          socket.emit("sendPrivateMessage", {
            sender: tokendata.id,
            receiver: selectedContact.userid,
            content: "image",
            mediaUrl: fileUrl, // Replace with a URL if sending media
          });
          handleClose(false);
        } else if (changeTabs === "group") {
          socket.emit("sendGroupMessage", {
            sender: tokendata.id,
            roomId: selectedGroup._id,
            content: "file",
            mediaUrl: fileUrl, // Replace with a URL if sending media
          });
        }
      }
    };

    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);

      // Check if the file is an image
      const imageTypes = ["image/jpeg", "image/png", "image/gif"];
      setIsImage(imageTypes.includes(selectedFile.type));
    };

    const handleUpload = async () => {
      if (!file) {
        alert("Please select a file!");
        return;
      }

      const formData = new FormData();
      formData.append("document", file);

      try {
        const response = await axios.post(
          `${API_URL}/user/upload-document`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        // Extract the public URL of the uploaded file
        const filePath = response.data.file.path;
        console.log(`${API_URL}${filePath}`);
        setFileUrl(`${API_URL}${filePath}`);
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file");
      }
    };
    return (
      <Popover
        id={1}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        sx={{
          p: "1rem",
        }}
      >
        {fileUrl && (
          <div style={{ padding: "1rem" }}>
            <h3>Uploaded File:</h3>
            {isImage ? (
              // Show the image if it's an image type
              <img
                src={fileUrl}
                alt="Uploaded file"
                style={{
                  maxWidth: "100px",
                  height: "100px",
                  marginTop: "10px",
                }}
              />
            ) : (
              // Show a download link if it's not an image
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                View Uploaded File
              </a>
            )}
          </div>
        )}
        <div style={{ padding: "1rem" }}>
          <h1 style={{ marginBottom: "1rem" }}>File Upload</h1>
          <input
            type="file"
            onChange={handleFileChange}
            style={{ marginBottom: "1rem" }}
          />
          {fileUrl ? (
            <button onClick={handleSendMessage}>send</button>
          ) : (
            <button onClick={handleUpload}>Upload</button>
          )}
        </div>
      </Popover>
    );
  };

  const chatEndRef = useRef(null);

  const handleClose = () => {
    setUpload(false);
    setAnchorEl(null);
  };

  const fetchUsers = async () => {
    try {
      const data = await axios.get(
        `${API_URL}/user/list-all-user/${tokendata.id}`
      );
      console.log(data.data.data);
      setChatHistory(data.data.data);
      if (data?.data?.data.length > 0) {
        setSelectedContact(data?.data?.data[0]);
        socket.emit("joinPrivateRoom", {
          user1: data?.data?.data[0].userid,
          user2: tokendata.id,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGroup = async () => {
    try {
      const data = await axios.get(
        `${API_URL}/group/getAllGroups/${tokendata.id}`
      );
      setSelectedGroup(data.data.data[0]);
      setAllgroup(data.data.data);
      console.log("chat history", data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("chatEndRef", chatEndRef);
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allChat, allGroupChat]);

  useEffect(() => {
    const chatHistory = async () => {
      if (Object.keys(selectedContact).length > 0 && changeTabs === "chat") {
        try {
          const data = await axios.get(
            `${API_URL}/message/${selectedContact.userid}/${tokendata.id}`
          );
          setAllChat(data.data);
          console.log("chat history", data);
        } catch (error) {
          console.log(error);
        }
      } else if (
        Object.keys(selectedGroup).length > 0 &&
        changeTabs === "group"
      ) {
        console.log("chat history", selectedGroup._id);
        const data = await axios.get(
          `${API_URL}/group/getGroupdata/${selectedGroup._id}`
        );
        console.log("chat history", data);
        setAllGroupChat(data.data.data);
      }
    };
    chatHistory();

    if (Object.keys(selectedContact).length > 0 && changeTabs === "chat") {
      socket.emit("joinPrivateRoom", {
        user1: selectedContact.userid,
        user2: tokendata.id,
      });
    }

   
  }, [selectedContact, changeTabs, selectedGroup]);

  var cout = 1
  useEffect(() => {
    if (cout === 1) {
      if (Object.keys(selectedGroup).length > 0 && changeTabs === "group") {
        socket.emit("joinGroup", {
          roomId: selectedGroup._id,
        });
      }
    }
    cout+=1;

    // if (changeTabs === "group") {
    //   fetchGroup();
    // }

    if (changeTabs === "chat") {
      fetchUsers();
    }
    console.log("[][]", allGroupChat);
    if (changeTabs === "group" && allGroupChat?.length > 0) {
      console.log("smooth history", allGroupChat);
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [changeTabs, selectedGroup]);

  useEffect(() => {
    fetchUsers();
    fetchGroup();

    socket.on("receivePrivateMessage", (data) => {
      setAllChat((prevMessages) => [...prevMessages, data]);
    });

    socket.on("receiveGroupMessage", (data) => {
      console.log(data, "---------------");
      setAllGroupChat((prevMessages) => {
        console.log("Previous messages:", prevMessages);
        if (!Array.isArray(prevMessages)) {
          console.error("prevMessages is not an array:", prevMessages);
          return [data];
        }
        return [...prevMessages, data];
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() && socket) {
      console.log("private", "in");
      if (changeTabs === "chat") {
        socket.emit("sendPrivateMessage", {
          sender: tokendata.id,
          receiver: selectedContact.userid,
          content: newMessage,
          mediaUrl: "", // Replace with a URL if sending media
        });
      }

      setNewMessage(""); // Clear the input field
    }
  };

  const handleSendGroupMessage = () => {
    if (newMessage.trim() && socket) {
      console.log("sendGroupMessage", newMessage);
      socket.emit("sendGroupMessage", {
        sender: tokendata.id,
        roomId: selectedGroup._id,
        content: newMessage,
        mediaUrl: "", // Replace with a URL if sending media
      });

      setNewMessage(""); // Clear the input field
    }
  };

  return (
    <div className="chat-main">
      <Management
        open={popupProfiles}
        handleClose={handleProfileClose}
        event={profileEvent}
        userData={tokendata}
      />
      <UploadFile
        open={upload}
        handleClose={handleClose}
        event={aneve}
        url={setUrl}
      />
      <CreateGroupPopup
        open={popup}
        handleClose={setPopup}
        users={ChatHistory}
        currentuser={tokendata.id}
        setAllgroup={setAllgroup}
        setAllChat={setAllChat}
      />
      {/* <NavBar /> */}
      <section className="chatLayout">
        <div className="listofuser">
          <div className="flex space">
            <p>WW</p>
            <div onClick={() => setPopupProfiles(true)}>
              <Avatar
                name={tokendata.username}
                src=""
                style={{ width: "2rem", height: "2rem" }}
              />
            </div>
          </div>

          <Input placeholder="Search Users" className="search-chat" />
          <div className="btn-selector">
            <div>
              <button
                className="chat-btn primary"
                onClick={() => {
                  setChangeTabs("chat");
                }}
              >
                Chat
              </button>
              <button
                className="chat-btn secondary"
                onClick={() => {
                  setChangeTabs("group");
                }}
              >
                Group
              </button>
            </div>
            {changeTabs === "group" && (
              <div>
                <IconButton className="addicon" onClick={() => setPopup(true)}>
                  <FaPlus />
                </IconButton>
              </div>
            )}
          </div>
          <div className="list-user">
            {ChatHistory &&
              changeTabs === "chat" &&
              ChatHistory.map((user, index) => (
                <div
                  key={index}
                  style={{ marginBottom: "1rem" }}
                  onClick={() => {
                    setSelectedContact(user);
                  }}
                >
                  <ChatContactCard
                    image={user.image}
                    username={user.username}
                    email={user.email}
                  />
                </div>
              ))}
            {allGroup &&
              changeTabs === "group" &&
              allGroup.map((group, index) => (
                <div
                  key={index}
                  style={{ marginBottom: "1rem" }}
                  onClick={() => {
                    setSelectedGroup(group);
                  }}
                >
                  <ChatContactCard
                    image={group.image}
                    username={group.name}
                    // email={group.createdBy}
                  />
                </div>
              ))}
          </div>
        </div>
        {console.log(selectedContact, "==========")}
        {Object.keys(selectedContact).length > 0 ? (
          <div className="chat-body flex">
            <div className="chat-header flex">
              <Avatar name="ra" src="" />
              <div className="chat-info flex">
                <h3 className="username">
                  {changeTabs === "group"
                    ? selectedGroup.name
                    : selectedContact.username}
                </h3>
                <p className="lastseen">Last Message</p>
              </div>
            </div>
            <div className="chat-content">
              {changeTabs === "chat" && allChat.length > 0
                ? allChat.map((chat, index) => (
                    <div
                      className={
                        chat.sender === tokendata.id
                          ? "sender-bubble"
                          : "reciver-bubble"
                      }
                      key={index}
                    >
                      {chat.mediaUrl.length > 0 ? (
                        <div
                          style={
                            chat.sender === tokendata.id
                              ? {
                                  maxWidth: "200px",
                                  padding: "0.4rem",
                                  background: "#ecf0f1",
                                  borderRadius: "1rem 1rem 0rem 1rem",
                                }
                              : {
                                  maxWidth: "200px",
                                  padding: "0.4rem",
                                  background: "#3498db",
                                  borderRadius: "0rem 1rem 1rem 1rem",
                                }
                          }
                        >
                          <img
                            src={chat.mediaUrl}
                            alt="img"
                            style={{ borderRadius: "1rem" }}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-dir-col">
                          {chat.content}
                          <span className="timestmp">
                            {new Date(chat.createdAt).toLocaleTimeString(
                              "en-GB",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                : !changeTabs === "group" && <div>Start a new message</div>}
              {changeTabs === "group" && allGroupChat?.length > 0
                ? allGroupChat.map((chat, index) => {
                    return (
                      <div
                        className={
                          chat.sender === tokendata.id
                            ? "sender-bubble"
                            : "reciver-bubble"
                        }
                        key={index}
                      >
                        {chat.mediaUrl.length > 0 ? (
                          <div
                            style={
                              chat.sender === tokendata.id
                                ? {
                                    maxWidth: "200px",
                                    padding: "0.4rem",
                                    background: "#ecf0f1",
                                    borderRadius: "1rem 1rem 0rem 1rem",
                                  }
                                : {
                                    maxWidth: "200px",
                                    padding: "0.4rem",
                                    background: "#3498db",
                                    borderRadius: "0rem 1rem 1rem 1rem",
                                  }
                            }
                          >
                            <img
                              src={chat.mediaUrl}
                              alt="img"
                              style={{ borderRadius: "1rem" }}
                            />
                          </div>
                        ) : (
                          <p>{chat.content}</p>
                        )}
                      </div>
                    );
                  })
                : changeTabs === "group" && <div>Start a new message</div>}
              <div ref={chatEndRef}></div>
            </div>
            <div className="chat-footer flex">
              <Input
                placeholder="Send message"
                className="search-chat"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <IconButton
                className="attachment"
                onClick={(e) => {
                  setAnchorEl(e);
                  setUpload(true);
                }}
              >
                <MdAttachFile />
              </IconButton>
              <button
                className="primary send-btn"
                onClick={() => {
                  changeTabs === "chat"
                    ? handleSendMessage()
                    : handleSendGroupMessage();
                }}
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          changeTabs === "chat" && (
            <div className="chat-body">
              <div className="noChatselect">No Chat Selected</div>
            </div>
          )
        )}
      </section>
    </div>
  );
};

export default ChatPage;
