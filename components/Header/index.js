import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import theme from "../../MUI_theme";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		width: "100vw"
	},
	appBar: {
		background: ({ palette }) => palette.dark.darkBlueGray,
		display: "flex",
		justifyContent: "center"
	},
	title: {
		flexGrow: 1,
		color: ({ palette }) => palette.light.lighterGray
	},
	menuButton: {
		marginRight: theme.spacing(2),
		color: theme.palette.primary.contrastText,
		[theme.breakpoints.up("lg")]: {
			display: "none"
		}
	}
}));

function Header(props) {
	const classes = useStyles(theme);
	const { toggleDrawer } = props;

	return (
		<>
			<header className={classes.root}>
				<AppBar position="static" className={classes.appBar}>
					<Toolbar>
						<Typography variant="h4" className={classes.title}>
							Connect 4
						</Typography>
						<h2>- Developed by Manthan Solanki </h2>
						{props.player && (
							<IconButton
								aria-label="open drawer"
								edge="start"
								onClick={toggleDrawer}
								className={classes.menuButton}
							>
								<MenuIcon />
							</IconButton>
						)}
					</Toolbar>
				</AppBar>
			</header>
		</>
	);
}

const mapStateToProps = ({ currentPlayer }) => ({
	player: currentPlayer.player || false
});

export default connect(mapStateToProps)(Header);
