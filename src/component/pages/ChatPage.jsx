import { Input } from "@chakra-ui/react";
import ChatContactCard from "../component/ChatContactCard";
import { Avatar, AvatarGroup } from "../../components/ui/avatar"

const ChatPage = () => {
  return (
    <div className="chat-main">
      {/* <NavBar /> */}
      <session className="chatLayout">
        <div className="listofuser">
          <p>WW</p>
          <Input placeholder="Search Users" className="search-chat" />
          <div className="btn-selector">
            <button className="chat-btn primary">Chat</button>
            <button className="chat-btn secondary">Group</button>
          </div>
          <div className="list-user">
            <ChatContactCard />
          </div>
        </div>
        <div className="chat-body flex">
          <div className="chat-header flex">
            <Avatar name="ra" src="" />
            <div className="chat-info flex">
              <h3 className="username">User Name</h3>
              <p className="lastseen">Last Message</p>
            </div>
          </div>
          <div className="chat-content">

          </div>
          <div className="chat-footer flex">
          <Input placeholder="Send message" className="search-chat" />
          <button className="primary send-btn">Send</button>
          </div>
        </div>
      </session>
    </div>
  );
};

export default ChatPage;
