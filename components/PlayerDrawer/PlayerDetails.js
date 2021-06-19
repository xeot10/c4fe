import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import ListItem from "@material-ui/core/ListItem";
import Grow from "@material-ui/core/Grow";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";

const useStyles = makeStyles(theme => ({
	root: {
		width: "100%",
		display: "flex",
		flexDirection: "column"
	},
	infoContainer: {
		textAlign: "left",
		width: "100%"
	},
	gameHistoryList: {
		height: "100px",
		overflow: "scroll"
	}
}));

function PlayerDetails({ player }) {
	const classes = useStyles();
	const {
		win_streak,
		wins,
		losses,
		games_played,
		email,
		game_history
	} = player;

	const generateGameHistory = () =>
		game_history.map(match => {
			const { _id, vs_player, is_winner } = match;

			const historyText = is_winner
				? `You won against ${vs_player}`
				: `You lost against ${vs_player}`;

			return <ListItem key={_id}>{historyText}</ListItem>;
		});

	return (
		<Grow in={true}>
			<ListItem className={classes.root}>
				<Box className={classes.infoContainer}>
					<Typography variant="subtitle2" gutterBottom>
						Wins: {wins}
					</Typography>
					<Typography variant="subtitle2" gutterBottom>
						Win Streak: {win_streak}
					</Typography>
					<Typography variant="subtitle2" gutterBottom>
						Losses: {losses}
					</Typography>
					<Typography variant="subtitle2" gutterBottom>
						Total Matches: {games_played}
					</Typography>
				</Box>
				<Box className={classes.infoContainer}>
					<Typography variant="subtitle2" gutterBottom>
						Email: {email}
					</Typography>
				</Box>
				<Typography variant="subtitle2" gutterBottom>
					Game History:
				</Typography>
				<List className={classes.gameHistoryList}>{generateGameHistory()}</List>
			</ListItem>
		</Grow>
	);
}

export default PlayerDetails;
