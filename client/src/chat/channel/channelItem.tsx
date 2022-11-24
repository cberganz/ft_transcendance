import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import LockIcon from '@mui/icons-material/Lock';
import '../chat.css'
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import {Chan} from '../stateInterface'

function getLastMessage(id: number, props: any) {
  for (let i = props.state.messages.length - 1; i >= 0; i--) {
    if (props.state.messages[i].channel.id === id)
      return props.state.messages[i]
  }
}

export function DialogChannelItem(props: any) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const joinChan = (e: any) => {
    e.preventDefault()
    if (props.chan.type === "public" || (props.chan.type === "private" && props.chan.password === e.target.password.value))
      props.props.joinChan(props.chan)
    else if (props.chan.type === "private" && props.chan.password !== e.target.password.value)
      alert("Wrong password.")
  }
  const lastMsg = getLastMessage(props.chan.id, props.props);

  return (
  <div>
        <ListItem onClick={handleClickOpen} alignItems="flex-start" className="ChannelItem" sx={{cursor: 'pointer'}}>

            <ListItemAvatar>
              {props.chan.type === 'dm' ? <Avatar alt={props.chanName} src={""} /> : <Avatar alt={props.chanName} src="-" />}
            </ListItemAvatar>

            <ListItemText
              primary={props.chanName}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    variant="body2"
                    color="text.primary"
                    component={'span'} 
                  >
                    {lastMsg?.author.login}
                  </Typography>
                  <span> </span>
                    {lastMsg?.content.substring(0, 15)}
                    {lastMsg?.content.length && lastMsg?.content.length > 15 ? <span>...</span> : null}
                  
                </React.Fragment>
              }
              />
            {props.chan.type === 'private' ? <span> <LockIcon sx={{ padding: '5%', marginTop:'10px'}} /></span> : null}
        </ListItem>

      <form  onSubmit={(e) => {joinChan(e)}}>
          <Dialog open={open} onClose={handleClose} disablePortal>
    
            <DialogTitle>Join "{props.chanName}" Channel ?</DialogTitle>
    
            <DialogContent>
              {props.chan.type === "private" ? 
              <TextField
              autoFocus
              margin="dense"
                id="password"
                label="Password"
                type="password"
                fullWidth
                variant="standard"
                /> : null}
            </DialogContent>
    
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" onClick={handleClose}>Join</Button>
            </DialogActions>
    
          </Dialog>
      </form>

  </div>
    
)
}

export function ChannelItem(chan: Chan, chanName: string, avatar: string, props: any) {
    const lastMsg = getLastMessage(chan.id, props);
    let bckgColor
  
    if (props.state.user.openedConvID === chan.id)
      bckgColor = '#f5f5f5'
    else
      bckgColor = 'white'
    return (
      <div>
        <ListItem onClick={event => props.openConvHandler(chan.id)} alignItems="flex-start" className="ChannelItem" sx={{backgroundColor: bckgColor, cursor: 'pointer'}}>

            <ListItemAvatar>
              {chan.type === 'dm' ? <Avatar alt={chanName} src={avatar} /> : <Avatar alt={chanName} src="-" />}
            </ListItemAvatar>

            <ListItemText
              primary={chanName}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {lastMsg?.author.login}
                  </Typography>
                  <span> </span>
                    {lastMsg?.content.substring(0, 15)}
                    {lastMsg?.content.length && lastMsg?.content.length > 15 ? <span>...</span> : null}
                  
                </React.Fragment>
              }
              />
            {chan.type === 'private' ? <span> <LockIcon sx={{ padding: '5%', marginTop:'10px'}} /></span> : null}
        </ListItem>
      </div>
    )
}
