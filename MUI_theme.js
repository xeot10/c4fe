import { createMuiTheme } from "@material-ui/core/styles";
import {
	red,
	blue,
	deepPurple,
	yellow,
	cyan,
	lime,
	blueGrey,
	grey,
	lightBlue,
	lightGreen,
	orange,
	pink
} from "@material-ui/core/colors";

const theme = createMuiTheme({
	palette: {
		chips: {
			purple: deepPurple["500"],
			pink: pink["A200"],
			red: red["500"],
			yellow: yellow["A200"],
			blue: blue["500"],
			orange: orange["A400"]
		},
		background: {
			blue: {
				dark: blue["A700"],
				light: lightBlue["A700"],
				lighter: lightBlue["100"],
				cyan: cyan["A400"]
			},
			green: {
				lime: lime["A700"],
				light: lightGreen["A700"]
			},
			red: {
				red: red["A400"]
			}
		},
		dark: {
			darkBlueGray: blueGrey["800"],
			darkerBlueGray: blueGrey["900"],
			darkGray: grey["800"],
			darkerGray: grey["900"],
			midDarkBlue: blueGrey["400"],
			midBlue: blueGrey["300"]
		},
		light: {
			lighterGray: grey["50"],
			lightGray: grey["200"],
			lighterBlue: blueGrey["50"],
			lightBlue: blueGrey["200"]
		}
	}
});

export default theme;
