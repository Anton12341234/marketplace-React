import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles } from '@material-ui/core/styles';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import './message.scss';
import {useState, useEffect} from "react";
import Avatar from '@material-ui/core/Avatar';
import {useDispatch, useSelector, connect} from "react-redux";
import {useParams} from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import {actionAdMessage, defaultAvatar,  origUrl} from '../../App.js';


const useStyles = makeStyles((theme) => ({
  messageList: {
    width: "70%",
    maxWidth: "70%",
    backgroundColor: '#ccd7e3',
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  userList: {
    width: "30%",
    marginRight: "5px",
    minWidth: "max-content",
    backgroundColor: '#ccd7e3'
  },
  MessageInput:{
    margin: '10px'
  },
  user:{
    display: 'flex',
    height: '60px',
    backgroundColor: '#88a0b9',
    margin: '10px',
    alignItems: 'center',
    padding: '5px'
  },
  avatar:{
    marginRight: '5px'
  },
  messageCard:{
    maxWidth: '80%',
    margin: '10px',
    width: 'max-content',
    padding: '4px'
  },
  myUserColor:{
    backgroundColor: "#848bd8",
    maxWidth: '80%',
    margin: '10px',
    marginRight: '-6px',
    marginLeft: '-5px',
    width: 'max-content',
    padding: '4px',
  },
  userColor:{
    backgroundColor: "#50905f",
    maxWidth: '80%',
    maxHeight: '21px',
    margin: '10px',
    marginRight: '-6px',
    width: 'max-content',
    padding: '4px',
  },
  UserDiv:{
    display: 'flex',
  },
  myUserDiv:{
    display: 'flex',
    flexDirection: 'row-reverse',
    marginRight: '15px',
  }
}));

function MyMessage({user, message}) {
  const login = useSelector(state => state.auth?.payload?.sub?.login)
  const classes = useStyles();
  return(<div className={login===user?classes.myUserDiv:classes.UserDiv}>
    <Card className={login===user?classes.myUserColor:classes.userColor}>{user} </Card>
    <Card className={classes.messageCard}>{message} </Card>
    </div>
  )
}


const Users = ({myOnclick, user})=>{
  const classes = useStyles();
  return(
      <CardActionArea onClick={()=>myOnclick(user._id)}>
        <Card className={classes.user}>
        <Avatar  className={classes.avatar} src={user.avatar?origUrl+user.avatar.url: defaultAvatar } alt="Remy Sharp" />
                <p >{user.login} </p>
        </Card>
      </CardActionArea>
  )
}

  const Message = ({loadData,dataMyUser ,sendMessage, myMessage=[],forMeMessage=[] , myNewMessage=[]})=>{
    const classes = useStyles();
    const dispatch = useDispatch();
    const id = useSelector(state => state.auth?.payload?.sub?.id)
    const [time, setTime] = useState(true);
    
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
      if(forMeMessage.length>0||myMessage.length>0){
        let allmessages=[]
        if(forMeMessage.length>0){
          allmessages = [...forMeMessage] 
        }
        if(myMessage.length>0){
          allmessages = [...myMessage] 
        }
        if(forMeMessage.length>0&&myMessage.length>0){
          allmessages = [...forMeMessage,...myMessage] 
        }
        
        if(allmessages.length>0){
          
          let usersList = allmessages.map((el)=>{
            if(el.to){
              return{login:el.to.login, _id:el.to._id, avatar:el.to.avatar}
            }
            return{login:el.owner.login, _id:el.owner._id, avatar:el.owner.avatar}
          } )
        usersList = usersList.reduce((a, b) => {
          if (!a.find(v => v._id == b._id)) {
            a.push(b);
          }
          return a;
        }, []);
        setUsers(usersList)
        }
        
      }

    },[forMeMessage,myMessage])
    
    const [send, setSend] = useState(false);
    useEffect(() => {
      loadData(id)
    },[send])
    const [message, setMessage] = useState('');


    const [iduser, setIduser]= useState("");

    

    
    const [messageArr, setMessageArr] = useState([]);
    const [allmessage, setAllMessage] = useState([]);

    const onclickSend =()=>{
      if(message){
        dispatch(actionAdMessage({text:message, to:{_id:iduser}}))
        setSend(!send)
        setMessage('')
      }
    }



  const upDate=()=>{
      let usersMessage = []
      forMeMessage.map((el)=>{
        if(el.owner._id===iduser){
          usersMessage.push(el)
        } 
      })
      
      myMessage.map((el)=>{
        if(el.to._id===iduser){
          usersMessage.push(el)
        } 
      })
  
      const sort = usersMessage.sort((a,b)=>a.createdAt-b.createdAt)
      setMessageArr(sort)
      setAllMessage([...forMeMessage,...myMessage]) 
    }

    useEffect(() => {
      setTimeout(()=>{
        dataMyUser(id)
        setTime(!time);
      },3000)
    },[time])




    const onclickUser =(id)=>{
     setIduser(id)
     let usersMessage = []
     forMeMessage.map((el)=>{
        if(el.owner._id===id){
          usersMessage.push(el)
        } 
      })
      
      myMessage.map((el)=>{
        if(el.to._id===id){
          usersMessage.push(el)
        } 
      })
        
      const sort = usersMessage.sort((a,b)=>a.createdAt-b.createdAt)
      setMessageArr(sort) 
    }

   if(allmessage.length<forMeMessage.length+myMessage.length){
    upDate()
   }
    
    
  return (
    <main className='mainMessage'>
    <Card className={classes.userList}>
    {users.map((el)=><Users myOnclick={onclickUser} user={el}/>)}
    </Card>
    <Card className={classes.messageList}>
      <div className='divButtonText'>
      <Button onClick={onclickSend} size="small" color="primary">SEND</Button>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)} 
          className={classes.MessageInput} 
          id="standard-basic" 
          label="Message" />
        <div >{messageArr.map((el)=><MyMessage user={el.owner.login} message={el.text}/>)}</div>
      </div>
    </Card>
    </main>
  );
  }

  



export default Message