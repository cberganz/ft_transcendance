import * as React from "react"
import { useUpdateUserMutation, useGetUserMutation } from "../../Api/User/userApiSlice"
import { selectCurrentUser } from '../../Hooks/authSlice'
import { useSelector } from "react-redux"
import { Button } from '@mui/material';
import useSimpleRequest from '../../Api/useSimpleRequest';
import useAlert from "../../Hooks/useAlert";
import ConnectedUsers from './ConnectedUsers';
import { Avatar } from "@mui/material";
import './Dashboard.css'


export default function UserCol(props: any) {
    return (
		<div className="userCol">
			<div className="userProfile">
				<Avatar 
				src={props.user.avatar}
				sx={{ width: 160, height: 160, marginLeft: '70px', marginTop: '30px' }}
				/>
				<br />
				<h3>{props.user.username}</h3>
			</div>
		</div>
    );
}

export function Dashboard() {
	const currentUser = useSelector(selectCurrentUser)
	const userData = useSimpleRequest(useGetUserMutation, 1)
	const [updateUser, {
		data: data,
		isLoading,
		isError,
		isSuccess,
		error
	}] = useUpdateUserMutation()
	
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
	return (
		<div>
			<div className="dashboard">
				<UserCol user={currentUser} />
				<div className="contentCol">
					<div className="homeHeader">TRANSCENDENCE</div>
					<div className="connectedUsers"><ConnectedUsers /></div>
				</div>
			</div>
		</div>
	);
}
