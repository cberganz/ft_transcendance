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
async function postUpdateChan(chan: Channel, socket: any) {
    console.log(chan)
    axios.post("http://localhost:3000/channel/update/" + chan.id, chan)
        .then(response => socket.emit('updateChanFromClient', response.data))
        .catch(error => alert(error.status + ": " + error.message)) 
}
/****************** */

/** SOCKET UPDATE */

/**************** */

function JoinChan(socket: any, state: ChatState, chanId: number) {

}

function LeaveChan(socket: any, state: ChatState, chanId: number) {
    let chan = structuredClone(getChan(chanId, state));

    chan?.members.splice(chan.members.findIndex((member: any) => member.id === state.actualUser.user.id), 1)
    if (chan?.owner?.id === state.actualUser.user.id) {
        chan.owner = undefined
    }
    for (let i = 0; chan?.admin?.length && i < chan?.admin?.length; i++) {
        if (chan?.admin[i].id === state.actualUser.user.id) {
            chan?.admin.splice(i, 1);
            break ;
        }
    }
    let newChan = {
        
    }
    postUpdateChan(chan, socket);
    socket.emit('leaveChatRoom', chan.id)
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