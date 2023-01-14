import * as React from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import { usersStatusSocket } from '../../../Router/Router'

interface Props {
	username: string;
	avatar: string;
	userId: string;
}

let userStatus = "offline"

const StyledBadge = styled(Badge)(({ theme }) => ({
	'& .MuiBadge-badge': {
	  backgroundColor: (userStatus === "online" ? '#44b700' : (userStatus === "in game" ? '#ffa500' : '#f00020')),
	  color: (userStatus === "online" ? '#44b700' : (userStatus === "in game" ? '#ffa500' : '#f00020')),
	  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
	  '&::after': {
	    position: 'absolute',
	    top: 0,
	    left: 0,
	    width: '100%',
	    height: '100%',
	    borderRadius: '50%',
	    animation: (userStatus === "online" ? 'ripple 1.2s infinite ease-in-out' : (userStatus === "in game" ? 'ripple 1.2s infinite ease-in-out' : '')),
	    border: '1px solid currentColor',
	    content: '""',
	  },
	},
	'@keyframes ripple': {
	  '0%': {
	    transform: 'scale(.8)',
	    opacity: 1,
	  },
	  '100%': {
	    transform: 'scale(2.4)',
	    opacity: 0,
	  },
	},
}));

export default class BadgeAvatar extends React.Component<Props, {}> {

	constructor(props: any) {
		super(props)
		usersStatusSocket.emit("updateStatus", "online")
	};

	socketUpdateUser(user: any) {
		let data = "offline"
		for (let obj of user) {
			if (obj.id === Number(this.props.userId))
				data = obj.status
		}
		userStatus = data;
	}

	render() {
		usersStatusSocket.off('updateStatusFromServer').on('updateStatusFromServer', (user) => this.socketUpdateUser(user));
		return (
		    <StyledBadge
				overlap="circular"
		    	anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
		    	variant="dot"
				sx={{ width: '100%', height: '100%' }}
		    >
				<Avatar
					alt={this.props.username}
		  			src={this.props.avatar}
		  			sx={{ width: '100%', height: '100%' }}
				/>
		    </StyledBadge>
		);
	}
}
