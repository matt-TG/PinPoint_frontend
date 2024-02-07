import {createContext} from 'react';

export const AuthContext=createContext( //these comes from App.js AuthContext.Provider
    {isLoggedIn: false,
     userId: null,
     token: null,
     login: ()=>{}, 
     logout: ()=>{},
    setEvents: ()=>{},
    setPlaces: ()=>{},
    events: null,
    places: null});