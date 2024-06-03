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

# It will be called before the first test is run.
oneTimeSetup() {
  config_file="resources/mocks/success/contest/valid_contest.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  # ret_code1=$?
  # npm run test:cli -- -p "${config_file}" -m activateContest >/dev/null 2>&1;
  # ret_code2=$?
  # [ $ret_code1 = 0 && $ret_code2 = 0 ]
  ret_code=$?
  return $ret_code
}

# It will be called before each test is run.
setUp() {
  config_file="resources/mocks/success/user/valid_user.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
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

testGetUserMissingPathArgument() {
  npm run test:cli -- -m getUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_ARGS $ret_code
}

testGetUserMissingMethodArgument() {
  config_file="resources/mocks/success/user/valid_user.json"
  npm run test:cli -- -p "${config_file}" >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_ARGS $ret_code
}

testGetUserInvalidPathArgument() {
  config_file="resources/mocks/fake.json"
  npm run test:cli -- -p "${config_file}" -m getUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_ARGS $ret_code
}

testGetUserInvalidMethodArgument() {
  config_file="resources/mocks/success/user/valid_user.json"
  npm run test:cli -- -p "${config_file}" -m getUserFake >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_ARGS $ret_code
}

testGetUserMissingConfigData() {
  config_file="resources/mocks/fail/setup/missing_config.json"
  npm run test:cli -- -p "${config_file}" -m getUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testGetUserMissingBocaUrl() {
  config_file="resources/mocks/fail/setup/missing_url.json"
  npm run test:cli -- -p "${config_file}" -m getUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testGetUserMissingResultFilePath() {
  config_file="resources/mocks/success/setup/missing_result_file_path_admin.json"
  npm run test:cli -- -p "${config_file}" -m getUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code
}

testGetUserInvalidBocaUrl() {
  config_file="resources/mocks/fail/setup/invalid_url.json"
  npm run test:cli -- -p "${config_file}" -m getUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testGetUserInvalidResultFilePath() {
  config_file="resources/mocks/fail/setup/invalid_result_file_path.json"
  npm run test:cli -- -p "${config_file}" -m getUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code

  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  ret_code=`[ -f "${file_path}" ] && echo $RET_SUCCESS || echo $RET_INVALID_CONFIG`
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testGetUserIncorrectBocaUrl() {
  config_file="resources/mocks/fail/setup/incorrect_url.json"
  npm run test:cli -- -p "${config_file}" -m getUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testGetUserIncorrectResultFilePath() {
  config_file="resources/mocks/fail/setup/incorrect_result_file_path.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testGetUserMissingLoginData() {
  config_file="resources/mocks/fail/login/missing_login.json"
  npm run test:cli -- -p "${config_file}" -m getUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testGetUserMissingUsername() {
  config_file="resources/mocks/fail/login/missing_username.json"
  npm run test:cli -- -p "${config_file}" -m getUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testGetUserMissingPassword() {
  config_file="resources/mocks/fail/login/missing_password.json"
  npm run test:cli -- -p "${config_file}" -m getUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testGetUserInvalidUsername() {
  config_file="resources/mocks/fail/login/invalid_username.json"
  npm run test:cli -- -p "${config_file}" -m getUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testGetUserInvalidPassword() {
  config_file="resources/mocks/fail/login/invalid_password.json"
  npm run test:cli -- -p "${config_file}" -m getUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testGetUserIncorrectUsername() {
  config_file="resources/mocks/fail/login/incorrect_username.json"
  npm run test:cli -- -p "${config_file}" -m getUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testGetUserIncorrectPassword() {
  config_file="resources/mocks/fail/login/incorrect_password.json"
  npm run test:cli -- -p "${config_file}" -m getUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testGetUserMissingUserData() {
  config_file="resources/mocks/fail/user/missing_user.json"
  npm run test:cli -- -p "${config_file}" -m getUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteUserMissingSite() {
  config_file="resources/mocks/success/user/missing_site.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testGetUserMissingId() {
  config_file="resources/mocks/fail/user/missing_id.json"
  npm run test:cli -- -p "${config_file}" -m getUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteUserInvalidSite() {
  config_file="resources/mocks/fail/user/invalid_site.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testGetUserInvalidId() {
  config_file="resources/mocks/fail/user/invalid_id.json"
  npm run test:cli -- -p "${config_file}" -m getUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteUserIncorrectSite() {
  config_file="resources/mocks/fail/user/incorrect_site.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testGetUserIncorrectId() {
  config_file="resources/mocks/fail/user/incorrect_id.json"
  npm run test:cli -- -p "${config_file}" -m getUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testGetValidUser() {
  if [ -n "$1" ];
  then
    config_file="$1"
  else
    config_file="resources/mocks/success/user/valid_user.json"
  fi

  npm run test:cli -- -p "${config_file}" -m getUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code

  # Check if the result file was created
  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  [ -f "../${file_path}" ]
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code

  # Check if the obtained user has a valid id
  jq -e '.userSiteNumber != null and .userSiteNumber != "" and .userNumber != null and .userNumber != ""' "../${file_path}" >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code

  # Check if the returned user is according to the configuration file
  if [ -n "$2" ];
  then
    jsonIn=$(jq -S --arg f "$2" '.user | del(.userPassword, .[$f])' "../${config_file}")
    jsonOut=$(jq -S --arg f "$2" 'del(.[$f])' "../${file_path}")
  else
    jsonIn=$(jq -S '.user | del(.userPassword)' "../${config_file}")
    jsonOut=$(jq -S '.' "../${file_path}")
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
