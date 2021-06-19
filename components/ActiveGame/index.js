import React, { useState } from 'react';
import theme from '../../MUI_theme';
import Box from '@material-ui/core/Box';
import GameGrid from './GameGrid';
import ChatBox from '../ChatBox';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { sendInGameMessage } from '../../websocket-api';
import { leaveActiveGame, resetGrid } from '../../actions';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    maxWidth: '1600px',
    padding: theme.spacing(1),
    [theme.breakpoints.up('lg')]: {
      margin: '0 auto'
    },
    [theme.breakpoints.down('md')]: {
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    background: ({palette}) => palette.dark.midDarkBlue,
  },
  chatBox: {
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(2),
      width: '70vw',
      height: '60vh'
    },
    [theme.breakpoints.up('lg')]: {
      width: '100%'
    },
    display: 'flex',
    width: '100%',
    position: 'relative',
  },
  chatToggle: {
    position: 'absolute',
    right: '5px',
    top: '5px',
    zIndex: 1
  }

}));

function ActiveGame(props) {
  const classes = useStyles(theme);
  const [isChatActive, setChatActive] = useState(true);
  const { status, resetGame, resetGameGrid } = props;

  const handleChatToggle = () => {
    setChatActive(!isChatActive);
  };

  const handleSendMessage = (message) => {
    sendInGameMessage(message);
  };

  if (status !== 'active' && status !== 'full') {
    if (status === 'waiting') resetGameGrid()
    else resetGame();
    return <Redirect to='/home' />
  };

  return (
    <Box className={classes.root}>
      <GameGrid />
    </Box>
  )
};

const mapStateToProps = ({ currentGame }) => ({
  grid: currentGame.grid,
  status: currentGame.status,
  messages: currentGame.messages,
});

const mapDispatchToProps = dispatch => ({
  resetGame: () => dispatch(leaveActiveGame()),
  resetGameGrid: () => dispatch(resetGrid())
});

export default connect(mapStateToProps, mapDispatchToProps)(ActiveGame);
