import classNames from 'classnames/bind';
import React, { useLayoutEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { instance } from '_constants';
import Button from 'components/shared/button';
import { useCustomTitle } from 'hooks';
import { useViewerToken } from 'hooks/swr';
import { ReactComponent as CopyIcon } from 'svg/copy.svg';

import css from './account.module.scss';

const cx = classNames.bind(css);

const initialState = {
  token: {
    copied: false,
    snippet: null,
  },
  api: {
    copied: false,
    snippet: null,
  },
  cli: {
    copied: false,
    snippet: null,
  },
};

export default function Account() {
  const [snippets, setSnippets] = useState(initialState);

  const { data } = useViewerToken();

  useCustomTitle('Account');

  const handleCopyClick = (snippetCategory) => () => {
    setSnippets((prev) => ({
      ...prev,
      [snippetCategory]: {
        ...prev[snippetCategory],
        copied: true,
      },
    }));
    setTimeout(() => {
      setSnippets((prev) => ({
        ...prev,
        [snippetCategory]: {
          ...prev[snippetCategory],
          copied: false,
        },
      }));
    }, 2000);
  };

  useLayoutEffect(() => {
    if (data?.token) {
      setSnippets({
        token: {
          copied: false,
          snippet: data.token,
        },
        api: {
          copied: false,
          snippet: [`curl -i ${instance}/api/user \\`, `-H "Authorization: Bearer ${data.token}"`],
        },
        cli: {
          copied: false,
          snippet: [`export DRONE_SERVER=${instance}`, `export DRONE_TOKEN=${data.token}`, 'drone info'],
        },
      });
    }
  }, [data?.token]);
  return (
    <>
      <header className={cx('header')}>
        <h1>Account Settings</h1>
        <a href="/logout" target="_self">Logout</a>
      </header>
      <section className={cx('wrapper')}>
        {snippets.token.snippet ? (
          <div>
            <div className={cx('row')}>
              <span className={cx('label')}>Your personal token:</span>
              <pre className={cx('snippet')}>
                <CopyToClipboard
                  text={snippets.token.snippet}
                  onCopy={handleCopyClick('token')}
                >
                  <Button
                    className={cx('copy-btn')}
                  >
                    {snippets.token.copied ? 'Copied' : <CopyIcon />}
                  </Button>
                </CopyToClipboard>
                <code>{snippets.token.snippet}</code>
              </pre>
            </div>
            <div className={cx('row')}>
              <span className={cx('label')}>Example API Usage:</span>
              <pre className={cx('snippet')}>
                <CopyToClipboard
                  text={snippets.api.snippet.join('\n')}
                  onCopy={handleCopyClick('api')}
                >
                  <Button
                    className={cx('copy-btn')}
                  >
                    {snippets.api.copied ? 'Copied' : <CopyIcon />}
                  </Button>
                </CopyToClipboard>
                <code>
                  <div>
                    <span>$</span>
                    {snippets.api.snippet[0]}
                  </div>
                  <div>
                    <span>&gt;</span>
                    {snippets.api.snippet[1]}
                  </div>
                </code>
              </pre>
            </div>
            <div className={cx('row')}>
              <span className={cx('label')}>Example CLI Usage:</span>
              <pre className={cx('snippet')}>
                <CopyToClipboard
                  text={snippets.cli.snippet?.join('\n')}
                  onCopy={handleCopyClick('cli')}
                >
                  <Button
                    className={cx('copy-btn')}
                  >
                    {snippets.cli.copied ? 'Copied' : <CopyIcon />}
                  </Button>
                </CopyToClipboard>
                <code>
                  <div>
                    <span>$</span>
                    {snippets.cli.snippet[0]}
                  </div>
                  <div>
                    <span>$</span>
                    {snippets.cli.snippet[1]}
                  </div>
                  <div>
                    <span>$</span>
                    {snippets.cli.snippet[2]}
                  </div>
                </code>
              </pre>
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
