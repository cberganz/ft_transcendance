import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import LockIcon from '@mui/icons-material/Lock';
import '../../chat.css'
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import { StyledBadge, getProfile, getDmUser, getLastMsg } from '../../utils';
import { Channel, ChatState, userProfile } from '../../stateInterface';
import ChatCommands from '../../chatCommands';
import useAlert from "../../../../Hooks/useAlert";
import { useSelector } from "react-redux"
import { selectUserlist } from '../../../../Hooks/userListSlice'

function getChanName(userList: userProfile[], state: ChatState, chan: Channel) {
  if (chan.type !== 'dm')
    return (chan.title);
  return (getDmUser(userList, state, chan)?.username);
}

function ItemContent(props: {chan: any, lastMsg: any, state: ChatState}) {
	const userList 		= useSelector(selectUserlist).userList
  const chanName    = getChanName(userList, props.state, props.chan);

  return (
    <>
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
                 {getProfile(useSelector(selectUserlist).userList, props.lastMsg?.author?.id)?.username}
                </Typography>
                <span> </span>
                  {props.lastMsg?.content?.substring(0, 15)}
                  {props.lastMsg?.content?.length && props.lastMsg?.content?.length > 15 ? <span>...</span> : null}
                
              </React.Fragment>
            }
            />
          {props.chan.type === 'private' ? <span> <LockIcon sx={{ padding: '5%', marginTop:'10px'}} /></span> : null}
      </>
  );
}

function DmItemAvatar(props: {state: ChatState, chan: any}) {
	const userList 		= useSelector(selectUserlist).userList
  let dmUser        = getDmUser(userList, props.state, props.chan);
  let isConnected   = getProfile(useSelector(selectUserlist).userList, dmUser?.id)?.status === 'online' ? true : false;
  
  return (
      <>
          {
            isConnected ? 
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{ marginRight: '10px', marginBottom: '10px' }}
              >
                  <Avatar alt={dmUser?.username?.valueOf()} src={dmUser?.avatar.valueOf()} /> 
              </StyledBadge>
            : <Avatar alt={dmUser?.username?.valueOf()} src={dmUser?.avatar.valueOf()} />
          }
      </>
  ); 
}


export function ChannelItem(chan: Channel, props: any) {
  let lastMsg = getLastMsg(props.state, chan);
  let bckgColor = props.state.actualUser.openedConvID === chan.id ? '#f5f5f5' : 'white';

  return (
    <>
      <ListItem 
        onClick={event => {props.openConvHandler(chan.id)}} 
        alignItems="flex-start" className="ChannelItem" 
        sx={{backgroundColor: bckgColor, 
        cursor: 'pointer'}}>
          <ListItemAvatar>
            {
              chan.type === 'dm' ? 
                <DmItemAvatar state={props.state} chan={chan} />
              : <Avatar alt={chan.title.valueOf()} src="-" />
            }
          </ListItemAvatar>
          <ItemContent chan={chan} lastMsg={lastMsg} state={props.state} />
      </ListItem>
          
    </>
  )
}

export function NotJoinedChanItem(props: any) {
  const lastMsg         = props.chan?.Message?.slice(-1);
  const { setAlert }    = useAlert();
  const [open, setOpen] = React.useState(false);
	const userList 		    = useSelector(selectUserlist).userList;
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const joinChan = async (e: any) => {
    e.preventDefault()
    let pwd = "";

    if (e.target.password)
      pwd = e.target.password.value;
    
    let errorLog: string | undefined = await ChatCommands("/join " + pwd, props.props.state, userList, props.props.socket, 
      {chanId: props.chan.id, openConvHandler: props.props.openConvHandler});
    if (!errorLog)
      return ;
    errorLog.substring(0, 5) === "Error" ? setAlert(errorLog, "error") : setAlert(errorLog, "success");
  }

  return (
  <div>
      <ListItem onClick={handleClickOpen} alignItems="flex-start" className="ChannelItem" sx={{backgroundColor: 'white', cursor: 'pointer'}}>
          <ListItemAvatar>
            <Avatar alt={props.chan.title} src="-" />
          </ListItemAvatar>
          <ItemContent chan={props.chan} lastMsg={lastMsg} state={props.props.state} />
          {props.chan.type === 'private' ? <span> <LockIcon sx={{ padding: '5%', marginTop:'10px'}} /></span> : null}
      </ListItem>

      <form  onSubmit={(e) => {joinChan(e)}}>
          <Dialog open={open} onClose={handleClose} disablePortal>
    
            <DialogTitle>Join "{props.chan.title}" Channel ?</DialogTitle>
    
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
