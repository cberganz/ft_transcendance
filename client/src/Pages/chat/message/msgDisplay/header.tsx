import BlockIcon from '@mui/icons-material/Block';
import { Tooltip } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { getChan, isBlocked, getProfile } from '../../utils'
import { Icon } from '@iconify/react';
import { Channel, User } from '../../stateInterface'
import ChatCommands from '../../chatCommands'
import useAlert from "../../../../Hooks/useAlert";
import { useNavigate } from "react-router-dom";


function isAdmin(userId: number, chan?: Channel) : boolean {
  if (chan === undefined) 
    return (false);
  for (let admin of chan.admin) {
    if (admin.id === userId)
      return true;
  }
  return (false);
}

export default function ChatHeader(props:any) {
  const navigate = useNavigate();
  const { setAlert } = useAlert();
  const chan = getChan(props.state.actualUser.openedConvID, props.state);
  let   profileLink: string = "";

  if (chan === undefined)
    return (<div></div>)
  
  let title: String = "";
  let dmUser = undefined;
  const chatCmd = async (cmd: string) => {
    let errorLog: string | undefined = await ChatCommands(cmd, props.state, props.socket, {chanId: chan.id, openConvHandler: props.openConvHandler});
    if (errorLog !== undefined) {
      if (errorLog.substring(0, 5) === "Error")
        setAlert(errorLog, "error");
      else
        setAlert(errorLog, "success");
    }
  }

  if (chan?.type === 'dm') {
    if (props.state.actualUser.user.id === chan.members[0].id)
      dmUser = getProfile(props.state.userList, chan.members[1].id);
    else
      dmUser = getProfile(props.state.userList, chan.members[0].id);
    profileLink = "/profile?userId=" + dmUser?.id.toString();
    if (dmUser)
      title = dmUser.login.valueOf();
  }
  else
    title = chan?.title;
  return (
    <div className='ChatHeader' style={{
        color: 'black',
        display: 'grid',
        gridTemplateColumns: 'auto 80px',
        gridTemplateRows: '1fr',
        gridAutoRows: '1fr',
        gap: '0px 0px',
        gridAutoFlow: 'row',
        }}>
      <div style={{textAlign: 'left', marginLeft: '5px', display: 'flex'}}>
        {props.state.mobile ? 
          <div style={{cursor: 'pointer'}}><Icon onClick={() => props.openConvHandler(-1)} icon="material-symbols:arrow-back-ios-rounded" width="30" height="20" /></div>
          : null }
          <div style={{marginLeft: '10px'}}>{dmUser === undefined || dmUser === null ? <span style={{marginRight: "10px"}}>{title}</span> : <span onClick={() => navigate(profileLink)} style={{cursor: 'pointer', marginRight: "10px"}}>{getProfile(props.state.userList, dmUser.id)?.username}</span>} </div>
        {dmUser !== undefined && dmUser !== null && isBlocked(props.state.actualUser.user, dmUser) ? <i style={{fontSize: '10px'}}>[blocked]</i> : null}
        {chan?.ownerId === props.state.actualUser.user.id ? <Tooltip title="Owner"><Icon icon="mdi:shield-crown" color="gray" inline={true} /></Tooltip> : null}
        {isAdmin(props.state.actualUser.user.id, chan) ? <Tooltip title="Group administrator"><Icon icon="dashicons:admin-users" color="gray" inline={true} /></Tooltip> : null}
      </div>
      <div>
        {chan?.type === 'dm' && dmUser !== undefined && dmUser !== null && !isBlocked(props.state.actualUser.user, dmUser) ? <div><Tooltip title="Invite for a pong"><SportsEsportsIcon sx={{cursor: 'pointer', color: 'grey', marginRight: '20px'}} /></Tooltip><Tooltip title="Block user"><BlockIcon onClick={(event) => chatCmd("/block " + title.valueOf())} sx={{cursor: 'pointer', color: 'grey'}} /></Tooltip></div> : null}
        {chan?.type === 'dm' && dmUser !== undefined && dmUser !== null && isBlocked(props.state.actualUser.user, dmUser) ? <Tooltip title="Unblock user"><LockOpenIcon onClick={(event) => chatCmd("/unblock " + title.valueOf())} sx={{cursor: 'pointer', color: 'grey', marginLeft: '45px'}} /></Tooltip> : null}
        {chan?.type === 'public' || chan?.type === 'private' ? <Tooltip title="Leave channel" sx={{cursor: 'pointer', color: 'grey', marginLeft: '45px'}}><ExitToAppIcon onClick={(event) => chatCmd("/leave")} /></Tooltip> : null}
      </div>
    </div>
  )
}