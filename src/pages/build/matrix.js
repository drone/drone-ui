import BuildPanel from '../../components/build_panel';
import JobListItem from '../../components/job_list_item';
import {Link} from 'react-router';
import PageContent from '../../components/layout/content';
import React from 'react';

export class Matrix extends React.Component {

  render() {
    const {repo, build} = this.props;

    function renderProc(proc) {
      return (
        <Link key={proc.pid} to={`/${repo.owner}/${repo.name}/${build.number}/${proc.pid}`}>
          <JobListItem repo={repo} build={build} job={proc} />
        </Link>
      );
    }

    return (
      <PageContent fluid className="build">
        <BuildPanel build={build} job={build} />
        <div>
          {build.procs && build.procs.map(renderProc)}
        </div>
      </PageContent>
    );
  }
}
