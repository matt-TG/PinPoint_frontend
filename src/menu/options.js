//This was UsersList.js originally

import React from 'react';

import MenuImg from './menuImg';


// import EventItem from './event';

// import PlaceItem from '../places/components/PlaceItem';

import Card from '../shared/components/UIElements/Card';

import {Link} from 'react-router-dom';

import './options.css';




const Options = props =>{
    
    
    const infoArea=<div className="info_container">
        
            <div className="center_box">
        
                <div className="info_box">

                    <h2 className="headline">Welcome to the PinPoint</h2>

                </div>


                <div className="info_box">

                    <h3>Source for user recommended places around the world</h3>

                    <h3>Source for user created events</h3>

                </div>
        
            </div>
        
               
        
        </div>;
    
    if(!props.events || !props.places){
        
        return (
        <div className="center">
            <Card>
                <h2>No events or places found.</h2>
            </Card>
        </div>
            );
    }
    
    
    if(props.events.length === 0 && props.places.length === 0){
        
        
        return (
            <React.Fragment>
            <div className="center">
                <Card>
                    <h2>No events or places found.</h2>
                </Card>
            </div>
            {infoArea}
            </React.Fragment>
            );
    }
    
    if(props.events.length === 0 && props.places.length > 0){
        
        
        return (
            
        <React.Fragment>
            
        <div className="center flex">
            
            <div className="options">
        
            <div className="LinkHolder">
                <Link to="/places" className="Link">See {props.places.length} {props.places.length ===1? "Place": "Places"}
        
                <MenuImg image="place"/>
                </Link>
            </div>
        
        </div>
            
        <Card>
            <h2>No events found.</h2>
        </Card>
            
        </div>
            
            
            {infoArea}
            
        </React.Fragment>
            );
    }
    
    if(props.events.length > 0 && props.places.length === 0){
        
        
        return (
            
            <React.Fragment>
            
        <div className="center flex">
            
            <Card>
                <h2>No places found.</h2>
            </Card>
            
            <div className="options">
        
            <div className="LinkHolder">
                <Link to="/events" className="Link">See {props.events.length} {props.events.length ===1? "Event": "Events"}
        
                <MenuImg image="event"/>
                </Link>
            </div>
        
        </div>
            
        </div>
            
            
        {infoArea}
            
            </React.Fragment>
            );
    }
    
    return (
        
        <React.Fragment>
        
    <div className="center flex">
        
        <div className="options">
        
            <div className="LinkHolder">
                <Link to="/places" className="Link">See {props.places.length} {props.places.length ===1? "Place": "Places"}
        
                <MenuImg image="place"/>
                </Link>
            </div>    
        
        </div>
        
        <div className="options">
        
            <div className="LinkHolder">
                <Link to="/events" className="Link">See {props.events.length} {props.events.length ===1? "Event": "Events"}
        
                <MenuImg image="event"/>
                </Link>
            </div>
        
        </div>
        
    </div>
        
        
        
        {infoArea}
        
    </React.Fragment>
    

    );

};

export default Options;