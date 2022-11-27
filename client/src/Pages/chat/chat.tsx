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
import axios from "axios"
import { channel } from "diagnostics_channel";

interface Props {
}

export class Chat extends React.Component<Props, ChatState> {
  constructor(props: any) {
    super(props)

    this.openConvHandler = this.openConvHandler.bind(this)
    this.updateChannelMenu = this.updateChannelMenu.bind(this)
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
    };
    
    this.socket = io("http://localhost:3000/chat") 
    this.getData()
    this.state = this.ChatData
    
    this.socket.emit('initTable', this.ChatData.actualUser.user.login)
  }

  private socket
  private ChatData: ChatState

  /** INIT REQUESTS **/
  async getData(): Promise<void> {
    this.ChatData = {
      actualUser: await this.getActualUser(),
      joinedChans: await this.getJoinedChans(),
      notJoinedChans: await this.getNotJoinedChans(),
      openedConversation: []
    }
    for (const chan of this.state.joinedChans)
      this.socket.emit('joinChatRoom', chan.id)
  }
  async getActualUser(): Promise<any> {
    this.ChatData.actualUser = {
      openedConvID: -1,
      user: await axios.get("http://localhost:3000/user/1")
        .then(response => response.data)
        .catch(error => alert(error.status + ": " + error.message))
      }
    return (this.ChatData.actualUser)
  }
  async getJoinedChans(): Promise<any> {
    this.ChatData.joinedChans = await axios.get("http://localhost:3000/channel/joinedChannels/" + this.ChatData.actualUser.user.id)
      .then(response => response.data)
      .catch(error => alert(error.status + ": " + error.message))
  }
  async getNotJoinedChans(): Promise<any> {
    this.ChatData.notJoinedChans = await axios.get("http://localhost:3000/channel/notJoinedChannels/" + this.ChatData.actualUser.user.id)
      .then(response => response.data)
      .catch(error => alert(error.status + ": " + error.message))
  }
    
    /** RENDERING FUNCTIONS */
  openConvHandler(chanID: number) {
    this.ChatData = this.state
    this.ChatData.openedConversation = this.getChan(chanID).Message
    this.ChatData.actualUser.openedConvID = chanID
    this.setState(this.ChatData)
  }

  updateChannelMenu(chan: any) : void {
    let whichTable;
    this.ChatData = this.state
    const userIsInChan = this.userIsInChan(chan)

    if (userIsInChan)
      whichTable = this.ChatData.joinedChans;
    else 
      whichTable = this.ChatData.notJoinedChans;
    for (let i = 0; i < whichTable.length; i++) {
      if (whichTable[i].id === chan.id) {
        whichTable.splice(0, 0, whichTable[i]);
        whichTable.splice(i + 1, 1);
      }
    }
  }

  /** UTILS **/
  userIsInChan(chan: any) {
    if (chan.members === undefined)
      return (false)
    for (let user of chan.members) {
      if (user.login === this.state.actualUser.user.login)
        return (true)
    }
    return (false)
  }
  getChan(id: number) {
    for (const chan of this.state.joinedChans) {
      if (chan.id === id)
        return chan
    }
  }

  /** CREATE **/
  joinChan(chan: Channel) {
    this.ChatData = this.state
    for (let i = 0; i < this.ChatData.notJoinedChans.length; i++) {
      if (chan.id === this.ChatData.notJoinedChans[i].id) {
        this.ChatData.notJoinedChans.splice(i, 1)
        break 
      }
    }
    this.ChatData.joinedChans.push(chan)
    this.openConvHandler(chan.id)
    this.setState(this.ChatData)
  }
  
  socketNewMsg(msg: any) {
    this.ChatData = this.state
    const chan = this.getChan(msg.channelId)
    chan.Message.push(msg)
    this.updateChannelMenu(this.getChan(msg.channelId))
    this.setState(this.ChatData)
  }
  
  socketNewChan(chan: any) {
    this.ChatData = this.state
    if (this.userIsInChan(chan))
      this.ChatData.joinedChans.splice(0, 0, chan)
    else
      this.ChatData.notJoinedChans.splice(0, 0, chan)
    this.setState(this.ChatData)
  }
  
  render() {
    this.socket.off('newChanFromServer').on('newChanFromServer', (chan) => this.socketNewChan(chan))
    this.socket.off('newMsgFromServer').on('newMsgFromServer', (msg) => this.socketNewMsg(msg))

    return (
    <div className="chatContainer">
        <div className="ChannelMenu">
            <HeaderChannels state={this.state} socket={this.socket} />
            <ChannelDisplay state={this.state} openConvHandler={this.openConvHandler}
                  joinChan={this.joinChan} />
            <InfoDialog />
        </div>
        {this.state.actualUser.openedConvID === -1 ? null : <div className="ChatHeader"><ChatHeader state={this.state} /></div> }
        <div className="MessageDisplay"><MessageDisplay state={this.state} /></div>
        {this.state.actualUser.openedConvID === -1 ? null : <div className="SendMessage"><SendBox state={this.state} socket={this.socket} /></div>}
    </div>
    )
  }
}
export default Chat;