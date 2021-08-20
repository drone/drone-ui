import classNames from 'classnames/bind';
import React from 'react';

import styles from './footer.module.scss';

const cx = classNames.bind(styles);

const LEFT_SIDE_ITEMS = [
  {
    label: 'Documentation',
    link: 'https://readme.drone.io/',
  },
  {
    label: 'Plugins',
    link: 'http://plugins.drone.io/',
  },
  {
    label: 'Support',
    link: 'https://discourse.drone.io/',
  },
];

const RIGHT_SIDE_ITEMS = [
  {
    label: 'GitHub',
    link: 'https://github.com/drone',
  },
  {
    label: 'Twitter',
    link: 'https://twitter.com/droneio',
  },
  {
    label: 'Discourse',
    link: 'https://discourse.drone.io/',
  },
  {
    label: 'Gitter',
    link: 'https://gitter.im/drone/drone',
  },
];

export default function Footer() {
  return (
    <footer className={cx('container', 'footer')}>
      <nav>
        {LEFT_SIDE_ITEMS.map(({ label, link }) => (
          <a key={link} href={link} target="_blank" rel="noopener noreferrer">{label}</a>
        ))}
      </nav>
      <nav>
        {RIGHT_SIDE_ITEMS.map(({ label, link }) => (
          <a key={link} href={link} target="_blank" rel="noopener noreferrer">{label}</a>
        ))}
      </nav>
    </footer>
  );
}
