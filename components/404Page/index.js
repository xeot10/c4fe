import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import theme from "../../MUI_theme";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		flexDirection: "column",
		textAlign: "center",
		paddingTop: "10vh",
		background: ({ palette }) => palette.dark.midBlue,
		height: "100vh"
	}
}));

function FourOhFourPage() {
	const classes = useStyles(theme);

	return (
		<Box className={classes.root}>
			<Typography variant="h1">404 Error</Typography>
			<Typography variant="h4">Nothing here :(</Typography>
		</Box>
	);
}

export default FourOhFourPage;
