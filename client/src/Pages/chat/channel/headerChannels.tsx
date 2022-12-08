import Button from '@mui/material/Button';
import '../chat.css'
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CreateSharpIcon from '@mui/icons-material/CreateSharp';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import { ChatProps, User, Channel } from '../stateInterface'
import Avatar from '@mui/material/Avatar';
import { Icon } from '@iconify/react';


// API REQUESTS ////////////////////////////////////
async function postChan(chan: any, socket: any) {
  axios.post('http://localhost:3000/channel/newChan/', chan)
    .then(response => socket.emit("newChanFromClient", response.data))
    .catch(error => alert("Error creating channel."))
}
////////////////////////////////////////////////////

function titleAlreadyExists(title: string, notJoinedChans: Channel[], joinedChans: Channel[]) : boolean {
  for (let chan of joinedChans) {
    if (title === chan.title && chan.type !== 'dm')
      return (true);
  }
  for (let chan of notJoinedChans) {
    if (title === chan.title && chan.type !== 'dm')
      return (true);
  }
  return (false);
}

function CreateChannelButton(props: any) {
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const createChannel = (e: any) => {
      e.preventDefault();
      var title = e.target.name.value.trim();
      if (title === "")
        return (alert("Please a channel title."))
      if (titleAlreadyExists(title, props.props.state.notJoinedChans, props.props.state.joinedChans))
        return (setOpen(true), alert("Title already exists."))
      let chanType
      if (e.target.password.value === "")
        chanType = "public"
      else
        chanType = "private"
      const newChan = {
        type:      chanType,
        password:  e.target.password.value,
        title:     title,
        ownerId:   props.props.state.actualUser.user.id,
      }
      postChan(newChan, props.props.socket);
    }

    return (
      <div>
        <Tooltip title="Create channel">
          <Icon icon="jam:write"
            onClick={handleClickOpen}
            fontSize='medium'
            style={{color: 'black', cursor: 'pointer', marginTop: '14px', marginLeft: '70%'}}
            width="23" height="23" />
          </Tooltip>
        <form  onSubmit={(e) => {createChannel(e)}}>
          <Dialog open={open} onClose={handleClose} disablePortal>
            <DialogTitle>New channel</DialogTitle>
            <DialogContent>
              <DialogContentText>
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Channel name"
                type="name"
                fullWidth
                variant="standard"
                inputProps={{ maxLength: 20 }}
              />
              <TextField
                margin="dense"
                id="password"
                label="Password (optionnal)"
                type="password"
                fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" onClick={handleClose}>Create</Button>
            </DialogActions>
          </Dialog>
          </form>
      </div>
    );
}

export default function HeaderChannels(props: ChatProps) {
  let avatar = props.state.actualUser.user.username;
    return (
    <div className='ChannelHeader'>
        <Avatar 
          alt={avatar.toString()} 
          src={""}
          sx={{ width: 30, height: 30, marginTop: '10px', marginLeft: '15px' }} />
        <CreateChannelButton props={props} />
    </div>
  )
}