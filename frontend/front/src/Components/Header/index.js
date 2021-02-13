import React from 'react';
import {Link} from 'react-router-dom';

import icon from '../../assets/icon.jpg';

import './style.css';
function Header(){
  return(
    <header className="container">
        <Link>
          <img className="logo" src={icon} alt="Home"/>
        </Link>

      <nav>
        <ul className="menu">
        <Link to="/"><li>Home</li></Link>
        <Link to="/empresa"><li>Sou Empresa</li></Link>
        <Link to="/peça"><li>Preciso de uma peça</li></Link>
        <Link to="/serviço"> <li>Preciso de um serviço</li></Link>
        </ul>
      </nav>
    </header>
  );
}
export default Header;