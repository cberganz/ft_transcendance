import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function getCurrentChan(props: any) {
  for(let i = 0; i < props.state.joinedChans.length; i++) {
    if (props.state.joinedChans[i].id === props.state.user.openedConvID){
      return (props.state.joinedChans[i])
    }
  }
}

// code all
function onKeyPress(e: any, props: any) {
  if (e.key === 'Enter') {
    const chan = getCurrentChan(props)
    const target = e.target as HTMLInputElement
    const value: string = target.value

    target.value = ""
    if (value.length) {
      if (value[0] === '/') {
        if (value.substring(0, 6) === "/leave")
          alert("Left channel.")
        else if (value.substring(0, 6) === "/block")
          alert("Blocked " + value.substring(7))
        else if (value.substring(0, 6) === "/unblock")
          alert("Blocked " + value.substring(9))
        else if (value.substring(0, 7) === "/setpwd")
          alert("Password changed.")
        else if (value.substring(0, 6) === "/rmpwd")
          alert("Password removed.")
        else if (value.substring(0, 10) === "/addadmin")
          alert("Admin added.")
        else if (value.substring(0, 4) === "/ban")
          alert(value.split(" ", 3)[1] + " banned for " + value.split(" ", 3)[2] + " minutes.")
        else if (value.substring(0, 4) === "/mute")
          alert(value.split(" ", 3)[1] + " muted for " + value.split(" ", 3)[2] + " minutes.")
        else if (value.substring(0, 5) === "/game")
          alert(value.split(" ", 3)[1] + " invited to play a game.")
      }
      else
        props.newMessage(value, chan)
    }
  }
}

export default function SendBox(props: any) {
  return (
    <Box>
      <TextField
        onKeyPress={(e) => onKeyPress(e, props)} 
        fullWidth id="fullWidth" 
        sx={{background: 'white'}} />
    </Box>
  );
}