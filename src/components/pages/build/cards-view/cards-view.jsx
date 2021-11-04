import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import Card from './card';
import css from './cards-view.module.scss';

const cx = classNames.bind(css);

const CardsView = ({
  data, isDataLoading, namespace, name, build,
}) => {
  if (isDataLoading) {
    return <div className={cx('message')}>LOADING...</div>;
  } if (!data.length) {
    return <div className={cx('card-list')}><span className={cx('message')}>NO ADAPTIVE CARDS FOUND</span></div>;
  }
  return (
    <ul className={cx('card-list')}>
      {data?.map((cardData) => {
        // causes a weird error when I use template literals...
        // eslint-disable-next-line prefer-template
        const key = cardData.stage.toString() + ' - ' + cardData.step.toString();
        return <Card key={key} data={cardData} namespace={namespace} name={name} build={build} />;
      })}
    </ul>
  );
};

CardsView.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    schema: PropTypes.string.isRequired,
    stage: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
  })),
  isDataLoading: PropTypes.bool.isRequired,
  namespace: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  build: PropTypes.string.isRequired,
};

CardsView.defaultProps = {
  data: [],
};

export default CardsView;
