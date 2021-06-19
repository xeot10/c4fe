import React from "react";
import Avatar from "@material-ui/core/Avatar";

const generateAvatar = playerName => {
	const firstLast = playerName[0] + playerName[playerName.length - 1];

	return <Avatar size="small">{firstLast}</Avatar>;
};

export default generateAvatar;
