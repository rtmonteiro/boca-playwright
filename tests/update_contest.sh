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
export RET_CONTEST_ERROR=14

# It will be called before the first test is run.
oneTimeSetUp() {
  # Check if contest exists. If not, create it.
  config_file="resources/mocks/success/contest/valid_contest.json"
  npm run test:cli -- -p "${config_file}" -m getContest >/dev/null 2>&1
  ret_code=$?
  if [ "${ret_code}" != "${RET_SUCCESS}" ]; then
    npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1
    ret_code=$?
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

testUpdateContestMissingPathArgument() {
  npm run test:cli -- -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testUpdateContestMissingMethodArgument() {
  config_file="resources/mocks/success/contest/valid_contest.json"
  npm run test:cli -- -p "${config_file}" >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testUpdateContestIncorrectPathArgument() {
  config_file="resources/mocks/fake.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testUpdateContestIncorrectMethodArgument() {
  config_file="resources/mocks/success/contest/valid_contest.json"
  npm run test:cli -- -p "${config_file}" -m updateContestFake >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testUpdateContestMissingConfigData() {
  config_file="resources/mocks/fail/setup/missing_config.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestMissingBocaUrl() {
  config_file="resources/mocks/fail/setup/missing_url.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestMissingResultFilePath() {
  config_file="resources/mocks/success/setup/missing_result_file_path_system.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"
}

testUpdateContestInvalidBocaUrl() {
  config_file="resources/mocks/fail/setup/invalid_url.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestInvalidResultFilePath() {
  config_file="resources/mocks/fail/setup/invalid_result_file_path.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"

  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  ret_code=$([ -f "${file_path}" ] && echo "${RET_SUCCESS}" || echo "${RET_CONFIG_VALIDATION}")
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestIncorrectBocaUrl() {
  config_file="resources/mocks/fail/setup/incorrect_url.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestIncorrectResultFilePath() {
  config_file="resources/mocks/fail/setup/incorrect_result_file_path.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestMissingLoginData() {
  config_file="resources/mocks/fail/login/missing_login.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestMissingUsername() {
  config_file="resources/mocks/fail/login/missing_username.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestMissingPassword() {
  config_file="resources/mocks/fail/login/missing_password.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestInvalidUsername() {
  config_file="resources/mocks/fail/login/invalid_username.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestInvalidPassword() {
  config_file="resources/mocks/fail/login/invalid_password.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestIncorrectUsername() {
  config_file="resources/mocks/fail/login/incorrect_username.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestIncorrectPassword() {
  config_file="resources/mocks/fail/login/incorrect_password.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestMissingContestData() {
  config_file="resources/mocks/fail/contest/missing_contest.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestMissingId() {
  config_file="resources/mocks/fail/contest/missing_id.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestMissingName() {
  config_file="resources/mocks/success/contest/missing_name.json"
  field="name"
  testUpdateValidContest "${config_file}" "${field}"
}

testUpdateContestMissingStartDate() {
  config_file="resources/mocks/success/contest/missing_start_date.json"
  field="startDate"
  testUpdateValidContest "${config_file}" "${field}"
}

testUpdateContestMissingEndDate() {
  config_file="resources/mocks/success/contest/missing_end_date.json"
  field="endDate"
  testUpdateValidContest "${config_file}" "${field}"
}

testUpdateContestMissingStopAnsweringDate() {
  config_file="resources/mocks/success/contest/missing_stop_answering_date.json"
  field="stopAnsweringDate"
  testUpdateValidContest "${config_file}" "${field}"
}

testUpdateContestMissingStopScoreboardDate() {
  config_file="resources/mocks/success/contest/missing_stop_scoreboard_date.json"
  field="stopScoreboardDate"
  testUpdateValidContest "${config_file}" "${field}"
}

testUpdateContestMissingPenalty() {
  config_file="resources/mocks/success/contest/missing_penalty.json"
  field="penalty"
  testUpdateValidContest "${config_file}" "${field}"
}

testUpdateContestMissingMaxFileSize() {
  config_file="resources/mocks/success/contest/missing_max_file_size.json"
  field="maxFileSize"
  testUpdateValidContest "${config_file}" "${field}"
}

testUpdateContestMissingMainSiteUrl() {
  config_file="resources/mocks/success/contest/missing_main_site_url.json"
  field="mainSiteUrl"
  testUpdateValidContest "${config_file}" "${field}"
}

testUpdateContestMissingMainSiteId() {
  config_file="resources/mocks/success/contest/missing_main_site_id.json"
  field="mainSiteId"
  testUpdateValidContest "${config_file}" "${field}"
}

testUpdateContestMissingLocalSiteId() {
  config_file="resources/mocks/success/contest/missing_local_site_id.json"
  field="localSiteId"
  testUpdateValidContest "${config_file}" "${field}"
}

testUpdateContestInvalidId() {
  config_file="resources/mocks/fail/contest/invalid_id.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestInvalidName() {
  config_file="resources/mocks/fail/contest/invalid_name.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestInvalidStartDate() {
  config_file="resources/mocks/fail/contest/invalid_start_date.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestInvalidEndDate() {
  config_file="resources/mocks/fail/contest/invalid_end_date.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestInvalidStopAnsweringDate() {
  config_file="resources/mocks/fail/contest/invalid_stop_answering_date.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestInvalidStopScoreboardDate() {
  config_file="resources/mocks/fail/contest/invalid_stop_scoreboard_date.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestInvalidPenalty() {
  config_file="resources/mocks/fail/contest/invalid_penalty.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestInvalidMaxFileSize() {
  config_file="resources/mocks/fail/contest/invalid_max_file_size.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestInvalidMainSiteUrl() {
  config_file="resources/mocks/fail/contest/invalid_main_site_url.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestInvalidMainSiteId() {
  config_file="resources/mocks/fail/contest/invalid_main_site_id.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestInvalidLocalSiteId() {
  config_file="resources/mocks/fail/contest/invalid_local_site_id.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestIncorrectId() {
  config_file="resources/mocks/fail/contest/incorrect_id.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONTEST_ERROR}" "${ret_code}"
}

testUpdateContestIncorrectStartDate() {
  config_file="resources/mocks/success/contest/incorrect_start_date.json"
  field="startDate"
  testUpdateValidContest "${config_file}" "${field}"
}

testUpdateContestIncorrectEndDate() {
  config_file="resources/mocks/success/contest/incorrect_end_date.json"
  field="endDate"
  testUpdateValidContest "${config_file}" "${field}"
}

testUpdateContestIncorrectStopAnsweringDate() {
  config_file="resources/mocks/success/contest/incorrect_stop_answering_date.json"
  field="stopAnsweringDate"
  testUpdateValidContest "${config_file}" "${field}"
}

testUpdateContestIncorrectStopScoreboardDate() {
  config_file="resources/mocks/success/contest/incorrect_stop_scoreboard_date.json"
  field="stopScoreboardDate"
  testUpdateValidContest "${config_file}" "${field}"
}

testUpdateContestIncorrectPenalty() {
  config_file="resources/mocks/fail/contest/incorrect_penalty.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestIncorrectMaxFileSize() {
  config_file="resources/mocks/fail/contest/incorrect_max_file_size.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestIncorrectMainSiteId() {
  config_file="resources/mocks/fail/contest/incorrect_main_site_id.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateContestIncorrectLocalSiteId() {
  config_file="resources/mocks/fail/contest/incorrect_local_site_id.json"
  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateValidContest() {
  if [ -n "$1" ]; then
    config_file="$1"
  else
    config_file="resources/mocks/success/contest/valid_contest.json"
  fi

  npm run test:cli -- -p "${config_file}" -m updateContest >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"

  # Check if the result file was created
  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  [ -f "../${file_path}" ]
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"

  # Check if the contest was updated according to the configuration file
  if [ -n "$2" ]; then
    jsonIn=$(jq -S --arg f "$2" '.contest | del(.[$f])' "../${config_file}")
    jsonOut=$(jq -S --arg f "$2" 'del(.isActive, .[$f])' "../${file_path}")
  else
    jsonIn=$(jq -S '.contest' "../${config_file}")
    jsonOut=$(jq -S 'del(.isActive)' "../${file_path}")
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
