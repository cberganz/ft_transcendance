import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import './ConnectedUsers.css'
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import { PanoramaSharp, Paragliding } from '@mui/icons-material';


export default function ConnectedUsers(props: any) {
	const getId = (username: string) => {
		console.log(props.allUsersTab)
		console.log(username)
		for (let user of props.allUsersTab) {
			if (user.User === username)
				return user.id;
		}
		return (-1);
	}
	const columns: GridColDef[] = [
		{
			field: 'User',
			headerName: 'User',
			minWidth: 120,
			editable: false,
			flex: 1,
			align: 'center',
			headerAlign: 'center',
			renderCell: (params) => {
				return <b onClick={() => props.navigate("/profile?userId=" + getId(params.value))} style={{cursor: 'pointer'}}>{params.value}</b>;
			}
		},
		{
			field: 'status',
			headerName: 'Status',
			minWidth: 120,
			editable: false,
			flex: 1,
			align: 'center',
			headerAlign: 'center',
			renderCell: (params) => {
				let chip_color: "primary" | "warning";
				(params.value === 'offline')
					? chip_color = "warning"
					: chip_color = "primary"
				return <Chip color={chip_color} label={params.value}></Chip>;
			}
		},
		{
			field: 'playgame',
			headerName: 'Play Game',
			minWidth: 120,
			editable: false,
			flex: 1,
			align: 'center',
			headerAlign: 'center',
			renderCell: (params) => {
				let chip_color: "primary" | "warning";
				(params.value === 'Play')
					? chip_color = "primary"
					: chip_color = "warning"
				return <Button color={chip_color} > {params.value} </Button>;
			}
		},
	];

	return (
		<div>
			<Stack>
				<Box className='data-grid'>
					<DataGrid
						className='grid'
						rows={props.allUsersTab}
						columns={columns}
						disableSelectionOnClick
						experimentalFeatures={{ newEditingApi: true }}
					/>
				</Box>
			</Stack>
		</div>
	);
}
