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

oneTimeTearDown() {
  [ -f "./result.json" ] && rm "./result.json"
  return 0
}

testDeleteUserMissingPathArgument() {
  npm run test:cli -- -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_ARGS $ret_code
}

testDeleteUserMissingMethodArgument() {
  config_file="resources/mocks/success/user/valid_user.json"
  npm run test:cli -- -p "${config_file}" >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_ARGS $ret_code
}

testDeleteUserInvalidPathArgument() {
  config_file="resources/mocks/fake.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_ARGS $ret_code
}

testDeleteUserInvalidMethodArgument() {
  config_file="resources/mocks/success/user/valid_user.json"
  npm run test:cli -- -p "${config_file}" -m deleteUserFake >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_ARGS $ret_code
}

testDeleteUserMissingConfigData() {
  config_file="resources/mocks/fail/setup/missing_config.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteUserMissingBocaUrl() {
  config_file="resources/mocks/fail/setup/missing_url.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteUserMissingResultFilePath() {
  config_file="resources/mocks/success/setup/missing_result_file_path_admin.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code
}

testDeleteUserInvalidBocaUrl() {
  config_file="resources/mocks/fail/setup/invalid_url.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteUserInvalidResultFilePath() {
  config_file="resources/mocks/fail/setup/invalid_result_file_path.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code

  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  ret_code=`[ -f "${file_path}" ] && echo $RET_SUCCESS || echo $RET_INVALID_CONFIG`
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteUserIncorrectBocaUrl() {
  config_file="resources/mocks/fail/setup/incorrect_url.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteUserIncorrectResultFilePath() {
  config_file="resources/mocks/fail/setup/incorrect_result_file_path.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteUserMissingLoginData() {
  config_file="resources/mocks/fail/login/missing_login.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteUserMissingUsername() {
  config_file="resources/mocks/fail/login/missing_username.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteUserMissingPassword() {
  config_file="resources/mocks/fail/login/missing_password.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteUserInvalidUsername() {
  config_file="resources/mocks/fail/login/invalid_username.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteUserInvalidPassword() {
  config_file="resources/mocks/fail/login/invalid_password.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteUserIncorrectUsername() {
  config_file="resources/mocks/fail/login/incorrect_username.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteUserIncorrectPassword() {
  config_file="resources/mocks/fail/login/incorrect_password.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteUserMissingUserData() {
  config_file="resources/mocks/fail/user/missing_user.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteUserMissingSite() {
  config_file="resources/mocks/success/user/missing_site.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteUserMissingId() {
  config_file="resources/mocks/fail/user/missing_id.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteUserInvalidSite() {
  config_file="resources/mocks/fail/user/invalid_site.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteUserInvalidId() {
  config_file="resources/mocks/fail/user/invalid_id.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteUserIncorrectSite() {
  config_file="resources/mocks/fail/user/incorrect_site.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteUserIncorrectId() {
  config_file="resources/mocks/fail/user/incorrect_id.json"
  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testDeleteValidUser() {
  if [ -n "$1" ];
  then
    config_file="$1"
  else
    config_file="resources/mocks/success/user/valid_user.json"
  fi

  npm run test:cli -- -p "${config_file}" -m deleteUser >/dev/null 2>&1;
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
