import * as React from "react"
import { selectCurrentUser } from '../../Hooks/authSlice'
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
import { useEffect, useState } from 'react';
import { usersStatusSocket } from "../../App/App";
import { userProfile } from '../chat/stateInterface';
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
	const [ userList, setUserList ] = useState<userProfile[]>([]);
	const [allUsersTab, setAllUsersTab ] = useState<allUsers[]>([]);

	useEffect(() => {
		usersStatusSocket.emit("updateStatus", "online");
	}, []);
	
	const socketUpdateUsersStatus = (usersStatusList: userProfile[]) => {
		for (let i = 0; i < usersStatusList.length; i++) {
			if (usersStatusList[i].id === undefined || usersStatusList[i].id === currentUser.id) {
				usersStatusList.splice(i, 1);
				i--;
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

    usersStatusSocket.off('updateStatusFromServer').on('updateStatusFromServer', (userStatusList: userProfile[]) => socketUpdateUsersStatus(userStatusList));
	return (
		<div>
			<div className="dashboard">
				<div className="userCol">
					<div className="userProfile">
						<Avatar 
						src={currentUser.avatar}
						sx={{ width: 160, height: 160, marginTop: '30px' }}
						className="dashboardAvatar"
						/>
						<br />
						<h3>{currentUser.username}</h3>
						<br />
					</div>

					{currentUser.friends.length ? 
					<div className="friendList">
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Friend</TableCell>
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
											<b onClick={() => navigate("/profile?userId=" + user.id)} style={{cursor: 'pointer'}}>{user.username}</b>
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
						<br />
					</div> : null}

				</div>

				<div className="contentCol">
					<div className="connectedUsers"><ConnectedUsers allUsersTab={allUsersTab} navigate={navigate} /></div>
				</div>
			</div>
		</div>
	);
}
