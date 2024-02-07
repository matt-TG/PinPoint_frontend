import React, {useState, useContext} from 'react';

import Card from '../shared/components/UIElements/Card';

import Button from '../shared/components/FormElements/Button';

import Avatar from '../shared/components/UIElements/Avatar';

import ErrorModal from '../shared/components/UIElements/ErrorModal';

import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';

import Modal from '../shared/components/UIElements/Modal';

// import Map from '../shared/components/UIElements/Map';

import {AuthContext} from '../shared/context/auth-context';

import {useHttpClient} from '../shared/hooks/http-hook';

import './comment.css';



const CommentItem = props=>{

    const auth=useContext(AuthContext);
    
    const [showConfirmModal, setShowConfirmModal]=useState(false);
    
    const {isLoading, error, sendRequest, clearError}=useHttpClient();
    
    
    
    
    const showDeleteWarningHandler= ()=>{
        
        setShowConfirmModal(true);
    };
    
    
    const cancelDeleteHandler= ()=>{
        
        setShowConfirmModal(false);
    };
    
    const confirmDeleteHandler= async () => {
        
        setShowConfirmModal(false);
        
        try{
            
            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/events/comment/${props.id}`, 'DELETE', null, {Authorization: 'Bearer '+ auth.token}); //null is for the body...we do not want to send any body with DELETE requests
            
//            props.onDelete(props.id); //this is from old code probably
            
            props.deleteHandler(props.id);
            
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
        
                <p>Do you want to proceed and delete this comment? Please note that it can't be undone thereafter</p>
            
            </Modal>
        
            
            <li className="place-item">

                <Card className="place-item__content">
                    
                {isLoading && <LoadingSpinner asOverlay/>}

            
                <div className="place-item__info">
        
                    <div className="user-item__image">
        
                        <div className="user-item__image_center">
                            <Avatar image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt="profile_pic" />
                        </div>
                    
                    </div>
        
                    <p>By: <b>{props.postedBy}</b> Posted: <b>{props.date}</b></p>

                    <h3>comment: {props.comment}</h3>

                </div>

                <div className="place-item__actions">

                {auth.userId === props.creatorId && <Button to={`/events/comment/mod/${props.id}`}>EDIT</Button>}
                {auth.userId === props.creatorId && <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>}

                </div>

                </Card>


            </li>
            
        </React.Fragment>

        );

};

export default CommentItem;