import React, { useState, useEffect, useRef } from "react";
import CloseIcon from "@material-ui/icons/Close";
import Fab from "@material-ui/core/Fab";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import generateAvatar from "../../utils/nameAvatarGenerator";
import colors from "../../MUI_theme";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { setPlayerReady } from "../../websocket-api";
import { Grid } from "@material-ui/core";
import { Grow } from "@material-ui/core";
import { unsubscribeToActiveGame, leaveGame } from "../../websocket-api";
import { leaveActiveGame } from "../../actions";

const useStyles = makeStyles(theme => ({
	root: {
		maxWidth: "700px",
		marginBottom: "10px",
		padding: theme.spacing(3, 2, 2, 2),
		background: ({ palette }) => palette.light.lighterBlue,
		position: "relative",
		textAlign: "center",
		justifyContent: "center",
		borderRadius: "10px"
	},
	playerCard: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "space-around",
		padding: "20px 0",
		borderRadius: "20px",
		margin: "10px auto",
		boxShadow: theme.shadows[2]
	},
	leaveButton: {
		position: "absolute",
		top: theme.spacing(2),
		right: theme.spacing(2)
	},
	isReady: {
		background: ({ palette }) => palette.dark.midDarkBlue,
		color: "#FFFFFF"
	},
	mainCardBorder: {
		border: ({ playerColor }) =>
			`8px solid ${!!playerColor.length ? playerColor : "white"}`
	},
	oppCardBorder: {
		border: ({ oppColor }) =>
			`8px solid ${!!oppColor.length ? oppColor : "white"}`
	},
	mainReadyBtn: {
		margin: theme.spacing(1)
	},
	chip: {
		height: "6vw",
		width: "6vw",
		maxWidth: "80px",
		maxHeight: "80px",
		alignSelf: "flex-end",
		[theme.breakpoints.down("sm")]: {
			width: "9vw",
			height: "9vw",
			minWidth: "40px",
			minHeight: "40px"
		}
	},
	chipHover: {
		"&:hover": {
			border: ({ palette }) => `6px solid ${palette.light.lighterBlue}`,
			cursor: "pointer"
		}
	},
	colorsContainer: {
		display: "flex",
		justifyContent: "space-around",
		alignContent: "center",
		margin: "10px"
	},
	colorBoxTitle: {
		textAlign: "center",
		color: ({ palette }) => palette.light.lighterGray,
		borderRadius: "5px 5px 0 0",
		background: ({ palette }) => palette.dark.darkBlueGray
	},
	colorsBox: {
		borderRadius: "5px",
		boxShadow: theme.shadows[2],
		display: "flex",
		background: ({ palette }) => palette.light.lightBlue,
		flexDirection: "column"
	},
	playerColor: {
		border: ({ palette }) => `6px solid ${palette.dark.darkerBlueGray}`
	},
	oppColor: {
		cursor: "not-allowed",
		opacity: ".1",
		border: ({ palette }) => `6px solid ${palette.light.lightGray}`
	},
	opponentReadyBtn: {
		padding: "5px 10px",
		borderRadius: "10px"
	}
}));

function WaitingRoom(props) {
	const hues = Object.values(colors.palette.chips);
	const [isReady, setIsReady] = useState(false);
	const [mainPlayer, setMainPlayer] = useState({});
	const [opponent, setOpponent] = useState({});
	const [playerColor, setPlayerColor] = useState("");
	const [oppColor, setOppColor] = useState("");
	const { players, currPlayerName, resetActiveGame } = props;
	const prevPlayers = useRef(props.players);
	const classes = useStyles({ ...colors, oppColor, playerColor });

	const pickRandomColor = () => {
		const cleared = [...hues].filter(c => c !== oppColor);
		return cleared[Math.floor(Math.random() * cleared.length)];
	};

	const handleLeave = () => {
		unsubscribeToActiveGame();
		leaveGame();
		resetActiveGame();
	};

	const chipStyleSelector = (isPlayer, isOpp) => {
		const { playerColor, oppColor, chip, chipHover } = classes;
		switch (true) {
			case isPlayer:
				return `${chip} ${playerColor}`;
			case isOpp:
				return `${chip} ${oppColor}`;
			default:
				return `${chip} ${chipHover}`;
		}
	};

	const handleColorSelect = color => {
		if (color !== oppColor) {
			setPlayerColor(color);
		}
	};

	const generateChips = () =>
		hues.map(hue => {
			const isPlayer = hue === playerColor;
			const isOpp = hue === oppColor;
			return (
				<Box
					onClick={() => handleColorSelect(hue)}
					boxShadow={3}
					key={hue}
					borderRadius="50%"
					bgcolor={hue}
					className={chipStyleSelector(isPlayer, isOpp)}
				></Box>
			);
		});

	useEffect(() => {
		if (players !== prevPlayers) {
			for (let player of players) {
				const p = player || {};
				if (p.player_name === currPlayerName) {
					setMainPlayer(p);
					setPlayerColor(p.chipColor || "");
				} else {
					setOpponent(p);
					setOppColor(p.chipColor || "");
				}
			}
		}
	}, [players, prevPlayers, currPlayerName]);

	const handleReady = () => {
		const payload = {
			isReady: !isReady,
			chipColor: !!playerColor.length ? playerColor : pickRandomColor()
		};
		setPlayerReady(payload);
		setIsReady(!isReady);
	};

	const generatePlayerCards = () =>
		players.map(player => {
			const { playerCard, mainCardBorder, oppCardBorder, isReady } = classes;
			let p = player || {};
			const ifMain = p === mainPlayer;

			const opponentBtn = (
				<Box className={classes.opponentReadyBtn} boxShadow={3}>
					<Typography variant="subtitle1">
						{opponent.isReady ? "READY!" : "Not Ready"}
					</Typography>
				</Box>
			);

			const createCard = () => (
				<Grow in={!!p.player_name} key={p.clientId || "OPPONENT"}>
					<Grid
						item
						xs={5}
						className={`${playerCard} ${
							ifMain ? mainCardBorder : oppCardBorder
						} ${p.isReady && isReady}`}
					>
						{!!p.player_name && generateAvatar(p.player_name)}
						<Typography variant="h6">{p.player_name}</Typography>
						<Box>
							{ifMain && (
								<Button
									onClick={handleReady}
									variant="contained"
									color={p.isReady ? "primary" : "inherit"}
									className={classes.mainReadyBtn}
								>
									{p.isReady ? "Ready!" : "Ready?"}
								</Button>
							)}
							{!!opponent.player_name && !ifMain && opponentBtn}
						</Box>
					</Grid>
				</Grow>
			);

			return createCard();
		});

	return (
		<Grid className={classes.root} container wrap="wrap">
			<Fab
				color="inherit"
				aria-label="leave room"
				className={classes.leaveButton}
				size="small"
				onClick={handleLeave}
			>
				<CloseIcon />
			</Fab>
			<Grid item xs={12}>
				<Typography variant="h5">Waiting for Opponent</Typography>
			</Grid>
			{generatePlayerCards()}
			<Grid item xs={12} className={classes.colorsBox}>
				<Typography variant="subtitle1" className={classes.colorBoxTitle}>
					Choose Your Color
				</Typography>
				<Box className={classes.colorsContainer}>{generateChips()}</Box>
			</Grid>
		</Grid>
	);
}

const mapStateToProps = ({ currentGame, currentPlayer }) => ({
	players: currentGame.players,
	currPlayerName: currentPlayer.player.player_name
});

const mapDispatchToProps = dispatch => ({
	resetActiveGame: () => dispatch(leaveActiveGame())
});

export default connect(mapStateToProps, mapDispatchToProps)(WaitingRoom);
