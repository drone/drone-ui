import classNames from 'classnames/bind';
import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Button from 'components/shared/button';
import Form, { Field, FormSection } from 'components/shared/form';
import { ReactComponent as DroneLogo } from 'svg/logo-full.svg';
import { ReactComponent as WelcomePageIllustration } from 'svg/welcome-illustration.svg';
import { axiosWrapper } from 'utils';

import css from './register.module.scss';

const cx = classNames.bind(css);

export default function LoginForm() {
  const history = useHistory();
  const [loginFormState, setLoginFormState] = useState({
    name: '',
    email: '',
    company: '',
  });
  const handleFieldChange = (field) => (event) => {
    setLoginFormState((prev) => ({ ...prev, [field]: event.target.value.trim() }));
  };
  const handleSubmit = useCallback(async () => {
    try {
      await axiosWrapper('/api/user', {
        method: 'PATCH',
        data: loginFormState,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err.message);
    }
    history.push('/');
  }, [loginFormState, history]);

  return (
    <section className={cx('wrapper')}>
      <div className={cx('login')}>
        <div className={cx('kicker')}>
          <DroneLogo />
        </div>
        <div className={cx('header')}>
          <h1 className={cx('title')}>Complete your Drone Registration.</h1>
        </div>
        <Form className={cx('form')} onSubmit={(e) => e.preventDefault()}>
          <FormSection>
            <Field.Input
              label="Your Email"
              name="email"
              width="100%"
              type="email"
              required
              onChange={handleFieldChange('email')}
            />
          </FormSection>
          <FormSection>
            <Field.Input
              label="Your Full Name"
              name="name"
              width="100%"
              type="text"
              required
              onChange={handleFieldChange('name')}
            />
          </FormSection>
          <FormSection>
            <Field.Input
              label="Company Name"
              name="name"
              width="100%"
              type="text"
              onChange={handleFieldChange('company')}
            />
          </FormSection>
          <FormSection>
            <Button
              theme="primary"
              className={cx('btn', 'btn-sign-in')}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </FormSection>
        </Form>
        <div className={cx('legal')}>
          By clicking &quot;Submit&quot;, you agree to our
          {' '}
          <a href="https://harness.io/privacy/">Privacy Policy</a>
          {' '}
          and
          {' '}
          <a href="https://github.com/drone/drone/blob/master/LICENSE">License</a>
          . See our
          {' '}
          <a href="https://docs.drone.io/enterprise/pings/">documentation</a>
          {' '}
          to learn more about how we process your data.
        </div>
      </div>
      <div className={cx('illustration')}>
        <WelcomePageIllustration />
      </div>
    </section>
  );
}
