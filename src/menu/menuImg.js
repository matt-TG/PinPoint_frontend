import React from 'react';

import EventImg from '../assets/event.jpg';

import PlaceImg from '../assets/place.jpg';

import './menuImg.css';

const MenuImg=props=>{
    
    let image;
    
    if(props.image === 'event'){
        
        image=EventImg;
    }
        
    if(props.image === 'place'){
        
        image=PlaceImg;
    }
    
    return(
        
        <div className="img_holder">
        
        <img src={image} alt='placeholder' className="image"/>
        
        </div>
    
    );
}
           
export default MenuImg;