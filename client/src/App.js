import React, { useEffect, createContext, useReducer, useContext } from 'react'
import NavBar from './components/Navbar';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';


import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';


import "./App.css";

import Home from './components/screens/Home';
import Signin from './components/screens/Signin';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import SuscribesUserPost from './components/screens/SuscribesUserPost';
import OneRecipe from './components/screens/OneRecipe';
import HastagPosts from './components/screens/HastagPosts'
import { reducer, initialState } from './reducers/userReducer';


export const UserContext = createContext()

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  //Al cargar la App, si hay una sesión abierta se guarda el usuario
  //en el UserContext y se envía al tl, si no, se envía al login
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push('/signin');
    }
  }, []);


  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/onerecipe/:postid">
        <OneRecipe />
      </Route>
      <Route path="/recetas/:etiqueta">
        <HastagPosts />
      </Route>
      <Route path="/myfollowingpost">
        <SuscribesUserPost />
      </Route>
    </Switch>
  )
}

function App() {

  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    //Todos los nodos hijos de app tiene acceso al contexto con state
    //Acceden a los valores(algo similar a un getter) y con dispatch
    //pueden cambiar esos valore(algo similar a un setter)
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />       
        <br/><br/><br/><br/><br/><br/>
        <div className="container">
          <Routing />
        </div>
      </BrowserRouter>
    </UserContext.Provider>


  );
}

export default App;
