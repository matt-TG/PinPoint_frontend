import React, {useContext} from 'react';

import {NavLink} from 'react-router-dom';

import {AuthContext} from '../../context/auth-context';

import './NavLinks.css';



const NavLinks = props => {
    
    const auth=useContext(AuthContext); //returns the object inside value property of AuthContext.Provider (in App.js)
    
  return (
   
      <ul className="nav-links">
      
        <li>
      
            <NavLink to="/" exact>
                
                MENU
      
            </NavLink>
      
        </li>
      
        <li>
      
            <NavLink to="/users" exact>
                
                ALL USERS
      
            </NavLink>
      
        </li>
      
      
      {auth.isLoggedIn && ( //isLoggedIn is one of the state properties we set up in auth-context.js
      <li>
      
            <NavLink to={`/${auth.userId}/own`}>
      
                OWN
            
            </NavLink>
      
        </li>
      )}

        {auth.isLoggedIn && (
        <li>
      
            <NavLink to="/events/new">
      
               ADD EVENT
            
            </NavLink>
      
        </li>
       )}
      
       {auth.isLoggedIn && (
        <li>
      
            <NavLink to="/places/new">
      
               ADD PLACE
            
            </NavLink>
      
        </li>
       )}
      
        {!auth.isLoggedIn? (
        <li>
      
            <NavLink to="/auth">
      
               AUTHENTICATION
            
            </NavLink>
      
        </li>) : (
        
            <li>
      
            <NavLink to="/" onClick={auth.logout}>
      
               LOGOUT
            
            </NavLink>
      
            </li>
        )
        }
      
      
      </ul>
      
  );
};

export default NavLinks;
