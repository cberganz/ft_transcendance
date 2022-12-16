import * as React from "react"
import { useUpdateUserMutation, useGetUserMutation } from "../../Api/User/userApiSlice"
import { selectCurrentUser } from '../../Hooks/authSlice'
import { Button } from '@mui/material';
import useSimpleRequest from '../../Api/useSimpleRequest';
import useAlert from "../../Hooks/useAlert";
import ConnectedUsers from './ConnectedUsers';
import { Avatar } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import './Dashboard.css'
import { useSelector } from "react-redux"
import { selectCurrentToken } from '../../Hooks/authSlice'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { usersStatusSocket } from "../../Router/Router";
import { userProfile, User } from '../chat/stateInterface';
import Paper from '@mui/material/Paper';
import { useNavigate } from "react-router-dom";
import Chip from '@mui/material/Chip';

interface allUsers {
	id: number,
	User: string,
	status: string,
	playgame: string,
}

export default function Dashboard() {
	const navigate = useNavigate();
	const currentUser = useSelector(selectCurrentUser)
	const userData = useSimpleRequest(useGetUserMutation, 1)
	const [updateUser, {
		data: data,
		isLoading,
		isError,
		isSuccess,
		error
	}] = useUpdateUserMutation()
	const token = useSelector(selectCurrentToken);
	const [ actualUser, setActualUser ] = useState<User>();
	const [ userList, setUserList ] = useState<userProfile[]>([]);
	const [allUsersTab, setAllUsersTab ] = useState<allUsers[]>([]);

	useEffect(() => {
		(async () => {
			const user = await axios.get("http://localhost:3000/user/" + currentUser.id,
				{withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
				.then(response => setActualUser(response.data))
				.catch(error => alert("getActualUser " + error.status + ": " + error.message))
		})();
	}, []);
	
	const socketUpdateUsersStatus = (usersStatusList: userProfile[]) => {
		for (let i = 0; i < usersStatusList.length; i++) {
			if (usersStatusList[i].id === currentUser.id) {
				usersStatusList.splice(i, 1);
				break ;
			}
		}
		setUserList(usersStatusList);
		let allUsers: allUsers[] = [];
		for (let user of usersStatusList) {
			const tmp: allUsers = {
				id: user.id,
				User: user.username,
				status: user.status,
				playgame: user.status === "in game" ? "View" : "Play",
			}
			allUsers.push(tmp);
		}
		setAllUsersTab(allUsers);
	}
	const isFriend = (id: number) => {
		if (!currentUser.friends)
			return false
		for (let friend of currentUser.friends) {
			if (id === friend.id)
				return true;
		}
		return false;
	}
	
	const handleSubmit = (e: any) => {
		e.preventDefault()
		const input = {
			id: currentUser.userId,
			newUserData: {
				username: "test",
				login: "test"
			}
		}
		updateUser(input)
	}

    usersStatusSocket.off('updateStatusFromServer').on('updateStatusFromServer', (userStatusList: userProfile[]) => socketUpdateUsersStatus(userStatusList));
	return (
		<div>
			<div className="dashboard">
				<div className="userCol">
					<div className="userProfile">
						<Avatar 
						src={currentUser.avatar}
						sx={{ width: 160, height: 160, marginLeft: '45px', marginTop: '30px' }}
						/>
						<br />
						<h3>{currentUser.username}</h3>
					</div>
					<div className="friendList">
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Friend username</TableCell>
										<TableCell>Status</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>

								{userList.filter((user) => isFriend(user.id)).map((user) => (
									
									<TableRow
									key={user.id}
									sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
									>
										<TableCell component="th" scope="row">
											<b onClick={() => navigate("http://localhost/profile?userId=" + user.id)} style={{cursor: 'pointer'}}>{user.username}</b>
										</TableCell>
										<TableCell>
											{user.status === "offline" ? 
											<Chip color="warning" label={user.status}></Chip>
											:<Chip color="primary" label={user.status}></Chip>}
										</TableCell>
									</TableRow>
								))}
								</TableBody>
							</Table>
						</TableContainer>
					</div>
				</div>

				<div className="contentCol">
					<div className="homeHeader">TRANSCENDENCE</div>
					<div className="connectedUsers"><ConnectedUsers allUsersTab={allUsersTab} navigate={navigate} /></div>
				</div>
			</div>
		</div>
	);
}
