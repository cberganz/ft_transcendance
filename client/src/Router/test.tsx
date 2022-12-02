import * as React from "react"
import { useUpdateUserMutation, useGetUserMutation } from "../Api/User/userApiSlice"
import { selectCurrentUser } from '../Hooks/authSlice'
import { useSelector } from "react-redux"
import { Button } from '@mui/material';
import useSimpleRequest from '../Api/useSimpleRequest';
import useAlert from "../Hooks/useAlert";

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
	// const userData = useSimpleRequest(useGetUsersMutation, {})
	let Content =() => <p>{JSON.stringify(userData)}</p> 
	
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
			<h1>Dashboard</h1>
			 <Content></Content>
		</div>
	);
}
