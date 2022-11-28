import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import SwipeableTemporaryDrawer from './MenuDrawer'
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import { Stack } from '@mui/system';
import Grid from '@mui/material/Grid';
import SettingsDialog from './SettingsDialog';

import { selectCurrentUser } from '../Features/Auth/authSlice'
import { useSelector } from "react-redux"

const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.grey[600], 0.15),
	'&:hover': {
		backgroundColor: alpha(theme.palette.primary.dark, 0.25),
	},
	marginRight: theme.spacing(2),
	marginLeft: 0,
	width: '100%',
	[theme.breakpoints.up('sm')]: {
		marginLeft: theme.spacing(3),
		width: 'auto',
	},
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
		width: '20ch',
		},
	},
}));

function ProfileBox() {
	const user = useSelector(selectCurrentUser)
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const isMenuOpen = Boolean(anchorEl);


	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const menuId = 'primary-search-account-menu';
	const renderMenu = (
		<Menu
		anchorEl={anchorEl}
		anchorOrigin={{
			vertical: 'top',
			horizontal: 'right',
		}}
		id={menuId}
		keepMounted
		transformOrigin={{
			vertical: 'top',
			horizontal: 'right',
		}}
		open={isMenuOpen}
		onClose={handleMenuClose}
		>
			<MenuItem>
				<Stack >
					<Typography fontWeight='bold'>
						{user.username}
					</Typography>
					<ListItemText>{user.login}</ListItemText>
				</Stack>
			</MenuItem>
			<Divider />
			<SettingsDialog/>
			<MenuItem>
				<ListItemIcon>
					<AccountCircle/>
				</ListItemIcon>
				<ListItemText>Profile</ListItemText>
			</MenuItem>
			<Divider />
			<MenuItem>
				<ListItemText>Logout</ListItemText>
			</MenuItem>
		</Menu>
	);


	return (
		<div>
			<Box sx={{ display: { xs: 'none', md: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.5,} }}>
				<Grid
					container spacing={1}
					aria-label="account of current user"
					aria-controls={menuId}
					aria-haspopup="true"
					onClick={handleProfileMenuOpen}
					color="inherit"
					sx={{cursor:'pointer'}}
				>
					<Grid item xs={4}>
							<AccountCircle/>
					</Grid>
					<Grid item xs={8}>
						<Typography sx={{ fontWeight:'bold'}}>{user.username}</Typography>
					</Grid>
				</Grid>
			</Box>
			<Box sx={{ display: { xs: 'flex', md: 'none' } }}>
				<IconButton
				size="large"
				aria-label="show more"
				aria-controls={menuId}
				aria-haspopup="true"
				onClick={handleProfileMenuOpen}
				color="inherit"
				>
					<MoreIcon />
				</IconButton>
			</Box>
			{renderMenu}
		</div>
	)
}

function	SearchBar() {
	return (
		<Box sx={
		{
			width:"100%",
			display: 'flex',
			justifyContent: 'center'
		}}>
			<Search>
				<SearchIconWrapper>
				<SearchIcon />
				</SearchIconWrapper>
				<StyledInputBase
				placeholder="Search…"
				inputProps={{ 'aria-label': 'search' }}
				/>
			</Search>
		</Box>
	)
}

export default function PrimarySearchAppBar() {

	return (
		<Box sx={{ flexGrow: 1 }}>
		<AppBar position="static" color="default" sx={{ boxShadow: 0 }}>
			<Toolbar>
			<SwipeableTemporaryDrawer/>
			<SearchBar/>
			<ProfileBox/>
			</Toolbar>
		</AppBar>
		</Box>
	);
}