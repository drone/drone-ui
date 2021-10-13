// import { AdaptiveCard } from 'adaptivecards';
import { Template } from 'adaptivecards-templating';
import axios from 'axios';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import AdaptiveCard from 'react-adaptivecards';

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
    data: json, isError: jsonIsError, isLoading: jsonIsLoading,
    // TODO build here probably has to be build number as opposed to build ID - my test data matches these numbers by fluke
  } = useCard({
    namespace, name, build, stage: data.stageNum, step: data.stepNum,
  });

  // TODO this should be moved to the SWR part
  const stringJson = json && Object.keys(json).reduce((acc, key) => {
    acc[key] = `${json[key]}`;
    return acc;
  },
  {});

  const [adaptiveCard, setAdaptiveCard] = useState(null);

  useEffect(() => {
    if (!jsonIsLoading && !adaptiveCard) {
      loadAdaptiveCard(data.schema, stringJson, setAdaptiveCard);
    }
  }, [jsonIsLoading, data, stringJson, adaptiveCard]);

  if (jsonIsLoading || !adaptiveCard) {
    return <li className={cx('card', 'card-loading')}>LOADING...</li>;
  }
  return <li className={cx('card')}><AdaptiveCard payload={adaptiveCard} /></li>;
};

export default Card;
