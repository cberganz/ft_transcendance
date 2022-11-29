import ChannelDisplay from "./channel/channelDisplay";
import MessageDisplay from "./message/msgDisplay/messageDisplay";
import ChatHeader from "./message/msgDisplay/header";
import SendBox from "./message/sendMsg/SendBox";
import HeaderChannels from "./channel/headerChannels";
import './chat.css'
import React from "react";
import { actualUser, ChatState, Channel, Message, User } from "./stateInterface";
import io from "socket.io-client";
import axios from "axios"
import { getChan, userIsInChan, sortChannels } from './utils'
import { InfoDialog } from "./channel/infoDialog"

interface Props {
}

export class Chat extends React.Component<Props, ChatState> {
  constructor(props: any) {
    super(props)

    this.openConvHandler = this.openConvHandler.bind(this)
    this.joinChan = this.joinChan.bind(this)
    
    // FILL WITH API REQUESTS
    this.ChatData = {
      actualUser: {
        openedConvID: -1,
        user: {
          id: -1,
          login: "",
          avatar: "",
          username: ""
        }
      },
      joinedChans: [],
      notJoinedChans: [],
      openedConversation: [],
      userList: [],
    };
    
    this.userID = prompt("User ID ?")
    this.getData()
    this.socket = io("http://localhost:3000/chat") 
    this.state = this.ChatData
  }

  private socket
  private ChatData: ChatState
  private userID

  /** INIT DATA **/
  async getData(): Promise<void> {
    this.ChatData = {
      actualUser: await this.getActualUser(),
      joinedChans: await this.getJoinedChans(),
      notJoinedChans: await this.getNotJoinedChans(),
      userList: await this.getUserList(),
      openedConversation: [],
    }
    for (const chan of this.state.joinedChans)
      this.socket.emit('joinChatRoom', chan.id)
    }
  async getActualUser(): Promise<any> {
    this.ChatData.actualUser = {
      openedConvID: -1,
      user: await axios.get("http://localhost:3000/user/" + this.userID)
        .then(response => response.data)
        .catch(error => alert("getActualUser " + error.status + ": " + error.message))
      }
    this.socket.emit('initTable', this.ChatData.actualUser.user.login)
    return (this.ChatData.actualUser)
  }
  async getJoinedChans(): Promise<any> {
    this.ChatData.joinedChans = await axios.get("http://localhost:3000/channel/joinedChannels/" + this.userID)
      .then(response => response.data)
      .catch(error => alert("getJoinedChan " + error.status + ": " + error.message))
    sortChannels(this.ChatData.joinedChans)
    return (this.ChatData.joinedChans)
    }
  async getNotJoinedChans(): Promise<any> {
    this.ChatData.notJoinedChans = await axios.get("http://localhost:3000/channel/notJoinedChannels/" + this.userID)
      .then(response => response.data)
      .catch(error => alert("getNotJoinedChans " + error.status + ": " + error.message))
    sortChannels(this.ChatData.notJoinedChans)
    return (this.ChatData.notJoinedChans)
  }
  async getUserList(): Promise<any> {
    this.ChatData.userList = await axios.get('http://localhost:3000/user/list/' + this.userID)
      .then(response => response.data)
      .catch(error => alert("getUserList " + error.status + ": " + error.message))
    return (this.ChatData.userList)
  }

    
    /** RENDERING FUNCTIONS */
  openConvHandler(chanID: number) {
    let ChatData = structuredClone(this.state)
  
    ChatData.openedConversation = getChan(chanID, this.state)?.Message
    ChatData.actualUser.openedConvID = chanID
    this.setState(ChatData)
  }

  /** SOCKETS **/
  socketNewMsg(msg: Message) {
    let ChatData = structuredClone(this.state)
    const chan = getChan(msg.channelId, ChatData)

    chan?.Message?.push(msg)
    sortChannels(ChatData.joinedChans)
    if (ChatData.actualUser.openedConvID === msg.channelId)
      ChatData.openedConversation.push(msg)
    this.setState(ChatData)
  }
  
  socketNewChan(chan: Channel) {
    let ChatData = structuredClone(this.state)

    if (userIsInChan(chan, this.state))
      ChatData.joinedChans.push(chan)
    else
      ChatData.notJoinedChans.push(chan)
    this.setState(ChatData)
  }

  socketUpdateChan(newChan: Channel) {
    let ChatData = structuredClone(this.state)
    let which

    for (let chan of ChatData.joinedChans) {
      if (chan.id === newChan.id) {
        ChatData.joinedChans.splice(ChatData.joinedChans.findIndex((chan_: Channel) => chan_.id === newChan.id), 1)
        break ;
      }
    }
    for (let chan of ChatData.notJoinedChans) {
      if (chan.id === newChan.id) {
        ChatData.notJoinedChans.splice(ChatData.notJoinedChans.findIndex((chan_: Channel) => chan_.id === newChan.id), 1)
        break ;
      }
    }
    if (userIsInChan(newChan, this.state))
      which = ChatData.joinedChans
    else
      which = ChatData.notJoinedChans
    which.push(newChan)
    sortChannels(ChatData)
    this.setState(ChatData)
  }
  
  /** CHAT COMMANDS **/
  joinChan(chan: Channel) {
    let ChatData = structuredClone(this.state)

    for (let i = 0; i < ChatData.notJoinedChans.length; i++) {
      if (chan.id === ChatData.notJoinedChans[i].id) {
        ChatData.notJoinedChans.splice(i, 1)
        break 
      }
    }
    ChatData.joinedChans.push(chan)
    this.openConvHandler(chan.id)
    this.setState(ChatData)
  }
    
  
  render() {
    this.socket.off('updateChanFromServer').on('updateChanFromServer', (chan) => this.socketUpdateChan(chan))
    this.socket.off('newChanFromServer').on('newChanFromServer', (chan) => this.socketNewChan(chan))
    this.socket.off('newMsgFromServer').on('newMsgFromServer', (msg) => this.socketNewMsg(msg))
    return (
    <div className="chatContainer">
      
        <div className="ChannelMenu">
            <HeaderChannels state={this.state} socket={this.socket} />
            <ChannelDisplay state={this.state} socket={this.socket} 
                  openConvHandler={this.openConvHandler} joinChan={this.joinChan} />
            <InfoDialog />
        </div>
        <div className="ChatDisplay">
            {this.state.actualUser.openedConvID === -1 ? null : <div className="ChatHeader"><ChatHeader state={this.state} socket={this.socket} /></div> }
            <div className="MessageDisplay"><MessageDisplay state={this.state} socket={this.socket} /></div>
            {this.state.actualUser.openedConvID === -1 ? null : <div className="SendMessage"><SendBox state={this.state} socket={this.socket} /></div>}
        </div>

    </div>
    )
  }
}
export default Chat;