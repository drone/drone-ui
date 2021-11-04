/* eslint-disable no-unused-expressions */
import { AdaptiveCard } from 'adaptivecards';
import PropTypes from 'prop-types';
import React from 'react';

const AdaptiveCardComponent = ({ payload }) => {
  const adaptiveCard = new AdaptiveCard();

  adaptiveCard.parse(payload);
  const result = adaptiveCard.render();
  return (
    <div
      ref={(n) => {
        n && n.firstChild && n.removeChild(n.firstChild);
        n && n.appendChild(result);
      }}
    />
  );
};

AdaptiveCardComponent.propTypes = {
  payload: PropTypes.shape().isRequired,
};

export default AdaptiveCardComponent;
