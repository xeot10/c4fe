import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import App from "./components/App";
import rootReducer from "./reducers";
import * as serviceWorker from "./serviceWorker";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(rootReducer, composeWithDevTools());

ReactDOM.render(
	<Provider store={store}>
		<HashRouter>
			<CssBaseline />
			<App />
		</HashRouter>
	</Provider>,
	document.getElementById("root")
);

serviceWorker.unregister();

export default store;
