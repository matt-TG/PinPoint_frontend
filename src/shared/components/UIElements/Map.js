import React, {useRef, useEffect} from 'react';

import './Map.css';


const Map= props=>{
    
    const mapRef=useRef();
    
    const {center, zoom}=props;
    
    useEffect(()=>{ //useEffect runs only after rendering has been done, so ref property has been established at that point which is the reason we needed to place this code into useEffect
        
        const map= new window.google.maps.Map(mapRef.current, {
        
        center: center,
        zoom: zoom
    });
    
    new window.google.maps.Marker({position: center, map: map});
        
    }, [center, zoom]);
    
    
    
    
    return <div ref={mapRef} className={`map ${props.className}`} style={props.style}></div>
};
    
export default Map;