import React, {useState, useContext} from 'react';

import Input from '../../shared/components/FormElements/Input';

import Button from '../../shared/components/FormElements/Button';

import Card from '../../shared/components/UIElements/Card';

import {VALIDATOR_MINLENGTH, VALIDATOR_EMAIL, VALIDATOR_REQUIRE} from '../../shared/util/validators';

import {useForm} from '../../shared/hooks/form-hook';

import {AuthContext} from '../../shared/context/auth-context';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';

import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import ImageUpload from '../../shared/components/FormElements/ImageUpload';

import {useHttpClient} from '../../shared/hooks/http-hook';

import './Auth.css';




const Auth = ()=>{
    
    const auth=useContext(AuthContext);
    
    const [isLoginMode, setIsLoginMode] = useState(true);
    
//    const [isLoading, setIsLoading] = useState(false);
//    
//    const [error, setError]= useState(); //initially we have no error so we leave the error value undefined
    
    const {isLoading, error, sendRequest, clearError}=useHttpClient();
    
    
    const [formState, inputHandler, setFormData]=useForm({
        
    email: {
        
        value: '',
        isValid: false
    },
    password: {
        
        value: '',
        isValid: false
    }
    
    }, false);
    
    
    
    const switchModeHandler =()=>{
        
        if(!isLoginMode){
            
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid);
            
        } else{
            
            setFormData({
                
                ...formState.inputs,
                name: {
                    
                    value: '',
                    isValid: false
                },
                image: {
                    
                    value: null,
                    isValid: false
                }
                
            }, false)
        }
        
        setIsLoginMode(prevMode => !prevMode);
    };
    
    
    
    const loginHandler=async event=>{
        
        event.preventDefault();
        
        if(isLoginMode){
                
                try{
                    
                    const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/login`, 'POST', JSON.stringify({ //see 81) about how this was done with fetch (so before using this custom hook)

                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }), {
                        'Content-Type': 'application/json'
                    }
                  
                    
                    );
                    
                    
                    auth.login(responseData.userId, responseData.token, null, responseData.image); //once we started to use authentication with tokens in the backend we changed the structure of the response the server send back
                    
                } catch(err){
                    
                    //no need to handle error here, because custom hook logic takes care of that, this just catches the error if there is any
                }
                
                
            
        } else{
            
            
            try{
                
                const formData=new FormData();
                
                formData.append('email', formState.inputs.email.value); //key value pairs
                formData.append('name', formState.inputs.name.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);
                
                
                const responseData=await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/signup`, 'POST', formData); //when you use FormData() you don't need to send over headers anymore

                
                auth.login(responseData.userId, responseData.token, null, responseData.image); //this will run only if the above code executes without an error, but the logic will be this only if the order is like this. So when you use async await syntax, every line of code is new "then" block. See user-controllers.js in backend login function to understand what is responseData.user.id (we send user property as a response and id is one of the properties in the user object)
                
            } catch (err){
                
                
            }
            
            
        }
        

    };
    
//    const errorHandler= ()=>{ //not needed when using the custom http hook, because it contains clearError function which we can then just refer down below in the ErrorModal component
//        
//        setError(null);
//    }
    
    
    return (
       
    <React.Fragment>
        
        <ErrorModal error={error} onClear={clearError}/>
        
       <Card className="authentication">
        
        {isLoading && <LoadingSpinner asOverlay />}  
        <h2>Login Required</h2>
        <hr/>{/* horizontal line */}
        <form className="place-form" onSubmit={loginHandler}>
        
        {!isLoginMode && (
        <Input 
            element="input" 
            id="name" 
            type="text" 
            label="Your Name" 
            validators={[VALIDATOR_REQUIRE()]} 
            errorText="Please enter a name." 
            onInput={inputHandler}
        />
        )
        }
            
            {!isLoginMode && <ImageUpload id="image" center onInput={inputHandler} errorText="Please provide an image" />}
        
            <Input 
                id="email" 
                element="input" 
                type="email" 
                label="E-mail" 
                validators={[VALIDATOR_EMAIL()]} 
                errorText="Please enter a valid email" 
                onInput={inputHandler}  //onInput basically has onChange functionality here
            />
            <Input 
                id="password"
                element="input"
                type="text"
                label="Password"
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText="Please enter a valid password, at least 6 characters" 
                onInput={inputHandler}
            />
                    
            <Button type="submit" disabled={!formState.isValid}>{isLoginMode? 'LOGIN': 'SIGNUP'}</Button>
        
        </form>
        <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode? 'SIGNUP': 'LOGIN'}</Button>
    </Card>

    </React.Fragment>
    );

};

export default Auth;