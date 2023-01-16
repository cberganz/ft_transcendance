import React from 'react';
import { ChatState } from '../stateInterface'
import axios from 'axios';
import useAlert from "../../../Hooks/useAlert";

function getUserListWithoutDm(state: ChatState) {
  let userList = structuredClone(state.userList);
  let dmList = [];

  for (let chan of state.joinedChans) {
    if (chan.type === "dm") {
      if (chan.members[0].id === state.actualUser.user.id)
        dmList.push(structuredClone(chan.members[1]));
      else
        dmList.push(structuredClone(chan.members[0]));
    }
  }
  for (let i = userList.length - 1; i >= 0; i--) {
    for (let dmUser of dmList) {
      if (userList[i] && dmUser.id === userList[i].id) {
        userList.splice(i, 1);
      }
    }
  }
  return (userList);
}

function isInUserList(userList: any, username: any) {
  for (let user of userList) {
      if (user.username === username)
          return (user.id);
  }
  return (-1);
}

async function createChan(newChan: {user1: number, user2: number}, props: any) {
  axios.post('http://localhost:3000/channel/newDM/', newChan, 
  {withCredentials: true, headers: {Authorization: `Bearer ${props.state.actualUser.token}`}})
  .then(response => {
    props.socket.emit("newChanFromClient", response.data); 
    props.openConvHandler(response.data.id);
    })
  .catch(error => alert("Error sending DM.")) 
}

export default function SearchBar(props: any) {
    const { setAlert }  = useAlert();
    let   userList      = getUserListWithoutDm(props.state);
    
    const newDM = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const data = new FormData(e.currentTarget);
      let   otherUserId: number = isInUserList(userList, data.get('username'));
      
      otherUserId === -1 ?
          setAlert(data.get('username') + " can't be found or is already in your dms.", "error")
        : createChan({user1: props.state.actualUser.user.id, user2: otherUserId}, props);
      e.currentTarget.reset();
    } 

    return (
        <div className="searchBar">
            <form  onSubmit={(e) => {newDM(e)}}>
                <input id="searchQueryInput" type="text" name="username" placeholder="Search username" autoComplete='off' />
            </form>
        </div>
    );
}