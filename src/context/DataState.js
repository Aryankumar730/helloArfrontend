import React, { useState } from "react";
import dataContext from './DataContext';


export default function DataState(props) {

    const [phoneNum, setPhoneNumber] = useState('');
    const [responseId, setResponseId] = useState('');


    async function onSubmitPhoneNum(){
       
        let newString = `+${phoneNum}`;
    
        console.log(newString);
        
    
        const response = await fetch(`https://dev.api.goongoonalo.com/v1/auth/login`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
              
            },
            body: JSON.stringify({phoneNumber: newString,})
    
          });
          
          const json = await response.json();
          console.log(json);
          setResponseId(json.requestId);
          return json.requestId;
         
    }
    
  
  
  return (
    <dataContext.Provider value={{phoneNum, setPhoneNumber, onSubmitPhoneNum, responseId}}>
      {props.children}
    </dataContext.Provider>
  )
}
