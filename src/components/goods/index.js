import {useState, useEffect} from 'react';
import {Typography,  Button} from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import '../../App.scss';
import {origUrl} from '../../App.js';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import {IconButton} from '@material-ui/core';
import {history} from '../../App.js';
import VisibilityIcon from '@material-ui/icons/Visibility';


const defaultImg = "https://www.lionstroy.ru/published/publicdata/U70619SHOP/attachments/SC/products_pictures/nophoto.png"
const url = 'http://marketplace.node.ed.asmer.org.ua/'
const GoodCard = ({good}) => {
  const [indexArr, setindexArr] = useState(0)
  const useStylesImg = makeStyles({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 280,
    },
    mediaButton:{
    justifyContent: 'center'
    },
  })
  const onClickGood = ()=>{
    history.push("/good/"+good._id)
  }
  return (
  <Grid item xs={6} md={4} >
    <Card className={useStylesImg().root}>
    <CardActionArea>
    <CardMedia
      className={useStylesImg().media}
      onClick={()=>indexArr=== good.images.length-1?setindexArr(0) :setindexArr(indexArr+1)}
      image={good.images&&good.images[indexArr]?origUrl+good.images[indexArr].url:defaultImg}
      title="Contemplative Reptile"/>
      <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
          {good.title?good.title:""}
          </Typography>
          <Typography gutterBottom variant="h6" component="h3">
          {"Цена: "+(good.price?good.price:0)+" грн"}
          </Typography>
        </CardContent>
    </CardActionArea>
    <CardActions className={useStylesImg().mediaButton}>
        <Button variant="outlined" color="primary" onClick={onClickGood} startIcon={<VisibilityIcon/>}>
          view
        </Button>
      </CardActions>
    </Card>
  </Grid>
)}

const Cards = ({loadData, cats=[], stat}) => {
  useEffect(() => {
    loadData()
  },[])
  const useStyles = makeStyles((theme) => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      marginTop: '55px',
      marginBottom: '20px',
      width: '70%',
      marginLeft: '16%'
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
  }));
  const classes = useStyles()
  if(stat==='PENDING'){
    return(
      <img className='preloader' src='https://i.pinimg.com/originals/c8/a1/76/c8a1765ffc8243f3a7b176c0ca84c3c1.gif' />
    )
  }
  return(<>
    <Paper component="form" className={classes.root}>
    <IconButton className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="Search"/>
    </Paper>
  <Grid container spacing={4} >
  {cats.reverse().map(el=><GoodCard key={el._id} good={el}/>)}
  </Grid></>)
}

  export default Cards