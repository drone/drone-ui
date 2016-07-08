import React from 'react';
import {Link} from 'react-router';

import BuildPanel from '../../components/build_panel';
import PageContent from '../../components/layout/content';
import JobListItem from '../../components/job_list_item';

export class Matrix extends React.Component {

  render() {
    const {repo, build} = this.props;

    function renderJob(job) {
      return (
        <Link key={job.number} to={`/${repo.owner}/${repo.name}/${build.number}/${job.number}`}>
          <JobListItem repo={repo} build={build} job={job} />
        </Link>
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
