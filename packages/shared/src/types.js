/** @typedef {{ id: string, owner: string, name: string, createdAt: string }} RepoSummary */
/** @typedef {{ id: string, title: string, status: string }} IssueSummary */
/** @typedef {{ id: string, title: string, status: string }} PullSummary */

/** @type {RepoSummary} */
export const RepoSummary = {
  id: "",
  owner: "",
  name: "",
  createdAt: ""
};

/** @type {IssueSummary} */
export const IssueSummary = {
  id: "",
  title: "",
  status: ""
};

/** @type {PullSummary} */
export const PullSummary = {
  id: "",
  title: "",
  status: ""
};
