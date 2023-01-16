import { getChan, isBlocked, getDmUser, isAdmin, isBlacklisted } from "../../utils";
import ChatCommands from "../../chatCommands";
import useAlert from "../../../../Hooks/useAlert";
import * as chatIcons from './chatIcons'
import { useNavigate } from "react-router-dom";
import '../../chat.css'
import { ChatState, User } from "../../stateInterface";
import { useSelector } from "react-redux"
import { selectUserlist } from '../../../../Hooks/userListSlice'
import { chatSocket } from "../../chat";

function RightDmHeader(props: {state: ChatState, dmUser: User, chatCmd: any}) {
  return (
    <>
    {
      isBlocked(props.state.actualUser.user, props.dmUser) ? 
        <chatIcons.ChatUnblockIcon chatCmd={props.chatCmd} user={props.dmUser.username} />
        : (
            <>
              {
                isBlacklisted(props.dmUser?.id, props.state.actualUser.user) ? null :
                  <chatIcons.ChatGameIcon id={props.dmUser?.id} />
              }
              <chatIcons.ChatBlockIcon chatCmd={props.chatCmd} user={props.dmUser.username} />
            </>
          )        
    }
    </>
  );
}

function RightChanHeader(props: {chan: any, chatCmd: any}) {
  return (
      <>
        <chatIcons.ChatULeaveIcon chatCmd={props.chatCmd} />
      </>
  );
}

function LeftDmHeader(props: {dmUser: any, state: ChatState}) {
  const navigate = useNavigate();
  let profileLink = "/profile?userId=" + props.dmUser?.id.toString();

  return (
    <div style={{ marginLeft: "10px" }}>
        <span onClick={() => navigate(profileLink)} style={{ cursor: "pointer", marginRight: "10px" }}>
            {props.dmUser.username}
        </span>
        {" "}
    </div>
  )
}

function LeftChanHeader(props: {chan: any, state: ChatState}) {
  return (
  <>
      <div style={{ marginLeft: "10px" }}>
        <span style={{ marginRight: "10px" }}>
          {props.chan.title}
        </span>{" "}
      </div>
      {
        props.chan?.ownerId === props.state.actualUser.user.id ?
          <chatIcons.ChatOwnerIcon /> : null
      }
      {
        isAdmin(props.state.actualUser.user.id, props.chan) ?
          <chatIcons.ChatAdminIcon /> : null
      }
  </>
  );
}

export default function ChatHeader(props: any) {
  const { setAlert }  = useAlert();
  const chan          = getChan(props.state.actualUser.openedConvID, props.state); 
	const userList 		  = useSelector(selectUserlist).userList;
  let   dmUser: any   = getDmUser(userList, props.state, chan);
  
  if (chan === undefined) return <div></div>;

  const chatCmd = async (cmd: string) => {
    let errorLog: string | undefined = await ChatCommands(
      cmd,
      props.state,
      userList,
      { chanId: chan.id, openConvHandler: props.openConvHandler }
    );

    if (errorLog)
      errorLog.substring(0, 5) === "Error" ? setAlert(errorLog, "error") : setAlert(errorLog, "success");
  };

  return (
    <div className="ChatHeader">
        <div className="leftChatHeader">
            { props.state.mobile && <chatIcons.ChatGobackIcon openConvHandler={props.openConvHandler} /> }    
            {
                chan.type === 'dm' ?
                <LeftDmHeader dmUser={dmUser} state={props.state} />
              : <LeftChanHeader chan={chan} state={props.state} />
            }

        </div>

        <div>
          {
            chan.type === 'dm' ?
              <RightDmHeader state={props.state} dmUser={dmUser} chatCmd={chatCmd} />
            : <RightChanHeader chan={chan} chatCmd={chatCmd} />
          }
        </div>
    </div>
  );
}
