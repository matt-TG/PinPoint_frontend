import React, {useRef, useState, useEffect} from 'react';

import Button from './Button';

import './ImageUpload.css';



const ImageUpload= props =>{
    
    const [file, setFile]=useState();
    
    const [previewUrl, setPreviewUrl]=useState();
    
    const [isValid, setIsValid]=useState(false);
    
    
    const filePickerRef= useRef(); //https://reactjs.org/docs/hooks-reference.html#useref. We basically use this so we do not need to show the ugly default file picker element, but instead we are using our custom Button and clicking that will actually click the file picker input element on the background. To have access to that click() method of the file picker element, we need to create a reference which survives rerender cycles of the component.
    
    useEffect(()=>{
        
        if (!file){
            
            return;
        }
        
        const fileReader = new FileReader(); //this is default browser method
        
        fileReader.onload=()=>{ //this function executes when the reading of the file down below is done
            
            setPreviewUrl(fileReader.result); //result property contains the result url we receive
        }
        
        fileReader.readAsDataURL(file); //doesn't give us a Promise, so we need to use onLoad method (default) above
        
    }, [file]);
    

    
    
    const pickedHandler= event=>{
        
        let pickedFile;
        
        let fileIsValid=isValid;
        
        if (event.target.files && event.target.files.length===1){ //files is a default property of native file picker element
            
            pickedFile=event.target.files[0];
            
            setFile(pickedFile);
            
            setIsValid(true); //when we update the state it doesn't update immidiately, but waits in a line. So we can't pass "isValid" state in the onInput method down below, because it would still be the old state value
            
            fileIsValid=true;
            
        } else{
            
            setIsValid(false);
            fileIsValid=false;
        }
        
        props.onInput(props.id, pickedFile, fileIsValid);
    }
    
    const pickImageHandler=()=>{
       
        filePickerRef.current.click();
    };
    
    return (
    
        <div className='form-control'>
        
            <input 
            id={props.id}
            ref={filePickerRef}
            style={{display: 'none'}}
            type='file' 
            accept=".jpg, .png, .jpeg"
            onChange={pickedHandler} /> {/* accept is a default property for input elements with type "file" */}

            <div className={`image-upload ${props.center && 'center'}`}>

                <div className="image-upload__preview">

                    {previewUrl && <img src={previewUrl} alt="Preview" />}

                    {!previewUrl && <p>Please pick an image</p>}

                </div>

                <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>

            </div>

            {!isValid && <p>{props.error}</p>}

        </div>
    
    );
}

export default ImageUpload;