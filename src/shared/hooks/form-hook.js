import {useCallback, useReducer} from 'react';


const formReducer= (state, action) =>{
    
    
    switch (action.type) {
            
        case 'INPUT_CHANGE':
            
            let formIsValid =true;
            
            for(const inputId in state.inputs) {
                
                if(!state.inputs[inputId]){
                    
                    continue; // this means that the loop continues to the next block if the value is undefined. This condition block was added due to switching between Login and Signup, switching to Login makes name property undefined so that we do not require it to be valid before sending the form, because it does not even exist when Logging in.
                }
                
                if(inputId === action.inputId){
                    
                    formIsValid=formIsValid && action.isValid;
                } else{
                    
                    formIsValid= formIsValid && state.inputs[inputId].isValid;
                }
            }
            
            return {
                
                ...state,
                inputs: {
                    
                    ...state.inputs,
                    [action.inputId]: {value: action.value, isValid: action.isValid}
                },
                isValid: formIsValid
            };
            
        case 'SET_DATA':
            return {
                
                inputs: action.inputs,
                isValid: action.formIsValid
            }
            
        default:
            return state;
    }
};



export const useForm = (initialInputs, initialFormValidity) =>{
    
   const [formState, dispatch]=useReducer(formReducer, {
        
        inputs: initialInputs,
        isValid: initialFormValidity
    });
    
    const inputHandler= useCallback((id, value, isValid) =>{
        
       dispatch({type: 'INPUT_CHANGE', value: value, isValid: isValid, inputId: id})
        
    }, []); //this is created only once when using useCallback without any dependancies. Otherwise the function would be created again every time the component mounts. We use onInput property below as an dependancy in Input.js useEffect so creating this function over and over again would lead to infinite loop otherwise
    
    const setFormData =useCallback( (inputData, formValidity)=> {
        
        dispatch({
            
            type: 'SET_DATA',
            inputs: inputData,
            formIsValid: formValidity
        });
    }, []); //this function will not get recreated on any dependency, because we didn't set any
    
    return [formState, inputHandler, setFormData]; //we are returning these so that Place.js has access to them when using this custom hook
    
};
