import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import TelegramIcon from '@mui/icons-material/Telegram';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Groups2Icon from '@mui/icons-material/Groups2';
import DashboardIcon from '@mui/icons-material/Dashboard';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface DrawerItemProp {
	text: string,
	icon: JSX.Element
	href: string,
}

function DrawerItem(props: DrawerItemProp) {
	return (
		<ListItem key={props.text} disablePadding>
			<ListItemButton href={props.href}>
				<ListItemIcon>
					{props.icon}
				</ListItemIcon>
				<ListItemText primary={props.text} />
			</ListItemButton>
		</ListItem>
	)
}

function DrawerList() {
	return (
		<List>
			<DrawerItem href="/" text='Dashboard' icon={<DashboardIcon />} />
			<DrawerItem href="/game" text='PLay Game' icon={<SportsEsportsIcon />} />
			<DrawerItem href="/chat" text='Chat' icon={<TelegramIcon />} />
			<DrawerItem href="/connected-users" text='Connected Users' icon={<Groups2Icon />} />
		</List>
	)
}

export default function SwipeableTemporaryDrawer() {
	const [state, setState] = React.useState({
		top: false,
		left: false,
		bottom: false,
		right: false,
	});

	const toggleDrawer =
		(anchor: Anchor, open: boolean) =>
		(event: React.KeyboardEvent | React.MouseEvent) => {
			if (
				event &&
				event.type === 'keydown' &&
				((event as React.KeyboardEvent).key === 'Tab' ||
				(event as React.KeyboardEvent).key === 'Shift')
			) {
				return;
			}

			setState({ ...state, [anchor]: open });
	};

	const list = (anchor: Anchor) => (
		<Box
		sx={{ width: 250, paddingTop: 6 }}
		role="presentation"
		onClick={toggleDrawer(anchor, false)}
		onKeyDown={toggleDrawer(anchor, false)}
		>
			<DrawerList />
		</Box>
	);

	return (
		<div>
			<IconButton
				onClick={toggleDrawer('left', true)}
				size="large"
				edge="start"
				color="inherit"
				aria-label="open drawer"
				sx={{ mr: 2 }}
			>
				<MenuIcon />
			</IconButton>
			<SwipeableDrawer
				anchor={'left'}
				open={state['left']}
				onClose={toggleDrawer('left', false)}
				onOpen={toggleDrawer('left', true)}
			>
				{list('left')}
			</SwipeableDrawer>
		</div>
	);
}