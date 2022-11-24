import { Avatar } from "@mui/material";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';
import { Player } from '@lottiefiles/react-lottie-player';
import '../../chat.css'
import { Message } from '../../stateInterface'

function MessageItemReceiver(avatar: string, name: string, text: string) {
  return (
    <div className="leftChat">
      <div className="leftChatAvatar"><Avatar src={avatar}></Avatar></div>
      <div className="leftChatContent">
        <Alert severity="success" icon={false}>
          <AlertTitle><b>{name}</b></AlertTitle>
          {text}
        </Alert>
      </div>
    </div>
  )
}

function MessageItemSender(avatar: string, name: string, text: string) {
  return (
    <div className="rightChat">
      <div className="rightChatContent">
        <Alert severity="info" icon={false}>
          <AlertTitle><b>{name}</b></AlertTitle>
          {text}
        </Alert>
      </div>
      <div className="rightChatAvatar"><Avatar src={avatar}></Avatar></div>
    </div>
  )
}

export default function MessageDisplay(props: any) {
  if (props.state.user.openedConvID === -1)
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
          {props.state.openedConversation.map((msg: Message) => (
            <div key={msg.id}>
              {msg.author.login === props.state.user.login ? MessageItemSender(msg.author.avatar, msg.author.login, msg.content) : 
                MessageItemReceiver(msg.author.avatar, msg.author.login, msg.content)}
            </div>
          ))}
      </Stack>
  	)
  }
}