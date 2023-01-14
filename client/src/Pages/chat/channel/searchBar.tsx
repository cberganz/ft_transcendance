import React from 'react';
import { User } from '../stateInterface'
import axios from 'axios';
import useAlert from "../../../Hooks/useAlert";

export default function SearchBar(props: any) {
    const { setAlert } = useAlert();
    
      const newDM = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget);

        let otherUserId: number = -1;
        for (let user of userList) {
            if (user.username === data.get('username'))
                otherUserId = user.id;
        }
        if (otherUserId === -1) {
            setAlert(data.get('username') + " can't be found or is already in your dms.", "error");
            return e.currentTarget.reset();
        }
        const newChan = {
          user1: props.state.actualUser.user.id,
          user2: otherUserId,
        }
        axios.post('http://localhost:3000/channel/newDM/', newChan, 
          {withCredentials: true, headers: {Authorization: `Bearer ${props.state.actualUser.token}`}})
          .then(response => {
            props.socket.emit("newChanFromClient", response.data); 
            props.openConvHandler(response.data.id);
            })
          .catch(error => alert("Error sending DM.")) 
        e.currentTarget.reset();
      }
  
      let userList = structuredClone(props.state.userList);
      let dmList: User[] = []
      for (let chan of props.state.joinedChans) {
        if (chan.type === "dm") {
          if (chan.members[0].id === props.state.actualUser.user.id)
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

    return (
        <div className="searchBar">
            <form  onSubmit={(e) => {newDM(e)}}>
                <input id="searchQueryInput" type="text" name="username" placeholder="Search username" autoComplete='off' />
            </form>
        </div>
    );
}