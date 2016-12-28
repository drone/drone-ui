import {monkey} from 'baobab';
import {tree} from '../actions/tree';

/**
* Sets filter suggestions in the tree.
*
* @param {object} builds
* @param {string} owner
* @param {string} name
* @returns {void}
*/
export function setSuggestions(builds) {
  let terms = Object.keys(builds).map(k => builds[k]).reduce((dict, build) => {
    dict['author:' + build.author] = true;
    dict['branch:' + build.branch] = true;
    dict['status:' + build.status] = true;
    dict['event:' + build.event] = true;
    if(build.ref.includes('tags')) {
      dict['tag:' + build.ref.replace('refs/tags/', '')] = true;
    }
    if(build.deploy_to !== '') {
      dict['deploy_to:' + build.deploy_to] = true;
    }
    return dict;
  }, {});

  let suggestions = Object.keys(terms)
    .sort((a, b) => a > b)
    .map(item => ({label:item, value:item}));

  if (suggestions.length == 0) {
    tree.unset(['pages', 'repo', 'suggestions']);
  } else {
    tree.set(['pages', 'repo', 'suggestions'], suggestions);
  }
}

/**
* Returns filter test functions.
*
* @param {string} filter - Value passed in the UI. eg. status:success;branch:foo
* @return {function[]} An array of build filter test functions
*/
export function predicates(filter = '') {
  const tags = ['tag', 'branch', 'author', 'status', 'event', 'deploy_to'];

  let criteria = filter.split(';').reduce((criteria, item) => {
    let tag = item.split(':');

    if(tags.includes(tag[0])) { 
      if(criteria.hasOwnProperty(tag[0])) {
        criteria[tag[0]].push(tag[1]);
      } else {
        criteria[tag[0]] = [tag[1]];
      }
    }
    return criteria;
  }, {});

  return Object.keys(criteria).reduce((tests, key) => {
    switch(key) {
    case 'branch':
    case 'author':
    case 'event':
    case 'status':
    case 'deploy_to':
      tests.push(item => {
        return criteria[key].includes(item[key]);
      });
      break;
    case 'tag':
      tests.push(item => {
        return criteria[key].includes(item['ref'].replace('refs/tags/', ''));
      });
      break;
    }
    return tests;
  }, []);
}

/**
* Sets filtered_builds facet to dynamically select builds meeting filter criteria.
*
* @param {string} owner
* @param {string} name
* @returns {void}
*/
export function filteredBuilds(owner, name) {
  tree.set(['filtered_builds', owner, name], monkey(
    ['builds', owner, name],
    ['pages', 'repo', 'build_filter'],
    function(builds, filter) {
      let tests = predicates(filter);
      return Object.keys(builds).reduce((filtered, k) => {
        let build = builds[k];
        if (tests.length > 0) {
          if (tests.every(test => test(build))) {
            filtered[k] = build;
          }
        } else {
          filtered[k] = build;
        }
        return filtered;
      }, {});
    }
  ));
}
