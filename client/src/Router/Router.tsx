import { BrowserRouter, Navigate, Route, Routes, Outlet } from 'react-router-dom';
import Login from '../Pages/Login/Login'
import ConnectedUsers from '../Pages/ConnectedUsers/ConnectedUsers'
import {Dashboard, Page2} from './test'
import useToken from '../Hooks/hook_access_token'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import PrimarySearchAppBar from "../Components/TopBar"

function	OutletRoute() {
	return (
		<div>
			<PrimarySearchAppBar />
			<Outlet/>
		</div>
	)
}

function	PrivateRoutes() {
	const isTokenValidated = useToken();

	if (isTokenValidated === 'loading'){
		return (
			<Box sx={{ display: 'flex' }}>
				<CircularProgress />
			</Box>
		)
	}
	return (
		isTokenValidated === 'valid' ? <OutletRoute/> : <Navigate to='/login'/>
	)
}

export default function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path='/' element={<PrivateRoutes />}>
					<Route path="/" element={<Dashboard />} />
					<Route path="/connected-users" element={<ConnectedUsers />} />
					<Route path="/page2" element={<Page2 />} />
				</Route>
				<Route path="*" element={<Login />} />{/* Handle 404 */}
			</Routes>
		</BrowserRouter>
	)
}