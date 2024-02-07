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

//const DUMMY_PLACES=[{//not used anymore since we use database now
//    id:'p1',
//    title:'Empire State Building',
//    description: 'One of the most famous skyscrapesrs in the world',
//    imageUrl:'https://www.attractionticketsdirect.de/sites/default/files/imagecache/472x352/empire_state_building5.jpg',
//    address:'20 W 34th St, New York, NY 10001, United States',
//    location:{
//        
//        lat: 40.7484405,
//        lng: -73.9878584
//    },
//    creator: 'u1'}, {
//    id:'p2',
//    title:'Emp. State Building',
//    description: 'One of the most famous skyscrapesrs in the world',
//    imageUrl:'https://www.attractionticketsdirect.de/sites/default/files/imagecache/472x352/empire_state_building5.jpg',
//    address:'20 W 34th St, New York, NY 10001, United States',
//    location:{
//        
//        lat: 40.7484405,
//        lng: -73.9878584
//    },
//    creator: 'u2'
//    }
//    ];


const UpdatePlace = props=>{
    
    const {isLoading, error, sendRequest, clearError}=useHttpClient();
    
    const [loadedPlace, setLoadedPlace]= useState();
    
    const placeId=useParams().placeId;
    
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
        
        const fetchPlace=async ()=>{
            
            try{
               
                const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`);
            
                setLoadedPlace(responseData.place);
                
                setFormData({

                title: {

                    value: responseData.place.title,
                    isValid: true
                },
                description: {

                    value: responseData.place.description,
                    isValid: true
                }
            });
                
            } catch(err){
                
                
            }
            
        }
        
        fetchPlace();
        
    }, [sendRequest, placeId, setFormData]);
    
    
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
    
    
    if(!loadedPlace && !error){ //identifiedPlace if not using database
        
        return (
        
            <div className="center">
                <Card>
                    <h2>Could not find place!</h2>
                </Card>
            </div>
        
        );
    }
    
    
    
    
    const placeUpdateSubmitHandler =async event=>{
        
        event.preventDefault();
        
        
        try{
            
            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`, 'PATCH', JSON.stringify({
            
            title: formState.inputs.title.value, 
            description: formState.inputs.description.value
        }), {'Content-Type': 'application/json',
            Authorization: 'Bearer '+ auth.token});
            
            history.push(`/${auth.userId}/places`);
            
        } catch(err){
            
            
        }
        
    };
    
    
    
    return (
        
        <React.Fragment>
    
        <ErrorModal error={error} onClear={clearError}/>
        
        {!isLoading && loadedPlace && (
        
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        
            <Input 
                id="title" 
                element="input" 
                type="text" 
                label="Title" 
                validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a valid title" 
                onInput={inputHandler}
                initialValue={loadedPlace.title} 
                initialValid={true}
            />
            <Input 
                id="description"
                element="textarea"
                label="Textarea"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid title" 
                onInput={inputHandler}
                initialValue={loadedPlace.description} 
                initialValid={true}
            />
                    
            <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
        
        </form>
        )}

        </React.Fragment>
    );
};

export default UpdatePlace;