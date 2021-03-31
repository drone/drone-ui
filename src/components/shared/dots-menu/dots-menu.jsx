import classNames from 'classnames/bind';
import React, { useEffect, useState, useRef } from 'react';

import { useOnClickOutside } from 'hooks';
import { ReactComponent as DotsVerticalIcon } from 'svg/dots-vertical.svg';

import css from './dots-menu.module.scss';

const cx = classNames.bind(css);

const renderMenuItems = (items, getMenuItemHandlers) => items.map((item, idx) => (
  <div
    className={cx('menu-item')}
    {...getMenuItemHandlers(item.value)}
    key={idx}
    role="menuitem"
    tabIndex="-1"
    data-value={item.value}
  >
    {item.content}
  </div>
));

const Menu = (props) => {
  const {
    id, className, isMenuOpen, hideMenu, menuItems, onMenuItemSelect, menuAlignment,
  } = props;
  const menuRef = useRef();
  const getMenuItemHandlers = (value) => ({
    onClick: (e) => {
      onMenuItemSelect(value, e);
      hideMenu();
    },
    onKeyDown: (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onMenuItemSelect(value, e);
        hideMenu();
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        hideMenu();
      }
    },
  });
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (e.target?.nextElementSibling) {
          e.target.nextElementSibling.focus();
        } else {
          e.target.parentElement.firstElementChild.focus();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (e.target?.previousElementSibling) {
          e.target.previousElementSibling.focus();
        } else {
          e.target.parentElement.lastElementChild.focus();
        }
        break;
      case 'Escape':
        e.preventDefault();
        hideMenu();
        break;
      default:
    }
  };
  useEffect(() => {
    if (isMenuOpen) {
      menuRef.current.firstElementChild.focus();
    }
  }, [isMenuOpen]);
  return (
    <div
      className={cx('menu', `menu-${menuAlignment}`, className)}
      role="menu"
      tabIndex="-1"
      hidden={!isMenuOpen}
      aria-hidden={!isMenuOpen}
      id={id}
      ref={menuRef}
      onKeyDown={handleKeyDown}
    >
      {renderMenuItems(menuItems, getMenuItemHandlers)}
    </div>
  );
};

const DotsMenu = (props) => {
  const {
    id, className, menuItems, onMenuItemSelect, disabled, menuAlignment,
  } = props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isControlInFocus, setIsControlInFocus] = useState(false);
  const wrapperRef = useRef();
  const menuBtnRef = useRef();

  useOnClickOutside(wrapperRef, () => setIsMenuOpen(false));

  const hideMenu = () => {
    setIsMenuOpen(false);
    menuBtnRef.current?.focus();
  };

  const toggleMenuVisibility = () => {
    if (isMenuOpen) {
      hideMenu();
    } else {
      setIsControlInFocus(false);
      setIsMenuOpen(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      toggleMenuVisibility();
    }
  };
  const handleControlFocus = (e) => {
    setIsControlInFocus(true);
  };
  const handleControlBlur = (e) => {
    setIsControlInFocus(false);
  };
  return (
    <div className={cx('wrapper', className)} ref={wrapperRef}>
      <div className={cx('wrapper-menu')}>
        <button
          className={cx('btn-menu-controller', { 'is-open': isMenuOpen, 'is-focused': isControlInFocus })}
          type="button"
          disabled={disabled}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen || undefined}
          ref={menuBtnRef}
          onFocus={handleControlFocus}
          onBlur={handleControlBlur}
          onClick={toggleMenuVisibility}
          onKeyPress={handleKeyPress}
        >
          <DotsVerticalIcon />
        </button>
        <Menu
          menuItems={menuItems}
          isMenuOpen={isMenuOpen}
          hideMenu={hideMenu}
          id={id}
          menuAlignment={menuAlignment}
          onMenuItemSelect={onMenuItemSelect}
        />
      </div>
    </div>
  );
};

export default DotsMenu;
