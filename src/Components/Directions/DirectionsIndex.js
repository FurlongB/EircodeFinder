import React, { Component } from "react";
import {NavLink } from 'react-router-dom';
import DirectionsRoute from './DirectionsRoute';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
import DetailIcon from '@material-ui/icons/DepartureBoard';
import { compose, withProps } from "recompose";
import DirectionRenderComponent from "./DirectionRenderComponent";
import { G_API_URL } from "../../utility/constants";
import classDirections from './Directions.css';

const { withScriptjs, withGoogleMap, GoogleMap } = require("react-google-maps");



const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
});

class Directions extends Component {
 
  state = {
    defaultZoom: 6.5,
    map: false,
    center: {
      lat: 23.217724,
      lng: 72.667216
    },
    from: null,
    to: null,
    strokeColor: '#f68f54',
    reference: [],
    classes: this.props,
    destination: false,
    showDirections: false
  };

  componentDidMount() {
    const localGPS = (window.location.href)
    const references = localGPS.split("dirs=")
    console.log('localGPS',references[1]);
    const lastleg = references[1].split(",")
    console.log('lastleg',lastleg);
    this.setState({from: {lat: parseFloat(lastleg[0]), lng:parseFloat(lastleg[1])}, 
                  to:{lat: parseFloat(lastleg[3]), lng: parseFloat(lastleg[4])}})
    this.setState({center: {lat: parseFloat(lastleg[3]), lng: parseFloat(lastleg[4])}})
    this.setState({map: true})
  }
  
  showHandler = () =>{
    !this.state.showDirections ? this.setState({showDirections: true}):      this.setState({showDirections: false});
  }

  render() {
    return (
     <div>
      {this.state.map ? 
      <GoogleMap
        defaultZoom={this.state.defaultZoom}
        center={this.state.center}
        defaultCenter={new window.google.maps.LatLng(this.state.to.lat, this.state.to.lng)}
      >
          <DirectionRenderComponent
              key={'1'}
              index={'1'}
              strokeColor={this.strokeColor}
              from={this.state.from}
              to={this.state.to}
            />

      </GoogleMap>: null}
      <div className={classDirections.Directions}>
      <span className={classDirections.butts}>
            <NavLink to={{
                      pathname: '/'
                  }}>
              <Button variant="contained" color="secondary" className={this.state.classes.button}>
                <HomeIcon />
              </Button>
            </NavLink>
          </span> 
          <span className={classDirections.butts}>
            <Button variant="contained" color="primary" className={this.state.classes.button} onClick={this.showHandler}>
              <DetailIcon />
            </Button>
          </span>
        </div>
        {this.state.showDirections ? <DirectionsRoute from={this.state.from} to={this.state.to} clicked={this.showHandler}/> : null}         
      </div> 
    );
  }
}

Directions.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(compose(
  withProps({
    googleMapURL: G_API_URL,
    loadingElement: <div style={{ height: `99%` }} />,
    containerElement: <div style={{ height: `600px` }} />,
    mapElement: <div style={{ height: `99%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(Directions));
