import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';

import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './PlaceForm.css';

const NewEvent = () => {

    
  const auth = useContext(AuthContext);
    
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
    
    
  const [formState, inputHandler] = useForm( //REACT recognizes this being a hook becuase of the naming convention, hooks start with "use"...this means that when the state is changed. React knows to rerender the component using the state. Note that we can use object construction here, because we return state and the dispatch function in form-hook-js
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      address: {
        value: '',
        isValid: false
      },
        link: {
        value: '',
        isValid: false
      },
        date: {
        value: '',
        isValid: false
      },
    image: {
        
        value: null,
        isValid: false
    }
    },
    false
  );

  const history = useHistory();

    
  const placeSubmitHandler = async event => {
      
    event.preventDefault();
      
    try {
        
        const formData=new FormData();
                
        formData.append('title', formState.inputs.title.value); //key value pairs
        formData.append('description', formState.inputs.description.value);
        formData.append('address', formState.inputs.address.value);
        formData.append('link', formState.inputs.link.value);
        formData.append('date', formState.inputs.date.value);
//        formData.append('creator', auth.userId); //we are not using this in the backend anymore...see explanation in backend places-controllers.js createPlace Middleware (line 147 when this was written)
        formData.append('image', formState.inputs.image.value);
        
        
//      await sendRequest( //this when not sending an image
//        'http://localhost:5000/api/places',
//        'POST',
//        JSON.stringify({
//          title: formState.inputs.title.value,
//          description: formState.inputs.description.value,
//          address: formState.inputs.address.value,
//          creator: auth.userId
//        }),
//        { 'Content-Type': 'application/json' }
//      );
        
        
        await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/events`, // process.env.REACT_APP_BACKEND_URL comes from .env file, see instructions 101)
        'POST',
        formData,
        {Authorization: 'Bearer '+ auth.token} //this, because we have set in the backend that the request needs to have a header with Authorization property which have such an value
      );
        
      history.push('/'); //this is possible with useHistory hook (see above)
        
    } catch (err) {}
  };

  return (
      
    <React.Fragment>
      
      <ErrorModal error={error} onClear={clearError} />
      
      <form className="place-form" onSubmit={placeSubmitHandler}>
      
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />   
        <Input
          id="date"
          element="input"
            type="date"
          label="Date"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid date."
          onInput={inputHandler}
        />
        <Input
          id="link"
          element="input"
          label="Link"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a url link to the event."
          onInput={inputHandler}
        />
              
        <ImageUpload id="image" onInput={inputHandler} errorText="Please provide an image" />
              
        <Button type="submit" disabled={!formState.isValid}>
          ADD EVENT
        </Button>

      </form>

    </React.Fragment>
  );
};

export default NewEvent;
