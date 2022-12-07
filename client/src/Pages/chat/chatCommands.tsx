import { Blacklist, ChatState } from './stateInterface'
import axios from 'axios'
import { getChan } from './utils';
import useAlert from "../../Hooks/useAlert";
import { setDefaultResultOrder } from 'dns';
import React from 'react';


function ChatCommandWithHook(component: any) {
    return function WrappedChat(props: any) {
        const { setAlert } = useAlert();
        return (<ChatCommands alert={setAlert} />)
    }
}

interface Props {
    alert: any,
}

export class ChatCommands extends React.Component<Props> {
    private socket: any;
    private commands: Map<string, Function>;
    private openConvHandler: Function;
    
    constructor(socket: any, openConvHandler: Function) {
        super(socket, openConvHandler);

        this.JoinChan = this.JoinChan.bind(this);
        this.LeaveChan = this.LeaveChan.bind(this);
        this.SetPwd = this.SetPwd.bind(this);
        this.RmPwd = this.RmPwd.bind(this);
        this.handler = this.handler.bind(this);
        this.AddAdmin = this.AddAdmin.bind(this);
        this.Block = this.Block.bind(this);
        this.Unblock = this.Unblock.bind(this);
        this.Ban = this.Ban.bind(this);
        this.Mute = this.Mute.bind(this);

        this.openConvHandler = openConvHandler;
        this.socket = socket;
        this.commands = new Map([
            ["/leave", this.LeaveChan],
            ["/setpwd", this.SetPwd],
            ["/rmpwd", this.RmPwd],
            ["/addadmin", this.AddAdmin],
            ["/block", this.Block],
            ["/unblock", this.Unblock],
            ["/ban", this.Ban],
            ["/mute", this.Mute],
        ]);
        }
    
    handler(input: string, state: ChatState, params: any) {
        let inputs = input.split(' ', 3);
        let func = this.commands.get(inputs[0])
        if (func !== undefined)
            func(inputs, state, params)
    }
    
    JoinChan(inputs: string[], state: ChatState, chanId: any) {
        this.socket.emit('joinChatRoom', chanId);
        const chan = getChan(chanId, state);
        if (chan?.type === 'dm')
            return ;
        axios.post("http://localhost:3000/channel/Member/", {channelId: chanId, memberId: state.actualUser.user.id})
            .then(response => this.socket.emit('updateChanFromClient', response.data))
            .catch(error => alert("You're banned from this chan.")) 
    }
    
    LeaveChan(inputs: string[], state: ChatState, chanId: any) {
        this.socket.emit('leaveChatRoom', chanId)
        const chan = getChan(chanId, state);
        if (chan?.type === 'dm')
            return ;

        axios.delete("http://localhost:3000/channel/Member/", {data: {channelId: chanId, memberId: state.actualUser.user.id}})
            .then(response => this.socket.emit('updateChanFromClient', response.data))
            .catch(error => alert(error.status + ": " + error.message)) 
        this.openConvHandler(-1);
    }

    SetPwd(inputs: string[], state: ChatState, chanId: any) {
        const chan = getChan(chanId, state);
        if (chan?.type === 'dm' || inputs.length === 1)
            return ;

        axios.post("http://localhost:3000/channel/setPwd/", {pwd: inputs[1], channelId: chanId, userId: state.actualUser.user.id})
            .then(response => this.socket.emit('updateChanFromClient', response.data))
            .catch(error => alert(error.status + ": " + error.message)) 
    }

    RmPwd(inputs: string[], state: ChatState, chanId: any) {
        const chan = getChan(chanId, state);
        if (chan?.type === 'dm')
            return ;

        axios.post("http://localhost:3000/channel/setPwd/", {pwd: "", channelId: chanId, userId: state.actualUser.user.id})
            .then(response => this.socket.emit('updateChanFromClient', response.data))
            .catch(error => alert(error.status + ": " + error.message)) 
    }

    AddAdmin(inputs: string[], state: ChatState, chanId: any) {
        const chan = getChan(chanId, state);
        if (chan?.type === 'dm' || inputs.length === 1 || chan === undefined)
            return ;

        let adminId = -1;
        for (let user of chan?.members) {
            if (user.username === inputs[1]) {
                adminId = user.id;
                break ;
            }
        }
        if (adminId === -1)
            return ;
        axios.post("http://localhost:3000/channel/addAdmin/", {adminId: adminId, chanId: chanId, userId: state.actualUser.user.id})
            .then(response => this.socket.emit('updateChanFromClient', response.data))
            .catch(error => alert(error.status + ": " + error.message)) 
    }

    async Block(inputs: string[], state: ChatState, chanId: any) {
        const chan = getChan(chanId, state);
        if (inputs.length === 1 || chan === undefined)
            return ;

        let blockedId = -1;
        for (let user of chan?.members) {
            if (user.username === inputs[1]) {
                blockedId = user.id;
                break ;
            }
        }
        if (blockedId === -1 || blockedId === state.actualUser.user.id)
            return ;
        await axios.post("http://localhost:3000/blacklist", {target_id: blockedId, type: "block", channelId: chanId, creatorId: state.actualUser.user.id})
            .then()
            .catch(error => alert(error.status + ": " + error.message));
        axios.get("http://localhost:3000/user/" + state.actualUser.user.id)
            .then(response => this.socket.emit('updateUserFromClient', response.data))
            .catch(error => alert("getActualUser " + error.status + ": " + error.message))
    }

    async Unblock(inputs: string[], state: ChatState, chanId: any) {
        const   chan = getChan(chanId, state);
        let     blockedId = -1;
        let     blacklistId = -1;

        if (inputs.length === 1 || chan === undefined || state.actualUser.user.blacklist === undefined)
            return ;
        for (let user of chan?.members) {
            if (user.username === inputs[1]) {
                blockedId = user.id;
                break ;
            }
        }
        if (blockedId === -1)
            return ;
        for (let blacklist of state.actualUser.user.blacklist) {
            if (blacklist.target_id === blockedId)
                blacklistId = blacklist.id;
        }
        if (blacklistId === -1)
            return ;
        await axios.delete("http://localhost:3000/blacklist/" + blacklistId)
            .then()
            .catch(error => alert(error.status + ": " + error.message));
        axios.get("http://localhost:3000/user/" + state.actualUser.user.id)
            .then(response => this.socket.emit('updateUserFromClient', response.data))
            .catch(error => alert("getActualUser " + error.status + ": " + error.message))
    }

    async Ban(inputs: string[], state: ChatState, chanId: any) {
        const chan = getChan(chanId, state);
        if (inputs.length < 3 || chan === undefined || isNaN(Number(inputs[2])))
            return ;
        let blockedId = -1;
        let blockedLogin;
        for (let user of chan?.members) {
            if (user.username === inputs[1]) {
                blockedId = user.id;
                blockedLogin = user.login;
                break ;
            }
        }
        if (blockedId === -1 || blockedId === state.actualUser.user.id)
            return ;

        let isError = await axios.post("http://localhost:3000/blacklist", {target_id: blockedId, type: "ban", delay: inputs[2], channelId: chanId, creatorId: state.actualUser.user.id})
            .then()
            .catch(error => error.code);
        if (isError === "ERR_BAD_RESPONSE")
            return alert("You don't have the rights.");
        axios.delete("http://localhost:3000/channel/Member/", {data: {channelId: chanId, memberId: blockedId}})
            .then(response => this.socket.emit('updateChanFromClient', response.data))
            .catch(error => alert(error.status + ": " + error.message)) 
        this.socket.emit('banFromClient', {bannedLogin: blockedLogin, chanId: chanId});
    }

    async Mute(inputs: string[], state: ChatState, chanId: any) {
        const chan = getChan(chanId, state);
        if (inputs.length < 3 || chan === undefined || isNaN(Number(inputs[2])))
            return ;
        let blockedId = -1;
        for (let user of chan?.members) {
            if (user.username === inputs[1]) {
                blockedId = user.id;
                break ;
            }
        }
        if (blockedId === -1 || blockedId === state.actualUser.user.id)
            return ;
        
        let isError = await axios.post("http://localhost:3000/blacklist", {target_id: blockedId, type: "mute", delay: inputs[2], channelId: chanId, creatorId: state.actualUser.user.id})
            .then()
            .catch(error => error.code);
        if (isError === "ERR_BAD_RESPONSE")
            return alert("You don't have the rights.");
    }
}
export default ChatCommandWithHook(ChatCommands);
