import Editor from '@monaco-editor/react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Button from 'components/shared/button';
import Form, { Field, FormSection } from 'components/shared/form';
import Modal, { useModal } from 'components/shared/modal';
import { useToast } from 'hooks';
import { useTemplates } from 'hooks/swr';
import { ReactComponent as DemoIcon } from 'svg/demo.svg';
import { ReactComponent as EditIcon } from 'svg/edit.svg';
import { ReactComponent as TrashIcon } from 'svg/trash.svg';
import { axiosWrapper } from 'utils';

import styles from './templates.module.scss';

const cx = classNames.bind(styles);

const JSONNET = '.jsonnet';
const STARLARK = '.starlark';
const YAML = '.yaml';

const EXT_OPTIONS = [JSONNET, STARLARK, YAML].map(
  (opt) => ({ key: opt, value: opt }),
);

const defaultJsonnet = `/* A Jsonnet template example. */
local stepName = std.extVar("input.stepName");
local image = std.extVar("input.image");
local commands = std.extVar("input.commands");
{
  "kind": "pipeline",
  "type": "docker",
  "name": "default",
  "steps": [
    {
      "name": stepName,
      "image": image,
      "commands": [
        commands
      ]
    }
  ]
}
`;

const defaultStarlark = `# A Starlark template example.
def main(ctx):
return {
  "kind": "pipeline",
  "name": "build",
  "steps": [
    {
      "name": ctx.input.stepName,
      "image": ctx.input.image,
      "commands": [
          ctx.input.commands
      ]
    }
  ]
}
`;

const defaultYaml = `# A YAML template example.
kind: pipeline
type: docker
name: default
steps:
   - name: {{ .input.name }}
     image: {{ .input.image }}
     commands:
        - {{ .input.commands }}
`;

const NewTemplateForm = ({ handleSubmit, handleCancel }) => {
  const [state, setState] = useState({
    name: '',
    ext: EXT_OPTIONS[0].value,
    data: '',
  });

  useEffect(() => {
    switch (state.ext) {
      case JSONNET:
        setState((prev) => ({ ...prev, data: defaultJsonnet }));
        break;
      case STARLARK:
        setState((prev) => ({ ...prev, data: defaultStarlark }));
        break;
      case YAML:
        setState((prev) => ({ ...prev, data: defaultYaml }));
        break;
      default:
        break;
    }
  }, [state.ext]);

  const handleTemplateChange = (field) => (e) => {
    setState((prev) => ({ ...prev, [field]: e?.target?.value || e }));
  };
  const handleAddTemplate = () => {
    handleSubmit(state);
    handleCancel();
  };
  return (
    <Form className={cx('container', 'form')}>
      <FormSection className={cx('group', 'group-fields')}>
        <Field.Input
          label="Name"
          value={state.name}
          name="template-name"
          width={700}
          autoFocus
          onChange={handleTemplateChange('name')}
        />
        <Field.Select
          label="Extension"
          value={state.ext}
          optionsList={EXT_OPTIONS}
          width={700}
          onChange={handleTemplateChange('ext')}
        />
        <Editor
          wrapperClassName={cx('monaco-wrapper')}
          height="20rem"
          width="100%"
          theme="vs-dark"
          value={state.data}
          onChange={handleTemplateChange('data')}
        />
      </FormSection>
      <FormSection className={cx('controls')}>
        <Button
          onClick={handleAddTemplate}
        >
          Create
        </Button>
        <Button onClick={handleCancel}>
          Cancel
        </Button>
      </FormSection>
    </Form>
  );
};

const EditTemplateForm = ({ handleSubmit, handleCancel, editModalInitialState }) => {
  const [state, setState] = useState({
    data: editModalInitialState.data,
  });
  const handleTemplateChange = (field) => (e) => {
    setState((prev) => ({ ...prev, [field]: e?.target?.value || e }));
  };
  const handleAddTemplate = () => {
    handleSubmit({ templateData: state.data, templateName: editModalInitialState.name });
    handleCancel();
  };
  return (
    <Form className={cx('container', 'form')}>
      <FormSection title={editModalInitialState.name} className={cx('group', 'group-fields')}>
        <Editor
          wrapperClassName={cx('monaco-wrapper')}
          height="20rem"
          width="100%"
          theme="vs-dark"
          value={state.data}
          onChange={handleTemplateChange('data')}
        />
      </FormSection>
      <FormSection className={cx('controls')}>
        <Button
          onClick={handleAddTemplate}
        >
          Update
        </Button>
        <Button onClick={handleCancel}>
          Cancel
        </Button>
      </FormSection>
    </Form>
  );
};

export default function Templates() {
  const { namespace } = useParams();
  const [isModalShowing, toggleModal] = useModal();
  const [isEditModalShowing, toggleEditModal] = useModal();
  const [editModalInitialState, setEditModalInitialState] = useState();
  const { data, isLoading, mutate } = useTemplates({ namespace });

  const { showSuccess, showError } = useToast();

  const handleAddTemplate = useCallback(async (values) => {
    try {
      const res = await axiosWrapper(`/api/templates/${namespace}`, {
        method: 'POST',
        data: { data: values.data, name: `${values.name}${values.ext}` },
      });
      mutate((prev) => [res, ...prev], false);
      showSuccess('Template has been added successfully');
    } catch (e) {
      showError(e.message);
      // eslint-disable-next-line no-console
      console.warn(e.message);
    }
  }, [namespace, mutate, showSuccess, showError]);

  const handleEditTemplate = useCallback(async ({ templateName, templateData }) => {
    try {
      const res = await axiosWrapper(`/api/templates/${namespace}/${templateName}`, {
        method: 'PATCH',
        data: { data: templateData },
      });
      mutate((prev) => [res, ...prev.filter((templateItem) => templateItem.name !== templateName)], false);
      showSuccess('Template has been edited successfully');
    } catch (e) {
      showError(e.message);
      // eslint-disable-next-line no-console
      console.warn(e.message);
    }
  }, [namespace, mutate, showSuccess, showError]);

  const handleRemoveTemplate = (templateName) => async () => {
    // eslint-disable-next-line no-alert
    const userAgreed = window.confirm('Are you sure you want to remove template?');
    if (userAgreed) {
      try {
        await axiosWrapper(`/api/templates/${namespace}/${templateName}`, { method: 'DELETE' });
        showSuccess('Template has been removed successfully');
        mutate((prev) => prev.filter((templateItem) => templateItem.name !== templateName), false);
      } catch (e) {
        showError(e.message);
        console.warn(e.message); // eslint-disable-line no-console
      }
    }
  };

  const setEditModalInitialStateAndToggle = (values) => {
    setEditModalInitialState(values);
    toggleEditModal();
  };

  let templates = null;
  if (isLoading) {
    templates = null;
  } else if (data.length) {
    templates = (
      <TemplateListView
        templates={data}
        handleRemove={handleRemoveTemplate}
        setEditModalInitialStateAndToggle={setEditModalInitialStateAndToggle}
      />
    );
  } else {
    templates = (
      <div className={cx('zero')}>
        <h2>No Templates</h2>
        <p>
          You can create templates to simplify configuration management
          if you have large numbers of similar configuration files.
        </p>
      </div>
    );
  }
  return (
    <>
      <div className={cx('wrapper')}>
        <div className={cx('card')}>
          {isLoading ? (
            null
          ) : (
            <>
              <div className={cx('actions')}>
                <Button
                  theme="primary"
                  className={cx('btn-new')}
                  icon={<DemoIcon />}
                  onClick={toggleModal}
                >
                  New Template
                </Button>
              </div>
              {templates}
            </>
          )}
        </div>
      </div>
      <Modal
        title="Create a New Template"
        isShowing={isModalShowing}
        hide={toggleModal}
      >
        <NewTemplateForm
          handleSubmit={handleAddTemplate}
          handleCancel={toggleModal}
        />
      </Modal>
      <Modal
        title="Edit Template"
        isShowing={isEditModalShowing}
        hide={toggleEditModal}
      >
        <EditTemplateForm
          handleSubmit={handleEditTemplate}
          handleCancel={toggleEditModal}
          editModalInitialState={editModalInitialState}
        />
      </Modal>
    </>
  );
}

function TemplateListView({ templates, setEditModalInitialStateAndToggle, handleRemove }) {
  return (
    <div className={cx('template-list-wrapper')}>
      <div className={cx('template-list-header')}>
        <div>Name</div>
        <div />
        <div />
      </div>
      <div className={cx('template-list')}>
        {templates?.map((template) => (
          <TemplateListItem
            data={template}
            key={template.id}
            setEditModalInitialStateAndToggle={setEditModalInitialStateAndToggle}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
}

function TemplateListItem({ data, onRemove, setEditModalInitialStateAndToggle }) {
  return (
    <>
      <div className={cx('template-list-item')}>
        <div>{data.name}</div>
        <div>
          <Button
            onClick={() => setEditModalInitialStateAndToggle(data)}
          >
            <EditIcon />
          </Button>
        </div>
        <div>
          <Button onClick={onRemove(data.name)}>
            <TrashIcon />
          </Button>
        </div>
      </div>
    </>
  );
}

NewTemplateForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

EditTemplateForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  editModalInitialState: PropTypes.shape({
    name: PropTypes.string,
    data: PropTypes.string,
  }).isRequired,
};

TemplateListView.propTypes = {
  templates: PropTypes.arrayOf(PropTypes.shape),
  setEditModalInitialStateAndToggle: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

TemplateListView.defaultProps = {
  templates: [],
};

TemplateListItem.propTypes = {
  data: PropTypes.shape({ name: PropTypes.string }).isRequired,
  setEditModalInitialStateAndToggle: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};
