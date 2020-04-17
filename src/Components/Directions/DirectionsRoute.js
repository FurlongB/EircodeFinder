import React, { useState, useEffect, createRef } from 'react';

import BackDrop from './BackDrop/BackDrop';
import classes from './Directions.css'


const FullScreenDialog = (props) => {
    const directionsDisplay = new window.google.maps.DirectionsRenderer();
    const directionsService = new window.google.maps.DirectionsService();
    const myRef = createRef();
    const [open, setOpen] = useState(true);
    useEffect(() =>{
        //startingObject();
        directionsDisplay.setPanel(myRef.current);
        console.log('myRef.current', myRef.current);
        calculateAndDisplayRoute()
        return () =>{
            console.log('Clean Up');
        }
    }, []);
   
    

  const handleClose = () =>{
    open ? setOpen(false) : setOpen(true);
  }
   

    const calculateAndDisplayRoute = ()=> {
        directionsService.route({
          origin: props.from.lat+', '+props.from.lng,
          destination: props.to.lat+', '+props.to.lng,
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            console.log('response', response)
            directionsDisplay.setDirections(response);
          } else {
            console.log('Directions request failed due to ', status);
          }
        });
    }

    return (
      <div >
        <BackDrop show={open} closed={props.clicked}/>
        <div className={classes.Modal}
            style={{transform: open ? 'translateY(0)': 'translateY(-100vh)',
                    opacity: open ? '1' : '0'
            }} ref={myRef}>
            <p className={classes.heading}>Route Details</p>
        </div> 
   
    </div>
      
    );
}


export default FullScreenDialog;