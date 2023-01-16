import { selectCurrentUser } from '../../Hooks/authSlice'
import ConnectedUsers from './ConnectedUsers';
import {
	Avatar,
	Box,
	Link,
	Typography
} from '@mui/material';

import './Dashboard.css'
import { useSelector } from "react-redux"
import { useEffect, useState } from 'react';
import { usersStatusSocket } from "../../Router/Router";
import { userProfile } from '../chat/stateInterface';
import { useNavigate } from "react-router-dom";
import { styled, alpha } from '@mui/material/styles';
import FriendSection from "./FriendList";

interface allUsers {
	id: number,
	User: string,
	status: string,
	playgame: string,
}

function UserCard() {
	const currentUser = useSelector(selectCurrentUser)

	const StyledAccount = styled('div')(({ theme }) => ({
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(2, 2.5),
		borderRadius: Number(theme.shape.borderRadius) * 1.5,
		backgroundColor: alpha(theme.palette.grey[500], 0.12),
	}));

	return (
		<Box sx={{ mb: 5, mx: 2.5 }}>
			<Link underline="none">
			<StyledAccount>
				<Avatar src={currentUser.avatar} alt="photoURL" />
				<Box sx={{ ml: 2 }}>
				<Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
					{currentUser.username}
				</Typography>
				<Typography variant="body2" sx={{ color: 'text.secondary' }}>
					{currentUser.login}
				</Typography>
				</Box>
			</StyledAccount>
			</Link>
		</Box>
	)
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
					<div className="userCol">
						<UserCard/>
						{currentUser.friends.length
							? 
								<div>
									<Typography sx={{ color: 'text.primary', fontWeight: 'bold' }}>
										Friends:
									</Typography>
									<FriendSection data={userList.filter((user) => isFriend(user.id))}/>
								</div>
							: null}
					</div>
				</div>
				<div className="userContentContainer">
					<div className="contentCol">
							<div className="connectedUsers"><ConnectedUsers allUsersTab={allUsersTab} navigate={navigate} /></div>
					</div>
				</div>
			</div>
		</div>
	);
}
