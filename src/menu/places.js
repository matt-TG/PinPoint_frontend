import React, {useContext, useState} from 'react';

import {useHistory} from 'react-router-dom';

// import Card from '../shared/components/UIElements/Card';

import PlaceItem from '../places/components/PlaceItem';

// import Button from '../shared/components/FormElements/Button';

import {AuthContext} from '../shared/context/auth-context';

import './places.css';



const PlaceList = ()=>{
    
    const auth=useContext(AuthContext);
    
     const history=useHistory();
    
    const [loadedPlaces, setLoadedPlaces]=useState(auth.places);
    
    if(auth.places===undefined){
        
        history.push('/');
    }
    
    const placeDeleteHandler=deletedPlaceId=>{
        
        setLoadedPlaces(prevPlaces=> prevPlaces.filter(place=> place.id !== deletedPlaceId));
    }
                
                return (
                    
                    <ul className="place-list">
                    {auth.places!==undefined && loadedPlaces.map(place=> (
                
                    <PlaceItem 
                    key={place.id} 
                    id={place.id} 
                    image={place.image} 
                    title={place.title} 
                    description={place.description} 
                    address={place.address} 
                    creatorId={place.creator} 
                    coordinates={place.location}
                    onDelete={placeDeleteHandler}
                    />
                    )
                    )}
                    </ul>
                    
                    );
    
};

export default PlaceList;