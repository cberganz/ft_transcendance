import React, {useState} from 'react';
import { User } from '../stateInterface'
import axios from 'axios';
import useAlert from "../../../Hooks/useAlert";

export default function SearchBar(props: any) {
    const [searchInput, setSearchInput] = useState("");
    const { setAlert } = useAlert();
    const handleChange = (e: any) => {
        e.preventDefault();
      };
    
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

                <button id="searchQuerySubmit" type="submit" name="searchQuerySubmit">
                <svg style={{width:'18px', height:'18px'}} viewBox="0 0 18 18">
                    <path fill="#666666" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                </svg>
                </button>
            </form>
        </div>
    );
}