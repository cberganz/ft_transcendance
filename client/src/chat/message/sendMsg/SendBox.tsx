import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function getCurrentChan(props: any) {
  for(let i = 0; i < props.state.joinedChans.length; i++) {
    if (props.state.joinedChans[i].id === props.state.user.openedConvID){
      return (props.state.joinedChans[i])
    }
  }
}

function onKeyPress(e: any, props: any) {
  if (e.key === 'Enter') {
    const target = e.target as HTMLInputElement;
    const value = target.value
    target.value = ""
    props.newMessage(value, getCurrentChan(props))
  }
}

export default function SendBox(props: any) {
  return (
    <Box>
      <TextField
        onKeyPress={(e) => onKeyPress(e, props)} 
        fullWidth id="fullWidth" />
    </Box>
  );
}