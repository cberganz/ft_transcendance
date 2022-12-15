import { Avatar } from "@mui/material";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';
import { Player } from '@lottiefiles/react-lottie-player';
import '../../chat.css'
import { Message, User, Channel, ChatState } from '../../stateInterface'
import { getChan, isBlocked, getProfile } from '../../utils'
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from "react-router-dom";


function MessageItemReceiver(msg: Message, chan: Channel | undefined, actualUser: User, navigate: any, state: ChatState) {
  if (chan === undefined || (isBlocked(actualUser, msg.author) && chan.type !== 'dm'))
  return (<div></div>)
  let     date: Date = new Date(msg.date);
  let     msgDate: String = String(date.getDay()) + "/" + String(date.getMonth()) + "/" + String(date.getFullYear()) + " " + String(date.getHours()) + ":" + String(date.getMinutes()); 
  const   profileLink: string = "http://localhost/profile?userId=" + msg.author.id.toString();
  let     author = getProfile(state.userList, msg.author.id);
  if (author && (author.avatar === undefined || author.avatar === null))
    author.avatar = "";

  return (
    <div className="leftChat">
      <div className="leftChatAvatar">
        <Avatar style={{cursor: 'pointer'}} src={author?.avatar.valueOf()} onClick={() => navigate(profileLink)}></Avatar>
      </div>
      <Tooltip title={msgDate}>
        <div className="leftChatContent">
          <Alert severity="success" icon={false}>
            <b onClick={() => navigate(profileLink)} style={{cursor: 'pointer'}}>{author?.username}</b><br />
            {msg.content}
          </Alert>
        </div>
      </Tooltip>
    </div>
  )
}

function MessageItemSender(msg: Message, navigate: any, state: ChatState) {
  let date: Date = new Date(msg.date);
  let msgDate: String = String(date.getDay()) + "/" + String(date.getMonth()) + "/" + String(date.getFullYear()) + " " + String(date.getHours()) + ":" + String(date.getMinutes()); 
  const   profileLink: string = "http://localhost/profile?userId=" + msg.author.id.toString();
  let     author = getProfile(state.userList, msg.author.id);
  if (author && (author.avatar === undefined || author.avatar === null))
    author.avatar = "";
  return (
    <div className="rightChat">
      <Tooltip title={msgDate}>
      <div className="rightChatContent">
        <Alert severity="info" icon={false}>
          <b onClick={() => navigate(profileLink)} style={{cursor: 'pointer'}}>{author?.username}</b><br />
          {msg.content}
        </Alert>
      </div>
      </Tooltip>
      <div className="rightChatAvatar">
        <Avatar style={{cursor: 'pointer'}} src={author?.avatar.valueOf()} onClick={() => navigate(profileLink)}></Avatar>
      </div>
    </div>
  )
}

export default function MessageDisplay(props: any) {
  let chan = getChan(props.state.actualUser.openedConvID, props.state);
  const navigate = useNavigate();

  if (props.state.actualUser.openedConvID === -1 || chan?.Message === undefined) {
    return (
    <div>
      <Player
        autoplay={true}
        loop={true}
        controls={true}
        src="https://assets9.lottiefiles.com/packages/lf20_fa1iw49j.json"
        style={{ height: '400px', width: '400px' }}
      ></Player>
    </div>
    )
  }
  else {
    return (
      <Stack sx={{ width: '100%' }} spacing={2}>
          {chan.Message.map((msg: Message) => (
            <div key={msg.id}>
              {msg.author.id === props.state.actualUser.user.id ? MessageItemSender(msg, navigate, props.state) : 
                MessageItemReceiver(msg, chan, props.state.actualUser.user, navigate, props.state)}
            </div>
          ))}
      </Stack>
  	)
  }
}