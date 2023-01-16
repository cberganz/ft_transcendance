import Router from "../Router/Router"
import './App.css'
import {AlertProvider} from "../Contexts/AlertContext"

function App() {
	return (
		<div className="App">
			<AlertProvider>
				<Router />
			</AlertProvider>
		</div>
	);
}

export default App;
