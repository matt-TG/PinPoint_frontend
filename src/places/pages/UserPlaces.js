import React, {useState, useEffect} from 'react';

import {useParams} from 'react-router-dom';

import PlaceList from '../components/PlaceList';

import {useHttpClient} from '../../shared/hooks/http-hook';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';

import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

//import {AuthContext} from '../../shared/context/auth-context';






const UserPlaces = ()=>{
    
    const [loadedPlaces, setLoadedPlaces]=useState();
    
//    const auth=useContext(AuthContext);
    
    const {isLoading, error, sendRequest, clearError}=useHttpClient();
    
    const userId=useParams().userId; //this accesses the property userId (:userId) we have for this component in App.js 
    
//    const loadedPlaces=DUMMY_PLACES.filter(place=> place.creator === userId); //we give value to userId in UserItem.js
    
    useEffect( ()=>{
        
       const fetchPlaces=async ()=>{
           
            try{
                
                const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);
                
                setLoadedPlaces(responseData.places);
                
            } catch(err){
                
               
            }
           
       }
             
        fetchPlaces();     
        
    }, [sendRequest, userId]);
    
    
    
    const placeDeleteHandler=deletedPlaceId=>{
        
        setLoadedPlaces(prevPlaces=> prevPlaces.filter(place=> place.id !== deletedPlaceId));
    }
    
    
    return(
    
        <React.Fragment>
        
            <ErrorModal error={error} onClear={clearError} />
        
            {isLoading && (
    
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            
            
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler} />}
        
        </React.Fragment>
    
    
    );
        
        
};

export default UserPlaces;