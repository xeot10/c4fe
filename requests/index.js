import handler from "./requestHandlers";

export default function(type, payload) {
	switch (type) {
		case "login":
			return handler.loginViaEmail(payload);
		case "tokenLogin":
			const token =
				JSON.parse(localStorage.getItem("connect_four_token")) || payload;
			return handler.loginViaToken(token);
		case "signupUser":
			return handler.signupUser(payload);
		case "anonymousLogin":
			return handler.anonymousLogin(payload);
		default:
			console.log("def");
	}
}
