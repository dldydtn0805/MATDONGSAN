const React = require('react');

function DemoContainer({ children }) {
  return React.createElement(React.Fragment, null, children);
}

function DemoItem({ children }) {
  return React.createElement(React.Fragment, null, children);
}

module.exports = {
  DemoContainer,
  DemoItem,
};
