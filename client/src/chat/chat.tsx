import ChannelDisplay from "./channel/channelDisplay";
import MessageDisplay from "./message/msgDisplay/messageDisplay";
import ChatHeader from "./message/msgDisplay/header";
import SendBox from "./message/sendMsg/SendBox";
import HeaderChannels from "./channel/headerChannels";
import './chat.css'
import React from "react";
import { actualUser, ChatState, Channel, Message } from "./stateInterface";
import io from "socket.io-client";
import { InfoDialog } from "./channel/infoDialog"
import { cdine } from "./bdd"

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
    
    // FILL WITH API REQUESTS
    this.ChatData = {
      messages: this.getMessages(),
      actualUser: this.getActualUser(),
      joinedChans: this.getJoinedChans(),
      notJoinedChans: this.getNotJoinedChans(),
      openedConversation: [],
    };

    this.state = this.ChatData
  }

  private ChatData: ChatState
  private socket = io("http://localhost:3000/chat") 

  /** INIT REQUEST **/
  getMessages() : Message[] {
      return []
  }
  getActualUser() : actualUser {
    return ({user: cdine, openedConvID: -1})
  }
  getJoinedChans() : Channel[] {
    return []
  }
  getNotJoinedChans() : Channel[] {
    return []
  }

  /** RENDERING FUNCTIONS */
  userHandler(openedChan: number) : void {
    if (!this.userIsNotInChan(openedChan)) {
      this.ChatData.actualUser.openedConvID = openedChan
      this.setState({ actualUser: this.ChatData.actualUser });
    }
  }

  openConvHandler(chanID: number) : void {
    if (!this.userIsNotInChan(chanID)) {
      this.ChatData.openedConversation.splice(0, this.state.openedConversation.length);
      for (let i = 0; i < this.state.messages.length; i++) {
        if (this.state.messages[i].channel.id === chanID) {
          this.ChatData.openedConversation.push(this.state.messages[i])
        }
      }
      this.userHandler(chanID)
      this.setState({openedConversation: this.ChatData.openedConversation})
   }
  }

  updateChannelMenu(channelID: number) : void {
    let whichTable;
    const userIsInChan = !this.userIsNotInChan(channelID)

    if (userIsInChan)
      whichTable = this.ChatData.joinedChans;
    else 
      whichTable = this.ChatData.notJoinedChans;
    for (let i = 0; i < whichTable.length; i++) {
      if (whichTable[i].id === channelID) {
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
  newMessage(content: string, channel: Channel) : void {
    let newMsg = {
      id: 0, // ?????????????????????????????????????????????????????????
      channel: channel,
      channelId: channel.id,
      author: this.state.actualUser.user,
      authorId: this.state.actualUser.user.id,
      date: new Date(),
      content: content,
    }
    this.ChatData.messages.push(newMsg)
    this.setState({messages: this.ChatData.messages})
    if (channel.id === this.state.actualUser.openedConvID)
      this.openConvHandler(this.state.actualUser.openedConvID)
    this.updateChannelMenu(channel.id)
  }

  newChannel(isPrivate: boolean, name: string, password: string) {
    // post chan to bdd
    // get new list
  }

  joinChan(chan: Channel) {
    for (let i = 0; i < this.ChatData.notJoinedChans.length; i++) {
      if (chan.id === this.ChatData.notJoinedChans[i].id) {
        this.ChatData.notJoinedChans.splice(i, 1)
        break 
      }
    }
    this.ChatData.joinedChans.push(chan)
    this.openConvHandler(chan.id)
    this.setState({joinedChans: this.ChatData.joinedChans, notJoinedChans: this.ChatData.notJoinedChans})
  }
  
  /** SOCKET **/
  joinRoomSocket(chanID: number) {
    this.socket.emit("joinChatRoom", "chan" + chanID);
  }
  
  leaveRoomSocket(chanID: number) {
    this.socket.emit("leaveChatRoom", "chan" + chanID);
  }

  listenNewMessage() {
    this.socket.on("chatToClient", (val) => {
      console.log(val);
    });
  }

  listendNewChan() {
    this.socket.on("newChan", (val) => {
      console.log(val)
    });
  }

  sendNewMessage(msg: Message) {
    this.socket.emit("addNewMsg", msg)
  }

  listenSockets() {
  }

  render() {
    this.listenSockets()
    return (
    <div className="chatContainer">
        <div className="ChannelMenu">
            <HeaderChannels state={this.state} socket={this.socket} />
            <ChannelDisplay state={this.state} userHandler={this.userHandler} openConvHandler={this.openConvHandler}
                  userIsNotInChan={this.userIsNotInChan} joinChan={this.joinChan} newChannel={this.newChannel} />
            <InfoDialog />
        </div>
        {this.state.actualUser.openedConvID === -1 ? null : <div className="ChatHeader"><ChatHeader state={this.state} /></div> }
        <div className="MessageDisplay"><MessageDisplay state={this.state} userHandler={this.userHandler} /></div>
        {this.state.actualUser.openedConvID === -1 ? null : <div className="SendMessage"><SendBox state={this.state} newMessage={this.newMessage} /></div>}
    </div>
    )
  }
}
export default Chat;