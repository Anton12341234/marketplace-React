import {useSelector} from 'react-redux';
import React from 'react';
import '../../App.scss';
import {history, actionlist, actionAuthLogout, store, defaultAvatar, origUrl} from '../../App.js';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {AppBar, Container, Toolbar, IconButton, Typography, Box, Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import HomeIcon from '@material-ui/icons/Home';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import BallotIcon from '@material-ui/icons/Ballot';
import EmailIcon from '@material-ui/icons/Email';
import {useEffect} from "react";

const useStyles = makeStyles((theme)=>({
  menuButton:{
    position: "absolute",
    right: 100,
  },
  Buttons:{
    position: "absolute",
    left: 50,
    marginTop: "-20px"
  },
  title:{
    flexGrow:1,
    cursor: "pointer"
  },
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    position: "absolute",
    right: 50,

  },
  menu:{
    marginLeft: "6%"
  }
  
}))


const Header = ({data,myUser})=> {
  const logined = useSelector(state => state?.auth?.token);
  const id = useSelector(state => state.auth?.payload?.sub?.id)
  
  useEffect(() => {
    data(id)
  },[])

  const classes = useStyles()
  const onclickHome = ()=>{
    handleClose()
    if(store.getState().auth.token){
      history.push("/")
      store.dispatch(actionlist())
    }else{
      history.push("/sign_in")
    }
  }
  const onclickLogout = ()=>{
    store.dispatch(actionAuthLogout())
    handleClose()
    history.push("/sign_in")
  }
  const onclickMyProfile = ()=>{
    handleClose()
    history.push("/my_profile")
  }
  const onclickAllProductsUser = ()=>{
    handleClose()
    history.push("/all_products_user")
  }
  const onclickCreateAd = ()=>{
    handleClose()
    history.push("/create_ad")
  }
  const onclickMessage = ()=>{
    handleClose()
    history.push("/message")
  }
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const Buttons = ()=>{
    if (logined){
      return(<>
      
      <Avatar alt="Remy Sharp" src={myUser.avatar? origUrl+myUser.avatar.url : defaultAvatar} className={classes.large} />
      
      
      <div>
        <Button className={classes.Buttons} variant="outlined" color="inherit" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
          Open Menu
        </Button>
        <Menu
        className={classes.menu}
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={onclickHome}><HomeIcon/> Home</MenuItem>
          <MenuItem onClick={onclickMessage}><EmailIcon/> Message</MenuItem>
          <MenuItem onClick={onclickMyProfile}><AccountBoxIcon/> Profile</MenuItem>
          <MenuItem onClick={onclickCreateAd}><AddCircleIcon/> Create Ad</MenuItem>
          <MenuItem onClick={onclickAllProductsUser}><BallotIcon/> My Products</MenuItem>
          <MenuItem onClick={onclickLogout}><MeetingRoomIcon/> Logout</MenuItem>
        </Menu>
      </div>
    </>)
    }else{
      return<>
        <Box mr={3}>
        <Button  color="inherit" variant="outlined" onClick={()=>history.push("/sign_in")}>Sign in</Button>
        </Box>
        <Button color="secondary" variant="contained" onClick={()=>history.push("/sign_up")}>Sign Up</Button></>
    }
  }
  return (
  <AppBar position="fixed" className='myButt'>
          <Container fixed>
          <Toolbar>
          <Buttons />
            <IconButton edge='start'
            color='inherit'  className={classes.menuButton} onClick={onclickHome}>
              <Typography variant='h6' className={classes.title}>OLX</Typography>
            </IconButton>
          </Toolbar>
          </Container>
        </AppBar>
        )
}

  export default Header