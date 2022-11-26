import { useEffect } from "react";

export function ListenSocket(socket: any, userIsInChan: Function, ChatData: any, setState: Function) {
    socket.on('newChanFromServer', (chan: any) => {
        socket.off('newChanFromServer')
        if (userIsInChan(chan))
          ChatData.joinedChans.push(chan)
        else
          ChatData.notJoinedChans.push(chan)
        setState(ChatData)
      });

      useEffect(() => {
        socket.on('newMsgFromServer', (msg: any) => {
          socket.off('newMsgFromServer')
          alert("ok")
          ChatData.messages.push(msg)
          if (msg.channelId === ChatData.actualUser.openedConvID)
            ChatData.openedConversation.push(msg)
        setState(ChatData)
        });
      }, [socket])
    
    return (<div></div>)
}