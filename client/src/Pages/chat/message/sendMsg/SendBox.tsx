import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios';

// API REQUESTS /////////////////////////
function postMsg(msg: any, socket: any, chanId: number) {
  axios.post("http://localhost:3000/message", msg)
    .then(response => socket.emit("newMsgFromClient", {room: "chat" + chanId, message: response.data}))
    .catch(error => alert(error.status + ": " + error.message)) 
}
/////////////////////////////////////////


function getCurrentChan(props: any) {
  for(let i = 0; i < props.state.joinedChans.length; i++) {
    if (props.state.joinedChans[i].id === props.state.actualUser.openedConvID){
      return (props.state.joinedChans[i])
    }
  }
}

function newMessage(value: String, props: any) {
  const chan = getCurrentChan(props)
  const newMsg = {
    channelId: chan.id,
    authorId:  props.state.actualUser.user.id,
    content:   value,
  }
  postMsg(newMsg, props.socket, chan.id)
}

function onKeyPress(e: any, props: any) {
  if (e.key === 'Enter') {
    const target = e.target as HTMLInputElement
    const value: string = target.value

    target.value = ""
    if (value.length) {
      if (value[0] === '/') {
        props.chatCommands.handler(value, props.state, props.state.actualUser.openedConvID);
      }
      else 
        newMessage(value, props);
    }
  }
}

export default function SendBox(props: any) {
  return (
    <Box>
      <TextField
        onKeyPress={(e) => onKeyPress(e, props)} 
        fullWidth id="fullWidth" 
        autoFocus
        sx={{background: 'white'}} />
    </Box>
  );
}