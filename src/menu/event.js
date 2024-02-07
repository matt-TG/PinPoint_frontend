import React, {useState, useContext, useEffect} from 'react';

import Card from '../shared/components/UIElements/Card';

import Button from '../shared/components/FormElements/Button';

import ErrorModal from '../shared/components/UIElements/ErrorModal';

import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';

import Modal from '../shared/components/UIElements/Modal';

import Map from '../shared/components/UIElements/Map';

import {AuthContext} from '../shared/context/auth-context';

import {useHttpClient} from '../shared/hooks/http-hook';

import Comments from '../comments/comments';

import './event.css';



const EventItem = props=>{

    
    const date=props.date;
    const dateMod=date.substr(0,10);
    
    const {fetchComments}=props;
    
    
    const [showMap, setShowMap]=useState(false);
    
//    const [loadedComments, setLoadedComments]=useState();
    
    const [openComments, setOpenComments]=useState(false);
    

    
    const auth=useContext(AuthContext);
    
    const [showConfirmModal, setShowConfirmModal]=useState(false);
    
    const {isLoading, error, sendRequest, clearError}=useHttpClient();
    
    
    useEffect( ()=>{

        fetchComments();     
        
    }, [fetchComments]);
    
    
    const openMapHandler=()=>setShowMap(true);
    
    const closeMapHandler=()=>setShowMap(false);
    
    
    const showDeleteWarningHandler= ()=>{
        
        setShowConfirmModal(true);
    };
    
    
    const cancelDeleteHandler= ()=>{
        
        setShowConfirmModal(false);
    };
    
    const confirmDeleteHandler= async () => {
        
        setShowConfirmModal(false);
        
        try{
            
            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/events/${props.id}`, 'DELETE', null, {Authorization: 'Bearer '+ auth.token}); //null is for the body...we do not want to send any body with DELETE requests
            
            
            if(props.loadedComments.length>0){
                
              await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/events/comments/${props.id}`, 'DELETE', null, {Authorization: 'Bearer '+ auth.token}); //this will delete all the comments related to the deleted event  
            }
            
            
            props.onDelete(props.id); //NOTE, THERE IS NO props.onDelete at the moment, because events.js is not a children of any component that would forward this property function. Event's follows the structure of EventList.js, but EventList.js is a child of UserEvents.js... I need to create this function in events.js
            
        } catch(err){}
        
        
    };
    
    const openCommentsHandler=()=>{
        
        if(!openComments){
            
            setOpenComments(true);
            
        } else{
            
            setOpenComments(false);
        }
        
    }


//    const commentDeleteHandler=deletedcommentId=>{ //in events.js now (otherwise the screen wouldn't rerender when a comment is deleted)
//        
//        setLoadedComments(prevComments=> prevComments.filter(comment=> comment.id !== deletedcommentId));
//    }
    
    
    return (
        
        
        
        <React.Fragment>
    
            <ErrorModal error={error} onClear={clearError}/>
        
            <Modal 
            show={showMap} 
            onCancel={closeMapHandler} 
            header={props.address} 
            contentClass="place-item__modal-content" 
            footerClass="place-item__modal-actions" 
            footer={<Button onClick={closeMapHandler}>CLOSE</Button>}>
        
                <div className="map-container">
        
                    <Map center={props.coordinates} zoom={16}/> {/* coordinates must be in this form: {lat: -34.397, lng: 150.644} which we have in this project in props.coordinates (userPlaces.js) */}
        
                </div>    
        
            </Modal>
    
            <Modal
                show={showConfirmModal}
                onCancel={cancelDeleteHandler}
                header="Are You Sure" 
                footerClass="place-item__modal-actions" 
                footer={
                <React.Fragment>
                
                    <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
                    <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
                
                </React.Fragment>
            }>
        
                <p>Do you want to proceed and delete this event? Please note that it can't be undone thereafter</p>
            
            </Modal>
            
            <li className="place-item">

                <Card className="place-item__content">
                    
                {isLoading && <LoadingSpinner asOverlay/>}

                <div className="place-item__image">

                    <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} />

                </div>

                <div className="place-item__info">

                    <h2>{props.title}</h2>
                    <h3>{props.address}</h3>
                    <p>{props.description}</p>
                    <p>{dateMod}</p>
                
                    <a href={props.link} target="_blank" rel="noopener noreferrer">Visit event webpage</a>

                </div>

                <div className="place-item__actions">

                    <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                {auth.userId === props.creatorId && <Button to={`/events/${props.id}`}>EDIT</Button>}
                {auth.userId === props.creatorId && <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>}
                {auth.userId && <Button to={`/events/comment/new/${props.id}`}>COMMENT</Button>}

                </div>

                </Card>
                

            </li>

        {props.loadedComments && !openComments && <button onClick={openCommentsHandler} className="comment_button">{props.loadedComments.filter(comment=>comment.event===props.id).length} {props.loadedComments.filter(comment=>comment.event===props.id).length===1?'comment':'comments'}</button>}

        {props.loadedComments && openComments && <Comments comments={props.loadedComments.filter(comment=>comment.event===props.id)} setOpenComments={openCommentsHandler} deleteHandler={props.commentDelete}/>}
            
        </React.Fragment>

        );

};

export default EventItem;