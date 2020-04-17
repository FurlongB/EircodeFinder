import React, {useState, useContext} from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import Logo from '../Logo/Logo';

import CodeContext from '../../Context/code-context';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import searchClass from './Search.css';

const styles = {
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 300,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
};


const search = (props) =>{
    const [value, setValue] = useState('');
    const [valid, setValid] = useState(false);
    const [address, setAddress] = useState(false);
    const eircodeStatus = useContext(CodeContext);
    const { classes } = props;

    const searchHandler = (event) =>{
      event.preventDefault();
      console.log('[value]',value)
     // setAddressDetails({"summaryline":"Department of Communications, Climate Action and Environment, 29-31 Adelaide Road, Dublin 2, D02 X285","organisation":"Department of Communications, Climate Action and Environment","number":"29-31","premise":"29-31","street":"Adelaide Road","posttown":"Dublin 2","county":"Co. Dublin","postcode":"D02 X285","latitude":"53.332067","longitude":"-6.255492"})
    
     //axios.get('http://ws.postcoder.com/pcw/PCWY2-WSYQ8-FMMYT-35DH9/geo/uk/'+value+'?format=json ')
     axios.get('http://ws.postcoder.com/pcw/PCW45-12345-12345-1234X/addressgeo/ie/Adelaide%20Road?format=json')
        .then(result =>{
         console.log('[result]', result);
          eircodeStatus.codeStatus({
            eircode: result.data[0].postcode, 
            number: result.data[0].number, 
            street: result.data[0].street,
            town: result.data[0].posttown,
            county: result.data[0].county,
            longitude: result.data[0].longitude,
            latitude: result.data[0].latitude
          });
          setAddress(true);
         })
         
        .catch(err =>{
            console.log(err)
            setAddress(false)
       });
    }
    
    const inputHandler = (event) =>{
      console.log(event.target.value.length)
      setValue(event.target.value);
      if(event.target.value.trim() === '' || event.target.value.length >= 6){
        setValid(false);
      }else{
        setValid(true);
      }
    }

    return(
        <div className={searchClass.Search}>
          <Logo />
          <Paper className={classes.root} elevation={1}>
            <InputBase className={classes.input} placeholder="Search Eircode or Address" onChange={inputHandler}/>
            <IconButton className={classes.iconButton} aria-label="Search" disabled={valid} onClick={searchHandler} >
              <SearchIcon />
            </IconButton>
          </Paper>
          {address ? <Redirect to="/details" /> : null}
        </div>
    );
}

search.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(search);






