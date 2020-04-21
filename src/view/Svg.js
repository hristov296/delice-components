import React from "react";

export default function(props) {
   
  const classes = props.class ? props.class + ' icon' : 'icon';

  return (
    <svg className={classes} ><use xlinkHref={'#'+props.icon} /></svg>
  )
}