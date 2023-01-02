import classNames from 'classnames/bind';
import React, { useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import Button from 'components/shared/button';
import { useOnClickOutside } from 'hooks';
import { ReactComponent as CloseIcon } from 'svg/close.svg';

import styles from './modal.module.scss';

const cx = classNames.bind(styles);

export const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);
  const toggle = () => setIsShowing(!isShowing);
  return [isShowing, toggle];
};

const Modal = ({
  isShowing, title, children, hide,
  mode = 'default',
}) => {
  const modalRef = useRef(null);
  useOnClickOutside(modalRef, hide);
  useLayoutEffect(() => {
    if (isShowing) {
      window.document.body.style.overflow = 'hidden';
    } else {
      window.document.body.style.overflow = 'unset';
    }
    return () => window.document.body.style.overflow = 'unset';
  }, [isShowing]);
  if (isShowing) {
    return ReactDOM.createPortal(
      <>
        <div className={cx('overlay')} />
        <div className={cx('modal-wrapper', `${mode}`)} tabIndex={-1} role="dialog" aria-modal aria-hidden>
          <div className={cx('modal-inner')} ref={modalRef}>
            <header className={cx('modal-header')}>
              <h3 className={cx('modal-title')}>{title}</h3>
              <Button theme="plain" type="button" onClick={hide}><CloseIcon /></Button>
            </header>
            <div className={cx('modal-content')}>{children}</div>
          </div>
        </div>
      </>,
      document.body,
    );
  }
  return null;
};

export default Modal;
