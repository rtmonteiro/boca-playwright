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
export RET_INVALID_ARGS=1
export RET_INVALID_CONFIG=2

# It will be called before each test is run.
setUp() {
  return 0
}

# It will be called after each test completes.
tearDown() {
  return 0
}

testCreateContestMissingPathArgument() {
  npm run test:cli -- -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_ARGS $ret_code
}

testCreateContestMissingMethodArgument() {
  config_file="resources/mocks/success/contest/create_contest.json"
  npm run test:cli -- -p "${config_file}" >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_ARGS $ret_code
}

testCreateContestInvalidPathArgument() {
  config_file="resources/mocks/fake.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_ARGS $ret_code
}

testCreateContestInvalidMethodArgument() {
  config_file="resources/mocks/success/contest/create_contest.json"
  npm run test:cli -- -p "${config_file}" -m createContestFake >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_ARGS $ret_code
}

testCreateContestMissingConfigData() {
  config_file="resources/mocks/fail/setup/missing_config.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestMissingBocaUrl() {
  config_file="resources/mocks/fail/setup/missing_config.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestMissingResultFilePath() {
  config_file="resources/mocks/success/setup/missing_result_file_path.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code
}

testCreateContestInvalidBocaUrl() {
  config_file="resources/mocks/fail/setup/invalid_url.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestInvalidResultFilePath() {
  config_file="resources/mocks/success/setup/invalid_result_file_path.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code

  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  ret_code=`[ -f "${file_path}" ] && echo $RET_SUCCESS || echo $RET_INVALID_CONFIG`
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestIncorrectBocaUrl() {
  config_file="resources/mocks/fail/setup/incorrect_url.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestMissingLoginData() {
  config_file="resources/mocks/fail/login/missing_login.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestMissingUsername() {
  config_file="resources/mocks/fail/login/missing_username.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestMissingPassword() {
  config_file="resources/mocks/fail/login/missing_password.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestInvalidUsername() {
  config_file="resources/mocks/fail/login/invalid_username.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestInvalidPassword() {
  config_file="resources/mocks/fail/login/invalid_password.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestIncorrectUsername() {
  config_file="resources/mocks/fail/login/incorrect_username.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestIncorrectPassword() {
  config_file="resources/mocks/fail/login/incorrect_password.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestMissingContestData() {
  config_file="resources/mocks/success/contest/missing_contest.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code
}

testCreateContestMissingName() {
  config_file="resources/mocks/success/contest/missing_name.json"
  field="name"
  testCreateValidContest $config_file $field
}

testCreateContestMissingStartDate() {
  config_file="resources/mocks/success/contest/missing_start_date.json"
  field="startDate"
  testCreateValidContest $config_file $field
}

testCreateContestMissingEndDate() {
  config_file="resources/mocks/success/contest/missing_end_date.json"
  field="endDate"
  testCreateValidContest $config_file $field
}

testCreateContestMissingStopAnsweringDate() {
  config_file="resources/mocks/success/contest/missing_stop_answering_date.json"
  field="stopAnsweringDate"
  testCreateValidContest $config_file $field
}

testCreateContestMissingStopScoreboardDate() {
  config_file="resources/mocks/success/contest/missing_stop_scoreboard_date.json"
  field="stopScoreboardDate"
  testCreateValidContest $config_file $field
}

testCreateContestMissingPenalty() {
  config_file="resources/mocks/success/contest/missing_penalty.json"
  field="penalty"
  testCreateValidContest $config_file $field
}

testCreateContestMissingMaxFileSize() {
  config_file="resources/mocks/success/contest/missing_max_file_size.json"
  field="maxFileSize"
  testCreateValidContest $config_file $field
}

testCreateContestMissingMainSiteUrl() {
  config_file="resources/mocks/success/contest/missing_main_site_url.json"
  field="mainSiteUrl"
  testCreateValidContest $config_file $field
}

testCreateContestMissingMainSiteNumber() {
  config_file="resources/mocks/success/contest/missing_main_site_number.json"
  field="mainSiteNumber"
  testCreateValidContest $config_file $field
}

testCreateContestMissingLocalSiteNumber() {
  config_file="resources/mocks/success/contest/missing_local_site_number.json"
  field="localSiteNumber"
  testCreateValidContest $config_file $field
}

testCreateContestInvalidName() {
  config_file="resources/mocks/fail/contest/invalid_name.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestInvalidStartDate() {
  config_file="resources/mocks/fail/contest/invalid_start_date.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestInvalidEndDate() {
  config_file="resources/mocks/fail/contest/invalid_end_date.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestInvalidStopAnsweringDate() {
  config_file="resources/mocks/fail/contest/invalid_stop_answering_date.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestInvalidStopScoreboardDate() {
  config_file="resources/mocks/fail/contest/invalid_stop_scoreboard_date.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestInvalidPenalty() {
  config_file="resources/mocks/fail/contest/invalid_penalty.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestInvalidMaxFileSize() {
  config_file="resources/mocks/fail/contest/invalid_max_file_size.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestInvalidMainSiteUrl() {
  config_file="resources/mocks/fail/contest/invalid_main_site_url.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestInvalidMainSiteNumber() {
  config_file="resources/mocks/fail/contest/invalid_main_site_number.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestInvalidLocalSiteNumber() {
  config_file="resources/mocks/fail/contest/invalid_local_site_number.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateValidContest() {
  if [ -n "$1" ];
  then
    config_file="$1"
  else
    config_file="resources/mocks/success/contest/create_contest.json"
  fi

  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code

  # Check if the result file was created
  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  [ -f "../${file_path}" ]
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code

  # Check if the created contest has a valid id
  jq -e '.id != null and .id != ""' "../${file_path}" >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code

  # Check if the contest was created according to the configuration file
  jsonIn=$(jq -S '.contest' "../${config_file}")
  if [ -n "$2" ];
  then
    jsonOut=$(jq -S --arg f "$2" 'del(.id, .[$f])' "../${file_path}")
  else
    jsonOut=$(jq -S 'del(.id)' "../${file_path}")
  fi
  [ "$jsonIn" = "$jsonOut" ]
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code
}

echo "This is the current shell:"
# https://www.cyberciti.biz/tips/how-do-i-find-out-what-shell-im-using.html
SHELL=$(ps -p $$)
echo "$SHELL"

# Load and run shUnit2.
if [ ! -d "../shunit2" ] || [ ! -f "../shunit2/shunit2" ];
then
  echo "Missing or noninstalled shUnit2 test framework."
  exit 1
fi

. ../shunit2/shunit2
