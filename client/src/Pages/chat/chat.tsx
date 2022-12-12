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
import { ChatCommands } from './chatCommands'
import { selectCurrentUser } from '../../Hooks/authSlice'
import { useSelector } from "react-redux"

function ChatWithHook(component: any) {
  return function WrappedChat(props: any) {
    const user = useSelector(selectCurrentUser);
    return (<Chat user={user} />)
  }
}

interface Props {
  user: any;
}

class Chat extends React.Component<Props, ChatState> {
  constructor(props: any) {
    super(props)

    this.openConvHandler = this.openConvHandler.bind(this)
    
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
      userList: [],
    };
    this.socket = io("http://localhost:3000/chat"); 
    this.userID = this.props.user.userId;
    this.getData();
    this.state = this.ChatData;
    this.chatCommands = new ChatCommands(this.socket, this.openConvHandler);
  }
  private chatCommands: ChatCommands
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
    }
    for (const chan of this.state.joinedChans)
      this.socket.emit('joinChatRoom', chan.id)
    }
  async getActualUser(): Promise<any> {
    this.ChatData.actualUser = {
      openedConvID: -1,
      user: await axios.get("http://localhost:3000/user/" + this.props.user.userId)
        .then(response => response.data)
        .catch(error => alert("getActualUser " + error.status + ": " + error.message))
    }
    this.socket.emit('initTable', this.ChatData.actualUser.user.username)
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
  
    ChatData.actualUser.openedConvID = chanID
    this.setState(ChatData)
  }

  /** SOCKETS **/
  socketNewMsg(msg: Message) {
    let ChatData = structuredClone(this.state)
    const chan = getChan(msg.channelId, ChatData)

    chan?.Message?.push(msg)
    sortChannels(ChatData.joinedChans)
    this.setState(ChatData)
  }
  
  socketNewChan(chan: Channel) {
    let ChatData = structuredClone(this.state)

    if (userIsInChan(chan, this.state.actualUser.user.id))
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
    if (userIsInChan(newChan, this.state.actualUser.user.id))
      which = ChatData.joinedChans
    else
      which = ChatData.notJoinedChans
    which.push(newChan)
    if (which === ChatData.joinedChans)
      sortChannels(which)
    this.setState(ChatData)
  }

  socketUpdateUser(user: User) {
    console.log(user)
    let ChatData: ChatState = structuredClone(this.state);
    ChatData.actualUser.user = user;
    this.setState(ChatData);
  }
  
  /** CHAT COMMANDS **/
  
  render() {
    this.socket.off('updateChanFromServer').on('updateChanFromServer', (chan) => this.socketUpdateChan(chan));
    this.socket.off('newChanFromServer').on('newChanFromServer', (chan) => this.socketNewChan(chan));
    this.socket.off('newMsgFromServer').on('newMsgFromServer', (msg) => this.socketNewMsg(msg));
    this.socket.off('updateUserFromServer').on('updateUserFromServer', (user) => this.socketUpdateUser(user));
    return (
    <div className="chatContainer">
      
        <div className="ChannelMenu">
            <HeaderChannels state={this.state} socket={this.socket} />
            <ChannelDisplay state={this.state} socket={this.socket} 
                  openConvHandler={this.openConvHandler} chatCommands={this.chatCommands} />
            <InfoDialog />
        </div>
        <div className="ChatDisplay">
            {this.state.actualUser.openedConvID === -1 ? null : <ChatHeader state={this.state} socket={this.socket} chatCommands={this.chatCommands} /> }
            <div className="MessageDisplay"><MessageDisplay state={this.state} socket={this.socket} /></div>
            {this.state.actualUser.openedConvID === -1 ? null : <div className="SendMessage"><SendBox state={this.state} socket={this.socket} chatCommands={this.chatCommands} /></div>}
        </div>

    </div>
    )
  }
}
export default ChatWithHook(Chat);
