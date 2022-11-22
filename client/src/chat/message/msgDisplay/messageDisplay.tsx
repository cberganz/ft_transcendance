import { Avatar } from "@mui/material";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';
import '../../chat.css'

function MessageItemReceiver(avatar: string, name: string, text: string) {
  return (
    <div className="leftChat">
      <div className="leftChatAvatar"><Avatar src={avatar} sx={{ marginRight: '10px', marginTop:'15px'}}></Avatar></div>
      <div className="leftChatContent">
        <Alert severity="success" icon={false} sx={{width:'70%'}}>
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
      <div className="rightChatAvatar"><Avatar src={avatar} sx={{marginLeft: '10px', marginRight: '10px', marginTop:'15px'}}></Avatar></div>
    </div>
  )
}

export default function MessageDisplay(props: any) {
  if (props.state.user.openedConvID === -1)
    return (<div></div>)
  else {
    return (
      <Stack sx={{ width: '100%' }} spacing={2}>
          {props.state.openedConversation.map((msg: any) => (
            <div key={msg.id}>
              {msg.author.login === props.state.user.login ? MessageItemSender(msg.author.avatar, msg.author.login, msg.content) : 
                MessageItemReceiver(msg.author.avatar, msg.author.login, msg.content)}
            </div>
          ))}
      </Stack>
  	)
  }
}