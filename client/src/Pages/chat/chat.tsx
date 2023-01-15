import ChannelDisplay from "./channel/channels/channelDisplay";
import MessageDisplay from "./message/msgDisplay/messageDisplay";
import ChatHeader from "./message/msgDisplay/chatHeader";
import SendBox from "./message/sendMsg/SendBox";
import HeaderChannels from "./channel/headerChannels";
import './chat.css'
import React from "react";
import { actualUser, ChatState, Channel, Message } from "./stateInterface";
import io from "socket.io-client";
import axios from "axios"
import { getChan, userIsInChan, sortChannels } from './utils'
import { InfoDialog } from "./channel/infoDialog"
import { selectCurrentUser } from '../../Hooks/authSlice'
import { selectCurrentToken } from '../../Hooks/authSlice'
import { useSelector } from "react-redux"
import SearchBar from "./channel/searchBar"
import { usersStatusSocket } from "../../Router/Router";
import { useSearchParams } from 'react-router-dom';

function ChatWithHook(component: any) {
  return function WrappedChat(props: any) {
    const user = useSelector(selectCurrentUser);
    const token = useSelector(selectCurrentToken);
    const [ openConv ] = useSearchParams();
    let   openConvId: number | null = Number(openConv.get("openConv"));

    return (<Chat user={user} openConv={openConvId} token={token} />)
  }
}

interface Props {
  user: any;
  openConv: number;
  token: any;
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
          username: "",
        },
        token: this.props.token,
      },
      joinedChans: [],
      notJoinedChans: [],
      userList: [],
      mobile: window.innerWidth < 600 ? true : false,
    };

    this.socket = io("http://localhost:3000/chat"); 
  }
  private socket
  
  /** INIT DATA **/
  async componentDidMount() {
    let ChatData = {
      actualUser: await this.getActualUser(),
      joinedChans: await this.getJoinedChans(),
      notJoinedChans: await this.getNotJoinedChans(),
      mobile: window.innerWidth < 600 ? true : false,
    }
    for (const chan of ChatData.joinedChans) 
    this.socket.emit('joinChatRoom', chan.id)
    this.setState(ChatData);
    this.emitNewChan();
    usersStatusSocket.emit("updateStatus", "online");
  }

  async getActualUser(): Promise<actualUser> {
    let actualUser = {
      token: this.props.token,
      openedConvID: this.props.openConv !== 0 ? this.props.openConv : -1,
      user: await axios.get("http://localhost:3000/user/" + this.props.user.id,
        {withCredentials: true, headers: {Authorization: `Bearer ${this.props.token}`}})
        .then(response => response.data)
        .catch(error => alert("getActualUser " + error.status + ": " + error.message))
    }
    this.socket.emit('initTable', actualUser.user.login)
    return (actualUser)
  }
  async getJoinedChans(): Promise<Channel[]> {
    let joinedChans = await axios.get("http://localhost:3000/channel/joinedChannels/" + this.props.user.id, 
      {withCredentials: true, headers: {Authorization: `Bearer ${this.props.token}`}})
      .then(response => response.data)
      .catch(error => alert("getJoinedChan " + error.status + ": " + error.message))
    sortChannels(joinedChans)
    return (joinedChans)
    }
  async getNotJoinedChans(): Promise<Channel[]> {
    let notJoinedChans = await axios.get("http://localhost:3000/channel/notJoinedChannels/" + this.props.user.id,
      {withCredentials: true, headers: {Authorization: `Bearer ${this.props.token}`}})
      .then(response => response.data)
      .catch(error => alert("getNotJoinedChans " + error.status + ": " + error.message))
    return (notJoinedChans)
  }
  async emitNewChan() {
    if (this.props.openConv !== 0) {
      axios.get("http://localhost:3000/channel" + this.props.openConv,
        {withCredentials: true, headers: {Authorization: `Bearer ${this.props.token}`}})
        .then(response => this.socket.emit("newChanFromClient", response.data))
        .catch()
    }
  }
    
  /** RENDERING FUNCTION */
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

    for (let channel of this.state.joinedChans) {
      if (channel.id === chan.id)
        return ;
    }
    for (let channel of this.state.notJoinedChans) {
      if (channel.id === chan.id)
        return ;
    }
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

  async socketUpdateUser(state: ChatState) {
    let ChatData: ChatState = structuredClone(state);

    ChatData.actualUser.user = await axios.get("http://localhost:3000/user/" + state.actualUser.user.id, 
      {withCredentials: true, headers: {Authorization: `Bearer ${state.actualUser.token}`}})
      .then(response => response.data)
      .catch()
    this.setState(ChatData);
  }

  socketUpdateUsersStatus(userList: any) {
    let ChatData: ChatState = structuredClone(this.state);

    ChatData.userList = userList;
    this.setState(ChatData);
  }

  /** RESPONSIVE **/
  setMobile(state: ChatState) {
    let change: boolean = false;
  
    if (window.innerWidth < 600 && state.mobile === false) {
      state.mobile = true;
      change = true;
    }
    else if (window.innerWidth >= 600 && state.mobile === true) {
      state.mobile = false;
      change = true;
    }
    if (change)
      this.setState(state);
  }
  
  
  render() {
    this.socket.off('updateChanFromServer').on('updateChanFromServer', (chan) => this.socketUpdateChan(chan));
    this.socket.off('newChanFromServer').on('newChanFromServer', (chan) => this.socketNewChan(chan));
    this.socket.off('newMsgFromServer').on('newMsgFromServer', (msg) => this.socketNewMsg(msg));
    this.socket.off('updateUserFromServer').on('updateUserFromServer', () => this.socketUpdateUser(this.state));
    usersStatusSocket.off('updateStatusFromServer').on('updateStatusFromServer', (profilesList) => this.socketUpdateUsersStatus(profilesList));

    window.addEventListener('resize', () => this.setMobile(this.state));

    return (
    <div className="chatContainer">
      
      {!this.state.mobile || (this.state.mobile && this.state.actualUser.openedConvID === -1) ?
        <div className="ChannelMenu">
            <HeaderChannels state={this.state} socket={this.socket} />
            <SearchBar state={this.state} socket={this.socket} openConvHandler={this.openConvHandler}  />
            <ChannelDisplay state={this.state} socket={this.socket} 
                  openConvHandler={this.openConvHandler} />
            <InfoDialog />
        </div> : null}

        {!this.state.mobile || (this.state.mobile && this.state.actualUser.openedConvID !== -1) ?
        <div className="ChatDisplay">
            {this.state.actualUser.openedConvID === -1 ? null : <ChatHeader state={this.state} socket={this.socket} openConvHandler={this.openConvHandler} /> }
            <div className="MessageDisplay"><MessageDisplay state={this.state} socket={this.socket} /></div>
            {this.state.actualUser.openedConvID === -1 ? null : <div className="SendMessage"><SendBox state={this.state} socket={this.socket} openConvHandler={this.openConvHandler} /></div>}
        </div>: null}

    </div>
    )
  }
}
export default ChatWithHook(Chat);