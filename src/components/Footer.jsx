import React from "react";
import nodes from "../assets/nodes.png";

const Footer = () => {
  return (
    <footer>
      <div>
        <p>RedNodeMods &copy; 2024</p>
        <br />
        <p>Developed by Axel</p>
      </div>
      <img src={nodes} alt="nodes" width="450" />
    </footer>
  );
};

export default Footer;
