import { ChatState, Channel } from './stateInterface'
import axios from 'axios'

export class ChatCommands {
    private cmd_socket: any;
    private cmd_state: ChatState;
    private commands: Map<string, Function>;
    private openConvHandler: Function;
    
    constructor(socket: any, state: ChatState, openConvHandler: Function) {
        this.JoinChan = this.JoinChan.bind(this);
        this.LeaveChan = this.LeaveChan.bind(this);
        this.handler = this.handler.bind(this);

        this.openConvHandler = openConvHandler;
        this.cmd_socket = socket;
        this.cmd_state = state;
        this.commands = new Map([
            ["/join", this.JoinChan],  
            ["/leave", this.LeaveChan],
        ]);
        }
    
    handler(input: string, params: any) {
        let inputs = input.split(' ', 3);
        let func = this.commands.get(inputs[0])
        if (func !== undefined)
            func(params, this)
    }
    
    JoinChan(chanId: number) {
        axios.post("http://localhost:3000/channel/addMember/", {channelId: chanId, memberId: this.cmd_state.actualUser.user.id})
            .then(response => this.cmd_socket.emit('updateChanFromClient', response.data))
            .catch(error => alert(error.status + ": " + error.message)) 
        this.cmd_socket.emit('joinChatRoom', chanId);
    }
    
    LeaveChan(chanId: any, self: ChatCommands) {
        axios.post("http://localhost:3000/channel/deleteMember/", {channelId: chanId, memberId: this.cmd_state.actualUser.user.id})
            .then(response => this.cmd_socket.emit('updateChanFromClient', response.data))
            .catch(error => alert(error.status + ": " + error.message)) 
        this.cmd_socket.emit('leaveChatRoom', chanId)
        this.openConvHandler(-1);
    }
}