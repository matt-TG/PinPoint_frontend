import React, {useEffect, useState, useContext} from 'react';

import {useParams, useHistory} from 'react-router-dom';

import Input from '../shared/components/FormElements/Input';

import Button from '../shared/components/FormElements/Button';

import ErrorModal from '../shared/components/UIElements/ErrorModal';

import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';

import Card from '../shared/components/UIElements/Card';

import {VALIDATOR_MINLENGTH} from '../shared/util/validators';

import {useForm} from '../shared/hooks/form-hook';

import {useHttpClient} from '../shared/hooks/http-hook';

import {AuthContext} from '../shared/context/auth-context';


import './updateComment.css';



const UpdateComment = props=>{
    
    const {isLoading, error, sendRequest, clearError}=useHttpClient();
    
    const [loadedComment, setLoadedComment]= useState();
    
    const commentId=useParams().commentId;
    
    const history=useHistory();
    
    const auth=useContext(AuthContext);
    
    
    const [formState, inputHandler, setFormData]=useForm({
        
    comment: {
        
        value: '',
        isValid: false
    }
    
    }, false);
    
    
    
    useEffect(()=>{
        
        const fetchComment=async ()=>{
            
            try{
               
                const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/events/comment/one/${commentId}`);
                
                setLoadedComment(responseData.comment);
                
                setFormData({

                comment: {

                    value: responseData.comment.comment,
                    isValid: true
                }
            });
                
            } catch(err){
                
                
            }
            
        }
        
        fetchComment();
        
    }, [sendRequest, commentId, setFormData]);
    

    
   if(isLoading){ //make sure this comes before the code block below otherwise the page will initialize weirdly
        
        return (
        
            <div className="center">
                <LoadingSpinner asOverlay />
            </div>
        
        );
    } 
    
    
    if(!loadedComment && !error){ //identifiedPlace if not using database
        
        return (
        
            <div className="center">
                <Card>
                    <h2>Could not find comment!</h2>
                </Card>
            </div>
        
        );
    }
    
    
    
    
    const commentUpdateSubmitHandler =async event=>{
        
        event.preventDefault();
        
        
        try{
            
            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/events/comment/${commentId}`, 'PATCH', JSON.stringify({
            
            comment: formState.inputs.comment.value
        }), {'Content-Type': 'application/json',
            Authorization: 'Bearer '+ auth.token});
            
            history.push(`/events`);
            
        } catch(err){
            
            
        }
        
    };
    
    
    
    return (
        
        <React.Fragment>
    
        <ErrorModal error={error} onClear={clearError}/>
        
        {!isLoading && loadedComment && (
        
        <form className="place-form" onSubmit={commentUpdateSubmitHandler}>
        
          
            <Input 
                id="comment"
                element="textarea"
                label="Comment"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid comment" 
                onInput={inputHandler}
                initialValue={loadedComment.comment} 
                initialValid={true}
            />
                    
            <Button type="submit" disabled={!formState.isValid}>UPDATE COMMENT</Button>
        
        </form>
        )}

        </React.Fragment>
    );
};

export default UpdateComment;