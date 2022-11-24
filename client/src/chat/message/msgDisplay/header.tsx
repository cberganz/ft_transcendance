import BlockIcon from '@mui/icons-material/Block';
import { Tooltip } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LockOpenIcon from '@mui/icons-material/LockOpen';

function getChan(id: number, props: any) {
  for (let i = 0; i < props.state.joinedChans.length; i++) {
    if (props.state.joinedChans[i].id === id)
      return (props.state.joinedChans[i])
  }
}

function isBlocked(props: any) : boolean {
  return (false)
}

export default function ChatHeader(props:any) {
  const chan = getChan(props.state.user.openedConvID, props)
  return (
    <div style={{
        marginTop: '15px', 
        color: 'black',
        display: 'grid',
        gridTemplateColumns: 'auto 50px',
        gridTemplateRows: '1fr',
        gridAutoRows: '1fr',
        gap: '0px 0px',
        gridAutoFlow: 'row',
        }}>
      <div>{chan?.name} {isBlocked(props) ? <i style={{fontSize: '10px'}}>[blocked]</i> : null} </div>
      <div>
        {chan.type === 'dm' && !isBlocked(props) ? <Tooltip title="Block user"><BlockIcon sx={{cursor: 'pointer', color: 'grey'}} /></Tooltip> : null}
        {chan.type === 'dm' && isBlocked(props) ? <Tooltip title="Unblock user"><LockOpenIcon sx={{cursor: 'pointer', color: 'grey'}} /></Tooltip> : null}
        {chan.type === 'public' || chan.type === 'private' ? <Tooltip title="Leave channel" sx={{cursor: 'pointer', color: 'grey'}}><ExitToAppIcon /></Tooltip> : null}
      </div>
    </div>
  )
}