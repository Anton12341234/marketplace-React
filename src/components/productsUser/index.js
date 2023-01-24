import {useState, useEffect, useRef} from 'react';
import {Provider, useDispatch, useSelector} from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { IconButton, Typography, Button} from '@material-ui/core';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {origUrl, defaultImg, actioCreateAd, history} from '../../App.js';



const GoodCard = ({good}) => {
    const dispatch = useDispatch();
    const owner = useSelector(state => state.promise?.user?.payload)
    const [indexArr, setindexArr] = useState(0)
    const [createAd, setCreateAd] = useState({ title:good.title?good.title:"", description:good.description?good.description:"", price:good.price?good.price:0});
    
    const onClickGoods = ()=>{
      history.push("/change/"+good._id)
    }
    const useStylesImg = makeStyles({
        button:{
            margin: "3%"
        },
        input:{
            margin: '3px'
        },
        inputDescription:{
            margin: '3px',
            width: '90%'
        },
        mediaButton:{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "stretch"
        },
        contentCard:{
            display: "flex",
            flexDirection: "column",
            width: "40%",
        },
        content:{
            width: "60%",
            display: "flex",
            justifyContent: "space-evenly",
            flexDirection: "column",
            maxWidth: "45%"
        },
        root: {
            display: "flex",
            margin: "2%",
            marginTop: "15px",
            backgroundColor: '#a9a9a96b',
        },
        media: {
            width: "100%",
            height: 280,
            borderRadius: "15px",
        },
        text:{
          padding: '10px',
          margin: '5px',
          backgroundColor: '#3f51b500',
        }
    })
    return (
    
      <Card className={useStylesImg().root}>
        <CardContent className={useStylesImg().contentCard}>
            <CardMedia
                className={useStylesImg().media}
                onClick={()=>indexArr=== good.images.length-1?setindexArr(0) :setindexArr(indexArr+1)}
                image={good.images&&good.images[indexArr]?origUrl+good.images[indexArr].url:defaultImg}
                title="Contemplative Reptile"/>
        </CardContent>
        <CardContent className={useStylesImg().content}>
        <Card className={useStylesImg().text}>
          <Typography gutterBottom variant="h5" component="h2">
                {good.title?good.title:""}
          </Typography>
          </Card>
          <Card className={useStylesImg().text}>
          <Typography gutterBottom variant="h6" component="h3">
              {"Цена: "+(good.price?good.price:0)+" грн"}
              </Typography>
              </Card>
              <Card className={useStylesImg().text}>
                <Typography gutterBottom variant="h6" component="h5">
              {good.description?good.description:""}
              </Typography>
              </Card>
          </CardContent>
          <CardActions className={useStylesImg().mediaButton}>
          <Button onClick={onClickGoods} color="inherit" variant="outlined" ><CreateIcon/> Сhange </Button>
          <Button onClick={()=> history.push("/good/"+good._id)} color="inherit" variant="outlined" ><VisibilityIcon/> view </Button>
          <Button color="secondary" variant="contained"><DeleteIcon/> Delete </Button>
        </CardActions>
      
      </Card>
    
  )}
  
  const CardsUser = ({loadData, productsUser=[], stat}) => {
    const id = useSelector(state => state.auth?.payload?.sub?.id)
    useEffect(() => {
      loadData(id)
    },[id])
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
      rootGrid:{
        display: 'flex',
        flexDirection: 'column',
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
    <Grid className={classes.rootGrid} container spacing={4} >
    {productsUser.reverse().map(el=><GoodCard key={el._id} good={el} />)}
    </Grid></>)
  }


  export default CardsUser