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

  file_path=$(jq '.config.resultFilePath' "../${config_file}")
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
  npm run test:cli -- -p resources/mocks/success/contest/missing_contest.json -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code
}

testCreateContestInvalidName() {
  npm run test:cli -- -p resources/mocks/fail/contest/invalid_name.json -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestInvalidStartDate() {
  npm run test:cli -- -p resources/mocks/fail/contest/invalid_start_date.json -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestInvalidEndDate() {
  npm run test:cli -- -p resources/mocks/fail/contest/invalid_end_date.json -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestInvalidStopAnsweringDate() {
  npm run test:cli -- -p resources/mocks/fail/contest/invalid_stop_answering_date.json -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestInvalidStopScoreboardDate() {
  npm run test:cli -- -p resources/mocks/fail/contest/invalid_stop_scoreboard_date.json -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestInvalidPenalty() {
  npm run test:cli -- -p resources/mocks/fail/contest/invalid_penalty.json -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestInvalidMaxFileSize() {
  npm run test:cli -- -p resources/mocks/fail/contest/invalid_max_file_size.json -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestInvalidMainSiteUrl() {
  npm run test:cli -- -p resources/mocks/fail/contest/invalid_main_site_url.json -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestInvalidMainSiteNumber() {
  npm run test:cli -- -p resources/mocks/fail/contest/invalid_main_site_number.json -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestInvalidLocalSiteNumber() {
  npm run test:cli -- -p resources/mocks/fail/contest/invalid_local_site_number.json -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateContestMissingName() {
  config_file="resources/mocks/success/contest/missing_name.json"
  field="name"
  testCreateValidContest $config_file $field
}

testCreateValidContest() {
  if [ -n $1 ];
  then
    config_file=$1
  else
    config_file="resources/mocks/success/contest/create_contest.json"
  fi

  npm run test:cli -- -p ${config_file} -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code

  # Check if the result file was created
  [ -f "./result.json" ]
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code

  # Check if the created contest has a valid id
  jq -e '.id != null and .id != ""' "./result.json" >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code

  # Check if the contest was created according to the configuration file
  jsonIn=$(jq -S '.contest' "../${config_file}")
  if [ -n $2 ];
  then
    jsonOut=$(jq -S --arg f $2 'del(.id, .[$f])' "./result.json")
  else
    jsonOut=$(jq -S 'del(.id)' "./result.json")
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
