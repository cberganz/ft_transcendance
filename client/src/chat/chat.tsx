import ChannelDisplay from "./channel/channelDisplay";
import MessageDisplay from "./message/msgDisplay/messageDisplay";
import ChatHeader from "./message/msgDisplay/header";
import SendBox from "./message/sendMsg/SendBox";
import HeaderChannels from "./channel/headerChannels";
import './chat.css'
import React from "react";
import { messages, user, joinedChans, notJoinedChans, openedConversation } from "./bdd";
import { Chan, ChatState, Message } from "./stateInterface";
import io from "socket.io-client";

interface Props {
}

export class Chat extends React.Component<Props, ChatState> {
  constructor(props: any) {
    super(props)

    this.userHandler = this.userHandler.bind(this)
    this.openConvHandler = this.openConvHandler.bind(this)
    this.newMessage = this.newMessage.bind(this)
    this.newChannel = this.newChannel.bind(this)
    this.updateChannelMenu = this.updateChannelMenu.bind(this)
    this.newChannel = this.newChannel.bind(this)
    this.userIsNotInChan = this.userIsNotInChan.bind(this)
    this.joinChan = this.joinChan.bind(this)

    this.state = 
    {
      messages: messages,
      user: user,
      joinedChans: joinedChans,
      notJoinedChans: notJoinedChans,
      openedConversation: openedConversation,
    };

  }
  socket = io("http://localhost:3001") 

  /** SOCKET **/
  joinRoomSocket(chanID: number) {
    this.socket.emit("joinChatRoom", "chan" + chanID);
  }
  
  leaveRoomSocket(chanID: number) {
    this.socket.emit("leaveChatRoom", "chan" + chanID);
  }

  listenNewMessage() {
    this.socket.on("msgToClient", (val) => {
      console.log(val);
    });
  }

  sendNewMessage(msg: Message) {
    this.socket.emit("addNewMsg", msg)
  }


  /** RENDERING FUNCTIONS */
  userHandler(openedChan: number) {
    if (!this.userIsNotInChan(openedChan)) {
      user.openedConvID = openedChan
      this.setState({ user: user });
    }
  }

  openConvHandler(chanID: number) {
    if (!this.userIsNotInChan(chanID)) {
      openedConversation.splice(0, this.state.openedConversation.length);
      for (let i = 0; i < this.state.messages.length; i++) {
        if (this.state.messages[i].channel.id === chanID) {
          openedConversation.push(this.state.messages[i])
        }
      }
      this.userHandler(chanID)
      this.setState({openedConversation: openedConversation})
   }
  }

  updateChannelMenu(channel: any) {
    let whichTable;
    const userIsInChan = !this.userIsNotInChan(channel)

    if (userIsInChan)
      whichTable = this.state.joinedChans;
    else 
      whichTable = this.state.notJoinedChans;
    for (let i = 0; i < whichTable.length; i++) {
      if (whichTable[i].id === channel.id) {
        whichTable.splice(0, 0, whichTable[i]);
        whichTable.splice(i + 1, 1);
      }
    }
    if (userIsInChan)
      this.setState({joinedChans: whichTable})
    else
      this.setState({notJoinedChans: whichTable})
  }

  /** UTILS **/
  userIsNotInChan(id: number) : boolean {
    for (let i = 0; i < this.state.notJoinedChans.length; i++) {
      if (this.state.notJoinedChans[i].id === id) 
        return (true)
    }
    return (false)
  }


  /** CREATE **/
  newMessage(content: string, channel: any) {
    let newMsg = {
      id: this.state.messages.length + 1,
      channel: {
        id: channel.id, 
        type: channel.type
      },
      author: {
        avatar: this.state.user.avatar, 
        login: this.state.user.login
      },
      date: "22/11/22",
      content: content,
    }
    messages.push(newMsg)
    this.setState({messages: messages})
    if (channel.id === this.state.user.openedConvID)
      this.openConvHandler(this.state.user.openedConvID)
    this.updateChannelMenu(channel)
  }

  newChannel(isPrivate: boolean, name: string, password: string) {
    // post chan to bdd
    // get new list
  }

  async joinChan(chan: Chan) {
    for (let i = 0; i < notJoinedChans.length; i++) {
      if (chan.id === notJoinedChans[i].id) {
        notJoinedChans.splice(i, 1)
        break 
      }
    }
    joinedChans.push(chan)
    this.openConvHandler(chan.id)
    this.setState({joinedChans: joinedChans, notJoinedChans: notJoinedChans})
  }


  render() {
    return (
    <div className="container">
      <div className="ChannelMenu">
        <HeaderChannels newChannel={this.newChannel} />
        <ChannelDisplay state={this.state} userHandler={this.userHandler} openConvHandler={this.openConvHandler}
              userIsNotInChan={this.userIsNotInChan} joinChan={this.joinChan} newChannel={this.newChannel} />
      </div>
      <div className="ChatHeader"><ChatHeader state={this.state} /></div>
      <div className="MessageDisplay"><MessageDisplay state={this.state} userHandler={this.userHandler} /></div>
      <div className="SendMessage"><SendBox state={this.state} newMessage={this.newMessage} /></div>
    </div>
    )
  }
}
export default Chat;