import BlockIcon from '@mui/icons-material/Block';
import { Tooltip } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

function getChan(id: number, props: any) {
  for (let i = 0; i < props.state.joinedChans?.length; i++) {
    if (props.state.joinedChans[i].id === id)
      return (props.state.joinedChans[i])
  }
}

// check dans blacklist de l'user si blocked
function isBlocked(props: any) : boolean {
  return (false)
}

// invite for a game, leave chan ou block/unblock
export default function ChatHeader(props:any) {
  const chan = getChan(props.state.actualUser.openedConvID, props)
  return (
    <div style={{
        marginTop: '15px', 
        color: 'black',
        display: 'grid',
        gridTemplateColumns: 'auto 80px',
        gridTemplateRows: '1fr',
        gridAutoRows: '1fr',
        gap: '0px 0px',
        gridAutoFlow: 'row',
        }}>
      <div style={{textAlign: 'left', marginLeft: '25px'}}>{chan?.title} {isBlocked(props) ? <i style={{fontSize: '10px'}}>[blocked]</i> : null} </div>
      <div>
        {chan?.type === 'dm' && !isBlocked(props) ? <div><Tooltip title="Invite for a pong"><SportsEsportsIcon sx={{cursor: 'pointer', color: 'grey', marginRight: '20px'}} /></Tooltip><Tooltip title="Block user"><BlockIcon sx={{cursor: 'pointer', color: 'grey'}} /></Tooltip></div> : null}
        {chan?.type === 'dm' && isBlocked(props) ? <Tooltip title="Unblock user"><LockOpenIcon sx={{cursor: 'pointer', color: 'grey', marginLeft: '45px'}} /></Tooltip> : null}
        {chan?.type === 'public' || chan?.type === 'private' ? <Tooltip title="Leave channel" sx={{cursor: 'pointer', color: 'grey', marginLeft: '45px'}}><ExitToAppIcon /></Tooltip> : null}
      </div>
    </div>
  )
}