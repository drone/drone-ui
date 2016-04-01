import React from 'react';

export default
class Breadcrumb extends React.Component {
  render() {
    return (
      <div className="breadcrumb">
        <ol>
          <li>MetalMatze / matthiasloibl.com</li>
          <li>
            <i className="material-icons">chevron_right</i>
          </li>
          <li>
            9
          </li>
        </ol>
      </div>
    );
  }
}
