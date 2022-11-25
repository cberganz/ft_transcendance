import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import './ConnectedUsers.css'
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';

const columns: GridColDef[] = [
	{
		field: 'User',
		headerName: 'User',
		width: 150,
		editable: false,
		flex: 1,
		align:'left'
	},
	{
		field: 'status',
		headerName: 'Status',
		width: 150,
		editable: false,
		flex: 1,
		align:'left',
		renderCell: (params) => {
			let chip_color: "primary" | "warning";
			(params.value === 'connected')
				? chip_color = "primary"
				: chip_color = "warning"
			return <Chip color={chip_color} label={params.value}></Chip>;
		}
	},
	{
		field: 'playgame',
		headerName: 'Play Game',
		width: 150,
		editable: false,
		flex: 1,
		align:'left',
		renderCell: (params) => {
			let chip_color: "primary" | "warning";
			(params.value === 'Play')
				? chip_color = "primary"
				: chip_color = "warning"
			return <Button color={chip_color} > {params.value} </Button>;
		}
	},
	{
		field: 'friend',
		headerName: 'Friend',
		width: 150,
		editable: false,
		flex: 1,
		align:'left'
	}
];

const rows = [
  { id: 1, User: 'Snow', status: 'connected', playgame: 'Play' ,friend: 'friend'},
  { id: 2, User: 'Lannister', status: 'connected', playgame: 'Play' ,friend: 'friend'},
  { id: 3, User: 'Lannister', status: 'in game', playgame: 'View' ,friend: 'friend'},
  { id: 4, User: 'Stark', status: 'connected', playgame: 'Play' ,friend: 'friend'},
  { id: 5, User: 'Targaryen', status: 'connected', playgame: 'Play' ,friend: 'friend'},
  { id: 6, User: 'Melisandre', status: 'connected', playgame: 'Play' ,friend: 'friend'},
  { id: 7, User: 'Clifford', status: 'connected', playgame: 'Play' ,friend: 'friend'},
  { id: 8, User: 'Frances', status: 'connected', playgame: 'Play' ,friend: 'friend'},
  { id: 9, User: 'Roxie', status: 'connected', playgame: 'Play' ,friend: 'friend'},
];

export default function ConnectedUsers() {
	return (
						
		<Container >
			<Stack>
				<Box className='data-grid-title'>
					<h1>Connected Users:</h1>
				</Box>
				<Box className='data-grid'>
					<DataGrid
						className='grid'
						rows={rows}
						columns={columns}
						pageSize={5}
						rowsPerPageOptions={[5]}
						disableSelectionOnClick
						experimentalFeatures={{ newEditingApi: true }}
					/>
				</Box>
			</Stack>
		</Container>
	);
}
