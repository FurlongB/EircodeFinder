import React, { useState, useContext, useEffect } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import axios from 'axios';

import SavedLocation from '../savedLocation/savedLocation'
import CodeContext from '../../Context/code-context';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import CarIcon from '@material-ui/icons/DirectionsCar';
import FavIcon from '@material-ui/icons/Favorite';
import HomeIcon from '@material-ui/icons/Home';
import Slide from '@material-ui/core/Slide';

import classDialog from './addressDetails.css'

const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
};

const Transition = (props) => {
  return <Slide direction="up" {...props} />;
}

const FullScreenDialog = (props) => {
  const [open, setOpen] = useState(true);
  const [home, setHome] = useState(false);
  const [added, setAdded] = useState(null);
  const [savedLocat, setSavedLocat] = useState(null)
  const [directions, setDirections] =useState(null)
  const eircodeStatus = useContext(CodeContext);

  useEffect(() =>{
     startingObject();
    return () =>{
         console.log('Clean Up');
     }
  }, [eircodeStatus]);

 const startingObject = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
  
    };
  };
  
  const showPosition = (position) =>{
    setDirections(position.coords.latitude+","+position.coords.longitude+",Home,"+eircodeStatus.eircode.latitude+","+eircodeStatus.eircode.longitude+","+eircodeStatus.eircode.town)
  };
  

  const handleClose = () => {
    setOpen(false);
  };

  const goHomeHandler = (event) => {
    event.preventDefault();
    setHome(true);
  }


  const saveAddress = (event) => {
    event.preventDefault();
    axios.get('https://eircodefinder.firebaseio.com/addresses.json')
    .then(res =>{
      const checkData = res.data
      let saveData = true
        for (const key in checkData){
          if(eircodeStatus.eircode.eircode === checkData[key].eircode){
            console.log('This address already exists in the data store.')
            setAdded('This address already exists in the data store.');
            saveData = false;
          }
        }
        if(saveData) storeData();
    })
    .catch(err =>{
      setAdded(err.message);

    });   
  };

  const getCurLocation = (id)=>{
    axios.get(`https://eircodefinder.firebaseio.com/addresses/${id}.json`)
    .then(result =>{
        setAdded(null);
        console.log(result.data.eircode)
        eircodeStatus.codeStatus({
            eircode: result.data.eircode, 
            number: result.data.number, 
            street: result.data.street,
            town: result.data.town,
            county: result.data.county,
            longitude: result.data.longitude,
            latitude: result.data.latitude
          });
    })
    .catch(err =>{
      console.log(err.message);
      setAdded(err.message);
    });
    
}  
  
  const storeData = () =>{
    axios.post('https://eircodefinder.firebaseio.com/addresses.json', eircodeStatus.eircode)
        .then(res =>{
           console.log(res);
           setAdded('Congratulations you have saved the address to the data store.');
        })
        .catch(err =>{
            console.log(err);
            setAdded(err.message);
    });
  };  

  const getLocations = (event) =>{
    event.preventDefault();
    setAdded(null);
    axios.get('https://eircodefinder.firebaseio.com/addresses.json')
    .then(res =>{
      setSavedLocat(res.data);
    })
    .catch(err =>{
      setAdded(err.message);
    });
  };


    const { classes } = props;
    return (
      <div>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={handleClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>
               Address Details
              </Typography>
            </Toolbar>
          </AppBar>
          <List>
            <ListItem>
              <ListItemText primary={eircodeStatus.eircode.street}/>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary={eircodeStatus.eircode.town}/>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary={eircodeStatus.eircode.county}/>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary={eircodeStatus.eircode.eircode}/>
            </ListItem>
            <Divider />
            <IconButton color="primary" className={classes.button} onClick={goHomeHandler.bind(this)} aria-label="Save Eircode">
                <HomeIcon/>
            </IconButton>
            <IconButton color="primary" className={classes.button} onClick={saveAddress.bind(this)} aria-label="Save Eircode">
                <SaveIcon/>
            </IconButton>
            <NavLink to={{
                    pathname: '/maps',
                    search:'?dirs='+String(directions)
                }}>
                  <IconButton color="primary" className={classes.button} aria-label="Get Directions">
                    <CarIcon />
                 </IconButton>
            </NavLink> 
            
            <IconButton color="primary" className={classes.button} onClick={getLocations.bind(this)} aria-label="Get Directions">
               <FavIcon />
            </IconButton>
          </List>
          {added ? <p className={classDialog.dialogBox}>{added}</p> : null}
          {savedLocat ? <SavedLocation locations={savedLocat} clicked={getCurLocation}/>: null}
        </Dialog>
        {!open || home ? <Redirect to="/" /> : null}
      </div>
    );
}

FullScreenDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FullScreenDialog);