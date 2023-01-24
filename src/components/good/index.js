import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { useParams} from 'react-router-dom';
import {Typography,  Button} from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import '../../App.scss';
import TextField from '@material-ui/core/TextField';
import {actionAdComment,origUrl,actionAdMessage,defaultAvatar} from '../../App.js';



const defaultImg = "https://www.lionstroy.ru/published/publicdata/U70619SHOP/attachments/SC/products_pictures/nophoto.png"
const url = 'http://marketplace.node.ed.asmer.org.ua/'

const Good = ({loadData,data, good, myUser })=>{
    const {_id} = useParams()
    const dispatch = useDispatch();
    const id = useSelector(state => state.auth?.payload?.sub?.id)
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');
      useEffect(() => {
          loadData(_id)
      },[_id])
      useEffect(() => {
        data(id)
      },[id])
    const [indexArr, setindexArr] = useState(0)
  
    
    const useStylesImgGood = makeStyles({
      root: {
        maxWidth: "80%",
        marginTop: 50,
        margin: "auto",
        textAlign: "-webkit-center"
      },
      comment:{
        width: "100%",
        marginBottom: '4px'
      },
      media: {
        height: 430,
        maxWidth: '70%'
      },
    })
    const onclickSend =()=>{
      dispatch(actionAdComment({text:comment, ad:{_id}}))
      setComment('')
    }
    const onclickMessage=()=>{
      dispatch(actionAdMessage({text:message, to:{_id:good.owner._id}}))
      setMessage('')
    }
    const Commets = ()=>{
      return(<>
          {good.comments.map(el=>
          <div className='commentCard'>
            <Card >
              <CardContent className='commentAvatar'>
                <Avatar  alt="Remy Sharp" src={el.owner.avatar?url+el.owner.avatar.url:defaultAvatar} />
                <p className="avatarName">
                  {el.owner.login}
                </p>
              </CardContent>
              <div className='comment'>
                {el.text&&el.text}
              </div>
            </Card>
          </div>)}</>
      )
    }

    
    
    return(<>
        <Card className={useStylesImgGood().root}>
          <CardActionArea>
          <CardMedia
            className={useStylesImgGood().media}
            onClick={()=>indexArr=== good.images.length-1?setindexArr(0) :setindexArr(indexArr+1)}
            image={good.images&&good.images[indexArr]?origUrl+good.images[indexArr].url:defaultImg}
            title="Contemplative Reptile"/>
            </CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
              {good.title?good.title:""}
              </Typography>
              <Typography gutterBottom variant="h6" component="h3">
              {"Цена: "+(good.price?good.price:0)+" грн"}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
              {good.description?good.description:""}
              </Typography>
              <div className='messageCardSend'>
              <CardContent className='commentAvatar'>
                <Avatar  alt="Remy Sharp"  src={good?.owner?.avatar?url+good.owner.avatar.url:defaultAvatar}/>
                <p className="avatarName">
                  {good.owner?good.owner.login:""}
                </p>
              </CardContent>
            <TextField 
              value={message}
              onChange={(e) => setMessage(e.target.value)} 
              className={useStylesImgGood().comment}
              id="outlined-multiline-static"
              label="Message"
              multiline
              variant="outlined"/>
              <Button size="small" color="primary" onClick={onclickMessage}>
            SEND
          </Button>
          
        </div>
            </CardContent>
          
        </Card>
        <Card className='commentCardSend'>
              <CardContent className='commentAvatar'>
                <Avatar  alt="Remy Sharp" src={myUser.avatar?url+myUser.avatar.url:defaultAvatar} />
                <p className="avatarName">
                  {myUser.login?myUser.login:''}
                </p>
              </CardContent>
            <TextField 
              value={comment}
              onChange={(e) => setComment(e.target.value)} 
              className={useStylesImgGood().comment}
              id="outlined-multiline-static"
              label="Comment"
              multiline
              variant="outlined"/>
              <Button size="small" color="primary" onClick={onclickSend}>
            SEND
          </Button>
          
        </Card>
        {good.comments&&<Commets/>}
        </>
  )}

  export default Good