import React, {useState, useContext} from 'react';

import Avatar from '../../shared/components/UIElements/Avatar';

import Card from '../../shared/components/UIElements/Card';

import Button from '../../shared/components/FormElements/Button';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';

import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import Modal from '../../shared/components/UIElements/Modal';

import {useHttpClient} from '../../shared/hooks/http-hook';

import {AuthContext} from '../../shared/context/auth-context';

import './UserItem.css'; //NOTE: this need to come after card, because otherwise there will be white padding area around the card, UserItem.css sets padding to 0

import {Link} from 'react-router-dom';



const UsersItem = props=>{

    const [showConfirmModal, setShowConfirmModal]=useState(false);

    const {isLoading, error, sendRequest, clearError}=useHttpClient();

    const auth=useContext(AuthContext);

    const deleteAccountHandler=()=>{

        setShowConfirmModal(true);
    }

    const cancelDeleteHandler= ()=>{
        
        setShowConfirmModal(false);
    };
    
    const confirmDeleteHandler= async () => {
        
        setShowConfirmModal(false);
        
        try{
            
            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/delete/${props.id}`, 'DELETE', null, {Authorization: 'Bearer '+ auth.token}); //null is for the body...we do not want to send any body with DELETE requests
            
            if(props.placeCount>0){

                await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/delete/${props.id}`, 'DELETE', null, {Authorization: 'Bearer '+ auth.token});
            }

            if(props.eventCount>0){

                await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/events/delete/${props.id}`, 'DELETE', null, {Authorization: 'Bearer '+ auth.token});
            }

            if(props.commentsCount>0){

                await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/events/comments/user/${props.id}`, 'DELETE', null, {Authorization: 'Bearer '+ auth.token});
            }

            props.onDelete(props.id); //NOTE, THERE IS NO props.onDelete at the moment, because events.js is not a children of any component that would forward this property function. Event's follows the structure of EventList.js, but EventList.js is a child of UserEvents.js... I need to create this function in events.js
            
        setTimeout(()=>{auth.logout()}, 2000);

        } catch(err){}
        
        
    };
    
    return (

        <React.Fragment>

            <ErrorModal error={error} onClear={clearError}/>

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
        
                <p>Do you want to proceed and delete your account and everything associated with it? Please note that it can't be undone thereafter</p>
            
            </Modal>

            <li className="user-item">
        
            <Card className="user-item__content">

            {isLoading && <LoadingSpinner asOverlay/>}
        
                  <div className="user-item__image">
        
                    <div className="user-item__image_center">
                        <Avatar image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.name} />
                    </div>
                    
                  </div>
        
                  <div className="user-item__info">
        
                    <h2>{props.name}</h2>
        
                     <Link to={`/${props.id}/places`} className="item_places">

                        <h3>
                            {props.placeCount} {props.placeCount === 1 ? 'Place' : 'Places'}
                        </h3>        

                    </Link>

                    <Link to={`/${props.id}/events`} className="item_events">

                        <h3>
                            {props.eventCount} {props.eventCount === 1 ? 'Event' : 'Events'}
                        </h3>

                    </Link>

                  </div>


        
            </Card>

            {auth.userId === props.id && <Button danger onClick={deleteAccountHandler}>DELETE USER ACCOUNT</Button>}
        
        </li>


        </React.Fragment>
    
    );
};

export default UsersItem;