import classNames from 'classnames/bind';
import React, { useState } from 'react';

import Button from 'components/shared/button';
import Form, { Field, FormSection } from 'components/shared/form';
import { ReactComponent as DroneLogo } from 'svg/logo-full.svg';
import { ReactComponent as WelcomePageIllustration } from 'svg/welcome-illustration.svg';

import css from './login.module.scss';

const cx = classNames.bind(css);

export default function LoginForm() {
  const [loginFormState, setLoginFormState] = useState({
    username: '',
    password: '',
  });
  const handleFieldChange = (field) => (event) => {
    setLoginFormState((prev) => ({ ...prev, [field]: event.target.value.trim() }));
  };

  return (
    <section className={cx('wrapper')}>
      <div className={cx('login')}>
        <div className={cx('kicker')}>
          <DroneLogo />
        </div>
        <div className={cx('header')}>
          <h1 className={cx('title')}>Sign in using your Gogs credentials.</h1>
          <span className={cx('title-sub')}>使用您的Gogs用户名和密码登录</span>
        </div>
        <Form className={cx('form')} method="POST" action="/login">
          <FormSection>
            <Field.Input
              label="Username"
              name="username"
              width="100%"
              type="text"
              required
              onChange={handleFieldChange('username')}
            />
          </FormSection>
          <FormSection>
            <Field.Input
              label="Password"
              name="password"
              width="100%"
              type="password"
              autoComplete="current-password"
              required
              onChange={handleFieldChange('password')}
            />
          </FormSection>
          <FormSection>
            <Button
              theme="primary"
              type="submit"
              className={cx('btn', 'btn-sign-in')}
            >
              Sign in

            </Button>
          </FormSection>
        </Form>
      </div>
      <div className={cx('illustration')}>
        <WelcomePageIllustration />
      </div>
    </section>
  );
}
