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
  return "${ret_code}"
}

# It will be called before each test is run.
setUp() {
  [ -f "./site_config.json" ] && rm "./site_config.json"
  [ -f "./result.json" ] && rm "./result.json"
  return 0
}

# It will be called after each test completes.
tearDown() {
  return 0
}

# It will be called after the last test completes.
oneTimeTearDown() {
  [ -f "./site_config.json" ] && rm "./site_config.json"
  [ -f "./result.json" ] && rm "./result.json"
  return 0
}

testCreateSiteMissingPathArgument() {
  $cmd -- -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testCreateSiteMissingMethodArgument() {
  config_file="resources/mocks/success/site/valid_site.json"
  aux_config_file="site_config.json"
  id=`awk 'BEGIN {srand(); print srand()}'`
  jq --arg x "$id" '.site.id = $x' "../${config_file}" > "${aux_config_file}"
  $cmd -- -p "${aux_config_file}" >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testCreateSiteIncorrectPathArgument() {
  config_file="resources/mocks/fake.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testCreateSiteIncorrectMethodArgument() {
  config_file="resources/mocks/success/site/valid_site.json"
  aux_config_file="site_config.json"
  id=`awk 'BEGIN {srand(); print srand()}'`
  jq --arg x "$id" '.site.id = $x' "../${config_file}" > "${aux_config_file}"
  $cmd -- -p "./tests/${aux_config_file}" -m createSiteFake >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testCreateSiteMissingConfigData() {
  config_file="resources/mocks/fail/setup/missing_config.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteMissingBocaUrl() {
  config_file="resources/mocks/fail/setup/missing_url.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteMissingResultFilePath() {
  config_file="resources/mocks/success/setup/missing_result_file_path_admin.json"
  aux_config_file="site_config.json"
  id=`awk 'BEGIN {srand(); print srand()}'`
  jq --arg x "$id" '.site.id = $x' "../${config_file}" > "${aux_config_file}"
  $cmd -- -p "./tests/${aux_config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"
}

testCreateSiteInvalidBocaUrl() {
  config_file="resources/mocks/fail/setup/invalid_url.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteInvalidResultFilePath() {
  config_file="resources/mocks/fail/setup/invalid_result_file_path.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"

  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  ret_code=$([ -f "${file_path}" ] && echo "${RET_SUCCESS}" || echo "${RET_CONFIG_VALIDATION}")
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteIncorrectBocaUrl() {
  config_file="resources/mocks/fail/setup/incorrect_url.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteIncorrectResultFilePath() {
  config_file="resources/mocks/fail/setup/incorrect_result_file_path.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteMissingLoginData() {
  config_file="resources/mocks/fail/login/missing_login.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteMissingUsername() {
  config_file="resources/mocks/fail/login/missing_username.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteMissingPassword() {
  config_file="resources/mocks/fail/login/missing_password.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteInvalidUsername() {
  config_file="resources/mocks/fail/login/invalid_username.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteInvalidPassword() {
  config_file="resources/mocks/fail/login/invalid_password.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteIncorrectUsername() {
  config_file="resources/mocks/fail/login/incorrect_username.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteIncorrectPassword() {
  config_file="resources/mocks/fail/login/incorrect_password.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteMissingSiteData() {
  config_file="resources/mocks/fail/site/missing_site.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteMissingId() {
  config_file="resources/mocks/fail/site/missing_id.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteMissingName() {
  config_file="resources/mocks/success/site/missing_name.json"
  field="name"
  testCreateValidSite "${config_file}" "${field}"
}

testCreateSiteMissingStartDate() {
  config_file="resources/mocks/success/site/missing_start_date.json"
  field="startDate"
  testCreateValidSite "${config_file}" "${field}"
}

testCreateSiteMissingEndDate() {
  config_file="resources/mocks/success/site/missing_end_date.json"
  field="endDate"
  testCreateValidSite "${config_file}" "${field}"
}

testCreateSiteMissingStopAnsweringDate() {
  config_file="resources/mocks/success/site/missing_stop_answering_date.json"
  field="stopAnsweringDate"
  testCreateValidSite "${config_file}" "${field}"
}

testCreateSiteMissingStopScoreboardDate() {
  config_file="resources/mocks/success/site/missing_stop_scoreboard_date.json"
  field="stopScoreboardDate"
  testCreateValidSite "${config_file}" "${field}"
}

testCreateSiteMissingRunsClarsSiteIds() {
  config_file="resources/mocks/success/site/missing_runs_clars.json"
  field="runsClarsSiteIds"
  testCreateValidSite "${config_file}" "${field}"
}

testCreateSiteMissingTasksSiteIds() {
  config_file="resources/mocks/success/site/missing_tasks.json"
  field="tasksSiteIds"
  testCreateValidSite "${config_file}" "${field}"
}

testCreateSiteMissingGlobalScoreSiteIds() {
  config_file="resources/mocks/success/site/missing_global_score.json"
  field="globalScoreSiteIds"
  testCreateValidSite "${config_file}" "${field}"
}

testCreateSiteMissingChiefUsername() {
  config_file="resources/mocks/success/site/missing_chief.json"
  field="chiefUsername"
  testCreateValidSite "${config_file}" "${field}"
}

testCreateSiteMissingActive() {
  config_file="resources/mocks/success/site/missing_active.json"
  field="isActive"
  testCreateValidSite "${config_file}" "${field}"
}

testCreateSiteMissingAutoEnd() {
  config_file="resources/mocks/success/site/missing_auto_end.json"
  field="enableAutoEnd"
  testCreateValidSite "${config_file}" "${field}"
}

testCreateSiteMissingAutoJudge() {
  config_file="resources/mocks/success/site/missing_auto_judge.json"
  field="enableAutoJudge"
  testCreateValidSite "${config_file}" "${field}"
}

testCreateSiteMissingScoreLevel() {
  config_file="resources/mocks/success/site/missing_score_level.json"
  field="scoreLevel"
  testCreateValidSite "${config_file}" "${field}"
}

testCreateSiteInvalidId() {
  config_file="resources/mocks/fail/site/invalid_id.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteInvalidName() {
  config_file="resources/mocks/fail/site/invalid_name.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteInvalidStartDate() {
  config_file="resources/mocks/fail/site/invalid_start_date.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteInvalidEndDate() {
  config_file="resources/mocks/fail/site/invalid_end_date.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteInvalidStopAnsweringDate() {
  config_file="resources/mocks/fail/site/invalid_stop_answering_date.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteInvalidStopScoreboardDate() {
  config_file="resources/mocks/fail/site/invalid_stop_scoreboard_date.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteInvalidRunsClarsSiteIds() {
  config_file="resources/mocks/fail/site/invalid_runs_clars.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteInvalidTasksSiteIds() {
  config_file="resources/mocks/fail/site/invalid_tasks.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteInvalidGlobalScoreSiteIds() {
  config_file="resources/mocks/fail/site/invalid_global_score.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteInvalidChiefUsername() {
  config_file="resources/mocks/fail/site/invalid_chief.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteInvalidActive() {
  config_file="resources/mocks/fail/site/invalid_active.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteInvalidAutoEnd() {
  config_file="resources/mocks/fail/site/invalid_auto_end.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteInvalidAutoJudge() {
  config_file="resources/mocks/fail/site/invalid_auto_judge.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteInvalidScoreLevel() {
  config_file="resources/mocks/fail/site/invalid_score_level.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteIncorrectId() {
  config_file="resources/mocks/success/site/valid_site.json"
  # ID already in use
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_SITE_ERROR}" "${ret_code}"
}

testCreateSiteIncorrectStartDate() {
  config_file="resources/mocks/success/site/incorrect_start_date.json"
  field="startDate"
  testCreateValidSite "${config_file}" "${field}"
}

testCreateSiteIncorrectEndDate() {
  config_file="resources/mocks/success/site/incorrect_end_date.json"
  field="endDate"
  testCreateValidSite "${config_file}" "${field}"
}

testCreateSiteIncorrectStopAnsweringDate() {
  config_file="resources/mocks/success/site/incorrect_stop_answering_date.json"
  field="stopAnsweringDate"
  testCreateValidSite "${config_file}" "${field}"
}

testCreateSiteIncorrectStopScoreboardDate() {
  config_file="resources/mocks/success/site/incorrect_stop_scoreboard_date.json"
  field="stopScoreboardDate"
  testCreateValidSite "${config_file}" "${field}"
}

testCreateSiteIncorrectActive() {
  config_file="resources/mocks/fail/site/incorrect_active.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteIncorrectAutoEnd() {
  config_file="resources/mocks/fail/site/incorrect_auto_end.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteIncorrectAutoJudge() {
  config_file="resources/mocks/fail/site/incorrect_auto_judge.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateSiteIncorrectScoreLevel() {
  config_file="resources/mocks/fail/site/incorrect_score_level.json"
  $cmd -- -p "${config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateValidSite() {
  if [ -n "$1" ]; then
    config_file="$1"
  else
    config_file="resources/mocks/success/site/valid_site.json"
  fi

  aux_config_file="site_config.json"
  id=`awk 'BEGIN {srand(); print srand()}'`
  jq --arg x "$id" '.site.id = $x' "../${config_file}" > "${aux_config_file}"
  $cmd -- -p "./tests/${aux_config_file}" -m createSite >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"

  # Check if the result file was created
  file_path=$(jq -r '.config.resultFilePath' "${aux_config_file}")
  [ -f "../${file_path}" ]
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"

  # Check if the created site has a valid id
  jq -e '.id != null and .id != ""' "../${file_path}" >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"

  # Check if the site was created according to the configuration file
  if [ -n "$2" ]; then
    jsonIn=$(jq -S --arg f "$2" '.site | del(.[$f])' "${aux_config_file}")
    jsonOut=$(jq -S --arg f "$2" 'del(.[$f])' "../${file_path}")
  else
    jsonIn=$(jq -S '.site' "${aux_config_file}")
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
