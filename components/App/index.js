import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { registerClient, removeClient } from "../../websocket-api";
import { connect } from "react-redux";
import { saveCurrentPlayer } from "../../actions";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import WorldChat from "../WorldChat";
import Header from "../Header";
import GameRooms from "../GameRooms";
import Connect4Grid from "../ActiveGame";
import PlayerForms from "../PlayerForms";
import request from "../../requests";
import theme from "../../MUI_theme";
import PlayerDrawer from "../PlayerDrawer";
import Splash from "../Splash";
import FourOhFourPage from "../404Page";

const useStyles = makeStyles(theme => ({
	root: {
		margin: 0,
		padding: 0,
		background: ({ palette }) => palette.dark.darkGray,
		[theme.breakpoints.up("lg")]: {
			paddingRight: "230px"
		}
	},
	homePgContainer: {
		maxWidth: "1400px",
		margin: "auto"
	},
	homePgItem: {
		width: "50%",
		margin: "0",
		[theme.breakpoints.down("sm")]: {
			minWidth: "100vw"
		}
	},
	loginPageContainer: {
		display: "flex",
		width: "100vw",
		flexDirection: "column",
		position: "relative"
	}
}));

function App(props) {
	const classes = useStyles(theme);
	const [isDrawerOpen, openDrawer] = useState(false);
	const [error, setError] = useState({});

	const handleDrawerToggle = () => {
		openDrawer(!isDrawerOpen);
	};

	const registerPlayer = player => {
		props.savePlayer(player);
		registerClient(player.token);
		if (player.type !== "anonymous") {
			localStorage.setItem("connect_four_token", JSON.stringify(player.token));
		}
	};

	const tokenLogin = async () => {
		const token =
			JSON.parse(localStorage.getItem("connect_four_token")) || false;

		if (token) {
			try {
				const player = await request("tokenLogin", token);
				if (player.ok) registerPlayer(await player.json());
				else throw await player.json();
			} catch (err) {
				setError(err);
			}
		}
	};

	useEffect(() => {
		tokenLogin();
		return () => removeClient();
	}, []);

	return (
		<div className={classes.root}>
			<Header toggleDrawer={handleDrawerToggle} />
			{props.player.token && (
				<PlayerDrawer
					isVisible={isDrawerOpen}
					toggleDrawer={handleDrawerToggle}
				/>
			)}
			<Switch>
				<Route
					exact
					path="/"
					render={() => {
						if (props.player.token) return <Redirect to="/home" />;
						return (
							<div className={classes.loginPageContainer}>
								<Splash />
								<PlayerForms registerPlayer={registerPlayer} />
							</div>
						);
					}}
				/>
				<Route
					exact
					path="/home"
					render={() => {
						if (!props.player.token) return <Redirect to="/" />;
						return (
							<Grid
								className={classes.homePgContainer}
								container
								wrap="wrap-reverse"
							>
								<Grid item xs={6} className={classes.homePgItem}>
									<WorldChat />
								</Grid>
								<Grid item xs={6} className={classes.homePgItem}>
									<GameRooms />
								</Grid>
							</Grid>
						);
					}}
				/>
				<Route
					exact
					path="/active_game"
					render={() => {
						return <Connect4Grid />;
					}}
				/>
				<Route component={FourOhFourPage} />
			</Switch>
		</div>
	);
}

const mapDispatchToProps = dispatch => ({
	savePlayer: player => dispatch(saveCurrentPlayer(player))
});

const mapStateToDispatch = ({ currentPlayer }) => ({
	player: currentPlayer
});

export default connect(mapStateToDispatch, mapDispatchToProps)(App);
