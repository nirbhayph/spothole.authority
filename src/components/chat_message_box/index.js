// contains the chat message component
// uses the mui treasury library for displaying the message array
import React from "react";
import ChatMsg from "@mui-treasury/components/chatMsg/ChatMsg";

const ChatMessage = props => (
  <div style={{ color: "#333" }}>
    <ChatMsg
      avatar={props.profileURL}
      side={props.side}
      messages={props.messageArray}
    />
  </div>
);

export default ChatMessage;
