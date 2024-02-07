import React from 'react';

import Card from '../../shared/components/UIElements/Card';

import EventItem from './EventItem';

import Button from '../../shared/components/FormElements/Button';

//import {useHttpClient} from '../../shared/hooks/http-hook';

import './PlaceList.css';



const EventList = props=>{
    
    
if(props.items.length === 0){
        
        return (
            
            <div className="place-list center">
            
            <Card>
                <h2>No events found. Maybe create one?
                </h2>
                <Button to='/events/new'>Share event</Button>
            </Card>
        </div>
            
        );
    }

                
                return (
                    
                    <ul className="place-list">
                    {props.items.map(event=> (
                
                    <EventItem 
                    key={event.id} 
                    id={event.id} 
                    image={event.image} 
                    title={event.title} 
                    description={event.description} 
                    address={event.address} 
                    creatorId={event.creator} 
                    coordinates={event.location}
                    onDelete={props.onDeleteEvent}
                    link={event.link}
                    date={event.date}
                    />
                    )
                    )}
                    </ul>
                    
                    );
    
};

export default EventList;