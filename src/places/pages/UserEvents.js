import React, {useState, useEffect} from 'react';

import {useParams} from 'react-router-dom';

import EventList from '../components/EventList';

import {useHttpClient} from '../../shared/hooks/http-hook';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';

import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

//import {AuthContext} from '../../shared/context/auth-context';



const UserEvents = ()=>{
    
    const [loadedEvents, setLoadedEvents]=useState();
    
//    const auth=useContext(AuthContext);
    
    const {isLoading, error, sendRequest, clearError}=useHttpClient();
    
    const userId=useParams().userId; //this accesses the property userId (:userId) we have for this component in App.js 
    
//    const loadedPlaces=DUMMY_PLACES.filter(place=> place.creator === userId); //we give value to userId in UserItem.js
    
    useEffect( ()=>{
        
       const fetchEvents=async ()=>{
           
            try{
                
                const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/events/user/${userId}`);
                
                setLoadedEvents(responseData.events);
                
            } catch(err){
                
               
            }
           
       }
             
        fetchEvents();     
        
    }, [sendRequest, userId]);
    
    
    
    const eventDeleteHandler=deletedEventId=>{
        
        setLoadedEvents(prevEvents=> prevEvents.filter(event=> event.id !== deletedEventId));
    }
    
    
    return(
    
        <React.Fragment>
        
            <ErrorModal error={error} onClear={clearError} />
        
            {isLoading && (
    
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
        
            {!isLoading && loadedEvents && <EventList items={loadedEvents} onDeleteEvent={eventDeleteHandler} />}
        
        </React.Fragment>
    
    
    );
        
        
};

export default UserEvents;