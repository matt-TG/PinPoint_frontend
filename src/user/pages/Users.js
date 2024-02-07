import React, {useState, useEffect} from 'react';

import UsersList from '../components/UsersList';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';

import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import {useHttpClient} from '../../shared/hooks/http-hook';

// import {AuthContext} from '../../shared/context/auth-context';




const Users = ()=>{
    
    const {isLoading, error, sendRequest, clearError}=useHttpClient();
    
    const [loadedUsers, setLoadedUsers]=useState();
    
    // const auth=useContext(AuthContext);

    const deleteUserHandler=uid=>{

        setLoadedUsers(prevUsers=> prevUsers.filter(user=> user.id !== uid));
    }
    
//    const USERS=[{id:'u1', name:'Matt', image:'https://images.unsplash.com/photo-1577836775203-2bc537cc0ad8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60', places:3}]; //not using this since we have backend now
    
    useEffect(()=>{ //don't turn useEffect function into async function
        
        const fetchUsers=async ()=>{
            
            try{
                
                const responseData= await sendRequest(process.env.REACT_APP_BACKEND_URL+'/users'); //fetch is GET by default

//                const responseData=await response.json(); //not necessary when using custom hook, because these are handeled in the custom hook logic
//                
//                if(!response.ok){
//                    
//                    throw new Error(responseData.message);
//                }

                setLoadedUsers(responseData.users);
            
                
            } catch(err){
                
            }
            
           
        }
        
        
        
        fetchUsers();
        
    }, [sendRequest]); //we need to send this as a dependecy because it is coming outside of useEffect. With fetch this was not needed, because fetch is default browser function. Otherwise sendRequest would rerun every time the component that uses the hook reruns which would cause infinite loop
    
//    const errorHandler=()=>{
//        
//        setError(null);
//    }
    
    return(
    
        <React.Fragment>
        
        <ErrorModal error={error} onClear={clearError} />
        
        {isLoading && <div className="center">
        
            <LoadingSpinner/>    
        
        </div>}
        
        {!isLoading && loadedUsers && <UsersList items={loadedUsers} deleteHandler={deleteUserHandler}/>}
        
        </React.Fragment>
    
    
    );
};

export default Users;