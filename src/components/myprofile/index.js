import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles } from '@material-ui/core/styles';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import './App.scss';
import {useState, useEffect} from "react";
import {useDispatch, useSelector, connect} from "react-redux";
import {actionUpdateMe,origUrl} from '../../App.js';
import {useParams} from 'react-router-dom';
import {useDropzone} from 'react-dropzone';


const useStyles = makeStyles((theme) => ({
  root: {
    height: '50vh',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

 function MyProfile({loadData,action, myUser=[],newImg }) {
  const id = useSelector(state => state.auth?.payload?.sub?.id)
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  const [profile, setProfile] = useState({avatar:'', login:'', nick: '', addresses:'', phones:''});
  useEffect(() => {
    acceptedFiles.map(file =>action(file));
  }, [acceptedFiles]);
  console.log(profile)

  useEffect(() => {
    setProfile({...profile, avatar:newImg})
  },[newImg])
  
  useEffect(() => {
    loadData(id)
  },[id])
  const dispatch = useDispatch();

  useEffect(() => {
    if(myUser!==[]){
        setProfile({avatar:myUser.avatar , login:myUser.login, nick:myUser.nick, addresses:myUser.addresses, phones:myUser.phones})
    }
},[myUser])

const onClickChange= ()=>{
  dispatch(actionUpdateMe({...profile, _id: id, avatar: {_id: profile.avatar._id}}))
  loadData(id)
}


  const defaultAvatar = `${origUrl}`+"images/744eed7a2030edd908ef3c59cc9405ce"
  const classes = useStyles();
  return (
    <main className="main1">
        <div className="banner-wrap" >
          <div className="conteiner">
            <div className="flex__box">
              <div className="conteiner__images__pc">
                <div className="photo">
                  <img className="imgDnd" src={profile.avatar?origUrl+profile.avatar.url: defaultAvatar} alt=""/>
                <div {...getRootProps({className: 'dropzon'})}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
                </div>
              </div>
              <div className="banner">
                <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="Login"
              label="Login"
              name="Login"
              autoComplete="Login"
              autoFocus
              value={profile.login}
              onChange={(e) => setProfile({...profile, login: e.target.value})}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="Name"
              label="Name"
              name="Name"
              autoComplete="Name"
              autoFocus
              value={profile.nick}
              onChange={(e) => setProfile({...profile, nick: e.target.value})}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="Number phone"
              label="Number phone"
              name="Number phone"
              autoComplete="Number phone"
              autoFocus
              value={profile.phones}
              onChange={(e) => setProfile({...profile, phones: e.target.value})}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="City"
              label="City"
              name="City"
              autoComplete="City"
              autoFocus
              value={profile.addresses}
              onChange={(e) => setProfile({...profile, addresses: e.target.value})}
            />
            <Button
              onClick={onClickChange}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              startIcon={<SaveIcon />}
            >
              Сhange profile
            </Button>
                
               </div>
            </div>
          </div>
        </div>
    </main>
  );
}



export default MyProfile