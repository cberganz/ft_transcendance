import Router from "../Router/Router"
import './App.css'
import {AlertProvider} from "../Contexts/AlertContext"
import { selectCurrentUser } from '../Hooks/authSlice'
import { useSelector } from "react-redux"
import { io } from "socket.io-client"

export const usersStatusSocket = io("http://localhost:3000/app");

function connectGlobalSocket(user: any) {
	const userData = {
		id: user?.id,
		login: user?.login,
		username: user?.username,
		status: "online",
		avatar: user?.avatar,
	}
	if (user)
		usersStatusSocket.emit("connection", userData);
}

function App() {
	const user = useSelector(selectCurrentUser);

	connectGlobalSocket(user);
	return (
		<div className="App">
			<AlertProvider>
				<Router />
			</AlertProvider>
		</div>
	);
}

export default App;
