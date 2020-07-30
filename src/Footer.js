import React from 'react';
import { SocialIcon } from 'react-social-icons';

const Footer = () => {
  return (
    <>
    <h3 style={{color: "#8c8c8c"}}>Designed with {"<"}{"/"}{">"} & <span style={{color: "red"}}>❤️</span> by <span style={{color: "black"}}>Kushagra Bhargav</span>  </h3>
      <div>
        <SocialIcon url="https://www.linkedin.com/in/kushagra-bhargav/" style={{ height: 40, width: 40, marginRight:15}}/>        
        <SocialIcon url="https://github.com/KushagraBhargav" style={{ height: 40, width: 40 }} bgColor="black"/>
    </div>
      </>
  );
};

export default Footer;
