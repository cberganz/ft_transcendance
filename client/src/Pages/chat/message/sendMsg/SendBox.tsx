import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import ChatCommands from '../../chatCommands'
import useAlert from "../../../../Hooks/useAlert";

function getCurrentChan(props: any) {
  for(let i = 0; i < props.state.joinedChans.length; i++) {
    if (props.state.joinedChans[i].id === props.state.actualUser.openedConvID){
      return (props.state.joinedChans[i])
    }
  }
}
  
export default function SendBox(props: any) {
  const { setAlert } = useAlert();

  const newMessage = async (value: String) => {
      const chan = getCurrentChan(props)
      const newMsg = {
        channelId: chan.id,
        authorId:  props.state.actualUser.user.id,
        content:   value,
      }
      axios.post("http://localhost:3000/message", newMsg, 
        {withCredentials: true, headers: {Authorization: `Bearer ${props.state.actualUser.token}`}})
        .then(response => props.socket.emit("newMsgFromClient", {room: "chat" + chan.id, message: response.data}))
        .catch(error => setAlert("You've been blocked or mute.", "error")) 
  }

  const onKeyPress = async (e: any) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement
      const value: string = target.value
      
      target.value = ""
      if (value.length) {
        if (value[0] === '/') {
          let errorLog: string | undefined = await ChatCommands(value, props.state, props.socket, 
            {chanId: props.state.actualUser.openedConvID, openConvHandler: props.openConvHandler})
          if (errorLog !== undefined) {
            if (errorLog.substring(0, 5) === "Error")
              setAlert(errorLog, "error");
            else
              setAlert(errorLog, "success");
          }
        }
        else 
          newMessage(value);
        }
      }
  }

  return (
    <Box>
      <TextField
        onKeyPress={(e) => onKeyPress(e)} 
        fullWidth id="fullWidth" 
        autoFocus
        sx={{background: 'white'}} />
    </Box>
  );
}