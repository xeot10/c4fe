import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Divider } from "@material-ui/core";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import generateAvatar from "../../utils/nameAvatarGenerator";
import theme from "../../MUI_theme";
import uuidv4 from "uuid/v4";

const useStyles = makeStyles(theme => ({
	root: {
		width: "100%",
		height: "40%",
		overflow: "scroll",
		backgroundColor: ({ palette }) => palette.light.lighterBlue,
		padding: theme.spacing(1),
		borderRadius: theme.spacing(0, 0, 1, 1)
	},
	playerCard: {
		backgroundColor: theme.palette.background.paper,
		borderRadius: "5px"
	}
}));

function WorldChatPlayers(props) {
	const classes = useStyles(theme);
	const { players } = props;

	const generatePlayerCards = () =>
		players.map(player => {
			const { player_name } = player;
			return (
				<ListItem button className={classes.playerCard} key={uuidv4()}>
					<ListItemAvatar>{generateAvatar(player_name)}</ListItemAvatar>
					<ListItemText primary={player_name} />
					<Divider />
				</ListItem>
			);
		});

	return (
		<List
			className={classes.root}
			aria-labelledby="world-chat-players"
			subheader={
				<ListSubheader component="div" id="world-chat-players">
					Online Players
				</ListSubheader>
			}
		>
			<Divider />
			{generatePlayerCards()}
		</List>
	);
}

const mapStateToProps = ({ worldChat }) => ({
	players: worldChat.players
});

export default connect(mapStateToProps)(WorldChatPlayers);
