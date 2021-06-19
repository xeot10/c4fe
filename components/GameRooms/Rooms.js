import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import generateAvatar from '../../utils/nameAvatarGenerator';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Button from '@material-ui/core/Button';
import LockIcon from '@material-ui/icons/Lock';
import Typography from '@material-ui/core/Typography';
import theme from '../../MUI_theme';
import Input from '@material-ui/core/Input';

const useStyles = makeStyles(theme => ({
  cardItem: {
    backgroundColor: ({palette}) => palette.background.blue.lighter,
    color: ({palette}) => palette.dark.darkerBlueGray,
    borderRadius: '5px',
    marginBottom: '10px'
  },
  joinBtn: {
    marginRight: theme.spacing(2),
    background: theme.palette.background.paper,
    '&:hover': {
      background: ({palette}) => palette.background.green.light
    },
    [theme.breakpoints.down('sm')]: {
      padding: '5px'
    },
  },
  cardsContainer: {
    padding: theme.spacing(1),
    height: ({isInRoom}) => isInRoom ? '51vh' : '87vh',
    [theme.breakpoints.down('sm')]: {
      maxHeight: '43vh'
    },
    overflow: 'scroll',
  },
  fullMessage: {
    color: theme.palette.common.white
  },
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    },
  },
  avatarIcon: {
    padding: '5px'
  }
}));

function Rooms({isInRoom, allGameRooms, joinHandler, currPlayerName}) { 
  const [roomPass, setRoomPass] = useState('');
  const [showPassInput, setShowPassInput] = useState(false);
  const classes = useStyles({...theme, isInRoom});

  const passInput = (
    <Input
      placeholder="Password"
      className={classes.input}
      value={roomPass}
      onChange={(e) => setRoomPass(e.target.value)}
      onBlur={() => setShowPassInput(false)}
      autoFocus
      inputProps={{
        'aria-label': 'room password input',
      }}
    />
  );

  const handleJoinClick = (roomId, hasPassword) => {
    if (hasPassword && !roomPass.length) {
      setShowPassInput(true);
    } else {
      joinHandler(roomId, roomPass);
      setRoomPass('');
    }
  };

  const generateGameRooms = () => {
    return allGameRooms.map(room => {
      const { roomId, players, name, status, hasPassword } = room;
      const roomHost = players[0] || players[1];
      const { player_name, win_streak, wins, losses } = roomHost;
      const hostWinRate = Math.round((wins / (wins + losses)) * 100)
      const isFull = status === 'full';
      const isAlreadyInRoom = players.some(p => {
        if (p !== null) {
          return p.player_name === currPlayerName;
        } else {
          return false;
        }
      });

      return (
        <ListItem key={roomId} className={classes.cardItem}>
          <Button
            disabled={isFull || isAlreadyInRoom}
            variant="contained"
            onClick={() => handleJoinClick(roomId, hasPassword)}
            className={classes.joinBtn}
            endIcon={hasPassword || isFull ? <LockIcon/> : <ArrowForwardIcon />}
          >
            {isFull ? 'Full' : 'Join'}
          </Button>
          <ListItemText
            primary={showPassInput ? passInput : name }
            secondary={player_name}
          />
          <ListItemSecondaryAction className={classes.avatarContainer}>
              <Typography variant="subtitle2">
                { `Win Rate: ${hostWinRate > 0 ? hostWinRate : 0}%` }
              </Typography>
            <IconButton className={classes.avatarIcon} edge="end" aria-label="requires-password">
              {generateAvatar(player_name)}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      );
    }) 
  }

  const noRoomsMessage = (
    <>
      <Typography className={classes.fullMessage} variant="h5">
        No Rooms Available
      </Typography>
      <Typography className={classes.fullMessage} variant="subtitle1">
        Click "NEW ROOM" to create a new one
      </Typography>
    </>
  );

  return (
    <List className={classes.cardsContainer}>
      {!allGameRooms.length 
        ? noRoomsMessage 
        : generateGameRooms()}    
    </List>
  )
}

const mapStateToProps = ({ allGameRooms, currentPlayer }) => ({
  allGameRooms,
  currPlayerName: currentPlayer.player.player_name,
})

export default connect(mapStateToProps)(Rooms);