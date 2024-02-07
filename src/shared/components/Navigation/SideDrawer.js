import React from 'react';

import ReactDOM from 'react-dom';

import {CSSTransition} from 'react-transition-group';

import './SideDrawer.css';

const SideDrawer = props => {
    
    
    const drawer=(
    
        <CSSTransition 
        in={props.show} //defines when the component will be animated
        timeout={200} 
        classNames="slide-in-left" //NOTE: not className but classNames...the classes we are referring to are in index.css
        mountOnEnter //both this and the property below define that the content should enter/exit from the DOM
        unmountOnExit
        >
        
            <aside className="side-drawer" onClick={props.onClick}>{props.children}</aside>
        
        </CSSTransition>
    );
    
  return ReactDOM.createPortal(drawer, document.getElementById('drawer-hook')); //this will tell react to render the content you define with the first argument inside the element you define in the second argument
    
};

export default SideDrawer;
