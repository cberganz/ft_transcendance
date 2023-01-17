import axios from 'axios'
import { store } from "../Store/store"
import 
{ selectCurrentUser, selectCurrentToken, setCredentials, logOut }
from '../Hooks/authSlice'
import { useSelector, useDispatch } from "react-redux"
import { useLogoutMutation } from "../Api/Auth/authApiSlice";
 

const RefreshRequest = async () => {
	const response = await axios({
		withCredentials: true,
		url: "http://localhost:3000/auth/refresh",
		method: "GET"
	})
	.then((response: any) => response)
	.catch((error: any) => {
		// logoutUser({});
		// logOut({});
		// window.location.replace("/login");
		return ;
	})
	store.dispatch(setCredentials({
		user: response.data.user,
		accessToken: response.data.jwt_token
	}))
	return response
}

const AxiosPrivate = async (...params: any) => {

	let data = await axios(params[0])
	.catch((error: any) => {
		if (error.response.status === 401) {
			let data = RefreshRequest()
			// .then((response: Response) => dispatch())
		}
	})	
	return data
}

export default AxiosPrivate
