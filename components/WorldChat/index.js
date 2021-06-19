import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
	joinWorldChat,
	sendWorldMessage,
	leaveWorldChat,
	getWorldChatPlayers
} from "../../websocket-api";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import WorldChatPlayers from "./WorldChatPlayers";
import Switch from "@material-ui/core/Switch";
import theme from "../../MUI_theme";
import ChatBox from "../ChatBox";

const useStyles = makeStyles(theme => ({
	container: {
		padding: theme.spacing(2, 0, 2, 2),
		margin: "auto",
		maxWidth: "700px",
		display: "flex",
		flexDirection: "column",
		position: "relative",
		minHeight: "92vh",
		height: "100%",
		[theme.breakpoints.down("md")]: {
			paddingRight: theme.spacing(2)
		}
	},
	chatToggle: {
		position: "absolute",
		right: "10px",
		top: "20px",
		zIndex: 1
	},
	chatBox: {
		height: "60%",
		display: "flex",
		width: "100%",
		position: "relative",
		backgroundColor: theme.palette.background.paper,
		borderRadius: theme.spacing(1, 1, 0, 0)
	}
}));

function WorldChat(props) {
	const classes = useStyles(theme);
	const [isChatActive, setChatActive] = useState(true);
	const { me, messages } = props;
	const { player_name, win_streak, _id, wins, losses } = me;

	const leaveChat = () => {
		leaveWorldChat();
	};
	const handleChatToggle = () => {
		if (isChatActive) {
			leaveChat();
		} else {
			joinWorldChat({ player_name, win_streak, _id, wins, losses });
		}
		setChatActive(!isChatActive);
	};

	const handleSendMessage = message => {
		sendWorldMessage(message);
	};

	useEffect(() => {
		joinWorldChat({ player_name, win_streak, _id, wins, losses });
		getWorldChatPlayers();
	}, [player_name, win_streak, _id, wins, losses]);

	return (
		<Box className={classes.container}>
			<Switch
				checked={isChatActive}
				onChange={handleChatToggle}
				className={classes.chatToggle}
				value="checkedB"
				color="primary"
				inputProps={{ "aria-label": "Join/leave world chat" }}
			/>
			<Box className={classes.chatBox}>
				<ChatBox
					messages={messages}
					sendMessage={handleSendMessage}
					title={"Global Chat Room:"}
				/>
			</Box>
			<WorldChatPlayers />
		</Box>
	);
}

const mapStateToProps = ({ worldChat, currentPlayer }) => ({
	messages: worldChat.messages,
	me: currentPlayer.player,
	token: currentPlayer.token
});

export default connect(mapStateToProps)(WorldChat);
