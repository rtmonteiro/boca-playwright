#! /bin/sh
#========================================================================
# Copyright Universidade Federal do Espirito Santo (Ufes)
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
#
# This program is released under license GNU GPL v3+ license.
#
#========================================================================

export RET_SUCCESS=0
export RET_ARGS_VALIDATION=1
export RET_CONFIG_VALIDATION=12
export RET_SITE_ERROR=22

# Check if library command to run tests has been defined.
if [ -z "${cmd}" ]; then
  export cmd="npm run test:cli"
fi

# It will be called before the first test is run.
oneTimeSetUp() {
  # Check if contest exists. If not, create it.
  config_file="resources/mocks/success/contest/valid_contest.json"
  $cmd -- -p "${config_file}" -m getContest >/dev/null 2>&1
  ret_code=$?
  if [ "${ret_code}" != "${RET_SUCCESS}" ]; then
    $cmd -- -p "${config_file}" -m createContest >/dev/null 2>&1
    ret_code=$?
  fi
  # Activate contest.
  if [ "${ret_code}" = "${RET_SUCCESS}" ]; then
    $cmd -- -p "${config_file}" -m activateContest >/dev/null 2>&1
    ret_code=$?
  fi
  # Check if site exists. If it does not, create it.
  if [ "${ret_code}" = "${RET_SUCCESS}" ]; then
    config_file="resources/mocks/success/site/valid_site.json"
    $cmd -- -p "${config_file}" -m getSite >/dev/null 2>&1
    ret_code=$?
    if [ "${ret_code}" != "${RET_SUCCESS}" ]; then
      $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
      ret_code=$?
    fi
  fi
  return "${ret_code}"
}

# It will be called before each test is run.
setUp() {
  [ -f "./result.json" ] && rm "./result.json"
  return 0
}

# It will be called after each test completes.
tearDown() {
  return 0
}

# It will be called after the last test completes.
oneTimeTearDown() {
  [ -f "./result.json" ] && rm "./result.json"
  return 0
}

testUpdateSiteMissingPathArgument() {
  $cmd -- -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testUpdateSiteMissingMethodArgument() {
  config_file="resources/mocks/success/site/valid_site.json"
  $cmd -- -p "${config_file}" >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testUpdateSiteIncorrectPathArgument() {
  config_file="resources/mocks/fake.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testUpdateSiteIncorrectMethodArgument() {
  config_file="resources/mocks/success/site/valid_site.json"
  $cmd -- -p "${config_file}" -m updateSiteFake >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testUpdateSiteMissingConfigData() {
  config_file="resources/mocks/fail/setup/missing_config.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteMissingBocaUrl() {
  config_file="resources/mocks/fail/setup/missing_url.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteMissingResultFilePath() {
  config_file="resources/mocks/success/setup/missing_result_file_path_admin.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"
}

testUpdateSiteInvalidBocaUrl() {
  config_file="resources/mocks/fail/setup/invalid_url.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteInvalidResultFilePath() {
  config_file="resources/mocks/fail/setup/invalid_result_file_path.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"

  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  ret_code=$([ -f "${file_path}" ] && echo "${RET_SUCCESS}" || echo "${RET_CONFIG_VALIDATION}")
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteIncorrectBocaUrl() {
  config_file="resources/mocks/fail/setup/incorrect_url.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteIncorrectResultFilePath() {
  config_file="resources/mocks/fail/setup/incorrect_result_file_path.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteMissingLoginData() {
  config_file="resources/mocks/fail/login/missing_login.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteMissingUsername() {
  config_file="resources/mocks/fail/login/missing_username.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteMissingPassword() {
  config_file="resources/mocks/fail/login/missing_password.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteInvalidUsername() {
  config_file="resources/mocks/fail/login/invalid_username.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteInvalidPassword() {
  config_file="resources/mocks/fail/login/invalid_password.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteIncorrectUsername() {
  config_file="resources/mocks/fail/login/incorrect_username.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteIncorrectPassword() {
  config_file="resources/mocks/fail/login/incorrect_password.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteMissingSiteData() {
  config_file="resources/mocks/fail/site/missing_site.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteMissingId() {
  config_file="resources/mocks/fail/site/missing_id.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteMissingName() {
  config_file="resources/mocks/success/site/missing_name.json"
  field="name"
  testUpdateValidSite "${config_file}" "${field}"
}

testUpdateSiteMissingStartDate() {
  config_file="resources/mocks/success/site/missing_start_date.json"
  field="startDate"
  testUpdateValidSite "${config_file}" "${field}"
}

testUpdateSiteMissingEndDate() {
  config_file="resources/mocks/success/site/missing_end_date.json"
  field="endDate"
  testUpdateValidSite "${config_file}" "${field}"
}

testUpdateSiteMissingStopAnsweringDate() {
  config_file="resources/mocks/success/site/missing_stop_answering_date.json"
  field="stopAnsweringDate"
  testUpdateValidSite "${config_file}" "${field}"
}

testUpdateSiteMissingStopScoreboardDate() {
  config_file="resources/mocks/success/site/missing_stop_scoreboard_date.json"
  field="stopScoreboardDate"
  testUpdateValidSite "${config_file}" "${field}"
}

testUpdateSiteMissingRunsClarsSiteIds() {
  config_file="resources/mocks/success/site/missing_runs_clars.json"
  field="runsClarsSiteIds"
  testUpdateValidSite "${config_file}" "${field}"
}

testUpdateSiteMissingTasksSiteIds() {
  config_file="resources/mocks/success/site/missing_tasks.json"
  field="tasksSiteIds"
  testUpdateValidSite "${config_file}" "${field}"
}

testUpdateSiteMissingGlobalScoreSiteIds() {
  config_file="resources/mocks/success/site/missing_global_score.json"
  field="globalScoreSiteIds"
  testUpdateValidSite "${config_file}" "${field}"
}

testUpdateSiteMissingChiefUsername() {
  config_file="resources/mocks/success/site/missing_chief.json"
  field="chiefUsername"
  testUpdateValidSite "${config_file}" "${field}"
}

testUpdateSiteMissingActive() {
  config_file="resources/mocks/success/site/missing_active.json"
  field="isActive"
  testUpdateValidSite "${config_file}" "${field}"
}

testUpdateSiteMissingAutoEnd() {
  config_file="resources/mocks/success/site/missing_auto_end.json"
  field="enableAutoEnd"
  testUpdateValidSite "${config_file}" "${field}"
}

testUpdateSiteMissingAutoJudge() {
  config_file="resources/mocks/success/site/missing_auto_judge.json"
  field="enableAutoJudge"
  testUpdateValidSite "${config_file}" "${field}"
}

testUpdateSiteMissingScoreLevel() {
  config_file="resources/mocks/success/site/missing_score_level.json"
  field="scoreLevel"
  testUpdateValidSite "${config_file}" "${field}"
}

testUpdateSiteInvalidId() {
  config_file="resources/mocks/fail/site/invalid_id.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteInvalidName() {
  config_file="resources/mocks/fail/site/invalid_name.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteInvalidStartDate() {
  config_file="resources/mocks/fail/site/invalid_start_date.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteInvalidEndDate() {
  config_file="resources/mocks/fail/site/invalid_end_date.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteInvalidStopAnsweringDate() {
  config_file="resources/mocks/fail/site/invalid_stop_answering_date.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteInvalidStopScoreboardDate() {
  config_file="resources/mocks/fail/site/invalid_stop_scoreboard_date.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteInvalidRunsClarsSiteIds() {
  config_file="resources/mocks/fail/site/invalid_runs_clars.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteInvalidTasksSiteIds() {
  config_file="resources/mocks/fail/site/invalid_tasks.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteInvalidGlobalScoreSiteIds() {
  config_file="resources/mocks/fail/site/invalid_global_score.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteInvalidChiefUsername() {
  config_file="resources/mocks/fail/site/invalid_chief.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteInvalidActive() {
  config_file="resources/mocks/fail/site/invalid_active.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteInvalidAutoEnd() {
  config_file="resources/mocks/fail/site/invalid_auto_end.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteInvalidAutoJudge() {
  config_file="resources/mocks/fail/site/invalid_auto_judge.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteInvalidScoreLevel() {
  config_file="resources/mocks/fail/site/invalid_score_level.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteIncorrectId() {
  config_file="resources/mocks/fail/site/incorrect_id.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_SITE_ERROR}" "${ret_code}"
}

testUpdateSiteIncorrectStartDate() {
  config_file="resources/mocks/success/site/incorrect_start_date.json"
  field="startDate"
  testUpdateValidSite "${config_file}" "${field}"
}

testUpdateSiteIncorrectEndDate() {
  config_file="resources/mocks/success/site/incorrect_end_date.json"
  field="endDate"
  testUpdateValidSite "${config_file}" "${field}"
}

testUpdateSiteIncorrectStopAnsweringDate() {
  config_file="resources/mocks/success/site/incorrect_stop_answering_date.json"
  field="stopAnsweringDate"
  testUpdateValidSite "${config_file}" "${field}"
}

testUpdateSiteIncorrectStopScoreboardDate() {
  config_file="resources/mocks/success/site/incorrect_stop_scoreboard_date.json"
  field="stopScoreboardDate"
  testUpdateValidSite "${config_file}" "${field}"
}

testUpdateSiteIncorrectActive() {
  config_file="resources/mocks/fail/site/incorrect_active.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteIncorrectAutoEnd() {
  config_file="resources/mocks/fail/site/incorrect_auto_end.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteIncorrectAutoJudge() {
  config_file="resources/mocks/fail/site/incorrect_auto_judge.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateSiteIncorrectScoreLevel() {
  config_file="resources/mocks/fail/site/incorrect_score_level.json"
  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateValidSite() {
  if [ -n "$1" ]; then
    config_file="$1"
  else
    config_file="resources/mocks/success/site/valid_site.json"
  fi

  $cmd -- -p "${config_file}" -m updateSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"

  # Check if the result file was created
  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  [ -f "../${file_path}" ]
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"

  # Check if the site was created according to the configuration file
  if [ -n "$2" ]; then
    jsonIn=$(jq -S --arg f "$2" '.site | del(.[$f])' "../${config_file}")
    jsonOut=$(jq -S --arg f "$2" 'del(.[$f])' "../${file_path}")
  else
    jsonIn=$(jq -S '.site' "../${config_file}")
    jsonOut=$(jq -S '.' "../${file_path}")
  fi
  [ "${jsonIn}" = "${jsonOut}" ]
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"
}

echo "This is the current shell:"
# https://www.cyberciti.biz/tips/how-do-i-find-out-what-shell-im-using.html
SHELL=$(ps -p $$)
echo "${SHELL}"

# Load and run shUnit2.
if [ ! -d "/opt/shunit2" ] || [ ! -f "/opt/shunit2/shunit2" ];
then
  echo "Missing or noninstalled shUnit2 test framework."
  exit 1
fi

. /opt/shunit2/shunit2
