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

interface Props {
}

export class Chat extends React.Component<Props, ChatState> {
  constructor(props: any) {
    super(props)

    this.userHandler = this.userHandler.bind(this)
    this.openConvHandler = this.openConvHandler.bind(this)
    this.updateChannelMenu = this.updateChannelMenu.bind(this)
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

    this.socket = io("http://localhost:3000/chat") 
    this.state = this.ChatData

    this.socket.emit('initTable', this.ChatData.actualUser.user.login)
  }

  private socket
  private ChatData: ChatState

  /** INIT REQUESTS **/
  getMessages() : Message[] {
      return []
  }
  getActualUser() : actualUser {
    let tmp = prompt("Enter your login", "")
    if (tmp === null)
      tmp = "cdine"
    let cdine = {
      id:          0,
      login:       tmp,
      username:    tmp,
      avatar:      "https://i.guim.co.uk/img/media/08312799ce07993294b1cd2e135a0f00e3455c42/0_0_6720_4480/master/6720.jpg?width=620&quality=85&dpr=1&s=none",
      friends:     [],
      blacklisted: [],
      messages:    [],
      channels:    [],
      admin_of:    [],
      p1_games:    [],
      p2_games:    [],
      friendship:  [],
      blacklist:   []
    }
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
        if (this.state.messages[i].channelId === chanID) {
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
  userIsInChan(chan: Channel) {
    return (true) ////////////////////////////////////////
  }

  /** CREATE **/
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
  
  newMsg(msg: any) {
    this.ChatData.messages.push(msg)
    if (msg.channelId === this.ChatData.actualUser.openedConvID)
      this.ChatData.openedConversation.push(msg)
    this.setState(this.ChatData)
  }
  
  newChan(chan: any) {
    if (this.userIsInChan(chan))
      this.ChatData.joinedChans.push(chan)
    else
      this.ChatData.notJoinedChans.push(chan)
    this.setState(this.ChatData)
  }
  
  render() {
    this.socket.off('newChanFromServer').on('newChanFromServer', (chan) => this.newChan(chan))
    this.socket.off('newMsgFromServer').on('newMsgFromServer', (msg) => this.newMsg(msg))

    return (
    <div className="chatContainer">
        <div className="ChannelMenu">
            <HeaderChannels state={this.state} socket={this.socket} />
            <ChannelDisplay state={this.state} userHandler={this.userHandler} openConvHandler={this.openConvHandler}
                  userIsNotInChan={this.userIsNotInChan} joinChan={this.joinChan} />
            <InfoDialog />
        </div>
        {this.state.actualUser.openedConvID === -1 ? null : <div className="ChatHeader"><ChatHeader state={this.state} /></div> }
        <div className="MessageDisplay"><MessageDisplay state={this.state} userHandler={this.userHandler} /></div>
        {this.state.actualUser.openedConvID === -1 ? null : <div className="SendMessage"><SendBox state={this.state} socket={this.socket} /></div>}
    </div>
    )
  }
}
export default Chat;