import React, {useState, useCallback, useEffect, Suspense} from 'react'; //Suspense is needed for lazy loading

import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

import Menu from './menu/menu';

//import Users from './user/pages/Users';

//import New from './places/pages/Place';

//import UserPlaces from './places/pages/UserPlaces';
//
//import UpdatePlace from './places/pages/UpdatePlace';

import MainNavigation from './shared/components/Navigation/MainNavigation';

//import Auth from './user/pages/Auth';

import {AuthContext} from './shared/context/auth-context';

import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';



//LAZY ROUTING
const Place= React.lazy(()=> import('./places/pages/Place'));
const Event= React.lazy(()=> import('./places/pages/Event'));
const NewComment= React.lazy(()=> import('./comments/NewComment'));
const UserPlaces= React.lazy(()=> import('./places/pages/UserPlaces'));
const UserEvents= React.lazy(()=> import('./places/pages/UserEvents'));
const Own= React.lazy(()=> import('./places/pages/Own'));
const UpdatePlace= React.lazy(()=> import('./places/pages/UpdatePlace'));
const UpdateEvent= React.lazy(()=> import('./places/pages/UpdateEvent'));
const UpdateComment= React.lazy(()=> import('./comments/updateComment'));
const Auth= React.lazy(()=> import('./user/pages/Auth'));
const Users= React.lazy(()=> import('./user/pages/Users'));
const Events= React.lazy(()=> import('./menu/events'));
const Places= React.lazy(()=> import('./menu/places'));


let logoutTimer;



const App= ()=> {
    
    const [token, setToken]=useState(false);
    
    const [tokenExpirationDate, setTokenExpirationDate]=useState();
    
    const [userId, setUserId]=useState(false);
    
    const [events, setLoadedEvents]=useState();
    
    const [places, setLoadedPlaces]=useState();
    
    const [image, setImage]=useState();
    
    
    
    const login= useCallback( (uid, token, expirationDate, image)=>{
        
        setToken(token);
        
        setUserId(uid);
        
        setImage(image);
        
        const tokenExpirationDate=expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); //Sets time that is this time plus one hour. Note that due to scoping this is not the same variable as the state variable outside of this function
        
        
        setTokenExpirationDate(tokenExpirationDate); //if there is a same name for two different variables then the one used is the one that lives inside this function
        
        localStorage.setItem('userData', JSON.stringify({
            
            userId: uid,
            token: token,
            expiration: tokenExpirationDate.toISOString(), //this is special method that makes sure no important data gets lost, when you stringify an object
            image: image
        }));
        
    }, []);
    
    
    const logout= useCallback( ()=>{
        
        setToken(null);
        
        setTokenExpirationDate(null);
        
        setUserId(null);
        
        setImage(null);
        
        localStorage.removeItem('userData');
        
    }, []);
    
    const setEvents =useCallback( (events)=>{
        
        
        setLoadedEvents(events);
        
    }, []);
    
    const setPlaces =useCallback( (places)=>{
        
        
        setLoadedPlaces(places);
        
    }, []);
    
    
    useEffect(()=>{
        
        if(token && tokenExpirationDate){
            

            
            const remainingTime=tokenExpirationDate.getTime() - new Date().getTime(); //we get milliseconds as a value which is good because setTimeout below wants milliseconds
            
            
            logoutTimer=setTimeout(logout, remainingTime);
            
        } else{
            
            clearTimeout(logoutTimer); //important to clear so that we don't have two timers running at the same time after we manually logout and then log in again.
        }
        
    },[token, logout, tokenExpirationDate]);
    
    
    
    useEffect(()=>{ //useEffect always runs after the rerender cycle
        
        const storedData=JSON.parse(localStorage.getItem('userData'));
        
        if(storedData && storedData.token && new Date(storedData.expiration) > new Date() ){
            
            login(storedData.userId, storedData.token, new Date(storedData.expiration), storedData.image);
        }
        
    }, [login]); //if we use something outside the useEffect function then we need to set it as a dependency. Because login method is using useCallback it doesn't get recreated on every rerender cycle which is the reason we don't get an infinite loop here.

    
    let routes;
    
    
    if(token){
        
        routes=(
        
            <Switch> {/* note, couldn't use React.Fragment here as a wrapper, caused a small error in the app's functionality, so down below we don't need to wrap the routes inside Switch anymore because the wrapping happens here now*/}
            
            <Route path="/" exact>
          
                <Menu/>
                
            </Route>
            
            <Route path="/users" exact>
          
                <Users/>
                
            </Route>
            
            <Route path="/:userId/places" exact>
          
                <UserPlaces/>
                
            </Route>
            
            <Route path="/:userId/events" exact>
          
                <UserEvents/>
                
            </Route>
            
            <Route path="/:userId/own" exact>
          
                <Own/>
                
            </Route>
            
            <Route path="/events" exact>
          
                <Events/>
                
            </Route>
            
            <Route path="/places" exact>
          
                <Places/>
                
            </Route>
            
            <Route path="/events/new" exact>
          
                <Event/>
                
            </Route>
            
            <Route path="/places/new" exact>
          
                <Place/>
                
            </Route>
            
            <Route path="/events/comment/new/:eventId" exact>
          
                <NewComment/>
                
            </Route>
    
            <Route path="/places/:placeId" exact> {/* Note that order matters here, this route can't come before /places/new, because otherwise React would interpret that places/new is this route here */}
          
                <UpdatePlace/>
                
            </Route>
            
            <Route path="/events/:eventId" exact> {/* Note that order matters here, this route can't come before /places/new, because otherwise React would interpret that places/new is this route here */}
          
                <UpdateEvent/>
                
            </Route>
            
            <Route path="/events/comment/mod/:commentId" exact> {/* Note that order matters here, this route can't come before /places/new, because otherwise React would interpret that places/new is this route here */}
          
                <UpdateComment/>
                
            </Route>
            
    
            <Redirect to="/" />
            
            </Switch>
        
        );
        
    } else{
        
        routes=(
        
            <Switch>
            
            
            <Route path="/" exact>
          
                <Menu/>
            
            </Route>
            
            <Route path="/users" exact>
          
                <Users/>
                
            </Route>
            
            <Route path="/:userId/places" exact>
          
                <UserPlaces/>
                
            </Route>
            
            <Route path="/:userId/events" exact>
          
                <UserEvents/>
                
            </Route>
            
            <Route path="/events" exact>
          
                <Events/>
                
            </Route>
            
            <Route path="/places" exact>
          
                <Places/>
                
            </Route>
            
            <Route path="/auth" exact>
          
                <Auth/>
                
            </Route>
    
            <Redirect to="/auth" />
            
            </Switch>
        
        );
    }
    
  return (
      <AuthContext.Provider value={{isLoggedIn: !!token, token: token, userId: userId, login: login, logout: logout, events: events, places: places, setEvents: setEvents, setPlaces: setPlaces, image: image}}> {/* AuthContext is a component and Provider is a React method that createContext hook provides...through it we get access to state properties/methods that AuthContext has in it. State is shared with all the components inside AuthContext.Provider and whenever something in the "value" property changes the component that uses the context value(s) rerenders */}
      
        <Router>
            
            <MainNavigation/> {/* We want to always render this so it is outside the switch statement, but inside Router, because we use Link from Router in MainNavigation */}
            
        <main>

      
            <Suspense fallback={<div className="center"><LoadingSpinner/></div>}>{routes}</Suspense>{/*fallback is shown, when the loading is not yet done.*/}
                
    
        </main>
                
        </Router>
      
      </AuthContext.Provider>
  );
}

export default App;
