import { ChatState, Channel } from './stateInterface'
import { getChan } from './utils'
import axios from 'axios'

export let COMMANDS = {
    JOINCHAN: 0,
    LEAVECHAN: 1,
    BLOCK: 2,
    UNBLOCK: 3,
    SETPWD: 4,
    RMPWD: 5,
    ADDADMIN: 6,
    BAN: 7,
    MUTE: 8,
    GAME: 9,
}

/** UPDATE REQUESTS */
async function deleteMemberChan(chanId: number, memberId: number, socket: any) {
    axios.post("http://localhost:3000/channel/deleteMember/", {channelId: chanId, memberId: memberId})
        .then(response => socket.emit('updateChanFromClient', response.data))
        .catch(error => alert(error.status + ": " + error.message)) 
}
async function addMemberChan(chanId: number, memberId: number, socket: any) {
    axios.post("http://localhost:3000/channel/addMember/", {channelId: chanId, memberId: memberId})
        .then(response => socket.emit('updateChanFromClient', response.data))
        .catch(error => alert(error.status + ": " + error.message)) 
}
/****************** */


/** SOCKET UPDATE */
/**************** */

function JoinChan(socket: any, state: ChatState, chanId: number) {
    addMemberChan(chanId, state.actualUser.user.id, socket);
    socket.emit('joinChatRoom', chanId);
}

function LeaveChan(socket: any, state: ChatState, chanId: number) {
    deleteMemberChan(chanId, state.actualUser.user.id, socket);
    socket.emit('leaveChatRoom', chanId)
}

export function ChatCommands(which: number, socket: any, state: ChatState, params: any) {
    switch (which) {
        case COMMANDS.JOINCHAN:
            return JoinChan(socket, state, params);
        case COMMANDS.LEAVECHAN:
            return LeaveChan(socket, state, params);
        case COMMANDS.BLOCK :
        case COMMANDS.UNBLOCK:
        case COMMANDS.SETPWD:
        case COMMANDS.RMPWD:
        case COMMANDS.ADDADMIN:
        case COMMANDS.BAN:
        case COMMANDS.MUTE:
        case COMMANDS.GAME:
        default:
    }
}