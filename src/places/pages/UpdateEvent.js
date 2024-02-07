import React, {useEffect, useState, useContext} from 'react';

import {useParams, useHistory} from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';

import Button from '../../shared/components/FormElements/Button';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';

import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import Card from '../../shared/components/UIElements/Card';

import {VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH} from '../../shared/util/validators';

import {useForm} from '../../shared/hooks/form-hook';

import {useHttpClient} from '../../shared/hooks/http-hook';

import {AuthContext} from '../../shared/context/auth-context';

import './PlaceForm.css';




const UpdateEvent = props=>{
    
    
    const {isLoading, error, sendRequest, clearError}=useHttpClient();
    
    const [loadedEvent, setLoadedEvent]= useState();
    
    const eventId=useParams().eventId;
    
    const history=useHistory();
    
    const auth=useContext(AuthContext);
    
    
    const [formState, inputHandler, setFormData]=useForm({
        
    title: {
        
        value: '',
        isValid: false
    },
    description: {
        
        value: '',
        isValid: false
    }
    
    }, false);
    
    
    
    useEffect(()=>{
        
        const fetchEvent=async ()=>{
            
            try{
               
                const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/events/${eventId}`);
            
                setLoadedEvent(responseData.event);
                
                setFormData({

                title: {

                    value: responseData.event.title,
                    isValid: true
                },
                description: {

                    value: responseData.event.description,
                    isValid: true
                }
            });
                
            } catch(err){
                
                
            }
            
        }
        
        fetchEvent();
        
    }, [sendRequest, eventId, setFormData]);
    
    
//    const identifiedPlace=DUMMY_PLACES.find(p=> p.id === placeId); //not using with database
    
    
//    useEffect(()=>{ //not using with database
//        
//        if(identifiedPlace){
//            
//            setFormData({
//
//                title: {
//
//                    value: identifiedPlace.title,
//                    isValid: true
//                },
//                description: {
//
//                    value: identifiedPlace.description,
//                    isValid: true
//                }
//            });
//
//        }
//        
//       
//        setIsLoading(false);
//        
//    }, [setFormData, identifiedPlace])
    
   if(isLoading){ //make sure this comes before the code block below otherwise the page will initialize weirdly
        
        return (
        
            <div className="center">
                <LoadingSpinner asOverlay />
            </div>
        
        );
    } 
    
    
    if(!loadedEvent && !error){ //identifiedPlace if not using database
        
        return (
        
            <div className="center">
                <Card>
                    <h2>Could not find event!</h2>
                </Card>
            </div>
        
        );
    }
    
    
    
    
    const EventUpdateSubmitHandler =async event=>{
        
        event.preventDefault();
        
        
        try{
            
            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/events/${eventId}`, 'PATCH', JSON.stringify({
            
            title: formState.inputs.title.value, 
            description: formState.inputs.description.value
        }), {'Content-Type': 'application/json',
            Authorization: 'Bearer '+ auth.token});
            
            history.push(`/${auth.userId}/events`);
            
        } catch(err){
            
            
        }
        
    };
    
    
    
    return (
        
        <React.Fragment>
    
        <ErrorModal error={error} onClear={clearError}/>
        
        {!isLoading && loadedEvent && (
        
        <form className="place-form" onSubmit={EventUpdateSubmitHandler}>
        
            <Input 
                id="title" 
                element="input" 
                type="text" 
                label="Title" 
                validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a valid title" 
                onInput={inputHandler}
                initialValue={loadedEvent.title} 
                initialValid={true}
            />
            <Input 
                id="description"
                element="textarea"
                label="Textarea"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid title" 
                onInput={inputHandler}
                initialValue={loadedEvent.description} 
                initialValid={true}
            />
                    
            <Button type="submit" disabled={!formState.isValid}>UPDATE Event</Button>
        
        </form>
        )}

        </React.Fragment>
    );
};

export default UpdateEvent;