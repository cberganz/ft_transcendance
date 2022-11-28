import { useState, useEffect } from "react";
import { refreshApiSlice } from "./refreshApiSlice";
import { selectCurrentToken } from './authSlice'
import { useSelector } from "react-redux"
import axios, {AxiosResponse} from "axios";
import { setCredentials, logOut } from '../../Features/Auth/authSlice'
import { useDispatch } from "react-redux"
			

const persistLogin = () => {
	const [isLoading, setIsLoading] = useState(true)
	const dispatch = useDispatch()

	// const refresh = refreshApiSlice;
	const auth = useSelector(selectCurrentToken) ? true : false

	useEffect(() => {
		const verifyRefreshToken = async () => {
			try {
				await axios.get("http://localhost:3000/auth/validate", { withCredentials: true })
				.then((response: AxiosResponse) => {
					dispatch(setCredentials({ user: response.data.user, accessToken: response.data.jwt_token }))
				})
			}
			catch (e) {
				logOut({})
				console.log(e)
			}
			finally {
				setIsLoading(false);
			}
		}
		!auth ? verifyRefreshToken() : setIsLoading(false);
	}, [])
}

export default persistLogin