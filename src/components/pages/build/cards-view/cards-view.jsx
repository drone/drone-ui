import classNames from 'classnames/bind';
import id from 'date-fns/esm/locale/id/index.js';
import React, { useState } from 'react';

import { useCard } from 'hooks/swr';

import Card from './card';
import css from './cards-view.module.scss';

const cx = classNames.bind(css);

const CardsView = ({
  data, isDataLoading, isError, namespace, name, build,
}) => {
  console.log(data);
  if (isError) {
    return <div className={cx('message')}>ERROR :(</div>;
  } if (isDataLoading) {
    return <div className={cx('message')}>LOADING...</div>;
  } if (!data.length) {
    return <div className={cx('message')}>NO CARDS FOUND...</div>;
  }
  return (
    <ul className={cx('card-list')}>
      {data?.map((cardData) => <Card key={cardData.id} data={cardData} namespace={namespace} name={name} build={build} />)}
    </ul>
  );
};

export default CardsView;
