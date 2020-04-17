import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const matrixServices = (props) =>{
  const [details, getDetails] = useState('');
  const [open, setOpen] = useState(true);
  useEffect(() =>{
    getMatrix();
   return () =>{
        console.log('Clean Up');
    }
 }, []);

 const handleClose = () =>{
  setOpen(false);
}


  const getMatrix = () =>{
    const origin = {lat: props.from.lat, lng: props.from.lng};
    const destination = {lat: props.to.lat, lng: props.to.lng};
    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      travelMode: 'DRIVING',
      unitSystem: window.google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, function(response, status) {
      if (status !== 'OK') {
        console.log('Error was: ', status);
        getDetails('Error was: '+ status) ;
      } else {
        console.log('Response was: ', response);
        const originList = response.originAddresses;
        const destinationList = response.destinationAddresses;
        let divelement = '';
        for (var i = 0; i < originList.length; i++) {
          const results = response.rows[i].elements;
          for (var j = 0; j < results.length; j++) {
            divelement += originList[i] + '*' + destinationList[j] +
                '*' + results[j].distance.text + '*' +
                results[j].duration.text;
          }
          console.log('this.divelement', divelement)  
        }
        getDetails(divelement.split('*'));
      }
    });
  };
    return(
      <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Journey Details"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <b>From: </b> {details[0]}
        </DialogContentText>
        <DialogContentText id="alert-dialog-description">
          <b>To: </b> {details[1]}
        </DialogContentText>
        <DialogContentText id="alert-dialog-description">
          <b>Distance: </b> {details[2]}
        </DialogContentText>
        <DialogContentText id="alert-dialog-description">
          <b>Duration: </b> {details[3]}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.clicked} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
    )
    
}

export default matrixServices;

