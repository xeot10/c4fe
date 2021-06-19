const handlers = {
	routes: {
		login: "https://connect-four-be.herokuapp.com/api/v1/login",
		signup: "https://connect-four-be.herokuapp.com/api/v1/signup",
		anonLogin: "https://connect-four-be.herokuapp.com/api/v1/anonymous"
	},
	noTokenPost: function(route, payload) {
		return fetch(route, {
			method: "POST",
			body: JSON.stringify(payload),
			headers: { "Content-Type": "application/json" }
		});
	},
	loginViaEmail: function(payload) {
		return this.noTokenPost(this.routes.login, payload);
	},
	signupUser: function(payload) {
		return this.noTokenPost(this.routes.signup, payload);
	},
	loginViaToken: function(token) {
		return fetch(this.routes.login, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`
			}
		});
	},
	anonymousLogin: function(player) {
		return this.noTokenPost(this.routes.anonLogin, player);
	}
};

export default handlers;
