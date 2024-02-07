import React, {useReducer, useEffect} from 'react';

import {validate} from '../../util/validators';

import './Input.css';


const inputReducer=(state, action) =>{
    
    switch (action.type){
            
        case 'CHANGE':
            return {
                
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            };
            
        case 'TOUCH':
            return {
                
                ...state,
                isTouched: true
            }
            
        default:
            return state;
    }
};


const Input= props=>{
    
    const [inputState, dispatch]=useReducer(inputReducer, {value: props.initialValue || '', isValid: props.initialValid || false, isTouched: false}); //second argument is initial state
    
    const {id, onInput}= props;
    const {value, isValid}= inputState;
    
    useEffect(()=>{
        
       onInput(id, inputState.value, inputState.isValid);
        
    }, [id, value, isValid, onInput, inputState.value, inputState.isValid]);
    
    const changeHandler=event=>{
        
        dispatch({type:'CHANGE', val: event.target.value, validators: props.validators}); //the argument is the action object the reducer receives
    };
    
    const onTouchHandler=()=>{
        
       dispatch({
           
          type: 'TOUCH' 
       });
    };
    
    const element=props.element === 'input' ? 
          
    <input id={props.id} 
    type={props.type} 
    placeholder={props.placeholder} 
    onChange={changeHandler} 
    value={inputState.value}
    onBlur={onTouchHandler}
    /> : 
    
    <textarea id={props.id} 
    rows={props.rows || 3} 
    onChange={changeHandler} 
    value={inputState.value}
    onBlur={onTouchHandler}
    />
    // {props.rows || 3} means that rows property value will be 3 if props.rows is not defined
    
   return <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
       
        <label htmlFor={props.id}>{props.label}</label> {/* htmlFor is React JSX equivalent to just "for" in normal html */}
        {element}
        
       {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
       </div>
};

export default Input;