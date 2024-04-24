#!/usr/bin/env bash
set -euo pipefail

function update_result_paths_with_env_vars() {
	sed -r '/test-results\/.*(png|webm)/s!(../)?test-results/!CI_PROJECT_URL/-/jobs/CI_JOB_ID/artifacts/raw/test-results/!g'
}


function replace_env_vars_with_url() {
	sed -e "s!CI_PROJECT_URL!${CI_PROJECT_URL}!g" -e "s!CI_JOB_ID!${CI_JOB_ID}!g"
}

update_result_paths_with_env_vars <junit-results.xml >junit-results-envvars.xml
replace_env_vars_with_url <junit-results-envvars.xml >junit-results.xml
