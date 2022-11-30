import BlockIcon from '@mui/icons-material/Block';
import { Tooltip } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { getChan } from '../../utils'

// check dans blacklist de l'user si blocked
function isBlocked(props: any) : boolean {
  return (false)
}

// invite for a game, leave chan ou block/unblock
export default function ChatHeader(props:any) {
  const chan = getChan(props.state.actualUser.openedConvID, props.state);
  let title;
  if (chan?.type === 'dm') {
    if (props.state.actualUser.user.id === chan.members[0].id)
      title = chan.members[1].username
    else
      title = chan.members[0].username
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
      <div style={{textAlign: 'left', marginLeft: '25px'}}>{title} {isBlocked(props) ? <i style={{fontSize: '10px'}}>[blocked]</i> : null} </div>
      <div>
        {chan?.type === 'dm' && !isBlocked(props) ? <div><Tooltip title="Invite for a pong"><SportsEsportsIcon sx={{cursor: 'pointer', color: 'grey', marginRight: '20px'}} /></Tooltip><Tooltip title="Block user"><BlockIcon sx={{cursor: 'pointer', color: 'grey'}} /></Tooltip></div> : null}
        {chan?.type === 'dm' && isBlocked(props) ? <Tooltip title="Unblock user"><LockOpenIcon sx={{cursor: 'pointer', color: 'grey', marginLeft: '45px'}} /></Tooltip> : null}
        {chan?.type === 'public' || chan?.type === 'private' ? <Tooltip title="Leave channel" sx={{cursor: 'pointer', color: 'grey', marginLeft: '45px'}}><ExitToAppIcon onClick={(event) => props.chatCommands.handler("/leave", chan.id)} /></Tooltip> : null}
      </div>
    </div>
  )
}