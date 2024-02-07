//THIS WAS ORIGINALLY Users.js

import React, {useState, useEffect, useContext} from 'react';

import Options from './options';

import ErrorModal from '../shared/components/UIElements/ErrorModal';

import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';

import {useHttpClient} from '../shared/hooks/http-hook';

import {AuthContext} from '../shared/context/auth-context';


const Users = ()=>{
    
    const auth=useContext(AuthContext);

    const {isLoading, error, sendRequest, clearError}=useHttpClient();
    
    const [loadedEvents, setLoadedEvents]=useState();
    
    const [loadedPlaces, setLoadedPlaces]=useState();
    
//    const USERS=[{id:'u1', name:'Matt', image:'https://images.unsplash.com/photo-1577836775203-2bc537cc0ad8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60', places:3}]; //not using this since we have backend now
    
    useEffect(()=>{ //don't turn useEffect function into async function
        
        
        const fetchEvents=async ()=>{
            
            try{
                
                const responseData= await sendRequest(process.env.REACT_APP_BACKEND_URL+'/menu/events'); //fetch is GET by default
                

                setLoadedEvents(responseData.events);
                
                auth.setEvents(responseData.events);
            
                
            } catch(err){
                
            }
            
           
        }
        
        const fetchPlaces=async ()=>{
            
            try{
                
                const responseData= await sendRequest(process.env.REACT_APP_BACKEND_URL+'/menu/places'); //fetch is GET by default

                setLoadedPlaces(responseData.places);
                
                auth.setPlaces(responseData.places);
            
                
            } catch(err){
                
            }
            
           
        }
  
        
        
        fetchEvents();
        
        fetchPlaces();
        
        
    }, [sendRequest]); //we need to send this as a dependecy because it is coming outside of useEffect. With fetch this was not needed, because fetch is default browser function. Otherwise sendRequest would rerun every time the component that uses the hook reruns which would cause infinite loop
    
//    const errorHandler=()=>{
//        
//        setError(null);
//    }
    
    return(
    
        <React.Fragment>
        
        <ErrorModal error={error} onClear={clearError} />
        
        {isLoading && <div className="center">
        
            <LoadingSpinner/>    
        
        </div>}
        
        {!isLoading && loadedEvents && loadedPlaces && <Options events={loadedEvents} places={loadedPlaces} />}
        
        </React.Fragment>
    
    
    );
};

export default Users;