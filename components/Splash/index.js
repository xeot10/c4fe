import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import theme from "../../MUI_theme";
import Box from "@material-ui/core/Box";
import Grow from "@material-ui/core/Grow";

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		background: ({ palette }) => palette.dark.midBlue
	},
	gridContainer: {
		overflow: "hidden",
		display: "flex",
		padding: theme.spacing(1),
		justifyContent: "center",
		borderRadius: "0 0 10px 10px"
	},
	column: {
		dispaly: "flex",
		flexDirection: "column"
	},
	slot: {
		borderRadius: "50%",
		width: "11vw",
		height: "11vw",
		margin: "1vw",
		maxWidth: "140px",
		maxHeight: "140px",
		[theme.breakpoints.down("sm")]: {
			width: "10vh",
			height: "10vh",
			margin: "1vh"
		}
	},
	emptySlot: {
		background: ({ palette }) => palette.light.lighterGray
	},
	chipOne: {
		background: ({ chipOne }) => chipOne
	},
	chipTwo: {
		background: ({ chipTwo }) => chipTwo
	}
}));

const slotProps = {
	m: 1,
	boxShadow: 3
};

function Splash() {
	const randomizedColors = Object.values(theme.palette.chips).sort(
		() => 0.5 - Math.random()
	);
	const [chipOne] = useState(randomizedColors[0]);
	const [chipTwo] = useState(randomizedColors[1]);
	const [currSlot, setCurrSlot] = useState([0, 0]);
	const [currChip, setCurrChip] = useState(1);
	const [grid, setGrid] = useState([
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 0, 0, 1, 2, 2],
		[0, 0, 0, 0, 0, 0, 0, 0, 2, 2],
		[0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
		[0, 0, 0, 0, 0, 0, 0, 1, 1, 2],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
	]);
	const classes = useStyles({
		...theme,
		chipOne,
		chipTwo
	});

	const placeRandomChip = useCallback(() => {
		const randIdx = Math.floor(Math.random() * grid.length);

		for (let i = grid[randIdx].length - 1; i >= 0; i--) {
			if (grid[randIdx][i] === 0) {
				const copy = [...grid];
				copy[randIdx][i] = currChip;
				setGrid(copy);
				setCurrSlot([randIdx, i]);
				currChip === 1 ? setCurrChip(2) : setCurrChip(1);
				break;
			}
		}
	}, [setCurrChip, currChip, grid]);

	useEffect(() => {
		const timout = setInterval(placeRandomChip, 1300);
		return () => clearInterval(timout);
	}, [placeRandomChip]);

	const handleSlotStyle = (slot, currChip) => {
		const { chipOne, chipTwo, emptySlot } = classes;

		switch (true) {
			case currChip === 1:
				return chipOne;
			case currChip === 2:
				return chipTwo;
			default:
				return emptySlot;
		}
	};

	const connectFourGrid = grid.map((column, i) => {
		return (
			<Box key={`col${i}`} className={classes.column}>
				{column.map((gridSlot, j) => {
					const ifNew = i === currSlot[0] && j === currSlot[1];
					const colorChip = (
						<Box
							className={`${classes.slot} ${handleSlotStyle(
								gridSlot,
								gridSlot
							)}`}
							{...slotProps}
						/>
					);
					const slidingChip = (
						<Grow
							key={`col${i}row${j}chip${gridSlot}`}
							in={ifNew}
							direction="down"
							timeout={800}
						>
							{colorChip}
						</Grow>
					);
					return ifNew ? slidingChip : colorChip;
				})}
			</Box>
		);
	});

	return (
		<Box className={classes.root}>
			<Box boxShadow={3} className={classes.gridContainer}>
				{connectFourGrid}
			</Box>
		</Box>
	);
}

export default Splash;
