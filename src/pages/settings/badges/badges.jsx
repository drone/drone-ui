import classNames from 'classnames/bind';
import React, { useMemo, useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useParams } from 'react-router-dom';

import { instance } from '_constants';
import Button from 'components/shared/button';
import Form, { Field } from 'components/shared/form';
import { ReactComponent as CopyIcon } from 'svg/copy.svg';

import styles from './badges.module.scss';

const cx = classNames.bind(styles);

const BADGE_OPTIONS = [
  {
    key: 'Markdown',
    value: 'markdown',
  },
  {
    key: 'Markup',
    value: 'markup',
  },
  {
    key: 'CCMenu',
    value: 'cc',
  },
];

const buildImage = (branch, droneInstance, name, namespace) => {
  const branchSuffix = branch ? `?ref=refs/heads/${branch}` : '';
  return `${droneInstance}/api/badges/${namespace}/${name}/status.svg${branchSuffix}`;
};

const buildSnippet = ({
  syntax, image, namespace, name,
}) => {
  switch (syntax) {
    case 'markup':
      return `<a href="${instance}/${namespace}/${name}">
  <img src="${image}" />
</a>`;
    case 'cc':
      return `${instance}/${namespace}/${name}/cc.xml`;
    case 'markdown':
    default:
      return `[![Build Status](${image})](${instance}/${namespace}/${name})`;
  }
};

export default function Main() {
  const { namespace, name } = useParams();
  const [isSnippetCopied, setIsSnippetCopied] = useState(false);

  /* States */
  const [badge, setBadge] = useState({ branch: '', snippetSyntax: 'markdown' });
  // derived state
  const image = buildImage(badge.branch, instance, name, namespace);

  const handleBadgeBranchChange = ({ target }) => {
    setBadge((prev) => ({ ...prev, branch: target.value.trim() }));
  };

  const handleBadgeSyntaxChange = ({ target }) => {
    setBadge((prev) => ({ ...prev, snippetSyntax: target.value }));
  };

  const handleCopyClick = () => {
    setIsSnippetCopied(true);
  };

  const currentSnippet = useMemo(() => buildSnippet({
    syntax: badge.snippetSyntax, image, namespace, name,
  }), [badge.snippetSyntax, image, namespace, name]);

  useEffect(() => {
    let timeout;
    if (isSnippetCopied) {
      timeout = setTimeout(() => {
        setIsSnippetCopied(false);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [isSnippetCopied]);

  useEffect(() => {
    setIsSnippetCopied(false);
  }, [badge]);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('inner')}>
        <img alt="badge" src={image} />
        <Form className={cx('group')}>
          <div className={cx('group', 'group-badge')}>
            <Field.Select
              label="Syntax"
              name="syntax"
              value={badge.snippetSyntax}
              optionsList={BADGE_OPTIONS}
              width={260}
              onChange={handleBadgeSyntaxChange}
            />
            <Field.Input
              label="Branch"
              name="branch"
              placeholder="master"
              value={badge.branch}
              width={260}
              onChange={handleBadgeBranchChange}
            />
          </div>
          <pre className={cx('badge-snippet')}>
            <CopyToClipboard
              text={currentSnippet}
              onCopy={handleCopyClick}
            >
              <Button className={cx('copy-btn')} type="button">
                {isSnippetCopied ? 'Copied!' : <CopyIcon />}
              </Button>
            </CopyToClipboard>
            <code>
              {currentSnippet}
            </code>
          </pre>
        </Form>
      </div>
    </div>
  );
}
