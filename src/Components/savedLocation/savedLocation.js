import React from 'react';
import classes from './savedLocation.css'
import Icon from './icon/icon'

const savedLocation = (props) =>{
    const todoData = props.locations;
    const loadLocation = [];
    for (const key in todoData ){
        loadLocation.push({id: key, eircode: todoData[key].eircode, street: todoData[key].street, town: todoData[key].town, county: todoData[key].county})
    }
     return(
        <div>
            {loadLocation.map((plr, index) =>
                    (<div key={plr.id} className={classes.savedLocation} onClick={props.clicked.bind(this, plr.id)}>
                        <span className={classes.img}><Icon/></span>
                        <span className={classes.address}>
                            <b>{Number(index+1)} - {plr.eircode}</b><br/>
                            <span>{plr.street === undefined ? null : plr.street+', '} {plr.town}, {plr.county}</span>
                        </span>
                    </div>)
                )}
        </div>
    )
}

export default savedLocation;