import React, {useContext, useState, useCallback} from 'react';

import {useHistory} from 'react-router-dom';

// import Card from '../shared/components/UIElements/Card';

import EventItem from './event';

// import Button from '../shared/components/FormElements/Button';

import {AuthContext} from '../shared/context/auth-context';

import {useHttpClient} from '../shared/hooks/http-hook';

import ErrorModal from '../shared/components/UIElements/ErrorModal';

import './events.css';



const EventsList = ()=>{
    
    const auth=useContext(AuthContext);
    
    const [loadedEvents, setLoadedEvents]=useState(auth.events);
    
    const [loadedComments, setLoadedComments]=useState();
    
    const {error, sendRequest, clearError}=useHttpClient();
    
    const history=useHistory();
    
    
    const eventDeleteHandler=deletedEventId=>{
        
        setLoadedEvents(prevEvents=> prevEvents.filter(event=> event.id !== deletedEventId));
    }
    
    if(auth.events===undefined){
        
        history.push('/');
    }
    
    
    const fetchCommentsHandler=useCallback(async ()=>{
           
            try{
                
                if(!loadedComments){
                    
                    const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/events/comment/all`);
            
                
                    setLoadedComments(responseData.comments);
                }
                
                
                
            } catch(err){

            }
           
       }, []);
    
    const commentDeleteHandler=deletedcommentId=>{
        
        setLoadedComments(prevComments=> prevComments.filter(comment=> comment.id !== deletedcommentId));
    }
                
                return (
                    
                    <React.Fragment>
                    
                        <ErrorModal error={error} onClear={clearError}/>

                        <ul className="place-list">
                        {auth.events!==undefined && loadedEvents.map(event=> (

                        <EventItem 
                        key={event.id}
                        id={event.id} 
                        image={event.image} 
                        title={event.title} 
                        description={event.description} 
                        address={event.address} 
                        creatorId={event.creator} 
                        coordinates={event.location}
                        onDelete={eventDeleteHandler}
                        link={event.link}
                        date={event.date}
                        fetchComments={fetchCommentsHandler}
                        loadedComments={loadedComments}
                        commentDelete={commentDeleteHandler}
                        />
                        )
                        )}
                        </ul>

                    </React.Fragment>
                    
                    );
    
};

export default EventsList;