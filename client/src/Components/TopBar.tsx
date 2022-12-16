import * as React from 'react';
import {
	AppBar,
	Avatar,
	Box,
	Toolbar,
	IconButton,
	MenuItem,
	Menu,
	Typography,
	ListItemText,
	ListItemIcon,
	Divider,
	Grid,
} from '@mui/material';
import SwipeableTemporaryDrawer from './MenuDrawer'
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Stack } from '@mui/system';
import SettingsDialog from './SettingsDialog';
import { selectCurrentUser } from '../Hooks/authSlice'
import { useSelector } from "react-redux"
import { SearchIconWrapper, Search, StyledInputBase } from './topBarStyle';
import { useCookies } from "react-cookie"
import { useLogoutMutation } from '../Api/Auth/authApiSlice'
import { logOut } from '../Hooks/authSlice';
import KeyIcon from '@mui/icons-material/Key';
import { useNavigate } from "react-router-dom"

function LogoutButton () {
	const [logoutUser] = useLogoutMutation()
	const[token, setCookie, removeCookie] = useCookies();

	const handleLogout = (e: any) => {
		removeCookie('jwt' ,{path:'/'});
		logoutUser({})
		logOut({})
		window.location.replace('/login');
	}

	return (
		<ListItemText onClick={handleLogout}>Logout</ListItemText>
	)
}

function ProfileBox() {
	const user = useSelector(selectCurrentUser)
	const navigate = useNavigate()
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
			<MenuItem onClick={() => navigate("/tfa-settings")}>
				<ListItemIcon>
					<KeyIcon/>
				</ListItemIcon>
				<ListItemText>Google 2fa</ListItemText>
			</MenuItem>
			<Divider />
			<MenuItem>
				<LogoutButton />
			</MenuItem>
		</Menu>
	);


	return (
		<div>
			<Box sx={{ display: { width: 150, xs: 'none', md: 'flex', flexDirection: 'row', alignItems: 'center'} }}>
				<Grid
					aria-label="account of current user"
					aria-controls={menuId}
					aria-haspopup="true"
					onClick={handleProfileMenuOpen}
					color="inherit"
					sx={{
						display: 'flex',
						alignItems: 'center',
						alignContent: 'center',
						cursor:'pointer'
					}}
				>
					<Grid item sx={{marginRight: 1}} xs={0}>
						<Avatar src={user.avatar}/>
					</Grid>
					<Grid item xs={0}>
						<Typography sx={{
							textOverflow: 'ellipsis',
							overflow: 'hidden',
							whiteSpace: 'nowrap',
							fontWeight:'bold'}}>
							{user.username}
						</Typography>
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
