import React, { useState, useEffect, useRef } from "react";
import theme from "../../MUI_theme";
import Box from "@material-ui/core/Box";
import Fade from "@material-ui/core/Fade";
import Grow from "@material-ui/core/Grow";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import WaitingRoom from "../WaitingRoom";
import { rematchReset, resetReady } from "../../actions";
import { connect } from "react-redux";
import { placePlayerChip } from "../../websocket-api";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
	root: {
		paddingRight: theme.spacing(1),
		margin: "auto"
	},
	turnIndicator: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: "10px 10px 0 0",
		background: ({ isPlayerTurn, main, opp }) => (isPlayerTurn ? main : opp)
	},
	gridContainer: {
		display: "flex",
		padding: theme.spacing(1),
		justifyContent: "center",
		borderRadius: "0 0 10px 10px",
		background: ({ palette }) => palette.dark.midBlue,
		[theme.breakpoints.down("sm")]: {
			width: "90vw"
		}
	},
	column: {
		dispaly: "flex",
		flexDirection: "column"
	},
	slot: {
		borderRadius: "50%",
		width: "8vw",
		height: "8vw",
		margin: ".8vw",
		borderColor: "darkGray",
		[theme.breakpoints.up("md")]: {
			maxWidth: "125px",
			maxHeight: "125px",
			margin: "13px"
		},
		[theme.breakpoints.down("sm")]: {
			width: "12vw",
			height: "12vw"
		}
	},
	emptySlot: {
		background: ({ palette, oppWin, mainWin, isActive }) =>
			oppWin || mainWin || !isActive
				? palette.dark.midBlue
				: palette.light.lighterGray
	},
	highlightSlot: {
		background: ({ main }) => main,
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	},
	highlightBorder: {
		borderColor: ({ isPlayerTurn }) => (isPlayerTurn ? "white" : "darkGray"),
		borderWidth: 4
	},
	mainBg: {
		background: ({ main }) => main,
		border: ({ main, mainWin, palette }) =>
			`4px solid ${mainWin ? palette.light.lighterGray : main}`
	},
	oppBg: {
		background: ({ opp }) => opp,
		border: ({ opp, oppWin, palette }) =>
			`4px solid ${oppWin ? palette.light.lighterGray : opp}`
	},
	addChipIcon: {
		width: "4vw",
		height: "4vw",
		minWidth: "30px",
		minHeight: "30px"
	},
	addChipBtn: {
		color: ({ isPlayerTurn }) => (isPlayerTurn ? "white" : "darkGray")
	},
	reMatchBox: {
		margin: "10px auto",
		maxWidth: "800px"
	}
}));

const slotProps = {
	m: 1,
	border: 1,
	boxShadow: 3
};

function GameGrid(props) {
	const {
		grid,
		gameStatus,
		currentTurn,
		currentPlayer,
		players,
		prevSlot,
		winner,
		resetGame,
		resetPlayerReady
	} = props;
	const isPlayerTurn = currentTurn === currentPlayer;
	const isActive = gameStatus === "active";
	const [main, setMain] = useState({});
	const [opponent, setOpponent] = useState({});
	const [showWaitRoom, setShowWaitRoom] = useState(false);
	const mainWin = main.player_name === winner;
	const oppWin = opponent.player_name === winner;
	const prevState = useRef({ winner, grid, players });
	const [xCoordinate, setCoordinate] = useState(null);

	const classes = useStyles({
		...theme,
		main: main.chipColor,
		mainWin,
		opp: opponent.chipColor,
		oppWin,
		isPlayerTurn,
		isActive
	});

	if (showWaitRoom && players[0].isReady && players[1].isReady) {
		setShowWaitRoom(false);
		resetGame();
	}

	useEffect(() => {
		const playerCheck =
			!main.player_name ||
			!opponent.player_name ||
			players !== prevState.current.players;

		if (playerCheck && isActive) {
			if (players[0].player_name === currentPlayer) {
				setMain({ ...players[0], slot: 1 });
				setOpponent({ ...players[1], slot: 2 });
			} else if (players[1].player_name === currentPlayer) {
				setMain({ ...players[1], slot: 2 });
				setOpponent({ ...players[0], slot: 1 });
			}
			prevState.current.players = players;
		}
	}, [currentPlayer, players, main, opponent, isActive]);

	useEffect(() => {
		if (winner !== prevState.current.winner && winner !== null && isActive) {
			setMain({ ...main, isReady: false });
			setOpponent({ ...opponent, isReady: false });
			resetPlayerReady();
			setShowWaitRoom(true);
		}
		prevState.current.winner = winner;
	}, [winner, resetPlayerReady, main, opponent, setShowWaitRoom, isActive]);

	const handleSlotStyle = (slot, hovered, isBottom) => {
		const {
			mainBg,
			oppBg,
			highlightSlot,
			highlightBorder,
			emptySlot
		} = classes;

		switch (true) {
			case slot === main.slot:
				return mainBg;
			case slot === opponent.slot:
				return oppBg;
			case hovered && isBottom && !oppWin && !mainWin:
				return `${highlightSlot} ${highlightBorder}`;
			default:
				return emptySlot;
		}
	};

	const handleHovered = ({ target }) => {
		const colId = (target.id || target.parentElement.id).split(":");
		setCoordinate(parseInt(colId[1]));
	};

	const handleChipPlacement = () => {
		placePlayerChip(xCoordinate);
	};

	const generateGrid = () =>
		grid.map((column, idx) => {
			const isHovered = xCoordinate === idx;
			let bottomIdx;

			for (let i = column.length - 1; i >= 0; i--) {
				if (column[i] === 0) {
					bottomIdx = i;
					break;
				}
			}

			return (
				<Box
					key={`col${idx}`}
					className={classes.column}
					id={`xCoordinate:${idx}`}
					onMouseEnter={handleHovered}
				>
					{column.map((gridSlot, i) => {
						const isBottom = bottomIdx === i && isHovered;
						const isNew = prevSlot.join("") === [idx, i, gridSlot].join("");

						const bottomHoveredSlot = (
							<Fade in={isBottom}>
								<Box
									onClick={handleChipPlacement}
									className={`${classes.slot} ${handleSlotStyle(
										gridSlot,
										isHovered,
										isBottom
									)}`}
									{...slotProps}
								>
									<IconButton className={classes.addChipBtn}>
										<AddIcon className={classes.addChipIcon} />
									</IconButton>
								</Box>
							</Fade>
						);
						const defaultSlot = (
							<Box
								onClick={handleHovered}
								key={`col${idx}row${i}player${gridSlot}`}
								className={`${classes.slot} ${handleSlotStyle(
									gridSlot,
									isHovered,
									isBottom
								)}`}
								{...slotProps}
							/>
						);
						const newSlot = (
							<Grow
								key={`col${idx}row${i}player${gridSlot}`}
								in={isNew}
								timeout={600}
							>
								<Box
									className={`${classes.slot} ${handleSlotStyle(
										gridSlot,
										isHovered,
										isBottom
									)}`}
									{...slotProps}
								/>
							</Grow>
						);

						if (isHovered && isBottom && !showWaitRoom) {
							return bottomHoveredSlot;
						} else if (isNew) {
							return newSlot;
						} else {
							return defaultSlot;
						}
					})}
				</Box>
			);
		});

	const turnIndicator = () => {
		return (
			<Box className={classes.turnIndicator}>
				<Typography variant="h5">
					{!showWaitRoom &&
						`${isPlayerTurn ? "Your" : opponent.player_name + "'s"} Turn!`}
					{mainWin && "You Win!"}
					{oppWin && `${opponent.player_name} Wins!`}
				</Typography>
			</Box>
		);
	};

	return (
		<div className={classes.root}>
			{showWaitRoom && (
				<div>
					<Grow in={showWaitRoom}>
						<Box className={classes.reMatchBox}>
							<WaitingRoom />
						</Box>
					</Grow>
				</div>
			)}
			{turnIndicator()}
			<Box
				boxShadow={3}
				className={classes.gridContainer}
				onMouseLeave={() => setCoordinate(null)}
			>
				{generateGrid()}
			</Box>
		</div>
	);
}

const mapStateToProps = ({ currentGame, currentPlayer }) => ({
	grid: currentGame.gridX,
	currentTurn: currentGame.currentPlayer
		? currentGame.currentPlayer.player_name
		: currentGame.currentPlayer,
	currentPlayer: currentPlayer.player ? currentPlayer.player.player_name : null,
	players: currentGame.players,
	prevSlot: currentGame.prevSlot,
	winner: currentGame.winner,
	gameStatus: currentGame.status
});

const mapDispatchToProps = dispatch => ({
	resetGame: () => dispatch(rematchReset()),
	resetPlayerReady: () => dispatch(resetReady())
});

export default connect(mapStateToProps, mapDispatchToProps)(GameGrid);
