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
  # Check if site exists. If not, create it.
  # TODO
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

testImportUsersMissingPathArgument() {
  $cmd -- -m importUsers >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testImportUsersMissingMethodArgument() {
  config_file="resources/mocks/success/user/valid_users.json"
  $cmd -- -p "${config_file}" >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testImportUsersIncorrectPathArgument() {
  config_file="resources/mocks/fake.json"
  $cmd -- -p "${config_file}" -m importUsers >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testImportUsersIncorrectMethodArgument() {
  config_file="resources/mocks/success/user/valid_users.json"
  $cmd -- -p "${config_file}" -m importUsersFake >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testImportUsersMissingConfigData() {
  config_file="resources/mocks/fail/setup/missing_config.json"
  $cmd -- -p "${config_file}" -m importUsers >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testImportUsersMissingBocaUrl() {
  config_file="resources/mocks/fail/setup/missing_url.json"
  $cmd -- -p "${config_file}" -m importUsers >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testImportUsersMissingResultFilePath() {
  config_file="resources/mocks/success/setup/missing_result_file_path_admin.json"
  $cmd -- -p "${config_file}" -m importUsers >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"
}

testImportUsersInvalidBocaUrl() {
  config_file="resources/mocks/fail/setup/invalid_url.json"
  $cmd -- -p "${config_file}" -m importUsers >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testImportUsersInvalidResultFilePath() {
  config_file="resources/mocks/fail/setup/invalid_result_file_path.json"
  $cmd -- -p "${config_file}" -m importUsers >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"

  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  ret_code=$([ -f "${file_path}" ] && echo "${RET_SUCCESS}" || echo "${RET_CONFIG_VALIDATION}")
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testImportUsersIncorrectBocaUrl() {
  config_file="resources/mocks/fail/setup/incorrect_url.json"
  $cmd -- -p "${config_file}" -m importUsers >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testImportUsersIncorrectResultFilePath() {
  config_file="resources/mocks/fail/setup/incorrect_result_file_path.json"
  $cmd -- -p "${config_file}" -m importUsers >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testImportUsersMissingLoginData() {
  config_file="resources/mocks/fail/login/missing_login.json"
  $cmd -- -p "${config_file}" -m importUsers >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testImportUsersMissingUsername() {
  config_file="resources/mocks/fail/login/missing_username.json"
  $cmd -- -p "${config_file}" -m importUsers >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testImportUsersMissingPassword() {
  config_file="resources/mocks/fail/login/missing_password.json"
  $cmd -- -p "${config_file}" -m importUsers >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testImportUsersInvalidUsername() {
  config_file="resources/mocks/fail/login/invalid_username.json"
  $cmd -- -p "${config_file}" -m importUsers >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testImportUsersInvalidPassword() {
  config_file="resources/mocks/fail/login/invalid_password.json"
  $cmd -- -p "${config_file}" -m importUsers >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testImportUsersIncorrectUsername() {
  config_file="resources/mocks/fail/login/incorrect_username.json"
  $cmd -- -p "${config_file}" -m importUsers >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testImportUsersIncorrectPassword() {
  config_file="resources/mocks/fail/login/incorrect_password.json"
  $cmd -- -p "${config_file}" -m importUsers >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testImportUsersMissingUserData() {
  config_file="resources/mocks/fail/user/missing_user.json"
  $cmd -- -p "${config_file}" -m importUsers >/dev/null 2>&1;
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testImportUsersMissingUserFilePath() {
  config_file="resources/mocks/fail/user/missing_user_file_path.json"
  $cmd -- -p "${config_file}" -m importUsers >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testImportUsersInvalidUserFilePath() {
  config_file="resources/mocks/fail/user/invalid_user_file_path.json"
  $cmd -- -p "${config_file}" -m importUsers >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testImportUsersIncorrectUserFilePath() {
  config_file="resources/mocks/fail/user/incorrect_user_file_path.json"
  $cmd -- -p "${config_file}" -m importUsers >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testImportValidUserFile() {
  config_file="resources/mocks/success/user/valid_users.json"
  $cmd -- -p "${config_file}" -m importUsers >/dev/null 2>&1
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
