import React, {useContext} from 'react';

import {useParams, useHistory} from 'react-router-dom';

import Input from '../shared/components/FormElements/Input';

import Button from '../shared/components/FormElements/Button';

import ErrorModal from '../shared/components/UIElements/ErrorModal';

import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';

// import Card from '../shared/components/UIElements/Card';

import {VALIDATOR_MINLENGTH} from '../shared/util/validators';

import {useForm} from '../shared/hooks/form-hook';

import {useHttpClient} from '../shared/hooks/http-hook';

import {AuthContext} from '../shared/context/auth-context';


import './NewComment.css';



const NewComment = props=>{
    
    const {isLoading, error, sendRequest, clearError}=useHttpClient();
    
    // const [loadedPlace, setLoadedPlace]= useState();
    
    const eventId=useParams().eventId;
    
    const history=useHistory();
    
    const auth=useContext(AuthContext);
    
    
    const [formState, inputHandler]=useForm({
        
    comment: {
        
        value: '',
        isValid: false
    }
    
    }, false);
    
    
    
    
    const commentSubmitHandler =async event=>{
        
        event.preventDefault();
        
        
        try{
            
            const storedData=JSON.parse(localStorage.getItem('userData'));
            
            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/events/comment`, 'POST', JSON.stringify({
            
            comment: formState.inputs.comment.value,
            eventId: eventId,
            image: auth.image  || storedData.image
        }), {'Content-Type': 'application/json',
            Authorization: 'Bearer '+ auth.token});
            
            history.push(`/events`);
            
        } catch(err){
        }
        
    };
    
    
    
    return (
        
        <React.Fragment>
    
        <ErrorModal error={error} onClear={clearError}/>

        
        
        
        <form className="place-form" onSubmit={commentSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
      
            <Input 
                id="comment"
                element="textarea"
                label="Comment"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid comment"
                onInput={inputHandler}
                initialValue={null} 
                initialValid={true}
            />
                    
            <Button type="submit" disabled={!formState.isValid}>Submit comment</Button>
        
        </form>

    

        </React.Fragment>
    );
};

export default NewComment;