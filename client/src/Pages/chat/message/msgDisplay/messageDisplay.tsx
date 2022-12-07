import { Avatar } from "@mui/material";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';
import { Player } from '@lottiefiles/react-lottie-player';
import '../../chat.css'
import { Message, User, Channel } from '../../stateInterface'
import { getChan, isBlocked } from '../../utils'

function MessageItemReceiver(author: User, text: String, chan: Channel | undefined, actualUser: User) {
  if (author.avatar === undefined || author.avatar === null)
    author.avatar = "";
  if (chan === undefined || (isBlocked(actualUser, author) && chan.type != 'dm'))
    return (<div></div>)
  return (
    <div className="leftChat">
      <div className="leftChatAvatar"><Avatar src={author.avatar.valueOf()}></Avatar></div>
      <div className="leftChatContent">
        <Alert severity="success" icon={false}>
          <b>{author.username}</b><br />
          {text}
        </Alert>
      </div>
    </div>
  )
}

function MessageItemSender(author: User, text: String) {
  if (author.avatar === undefined || author.avatar === null)
    author.avatar = "";
  return (
    <div className="rightChat">
      <div className="rightChatContent">
        <Alert severity="info" icon={false}>
          <AlertTitle><b>{author.username}</b></AlertTitle>
          {text}
        </Alert>
      </div>
      <div className="rightChatAvatar"><Avatar src={author.avatar.valueOf()}></Avatar></div>
    </div>
  )
}

export default function MessageDisplay(props: any) {
  let chan = getChan(props.state.actualUser.openedConvID, props.state);
  if (props.state.actualUser.openedConvID === -1 || chan?.Message === undefined)
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
  else {
    return (
      <Stack sx={{ width: '100%' }} spacing={2}>
          {chan.Message.map((msg: Message) => (
            <div key={msg.id}>
              {msg.author.id === props.state.actualUser.user.id ? MessageItemSender(msg.author, msg.content) : 
                MessageItemReceiver(msg.author, msg.content, chan, props.state.actualUser.user)}
            </div>
          ))}
      </Stack>
  	)
  }
}