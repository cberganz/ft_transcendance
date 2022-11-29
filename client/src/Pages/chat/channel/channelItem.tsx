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
import { ChatCommands, COMMANDS } from '../chatCommands';


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
      ChatCommands(COMMANDS.JOINCHAN, props.props.socket, props.props.state, props.chan.id);
    else if (props.chan.type === "private" && props.chan.password !== e.target.password.value)
      alert("Wrong password.")
  }
  const lastMsg = props.chan?.Message?.slice(-1);
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
                    {lastMsg?.author?.login}
                  </Typography>
                  <span> </span>
                    {lastMsg?.content?.subString(0, 15)}
                    {lastMsg?.content?.length && lastMsg?.content?.length > 15 ? <span>...</span> : null}
                  
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

export function ChannelItem(chan: any, chanName: String, avatar: String, props: any) {
  let lastMsg = chan?.Message[chan.Message.length - 1];
  let lastMsgContent: string = lastMsg?.content
  let bckgColor
 
  if (props.state.actualUser.openedConvID === chan.id)
    bckgColor = '#f5f5f5'
  else
    bckgColor = 'white'
  return (
    <div>
      <ListItem onClick={event => {props.openConvHandler(chan.id)}} alignItems="flex-start" className="ChannelItem" sx={{backgroundColor: bckgColor, cursor: 'pointer'}}>

          <ListItemAvatar>
            {chan.type === 'dm' ? <Avatar alt={chanName?.valueOf()} src={avatar.valueOf()} /> : <Avatar alt={chanName?.valueOf()} src="-" />}
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
                  {lastMsgContent?.substring(0, 15)}
                  {lastMsgContent?.length && lastMsgContent?.length > 15 ? <span>...</span> : null}
                
              </React.Fragment>
            }
            />
          {chan.type === 'private' ? <span> <LockIcon sx={{ padding: '5%', marginTop:'10px'}} /></span> : null}
      </ListItem>
    </div>
  )
}
