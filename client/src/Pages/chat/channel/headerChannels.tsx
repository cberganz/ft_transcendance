import Button from '@mui/material/Button';
import '../chat.css'
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import { Channel } from '../stateInterface'
import Avatar from '@mui/material/Avatar';
import { Icon } from '@iconify/react';
import useAlert from "../../../Hooks/useAlert";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"
import { selectCurrentUser } from '../../../Hooks/authSlice'
import { chatSocket } from '../chat'
import { selectCurrentToken } from '../../../Hooks/authSlice'

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
    const user            = useSelector(selectCurrentUser);
    const token           = useSelector(selectCurrentToken);
    const { setAlert }    = useAlert();
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const createChannel = async (e: any) => {
      e.preventDefault();
      var title = e.target.name.value.trim();
      if (title === "")
        return (alert("Please enter a channel title."))
      if (titleAlreadyExists(title, props.props.state.notJoinedChans, props.props.state.joinedChans))
        return (setOpen(true), alert("Title already exists."))
      
      const newChan = {
        type:      e.target.password.value === "" ? "public" : "private",
        password:  e.target.password.value,
        title:     title,
        ownerId:   user.id,
      }
      axios.post('http://localhost:3000/channel/newChan/', newChan, 
        {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
        .then(response => {
          chatSocket.emit("newChanFromClient", response.data);
          setAlert("Channel successfully created.", "success");
        })
        .catch(error => setAlert("Error creating channel.", "error"))
    }

    return (
      <div>
        <Tooltip title="Create channel">
          <Icon icon="jam:write"
            onClick={handleClickOpen}
            fontSize='medium'
            style={{color: 'black', cursor: 'pointer', marginTop: '14px', marginLeft: '75%'}}
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

export default function HeaderChannels(props: any) {
	const   user 		            = useSelector(selectCurrentUser);
  const   navigate            = useNavigate();
  let     avatar              = user.avatar;
  const   profileLink: string = "/profile?userId=" + user.id.toString();

  return (
    <div className='ChannelHeader'>
        <Tooltip title={user.username}>
                 <Avatar 
          alt={avatar?.toString()} 
          src={avatar?.toString()}
          sx={{ width: 30, height: 30, marginTop: '10px', marginLeft: '25%', cursor: 'pointer' }}
          onClick={() => navigate(profileLink)} />
        </Tooltip>
        <CreateChannelButton props={props} />
    </div>
  )
}