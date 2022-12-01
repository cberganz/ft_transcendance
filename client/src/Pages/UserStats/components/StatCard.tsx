import * as React from 'react';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';

export default class StatCard extends React.Component<{
		title: string,
		data: string,
		color: string,
		bgColor: string,
		sx?: object,
		other?: any,
	}, {}> {

	constructor(props: any) {
		super(props);
	}

	render () {
		return (
			<Card
				sx={{
					py: 5,
				    boxShadow: 0,
				    textAlign: 'center',
				    color: this.props.color,
				    bgcolor: this.props.bgColor,
				    ...this.props.sx,
			    }}
			    {...this.props.other}
			 >
				<Typography variant="h3">{this.props.data}</Typography>
				<Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
					{this.props.title}
				</Typography>
			</Card>
		);
	}
}
