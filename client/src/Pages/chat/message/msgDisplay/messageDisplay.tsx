import { Avatar } from "@mui/material";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { Player } from '@lottiefiles/react-lottie-player';
import '../../chat.css'
import { Message, User, Channel, ChatState } from '../../stateInterface'
import { getChan, isBlocked, getProfile, dateToString } from '../../utils'
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from "react-router-dom";

function MessageContent(props: {type: any, msg: Message, author: any}) {
  let date: Date              = new Date(props.msg.date);
  let msgDate: String         = dateToString(date);
  const   profileLink: string = "/profile?userId=" + props.msg.author.id.toString();
  const navigate = useNavigate();

  return (
      <Tooltip title={msgDate}>
        <Alert severity={props.type}icon={false}>
              <b onClick={() => navigate(profileLink)} style={{cursor: 'pointer'}}>
                {props.author?.username}
              </b><br />
              {props.msg.content}
        </Alert>
      </Tooltip>
  );
}

function MessageItemReceiver(msg: Message, chan: Channel | undefined, actualUser: User, state: ChatState) {
  if (!chan || (isBlocked(actualUser, msg.author) && chan.type !== 'dm'))
      return (<div></div>);
  let     author              = getProfile(state.userList, msg.author.id);

  return (
    <div className="leftChat">
        <div className="leftChatAvatar">
          <Avatar src={author?.avatar.valueOf()}></Avatar>
        </div>
            <div className="leftChatContent">
              <MessageContent type="success" msg={msg} author={author} />
            </div>
    </div>
  )
}


function MessageItemSender(msg: Message, state: ChatState) {
  let     author              = getProfile(state.userList, msg.author.id);
    
  return (
    <div className="rightChat">
        <div className="rightChatContent">
          <MessageContent type="info" msg={msg} author={author} />
        </div>
        <div className="rightChatAvatar">
            <Avatar src={author?.avatar.valueOf()}></Avatar>
        </div>
    </div>
  )
}

export default function MessageDisplay(props: any) {
  let chan = getChan(props.state.actualUser.openedConvID, props.state);

  if (props.state.actualUser.openedConvID === -1 || !chan?.Message)
    return (
        <div>
          <Player
            autoplay={true}
            loop={true}
            controls={true}
            src="https://assets9.lottiefiles.com/packages/lf20_fa1iw49j.json"
            style={{ height: '50vh', width: '50vw'}}
          ></Player>
        </div>
    );
  
  return (
      <Stack sx={{ width: '100%' }} spacing={2}>
          {chan.Message.map((msg: Message) => (
            <div key={msg.id}>
              {msg.author.id === props.state.actualUser.user.id ? MessageItemSender(msg, props.state) : 
                MessageItemReceiver(msg, chan, props.state.actualUser.user, props.state)}
            </div>
          ))}
      </Stack>
  	);
}