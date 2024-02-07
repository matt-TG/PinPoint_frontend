import React, {useState} from 'react';
import { Link } from 'react-router-dom';

import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import BackDrop from '../UIElements/Backdrop';
import MainImg from '../../../assets/logo_Main3.png';
import './MainNavigation.css';



const MainNavigation = props => {
    
    const [drawerIsOpen, setDrawer]=useState(false);
    
    const openDrawer=()=>{
        
        setDrawer(true);
    }
    
    const closeDrawer=()=>{
        
        setDrawer(false);
    }
    
  return (
      
      <React.Fragment> {/* We need to insert several main level elements next to each other... this is the same what I have done with the Aux component in other React projects. Or just <></> is enough https://reactjs.org/docs/fragments.html#short-syntax */}
      
      {drawerIsOpen && <BackDrop onClick={closeDrawer}/>} {/* this means the same as {drawerIsOpen ? ... : null} */}
      
      <SideDrawer show={drawerIsOpen} onClick={closeDrawer}> 
      
        <nav className="main-navigation__drawer-nav">
        
            <NavLinks/>
        
        </nav>
      
      </SideDrawer>
      
   
      <MainHeader>
      
        <button className="main-navigation__menu-btn" onClick={openDrawer}>
      
            <span/>
            <span/>
            <span/>
      
        </button>
      
        <h1 className="main-navigation__title">
        
            <Link to="/"><img src={MainImg} alt="main_img"/></Link>
      
        </h1>
      
        <nav className="main-navigation__header-nav">
      
            <NavLinks/>
      
        </nav>
      
        
      
      </MainHeader>
      
      </React.Fragment>
      
  );
};



export default MainNavigation;
