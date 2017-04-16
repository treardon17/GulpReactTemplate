import { render } from "react-dom"
import React from "react";
import Home from './ui/pages/Home';

const containerEl = document.getElementById("app");

render(
  <Home/>,
  containerEl
);
