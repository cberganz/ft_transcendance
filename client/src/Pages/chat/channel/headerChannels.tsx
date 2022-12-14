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
import { ChatProps, User, Channel } from '../stateInterface'
import { StyledBadge } from '../utils'
import Avatar from '@mui/material/Avatar';
import { Icon } from '@iconify/react';
import useAlert from "../../../Hooks/useAlert";
import { useNavigate } from "react-router-dom";

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
    const { setAlert } = useAlert();
  
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
      axios.post('http://localhost:3000/channel/newChan/', newChan, 
        {withCredentials: true, headers: {Authorization: `Bearer ${props.props.state.actualUser.token}`}})
        .then(response => {
          props.props.socket.emit("newChanFromClient", response.data);
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

export default function HeaderChannels(props: ChatProps) {
  const navigate = useNavigate();
  let avatar = props.state.actualUser.user.username;
  const   profileLink: string = "http://localhost/profile?userId=" + props.state.actualUser.user.id.toString();
  return (
    <div className='ChannelHeader'>
        <Tooltip title={props.state.actualUser.user.username}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          sx={{ marginRight: '10px', marginBottom: '10px' }}
        >
          <Avatar 
          alt={avatar.toString()} 
          src={avatar.toString()}
          sx={{ width: 30, height: 30, marginTop: '10px', marginLeft: '15px', cursor: 'pointer' }}
          onClick={() => navigate(profileLink)} />
        </StyledBadge>
        </Tooltip>
        <CreateChannelButton props={props} />
    </div>
  )
}