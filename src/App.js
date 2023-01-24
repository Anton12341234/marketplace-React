import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {Provider, connect} from 'react-redux';
import {Router, Route} from 'react-router-dom';
import React from 'react';
import './App.scss';
import SignIn from './components/signIn';
import SignUp from './components/signup';
import MyProfile from './components/myprofile';
import CreateAd from './components/add';
import Good from './components/good';
import Cards from './components/goods'
import CardsUser from './components/productsUser';
import Header from './components/header'
import Message from './components/message'
import ChangeAd from './components/changeAd'
const history = require("history").createBrowserHistory()

const getGQL = url =>
	(query, variables= {}) =>
		fetch(url, {
			method: 'POST',
			headers: checkToken(),
			body:JSON.stringify({query, variables})
		}).then(res => res.json())
			.then(data => {
				try {
					if(!data.data && data.errors) {
						throw new SyntaxError(`SyntaxError - ${JSON.stringify(Object.values(data.errors)[0])}`);
					}
					return Object.values(data.data)[0];
				} catch (e) {
					console.error(e);
				}
			});

const checkToken = () => {
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  }
  if(localStorage.getItem('authToken')) {
    return {
      ...headers,
      "Authorization": `Bearer ${localStorage.getItem('authToken')}`
    }
  } else {
    return headers;
  }
}

const defaultAvatar = "http://marketplace.node.ed.asmer.org.ua/images/744eed7a2030edd908ef3c59cc9405ce"
const url = 'http://marketplace.node.ed.asmer.org.ua/'
const gql = getGQL(url + 'graphql')

const actionPromise = (namePromise,promise) =>
    async dispatch => { 
        dispatch(actionPending(namePromise)) //сигнализируем redux, что промис начался
        try{
            const payload = await promise //ожидаем промиса
            dispatch(actionFulfilled(namePromise,payload)) //сигнализируем redux, что промис успешно выполнен
            return payload //в месте запуска store.dispatch с этим thunk можно так же получить результат промиса
        }
        catch (error){
            dispatch(actionRejected(namePromise,error)) //в случае ошибки - сигнализируем redux, что промис несложился
        }
    }

const actionPending   = (namePromise)      => ({type: 'PROMISE', status: 'PENDING',namePromise})
const actionFulfilled = (namePromise,payload) => ({type: 'PROMISE', status: 'FULFILLED',namePromise, payload})
const actionRejected  = (namePromise,error)  => ({type: 'PROMISE', status: 'REJECTED', namePromise, error})

function promiseReducer(state={}, {type, status, payload, error,namePromise}){
  if (type === 'PROMISE'){
      return {
      ...state,
        [namePromise] : {status, payload, error}
      }
    }
    return state
}


const actionUpload = (files) =>
	async (dispatch) => {
		const formData = new FormData();
		formData.append('photo', files);
		await dispatch(actionUploadFile(formData));
	}


  const actionUploadFile = formData =>
	actionPromise('upload',
		fetch(`${url}upload`, {
			method: "POST",
			headers: localStorage.authToken ? {Authorization: 'Bearer ' + localStorage.authToken} : {},
			body: formData
		}).then(res => res.json())
	);


const actionlist = () => 
actionPromise('list', gql(`query list{
  AdFind(query:"[{}]") {
    price 
    _id 
    owner {
      _id 
      login 
      nick 
      avatar {
        _id 
        url
        }
    }
    title 
    description 
    images {
      _id 
      url
    }
  }
}`))



const actionOnelist = (_id) => 
actionPromise('onelist', gql(`query onelist($q: String!) {
    AdFindOne(query:$q) {
      price _id owner {
                  _id login nick avatar {
                    _id url
                  }
      }
      title description images {
        _id url
      }
      comments {
                  _id owner {
                    _id login nick avatar {
                      _id url
                    }
                  }
                  createdAt
                  text
                  answerTo {
                    _id
                  }
      }
    }
  }`,{q: JSON.stringify([{_id}])}
)) 


const actionLogin = (login, password) =>
actionPromise('login', gql(`query Login($login: String!, $password: String!) {
     login(login: $login, password: $password)
   }`, {login, password}));


const actionRegister = (login, password) => 
actionPromise('reg', gql(`mutation Reg($login: String!, $password: String!) {
     createUser(login: $login, password: $password) {
       _id
     }
   }`, 
{"login" : login,
"password": password}
))

const actionUpdateMe = (user) =>
    actionPromise('profile', gql(`mutation upsertProfile($user:UserInput) {
                                        UserUpsert(user:$user) {
                                            _id login nick
                                        }
                                    }`, {user}))



const actioCreateAd = (ad) =>
actionPromise('createAd', gql(`mutation userAd($ad:AdInput) {
  AdUpsert(ad: $ad) {
      _id title images{
          _id url
      }
  }
}`, {ad}))


const actionOneUser = (_id) =>
actionPromise('user', gql(`query userOne($qq: String!){
  UserFindOne(query:$qq){
    _id
    login
   phones
   addresses
   nick 
   incomings{
    _id text createdAt  owner{
      _id login
    }
   }
   avatar{
      url
    }
  }
}`, {qq: JSON.stringify([{_id}])}))





const actionAdComment = (comment) =>
actionPromise('adComment', gql(`mutation adComment($comment:CommentInput) {
  CommentUpsert(comment: $comment) {
    _id
    text owner {
      _id login nick 
    }
  }
}`, {comment}))


const actionAdMessage = (message) =>
actionPromise('admessage', gql(`mutation admessage($message:MessageInput) {
  MessageUpsert(message: $message) {
    _id
    text
    createdAt
    to{
      _id login
    }
    owner{
      _id
      login
      nick
    }
  }
}`, {message}))


const actionAllProductsUser = (_id) =>
actionPromise("productsUser", gql(`query productsUser($userId: String) {
                AdFind(query: $userId) {
                  price _id owner {
                                      _id login nick avatar {
                                        _id url
                                      }
                                    }
                                    title description images {
                                      _id url
                                    }
                }
              }`, {userId: JSON.stringify([{___owner: _id}])}));


const actionMyUserMessage = (_id) => 
actionPromise('allMeMessage', gql(`query allMeMessage($userId: String){
  MessageFind(query: $userId){
    _id
  text
  createdAt
  to{
    _id login avatar {_id url}
  }
  owner{
    _id
    login
    nick
  }
  }
}`, {userId: JSON.stringify([{___owner: _id}])}));


const actionForMeMessage = (_id) =>
actionPromise('allForMeMessage', gql(`query forMeMessage($qq: String!){
  UserFindOne(query:$qq){
   incomings{
    _id text createdAt  owner{
      _id login avatar {_id url}
    }
   }
  }
}`, {qq: JSON.stringify([{_id}])}))



const store = createStore(combineReducers({auth: authReducer, promise:localStoredReducer(promiseReducer, 'promise')}), applyMiddleware(thunk))
store.subscribe(() => console.log(store.getState()))


function jwtDecode(token){
	try {
		return JSON.parse(atob(token.split('.')[1]))
	}
	catch(e){
	}
}

function localStoredReducer(reducer, localStorageKey){
	function wrapper(state, action){
		if (state === undefined){
			try {
				return JSON.parse(localStorage[localStorageKey]) 
			}
			catch(e){ } 
		}
		const newState = reducer(state, action)
		localStorage.setItem(localStorageKey, JSON.stringify(newState)) 
		return newState
	}
	return wrapper
}


function authReducer(state={}, {type, token}){
	if (type === 'AUTH_LOGIN'){ 
		const payload = jwtDecode(token)
		try{
            if (payload){
                return {
                    token,
                    payload
                }
		    }
        }
        catch (e) {}
	}
	if (type === 'AUTH_LOGOUT'){ 
		return {}
	}
	return state
}

const actionAuthLogout = () =>
	() => {
		store.dispatch({type: 'AUTH_LOGOUT'});
		localStorage.removeItem('authToken');
    localStorage.clear()
	}

const actionAuthLogin = (token) =>
	() => {
		const oldState = store.getState()
		store.dispatch({type: 'AUTH_LOGIN', token})
		const newState = store.getState()
		if (oldState !== newState)
			localStorage.setItem('authToken', token)
	}



const origUrl = "http://marketplace.node.ed.asmer.org.ua/"
const defaultImg = "https://www.lionstroy.ru/published/publicdata/U70619SHOP/attachments/SC/products_pictures/nophoto.png"

const mainList = connect(state => ({
  cats: state.promise?.list?.payload, 
  stat: state.promise?.list?.status
}),
{loadData: actionlist})(Cards)

const goodUser = connect(state => ({
  good: state.promise?.onelist?.payload||[],
  myUser: state.promise?.user?.payload||[]}),{
    loadData: actionOnelist, 
    data:actionOneUser} )(Good)

const Profile = connect(state => ({
  myUser: state.promise?.user?.payload||[],
  newImg: state.promise?.upload?.payload||[]}),
  {loadData: actionOneUser,
   action: actionUpload} )(MyProfile)

const Messages = connect(state => ({
  myMessage: state.promise?.allMeMessage?.payload, 
  forMeMessage: state.promise?.allForMeMessage?.payload?.incomings||[],
  myNewMessage: state.promise?.admessage?.payload||[]}),{
    loadData: actionMyUserMessage, 
    dataMyUser:actionForMeMessage,
    sendMessage:actionAdMessage} )(Message)

const AllProductsUser = connect(state => ({
  productsUser: state.promise?.productsUser?.payload||[], 
  stat: state.promise?.list?.status||[]}),
  {loadData: actionAllProductsUser} )(CardsUser)

const CreateAdConnect = connect(state => ({
  newImg: state.promise?.upload?.payload||[]}),
  {action: actionUpload} )(CreateAd)

const HeaderConnect = connect(state => ({
  myUser: state.promise?.user?.payload||[]}),
  {data:actionOneUser} )(Header)

const ChangeAdConnect = connect(state => ({
  newImg: state.promise?.upload?.payload||[],
  good: state.promise?.onelist?.payload||[]}),
  {action: actionUpload,
  oneGood: actionOnelist} )(ChangeAd)

store.dispatch(actionAuthLogin(localStorage.authToken))
!store.getState().auth.token&&history.push("/sign_in")



function App() {
  return (
  <Router history = {history}>
    <Provider store={store}>
    <Route path="/sign_in" component={SignIn} exact/>
    <Route path="/sign_up" component={SignUp} exact/>
    <Route path="/my_profile" component={Profile} exact/>
    <Route path="/create_ad" component={CreateAdConnect} exact/>
    <Route path="/change/:_id" component={ChangeAdConnect} exact/>
    <HeaderConnect/>
      <main className="mainHome" style={{ backgroundColor: '#EEEFF1' }}>
        <main  className="mainCard">
        <Route path="/message" component={Messages} exact/>
        <Route path="/all_products_user" component={AllProductsUser} exact/>
        <Route path="/" component={mainList} exact/>
        <Route path="/good/:_id" component={goodUser} exact/>
        </main>
      </main>
    </Provider>
  </Router>
  );
}

export {actionLogin,actionPromise, store, defaultAvatar,  origUrl,defaultImg,actionUpload, actionOneUser,actionlist, actionAuthLogout,actionAdMessage, actionOnelist,actionAdComment, actioCreateAd, actionAuthLogin, actionRegister, mainList, history, actionUpdateMe, jwtDecode} 

export default App;