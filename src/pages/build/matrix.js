import React from 'react';

import BuildPanel from '../../components/build_panel';
import PageContent from '../../components/layout/content';
import JobListItem from '../../components/job_list_item';

export class Matrix extends React.Component {

  render() {
    const {repo, build} = this.props;

    function renderJob(job) {
      return (
        <JobListItem key={job.number} repo={repo} build={build} job={job} />
      );
    }

    return (
      <PageContent fluid className="build">
        <BuildPanel build={build} job={build} />
        <div>
          {build.jobs.map(renderJob)}
        </div>
      </PageContent>
    );
  }
}
