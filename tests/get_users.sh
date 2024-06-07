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

# It will be called before the first test is run.
oneTimeSetUp() {
  # Check if contest exists. If not, create it.
  config_file="resources/mocks/success/contest/valid_contest.json"
  npm run test:cli -- -p "${config_file}" -m getContest >/dev/null 2>&1;
  ret_code=$?
  if [ $ret_code != $RET_SUCCESS ];
  then
    npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
    ret_code=$?
  fi
  # Activate contest.
  if [ $ret_code = $RET_SUCCESS ];
  then
    npm run test:cli -- -p "${config_file}" -m activateContest >/dev/null 2>&1;
    ret_code=$?
  fi
  # Check if site exists. If not, create it.
  # TODO
  return $ret_code
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
  # [ -f "./result.json" ] && rm "./result.json"
  return 0
}

testGetUsersMissingPathArgument() {
  npm run test:cli -- -m getUsers >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_ARGS_VALIDATION $ret_code
}

testGetUsersMissingMethodArgument() {
  config_file="resources/mocks/success/user/valid_user.json"
  npm run test:cli -- -p "${config_file}" >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_ARGS_VALIDATION $ret_code
}

testGetUsersIncorrectPathArgument() {
  config_file="resources/mocks/fake.json"
  npm run test:cli -- -p "${config_file}" -m getUsers >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_ARGS_VALIDATION $ret_code
}

testGetUsersIncorrectMethodArgument() {
  config_file="resources/mocks/success/user/valid_user.json"
  npm run test:cli -- -p "${config_file}" -m getUsersFake >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_ARGS_VALIDATION $ret_code
}

testGetUsersMissingConfigData() {
  config_file="resources/mocks/fail/setup/missing_config.json"
  npm run test:cli -- -p "${config_file}" -m getUsers >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetUsersMissingBocaUrl() {
  config_file="resources/mocks/fail/setup/missing_url.json"
  npm run test:cli -- -p "${config_file}" -m getUsers >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetUsersMissingResultFilePath() {
  config_file="resources/mocks/success/setup/missing_result_file_path_admin.json"
  npm run test:cli -- -p "${config_file}" -m getUsers >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code
}

testGetUsersInvalidBocaUrl() {
  config_file="resources/mocks/fail/setup/invalid_url.json"
  npm run test:cli -- -p "${config_file}" -m getUsers >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetUsersInvalidResultFilePath() {
  config_file="resources/mocks/fail/setup/invalid_result_file_path.json"
  npm run test:cli -- -p "${config_file}" -m getUsers >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code

  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  ret_code=`[ -f "${file_path}" ] && echo $RET_SUCCESS || echo $RET_CONFIG_VALIDATION`
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetUsersIncorrectBocaUrl() {
  config_file="resources/mocks/fail/setup/incorrect_url.json"
  npm run test:cli -- -p "${config_file}" -m getUsers >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetUsersIncorrectResultFilePath() {
  config_file="resources/mocks/fail/setup/incorrect_result_file_path.json"
  npm run test:cli -- -p "${config_file}" -m getUsers >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetUsersMissingLoginData() {
  config_file="resources/mocks/fail/login/missing_login.json"
  npm run test:cli -- -p "${config_file}" -m getUsers >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetUsersMissingUsername() {
  config_file="resources/mocks/fail/login/missing_username.json"
  npm run test:cli -- -p "${config_file}" -m getUsers >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetUsersMissingPassword() {
  config_file="resources/mocks/fail/login/missing_password.json"
  npm run test:cli -- -p "${config_file}" -m getUsers >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetUsersInvalidUsername() {
  config_file="resources/mocks/fail/login/invalid_username.json"
  npm run test:cli -- -p "${config_file}" -m getUsers >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetUsersInvalidPassword() {
  config_file="resources/mocks/fail/login/invalid_password.json"
  npm run test:cli -- -p "${config_file}" -m getUsers >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetUsersIncorrectUsername() {
  config_file="resources/mocks/fail/login/incorrect_username.json"
  npm run test:cli -- -p "${config_file}" -m getUsers >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetUsersIncorrectPassword() {
  config_file="resources/mocks/fail/login/incorrect_password.json"
  npm run test:cli -- -p "${config_file}" -m getUsers >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetUsersMissingUserData() {
  config_file="resources/mocks/fail/user/missing_user.json"
  testGetValidUsers $config_file
}

testGetValidUsers() {
  if [ -n "$1" ];
  then
    config_file="$1"
  else
    config_file="resources/mocks/success/user/valid_user.json"
  fi

  npm run test:cli -- -p "${config_file}" -m getUsers >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code

  # Check if the result file was created
  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  [ -f "../${file_path}" ]
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
