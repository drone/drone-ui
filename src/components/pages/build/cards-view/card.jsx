import { AdaptiveCard } from 'adaptivecards-react';
import { Template } from 'adaptivecards-templating';
import axios from 'axios';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { useCard } from 'hooks/swr';

import css from './card.module.scss';

const cx = classNames.bind(css);

const loadAdaptiveCard = async (url, json, setAdaptiveCard) => {
  const schema = await axios({ method: 'GET', url });
  const template = new Template(schema?.data);
  const cardPayload = await template.expand({
    $root: {
      ...json,
    },
  });
  setAdaptiveCard(cardPayload);
};

const Card = ({
  data, namespace, name, build,
}) => {
  const {
    data: json,
    isError: jsonIsError,
    isLoading: jsonIsLoading,
  } = useCard({
    namespace,
    name,
    build,
    stage: data.stage,
    step: data.step,
  });

  const [adaptiveCard, setAdaptiveCard] = useState(null);

  useEffect(() => {
    if (!jsonIsLoading && !adaptiveCard) {
      loadAdaptiveCard(data.schema, json, setAdaptiveCard);
    }
  }, [jsonIsLoading, data, json, adaptiveCard]);

  if (jsonIsLoading || !adaptiveCard) {
    return <li className={cx('card', 'card-message')}>CARD LOADING...</li>;
  }
  if (jsonIsError) {
    return <li className={cx('card', 'card-message')}>CARD ERROR</li>;
  }
  return (
    <li className={cx('card')}>
      <AdaptiveCard payload={adaptiveCard} />
    </li>
  );
};

Card.propTypes = {
  namespace: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  build: PropTypes.string.isRequired,
  data: PropTypes.shape({
    schema: PropTypes.string.isRequired,
    stage: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
  }).isRequired,
};

export default Card;
