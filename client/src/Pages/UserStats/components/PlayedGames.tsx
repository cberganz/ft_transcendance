import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const columns: GridColDef[] = [
	{
		field: 'id',
		headerName: 'ID',
		type: 'number',
		width: 70,
		align: 'center',
		headerAlign: 'center',
	},
	{
		field: 'date',
		headerName: 'Date',
		type: 'date',
		minWidth: 120,
		flex: 1,
		align: 'center',
		headerAlign: 'center',
	},
	{
		field: 'playerScore',
		headerName: 'Player Score',
		type: 'number',
		minWidth: 120,
		flex: 1,
		align: 'center',
		headerAlign: 'center',
	},
	{
		field: 'opponent',
		headerName: 'Opponent',
		minWidth: 120,
		flex: 1,
		align: 'center',
		headerAlign: 'center',
	},
	{
		field: 'opponentScore',
		headerName: 'Opponent Score',
		type: 'number',
		minWidth: 120,
		flex: 1,
		align: 'center',
		headerAlign: 'center',
	},
	{
		field: 'result',
		headerName: 'Result',
		minWidth: 120,
		flex: 1,
		align: 'center',
		headerAlign: 'center',
	},
];

const rows = [
	{ id: 1, date: '12/01/2022', playerScore: 2,  opponent: 'Robin',  opponentScore: 12, result: 'Eq' },
	{ id: 2, date: '12/01/2022', playerScore: 2,  opponent: 'Celine', opponentScore: 12, result: 'Loser' },
	{ id: 3, date: '12/01/2022', playerScore: 2,  opponent: 'Ugo',    opponentScore: 12, result: 'Loser' },
	{ id: 4, date: '12/01/2022', playerScore: 2,  opponent: 'Julien', opponentScore: 12, result: 'Loser' },
	{ id: 5, date: '12/01/2022', playerScore: 12, opponent: 'Robin',  opponentScore: 2,  result: 'Winner' },
	{ id: 6, date: '12/01/2022', playerScore: 12, opponent: 'Celine', opponentScore: 2,  result: 'Winner' },
	{ id: 7, date: '12/01/2022', playerScore: 12, opponent: 'Ugo',    opponentScore: 2,  result: 'Winner' },
	{ id: 8, date: '12/01/2022', playerScore: 12, opponent: 'Julien', opponentScore: 2,  result: 'Winner' },
];

export default function PlayedGames() {
	return (
		<React.Fragment>
    	  <CssBaseline />
			<Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<DataGrid
		  		    rows={rows}
		  		    columns={columns}
				/>
	      	</Box>
    	</React.Fragment>
	);
}
