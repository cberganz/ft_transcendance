import ChannelDisplay from "./channel/channels/channelDisplay";
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
import { selectCurrentUser } from '../../Hooks/authSlice'
import { useSelector } from "react-redux"
import SearchBar from "./channel/searchBar"
import { usersStatusSocket } from "../../Router/Router";


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
    
    this.state = {
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
    this.getData();
    usersStatusSocket.emit("updateStatus", "online");
  }
  private socket

  /** INIT DATA **/
  async getData() {
    let ChatData = {
      actualUser: await this.getActualUser(),
      joinedChans: await this.getJoinedChans(),
      notJoinedChans: await this.getNotJoinedChans(),
      userList: await this.getUserList(),
    }
    for (const chan of ChatData.joinedChans) 
      this.socket.emit('joinChatRoom', chan.id)
    this.setState(ChatData);
  }
  async getActualUser(): Promise<actualUser> {
    let actualUser = {
      openedConvID: -1,
      user: await axios.get("http://localhost:3000/user/" + this.props.user.id)
        .then(response => response.data)
        .catch(error => alert("getActualUser " + error.status + ": " + error.message))
    }
    this.socket.emit('initTable', actualUser.user.username)
    return (actualUser)
  }
  async getJoinedChans(): Promise<Channel[]> {
    let joinedChans = await axios.get("http://localhost:3000/channel/joinedChannels/" + this.props.user.id)
      .then(response => response.data)
      .catch(error => alert("getJoinedChan " + error.status + ": " + error.message))
    sortChannels(joinedChans)
    return (joinedChans)
    }
  async getNotJoinedChans(): Promise<Channel[]> {
    let notJoinedChans = await axios.get("http://localhost:3000/channel/notJoinedChannels/" + this.props.user.id)
      .then(response => response.data)
      .catch(error => alert("getNotJoinedChans " + error.status + ": " + error.message))
    return (notJoinedChans)
  }
  async getUserList(): Promise<User[]> {
    let userList = await axios.get('http://localhost:3000/user/list/' + this.props.user.id)
      .then(response => response.data)
      .catch(error => alert("getUserList " + error.status + ": " + error.message))
    return (userList)
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
    let ChatData = structuredClone(this.state);
    let which;

    if (newChan.id === undefined)
      return ;
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
    for (let chan of ChatData.notJoinedChans) {
      if (chan.id === this.state.actualUser.openedConvID) {
        ChatData.actualUser.openedConvID = -1;
        break ;
      }
    }
    this.setState(ChatData)
  }

  socketUpdateUser(user: User) {
    let ChatData: ChatState = structuredClone(this.state);
    ChatData.actualUser.user = user;
    this.setState(ChatData);
  }

  socketUpdateUserlist(userUpdate: User) {
    let ChatData: ChatState = structuredClone(this.state);
    
    for (let i = 0; i < ChatData.userList.length; i++) {
      if (ChatData.userList[i].id === userUpdate.id) {
        ChatData.userList.splice(i, 1);
        ChatData.userList.push(userUpdate);
      }
    }
    this.setState(ChatData);
  }

  socketUpdateUsersStatus(usersStatusList: any) {
    let ChatData: ChatState = structuredClone(this.state);

    ChatData.statusList = new Map(JSON.parse(usersStatusList));
    this.setState(ChatData);
  }
  
  async socketNewUser() {
    let ChatData: ChatState = structuredClone(this.state);

    ChatData.userList = await this.getUserList();
    this.setState(ChatData);
  }
  /** CHAT COMMANDS **/
  
  render() {
    this.socket.off('updateChanFromServer').on('updateChanFromServer', (chan) => this.socketUpdateChan(chan));
    this.socket.off('newChanFromServer').on('newChanFromServer', (chan) => this.socketNewChan(chan));
    this.socket.off('newMsgFromServer').on('newMsgFromServer', (msg) => this.socketNewMsg(msg));
    this.socket.off('updateUserFromServer').on('updateUserFromServer', (user) => this.socketUpdateUser(user));
    this.socket.off('updateUserlistFromServer').on('updateUserlistFromServer', (user) => this.socketUpdateUserlist(user));
    usersStatusSocket.off('updateStatusFromServer').on('updateStatusFromServer', (statusList) => this.socketUpdateUsersStatus(statusList));
    usersStatusSocket.off('newUserFromServer').on('newUserFromServer', () => this.socketNewUser());

    return (
    <div className="chatContainer">
      
        <div className="ChannelMenu">
            <HeaderChannels state={this.state} socket={this.socket} />
            <SearchBar state={this.state} socket={this.socket} openConvHandler={this.openConvHandler}  />
            <ChannelDisplay state={this.state} socket={this.socket} 
                  openConvHandler={this.openConvHandler} />
            <InfoDialog />
        </div>
        <div className="ChatDisplay">
            {this.state.actualUser.openedConvID === -1 ? null : <ChatHeader state={this.state} socket={this.socket} openConvHandler={this.openConvHandler} /> }
            <div className="MessageDisplay"><MessageDisplay state={this.state} socket={this.socket} /></div>
            {this.state.actualUser.openedConvID === -1 ? null : <div className="SendMessage"><SendBox state={this.state} socket={this.socket} openConvHandler={this.openConvHandler} /></div>}
        </div>

    </div>
    )
  }
}
export default ChatWithHook(Chat);