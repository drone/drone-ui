import React from 'react';

export const SEPARATOR = (
  <i className="material-icons">chevron_right</i>
);

export default
class Breadcrumb extends React.Component {
  render() {
    const {elements} = this.props;

    return (
      <div className="breadcrumb">
        <ol>
          {elements.map((element, index) => {
            return (
              <li key={index}>{element}</li>
            );
          })}
        </ol>
      </div>
    );
  }
}
