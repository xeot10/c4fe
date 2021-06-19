import React, { useState } from "react";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import theme from "../../MUI_theme";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import generateAvatar from "../../utils/nameAvatarGenerator";
import Typography from "@material-ui/core/Typography";
import DoneIcon from "@material-ui/icons/Done";
import Tooltip from "@material-ui/core/Tooltip";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import PlayerDetails from "./PlayerDetails";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { leaveWorldChat, leaveGame } from "../../websocket-api";
import { saveCurrentPlayer, leaveActiveGame } from "../../actions";
import { connect } from "react-redux";

const drawerWidth = 230;

const useStyles = makeStyles(theme => ({
	drawer: {
		[theme.breakpoints.up("md")]: {
			width: drawerWidth,
			flexShrink: 0
		}
	},
	toolbar: {
		...theme.mixins.toolbar,
		padding: theme.spacing(1),
		display: "flex",
		alignItems: "center"
	},
	drawerPaper: {
		width: drawerWidth,
		background: ({ palette }) => palette.light.lighterBlue,
		color: ({ palette }) => palette.dark.darkerBlueGray
	},
	fixedMenu: {
		[theme.breakpoints.down("md")]: {
			display: "none"
		}
	},
	menuList: {},
	userName: {
		marginLeft: theme.spacing(3)
	},
	link: {
		textDecoration: "none",
		color: "red"
	}
}));

function PlayerDrawer(props) {
	const classes = useStyles(theme);
	const [selectedItem, setSelectedItem] = useState("");

	const generateSelectedItem = () => {
		switch (selectedItem) {
			case "PLAYER_DETAILS":
				return <PlayerDetails player={props.player} />;
			default:
				return null;
		}
	};

	const handleLogout = () => {
		leaveWorldChat();
		leaveGame();
		props.resetActiveGame();
		props.deletePlayer();
		localStorage.removeItem("connect_four_token");
	};

	const drawers = (
		<div>
			<div className={classes.toolbar}>
				{generateAvatar(props.player.player_name)}
				<Typography variant="h6" className={classes.userName}>
					{props.player.player_name}
				</Typography>
			</div>
			<Divider />
			<List className={classes.menuList}>
				{generateSelectedItem()}

			</List>
			<Divider />
			<List className={classes.menuList}>
				<Link to="/" className={classes.link}>
					<ListItem
						button
						key={"Logout"}
						onClick={() => {
							handleLogout();
							props.toggleDrawer();
						}}
					>
						<ListItemIcon>
							<ExitToAppIcon />
						</ListItemIcon>
						<ListItemText primary={"Logout"} />
					</ListItem>
				</Link>
			</List>
		</div>
	);

	return (
		<nav className={classes.drawer} aria-label="mailbox folders">
			<Hidden smUp implementation="css">
				<Drawer
					variant="temporary"
					anchor="right"
					open={props.isVisible}
					onClose={props.toggleDrawer}
					classes={{
						paper: classes.drawerPaper
					}}
					ModalProps={{
						keepMounted: true
					}}
				>
					{drawers}
				</Drawer>
			</Hidden>
			<Hidden xsDown implementation="css">
				<Drawer
					classes={{
						paper: classes.drawerPaper
					}}
					className={classes.fixedMenu}
					variant="permanent"
					open
					anchor="right"
				>
					{drawers}
				</Drawer>
			</Hidden>
		</nav>
	);
}

const mapStateToProps = ({ currentPlayer }) => ({
	player: currentPlayer.player,
	isActive: currentPlayer.token
});

const mapDispatchToProps = dispatch => ({
	deletePlayer: () => dispatch(saveCurrentPlayer({})),
	resetActiveGame: () => dispatch(leaveActiveGame())
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerDrawer);
