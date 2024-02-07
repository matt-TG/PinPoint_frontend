import {useState, useCallback, useRef, useEffect} from 'react';

export const useHttpClient=()=>{
    
    const [isLoading, setIsLoading] = useState(false);
    
    const [error, setError]= useState(); //initially we have no error so we leave the error value undefined
    
    const activeHttpRequests=useRef([]);
    
    
    const sendRequest=useCallback(async (url, method='GET', body=null, headers={})=>{
    
        setIsLoading(true); //React will execute this right away, because it recognizes this is asynchronous block and it has time to update the state
        
        const httpAbortCtrl=new AbortController(); //API supported by modern browsers
        
        activeHttpRequests.current.push(httpAbortCtrl);

        try{

           const response=await fetch(url, {

             method,
             body,
             headers,
             signal: httpAbortCtrl.signal
            });

           const responseData=await response.json();
            
            activeHttpRequests.current=activeHttpRequests.current.filter(reqCtrl=> reqCtrl !==httpAbortCtrl);

            if (!response.ok) { //this will catch also errors that have 400s or 500s error code (see instructions 83) )

                throw new Error(responseData.message);
            }
            
            setIsLoading(false);
            
            return responseData;

        } catch(err){

            setError(err.message);
            setIsLoading(false);
            throw err;
        }
    
      
    }, []); //with useCallback and [] as an dependency we ensure that this function never gets recreated and we don't have inefficient rerender cycles or infinite loops
    
    const clearError=()=>{
        
        setError(null);
    }
    
    useEffect(()=>{
        
        return()=>{ //cleanup function/unmount function
            
            activeHttpRequests.current.forEach(abortCtrl=>abortCtrl.abort()); //this ensures that a request is aborted if we move away from the component that triggered the request
        }
        
    }, []);
    
    return {isLoading, error, sendRequest, clearError};
};