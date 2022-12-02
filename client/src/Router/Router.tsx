import { Navigate, Route, Routes, Outlet } from 'react-router-dom';
import Login from '../Pages/Auth/Login'
import ConnectedUsers from '../Pages/ConnectedUsers/ConnectedUsers'
import {Dashboard} from './test'
import PrimarySearchAppBar from "../Components/TopBar"
import Game from "../Pages/Game/Game";
import Chat from "../Pages/chat/chat"
import Signup from "../Pages/Auth/SignUp"
import PersistLogin from '../Hooks/persistLogin';
import { selectCurrentToken } from '../Hooks/authSlice'
import { useSelector } from "react-redux"
import AlertPopup from '../Components/AlertPopup';

function	OutletRoute() {
	return (
		<div>
			<PrimarySearchAppBar />
			<Outlet/>
			<AlertPopup/>
		</div>
	)
}

function	PrivateRoutes() {
	const isTokenValidated = useSelector(selectCurrentToken) ? 'valid' : 'invalid'//useToken();
	return (
		isTokenValidated === 'valid'
			? <OutletRoute/>
			: <Navigate to='/login'/>
	)
}

export default function Router() {
	return (
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route element= /* {<OutletRoute/>} */ {<PersistLogin />}>

					<Route path='/' element=/* {<OutletRoute/>} */{<PrivateRoutes />}>
						<Route path="/" element={<Dashboard />} />
						<Route path="/connected-users" element={<ConnectedUsers />} />
						<Route path="/game" element={<Game />} />
						<Route path="/chat" element={<Chat />} />

					</Route>
				</Route>
				<Route path="*" element={<Login />} />{/* Handle 404 */}
			</Routes>
	)
}