import React, {useEffect,useState} from 'react';
import './style.css';

import api from '../../services/api';

export default function Empresa(){
  
  const [pedidos,setPedidos] = useState([]);


  useEffect(() =>{
      fetch('http://localhost:3333/pedidos',{
        method:'GET',
        headers:{id:'601d2fe2e72b490dc4498c8d'}
      })
      .then(r => r.json())
      .then(json => {console.log(json)})
  },[])


  return(
    <div className="container">
      <div>

      </div>
    </div>
  );
}