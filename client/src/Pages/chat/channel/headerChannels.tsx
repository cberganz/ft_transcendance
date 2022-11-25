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
import { Channel } from '../stateInterface'


// API REQUESTS ////////////////////////////////////
function postChan(chan: Channel) {
}

function getChanID() : number {
  return (1)
}

function getUserList() {
  return ([{login: "cdine", id: 0}, {login: "rbicanic", id: 1}])
}

////////////////////////////////////////////////////

function CreateChannelButton(props: any) {
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const createChannel = (e: any) => {
      e.preventDefault()
      if (e.target.name.value === "")
        return (alert("Please a channel title."))
        
      let chanType
      if (e.target.password.value === "")
        chanType = "public"
      else
        chanType = "private"
      const newChan: Channel = {
        id:        getChanID(),
        ownerId:   props.props.state.actualUser.user.id,
        title:     e.target.name.value,
        members:   [],
        type:      chanType,
        password:  e.target.password.value,
        admin:     [],
        Message:   [],
        blacklist: [],
      }
      newChan.members[0] = props.props.state.actualUser.user
      newChan.admin[0] = props.props.state.actualUser.user

      props.props.socket.emit("newChan", newChan)
      postChan(newChan)
    }
    return (
      <div>
        <Tooltip title="Create channel">
          <AddCircleOutlineSharpIcon
            onClick={handleClickOpen}
            fontSize='medium'
            sx={{color: 'black', cursor: 'pointer', marginTop: '10px', marginLeft: '70%'}} />
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

function SendMessageButton(props: any) {
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    const [login, setLogin] = React.useState('');
    const handleChange = (event: SelectChangeEvent) => {
        setLogin(event.target.value as string);
    };

    const userList = getUserList()
    
    const newDM = (e: any) => {
      e.preventDefault()

      const newChan: Channel = {
        id:        getChanID(),
        ownerId:     props.props.state.actualUser.user.id,
        title:     "",
        members:   [],
        type:      "dm",
        password:  "",
        admin:     [],
        Message:   [],
        blacklist: [],
      }
      newChan.members[0] = props.props.state.actualUser.user
      // newChan.members[1] = get user 

      props.props.socket.emit("newChan", newChan)
      postChan(newChan)
    }
  
    return (
      <div>
        <Tooltip title="Send message">
          <CreateSharpIcon
            onClick={handleClickOpen}
            fontSize='medium'
            sx={{color: 'black', cursor: 'pointer', marginTop: '10px'}} />
        </Tooltip>

        <form  onSubmit={(e) => {newDM(e)}}>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>New DM</DialogTitle>
          <DialogContent>

            <Box sx={{ minWidth: 120, marginTop: '10px' }}>
                <FormControl fullWidth>
                    <InputLabel id="login">Login</InputLabel>
                    <Select
                    labelId="login"
                    id="login"
                    value={login}
                    label="login"
                    onChange={handleChange}
                    >
                    {userList.map((user) => (<MenuItem value={user.id}>{user.login}</MenuItem>))}
                    </Select>
                </FormControl>
            </Box>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Open discussion</Button>
          </DialogActions>
        </Dialog>
        </form>
      </div>
    );
}

export default function HeaderChannels(props: any) {
    return (
        <div className='ChannelHeader'>
            <SendMessageButton props={props} />
            <CreateChannelButton props={props} />
        </div>
    )
}