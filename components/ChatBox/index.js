import React, { useRef, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Send from "@material-ui/icons/Send";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import theme from "../../MUI_theme";
import uuidv4 from "uuid/v4";

const useStyles = makeStyles(theme => ({
	root: {
		width: "100%",
		borderRadius: "10px",
		marginBottom: "55px",
		overflow: "scroll",
		backgroundColor: theme.palette.background.paper
	},
	userName: {
		display: "inline"
	},
	newMessageForm: {
		display: "flex",
		position: "absolute",
		bottom: 0,
		width: "100%"
	},
	textField: {
		margin: theme.spacing(1, 0),
		width: "90%",
		marginRight: 0,
		background: theme.palette.background.paper
	},
	submit: {
		margin: theme.spacing(1, 0),
		marginLeft: 0,
		background: theme.palette.primary.main,
		color: theme.palette.common.white,
		borderBottomLeftRadius: 0
	},
	title: {
		width: "100%",
		padding: theme.spacing(1, 2),
		background: ({ palette }) => palette.light.lighterBlue
	},
	message: {
		width: "95%",
		overflowWrap: "break-word",
		color: ({ palette }) => palette.dark.darkerBlueGray
	}
}));

function ChatBox(props) {
	const classes = useStyles(theme);
	const { messages, sendMessage, title } = props;
	const messagesEndRef = useRef(null);
	const [newMessage, setNewMessage] = useState("");
	const [autoScroll, switchAutoScroll] = useState(false);

	const scrollToBottom = () => {
		messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		if (autoScroll) {
			scrollToBottom();
		}
	}, [props.messages, autoScroll]);

	const messageCard = (message, player_name = false, type) => (
		<ListItem
			key={uuidv4()}
			alignItems="flex-start"
			className={classes.message}
		>
			<ListItemText
				className={classes.message}
				primary={
					<Typography
						component="span"
						variant="body2"
						className={classes.userName}
						color="textSecondary"
					>
						{type === "message" && `${player_name}: `}
					</Typography>
				}
				secondary={
					<Typography component="span" variant="body2">
						{message}
					</Typography>
				}
			/>
		</ListItem>
	);

	const generateMessageCards = () =>
		messages.map(({ message, player_name, type }) =>
			messageCard(message, player_name, type)
		);

	const handleSubmit = e => {
		e.preventDefault();
		if (newMessage.length > 0) {
			sendMessage(newMessage);
			setNewMessage("");
		}
	};

	return (
		<Box boxShadow={3} className={classes.root}>
			<Typography variant="h6" className={classes.title}>
				{title}
			</Typography>
			<List>
				{generateMessageCards()}
				<div ref={messagesEndRef} />
			</List>
			<form
				onFocus={() => switchAutoScroll(true)}
				onBlur={() => switchAutoScroll(false)}
				autoComplete="off"
				className={classes.newMessageForm}
				onSubmit={handleSubmit}
			>
				<TextField
					id="outlined-multiline-flexible"
					label="Message"
					rowsMax="4"
					value={newMessage}
					onChange={({ target }) => setNewMessage(target.value)}
					className={classes.textField}
					margin="normal"
					variant="outlined"
				/>
				<Button
					variant="contained"
					onClick={handleSubmit}
					className={classes.submit}
					endIcon={<Send />}
				>
					Send
				</Button>
			</form>
		</Box>
	);
}

export default ChatBox;
