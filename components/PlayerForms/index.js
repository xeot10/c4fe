import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import request from "../../requests";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grow from "@material-ui/core/Grow";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		position: "fixed",
		top: "9%",
		right: "0",
		margin: theme.spacing(2),
		flexDirection: "row-reverse"
	},
	inputsContainer: {
		display: "flex",
		flexDirection: "column",
		flexWrap: "wrap",
		minWidth: "300px",
		padding: theme.spacing(2),
		position: "relative",
		background: "rgba(255, 255, 255, .9)",
		boxShadow: theme.shadows[5]
	},
	loadingIcon: {
		display: "flex",
		zIndex: 1,
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		height: "100%",
		width: "100%"
	},
	optionButton: {
		margin: "10px 0"
	},
	error: {
		color: "red",
		margin: "5px auto"
	}
}));

function PlayerForms(props) {
	const classes = useStyles();
	const [loginValues, setLoginValues] = useState({});
	const [signUpValues, setSignUpValues] = useState({});
	const [showSignUpForm, setShowSignUpForm] = useState(false);
	const [showAnonLoginForm, setShowAnonLoginForm] = useState(false);
	const [errors, setErrors] = useState([]);
	const [isLoading, setLoading] = useState(false);

	const handleLoginForm = ({ target }) =>
		setLoginValues({ ...loginValues, [target.name]: target.value });
	const handleSignUpForm = ({ target }) => {
		const withSpace = target.value.replace(/[^a-zA-Z\s0-9]/g, "");
		const withoutSpace = withSpace.replace(/[\s]/g, "");

		if (target.name === "secret_one" || target.name === "secret_two") {
			setSignUpValues({ ...signUpValues, [target.name]: withSpace });
		} else if (target.name === "email") {
			setSignUpValues({ ...signUpValues, [target.name]: target.value });
		} else {
			setSignUpValues({ ...signUpValues, [target.name]: withoutSpace });
		}
	};

	const verifySignUpParams = () => {
		const errors = [];
		const reqParams = [
			"email",
			"player_name",
			"password",
			"confirm_password",
			"secret_one",
			"secret_two"
		];

		for (let param of reqParams) {
			const readable = param.split("_").join(" ");
			if (!signUpValues[param]) {
				errors.push({
					type: "input",
					error: `${readable.toUpperCase()} is required.`
				});
			} else if (signUpValues[param].length < 3) {
				errors.push({
					type: "input",
					error: `${readable.toUpperCase()} must be at least 3 characters or longer.`
				});
			} else if (param === "password") {
				if (signUpValues.password !== signUpValues.confirm_password) {
					errors.push({ type: "input", error: "Passwords must match." });
				}
			}
		}

		if (errors.length > 0) {
			setErrors(errors);
			return false;
		} else {
			return true;
		}
	};

	const loadingIcon = (
		<div className={classes.loadingIcon}>
			<CircularProgress />
		</div>
	);

	const signUpUser = async e => {
		e.preventDefault();
		try {
			if (verifySignUpParams()) {
				const {
					email,
					password,
					player_name,
					secret_one,
					secret_two
				} = signUpValues;
				const res = await request("signupUser", {
					email,
					password,
					player_name,
					secret_one,
					secret_two
				});
				if (!res.ok) {
					setLoading(false);
					throw await res.json();
				} else {
					const player = await res.json();
					props.registerPlayer(player);
					setLoading(false);
				}
			}
		} catch (err) {
			setErrors([err]);
		}
	};

	const loginAnonymously = async e => {
		e.preventDefault();
		const { player_name } = signUpValues;
		setLoading(true);
		try {
			const res = await request("anonymousLogin", { player_name });
			if (!res.ok) {
				setLoading(false);
				throw await res.json();
			} else {
				const token = await res.json();
				const anon = {
					player: {
						player_name
					},
					type: "anonymous",
					...token
				};
				props.registerPlayer(anon);
				setLoading(false);
			}
		} catch (error) {
			setErrors([error]);
		}
	};

	const loginUser = async e => {
		e.preventDefault();
		setLoading(true);
		try {
			const player = await request("login", loginValues);
			if (!player.ok) {
				setLoading(false);
				throw await player.json();
			} else {
				props.registerPlayer(await player.json());
				setLoading(false);
			}
		} catch (err) {
			setErrors([err]);
		}
	};

	const generateErrors = () =>
		errors.map(err => {
			return (
				<Grow in={!!errors.length} timeout={400}>
					<Typography className={classes.error}>{err.error}</Typography>
				</Grow>
			);
		});

	const optionButtons = (
		<div className={classes.inputsContainer}>
			<Button
				color="secondary"
				variant="contained"
				className={classes.optionButton}
				onClick={() => {
					setShowSignUpForm(true);
					setShowAnonLoginForm(false);
				}}
			>
				Create Account
			</Button>
			{!showAnonLoginForm && (
				<Button
					color="secondary"
					variant="contained"
					className={classes.optionButton}
					onClick={() => setShowAnonLoginForm(true)}
				>
					Login Anonymously
				</Button>
			)}
		</div>
	);

	const anonForm = (
		<form autoComplete="off" onSubmit={loginAnonymously}>
			<Box className={classes.inputsContainer}>
				<Typography variant="h6">Anonymous Login</Typography>
				<TextField
					id="player_name"
					label="Player Name"
					className={classes.textField}
					type="text"
					name="player_name"
					value={signUpValues.player_name || ""}
					onChange={handleSignUpForm}
					margin="normal"
					variant="outlined"
					inputProps={{ maxLength: 15 }}
				/>
				<h4>{isLoading && loadingIcon}</h4>
				{!!errors.length && generateErrors()}
				<Button color="primary" type="submit" variant="contained">
					Login
				</Button>
				<Button
					color="primary"
					size="small"
					onClick={() => {
						setShowSignUpForm(false);
						setShowAnonLoginForm(false);
					}}
				>
					Already a user? Click me
				</Button>
			</Box>
		</form>
	);

	const registerForm = (
		<form autoComplete="off" onSubmit={signUpUser}>
			<Box className={classes.inputsContainer}>
				<TextField
					id="outlined-email"
					label="Email"
					className={classes.textField}
					type="email"
					name="email"
					value={signUpValues.email || ""}
					onChange={handleSignUpForm}
					margin="normal"
					variant="outlined"
					inputProps={{ maxLength: 35 }}
				/>
				<TextField
					id="outlined-player-name"
					label="Player Name"
					className={classes.textField}
					type="text"
					name="player_name"
					value={signUpValues.player_name || ""}
					onChange={handleSignUpForm}
					margin="normal"
					variant="outlined"
					inputProps={{ maxLength: 20 }}
				/>
				<TextField
					id="outlined-password"
					label="Password"
					className={classes.textField}
					type="password"
					name="password"
					value={signUpValues.password || ""}
					onChange={handleSignUpForm}
					margin="normal"
					variant="outlined"
					inputProps={{ maxLength: 25 }}
				/>
				<TextField
					id="outlined-confirm-password"
					label="Confirm Password"
					className={classes.textField}
					type="password"
					name="confirm_password"
					value={signUpValues.confirm_password || ""}
					onChange={handleSignUpForm}
					margin="normal"
					variant="outlined"
					inputProps={{ maxLength: 25 }}
				/>
				<TextField
					id="outlined-secret-one"
					label="Secret Phrase One (For: Password Reset)"
					className={classes.textField}
					type="text"
					name="secret_one"
					value={signUpValues.secret_one || ""}
					onChange={handleSignUpForm}
					margin="normal"
					variant="outlined"
					inputProps={{ maxLength: 40 }}
				/>
				<TextField
					id="outlined-secret-two"
					label="Secret Phrase Two (For: Password Reset)"
					className={classes.textField}
					type="text"
					name="secret_two"
					value={signUpValues.secret_two || ""}
					onChange={handleSignUpForm}
					margin="normal"
					variant="outlined"
					inputProps={{ maxLength: 40 }}
				/>
				<h4>{isLoading && loadingIcon}</h4>
				{!!errors.length && generateErrors()}
				<Button color="primary" type="submit" variant="contained">
					Create
				</Button>
				<Button
					color="primary"
					size="small"
					onClick={() => setShowSignUpForm(false)}
				>
					Already a user? Click me
				</Button>
			</Box>
		</form>
	);

	const loginForm = (
		<form autoComplete="off" onSubmit={loginUser}>
			<Box className={classes.inputsContainer}>
				<TextField
					error={!!errors.length}
					id="outlined-email"
					label="Email"
					className={classes.textField}
					type="email"
					name="email"
					value={loginValues.email || ""}
					onChange={handleLoginForm}
					margin="normal"
					variant="outlined"
					inputProps={{ maxLength: 35 }}
				/>
				<TextField
					error={!!errors.length}
					id="outlined-password"
					label="Password"
					className={classes.textField}
					name="password"
					type="password"
					value={loginValues.password || ""}
					onChange={handleLoginForm}
					margin="normal"
					variant="outlined"
					inputProps={{ maxLength: 25 }}
				/>
				{isLoading && loadingIcon}
				{!!errors.length && generateErrors()}
				<Button color="primary" type="submit" variant="contained">
					Log In
				</Button>
			</Box>
		</form>
	);

	return (
		<div className={classes.root}>
			<Box onFocus={() => setErrors([])}>
				{!showSignUpForm && !showAnonLoginForm && loginForm}
				{showSignUpForm && registerForm}
				{showAnonLoginForm && anonForm}
				{!showSignUpForm && optionButtons}
			</Box>
		</div>
	);
}

export default PlayerForms;
