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
export RET_USER_ERROR=23

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
  # Activate contest.
  if [ "${ret_code}" = "${RET_SUCCESS}" ]; then
    npm run test:cli -- -p "${config_file}" -m activateContest >/dev/null 2>&1
    ret_code=$?
  fi
  # Check if site exists. If not, create it.
  # TODO
  config_file="resources/mocks/success/user/valid_user.json"
  npm run test:cli -- -p "${config_file}" -m getUser >/dev/null 2>&1
  ret_code=$?
  if [ "${ret_code}" != "${RET_SUCCESS}" ]; then
    npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1
    ret_code=$?
  else
    ret_code="${RET_SUCCESS}"
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

testUpdateUserMissingPathArgument() {
  npm run test:cli -- -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testUpdateUserMissingMethodArgument() {
  config_file="resources/mocks/success/user/valid_user.json"
  npm run test:cli -- -p "${config_file}" >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testUpdateUserIncorrectPathArgument() {
  config_file="resources/mocks/fake.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testUpdateUserIncorrectMethodArgument() {
  config_file="resources/mocks/success/user/valid_user.json"
  npm run test:cli -- -p "${config_file}" -m updateUserFake >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testUpdateUserMissingConfigData() {
  config_file="resources/mocks/fail/setup/missing_config.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserMissingBocaUrl() {
  config_file="resources/mocks/fail/setup/missing_url.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserMissingResultFilePath() {
  config_file="resources/mocks/success/setup/missing_result_file_path_admin.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"
}

testUpdateUserInvalidBocaUrl() {
  config_file="resources/mocks/fail/setup/invalid_url.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserInvalidResultFilePath() {
  config_file="resources/mocks/fail/setup/invalid_result_file_path.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"

  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  ret_code=$([ -f "${file_path}" ] && echo "${RET_SUCCESS}" || echo "${RET_CONFIG_VALIDATION}")
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserIncorrectBocaUrl() {
  config_file="resources/mocks/fail/setup/incorrect_url.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserIncorrectResultFilePath() {
  config_file="resources/mocks/fail/setup/incorrect_result_file_path.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserMissingLoginData() {
  config_file="resources/mocks/fail/login/missing_login.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserMissingUsername() {
  config_file="resources/mocks/fail/login/missing_username.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserMissingPassword() {
  config_file="resources/mocks/fail/login/missing_password.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserInvalidUsername() {
  config_file="resources/mocks/fail/login/invalid_username.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserInvalidPassword() {
  config_file="resources/mocks/fail/login/invalid_password.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserIncorrectUsername() {
  config_file="resources/mocks/fail/login/incorrect_username.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserIncorrectPassword() {
  config_file="resources/mocks/fail/login/incorrect_password.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserMissingUserData() {
  config_file="resources/mocks/fail/user/missing_user.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserMissingSite() {
  config_file="resources/mocks/success/user/missing_site.json"
  field="siteId"
  testUpdateValidUser "${config_file}" "${field}"
}

testUpdateUserMissingId() {
  config_file="resources/mocks/fail/user/missing_id.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserMissingUsername() {
  config_file="resources/mocks/fail/user/missing_username.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserMissingIcpc() {
  config_file="resources/mocks/success/user/missing_icpc.json"
  field="icpcId"
  testUpdateValidUser "${config_file}" "${field}"
}

testUpdateUserMissingType() {
  config_file="resources/mocks/success/user/missing_type.json"
  field="type"
  testUpdateValidUser "${config_file}" "${field}"
}

testUpdateUserMissingEnabled() {
  config_file="resources/mocks/success/user/missing_enabled.json"
  field="isEnabled"
  testUpdateValidUser "${config_file}" "${field}"
}

testUpdateUserMissingMultilogin() {
  config_file="resources/mocks/success/user/missing_multilogin.json"
  field="isMultiLogin"
  testUpdateValidUser "${config_file}" "${field}"
}

testUpdateUserMissingFullname() {
  config_file="resources/mocks/success/user/missing_fullname.json"
  field="fullName"
  testUpdateValidUser "${config_file}" "${field}"
}

testUpdateUserMissingDesc() {
  config_file="resources/mocks/success/user/missing_desc.json"
  field="description"
  testUpdateValidUser "${config_file}" "${field}"
}

testUpdateUserMissingIP() {
  config_file="resources/mocks/success/user/missing_ip.json"
  field="ip"
  testUpdateValidUser "${config_file}" "${field}"
}

testUpdateUserMissingUserPassword() {
  config_file="resources/mocks/success/user/missing_password.json"
  field="password"
  testUpdateValidUser "${config_file}" "${field}"
}

testUpdateUserMissingChangePass() {
  config_file="resources/mocks/success/user/missing_change_pass.json"
  field="allowPasswordChange"
  testUpdateValidUser "${config_file}" "${field}"
}

testUpdateUserInvalidSite() {
  config_file="resources/mocks/fail/user/invalid_site.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserInvalidId() {
  config_file="resources/mocks/fail/user/invalid_id.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserInvalidUsername() {
  config_file="resources/mocks/fail/user/invalid_username.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserInvalidIcpc() {
  config_file="resources/mocks/fail/user/invalid_icpc.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserInvalidType() {
  config_file="resources/mocks/fail/user/invalid_type.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserInvalidEnabled() {
  config_file="resources/mocks/fail/user/invalid_enabled.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserInvalidMultilogin() {
  config_file="resources/mocks/fail/user/invalid_multilogin.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserInvalidFullname() {
  config_file="resources/mocks/fail/user/invalid_fullname.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserInvalidDesc() {
  config_file="resources/mocks/fail/user/invalid_desc.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserInvalidIP() {
  config_file="resources/mocks/fail/user/invalid_ip.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserInvalidUserPassword() {
  config_file="resources/mocks/fail/user/invalid_password.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserInvalidChangePass() {
  config_file="resources/mocks/fail/user/invalid_change_pass.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserIncorrectSite() {
  config_file="resources/mocks/fail/user/incorrect_site.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserIncorrectId() {
  config_file="resources/mocks/fail/user/incorrect_id.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_USER_ERROR}" "${ret_code}"
}

testUpdateUserIncorrectType() {
  config_file="resources/mocks/fail/user/incorrect_type.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserIncorrectEnabled() {
  config_file="resources/mocks/fail/user/incorrect_enabled.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserIncorrectMultilogin() {
  config_file="resources/mocks/fail/user/incorrect_multilogin.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateUserIncorrectChangePass() {
  config_file="resources/mocks/fail/user/incorrect_change_pass.json"
  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateValidUser() {
  if [ -n "$1" ]; then
    config_file="$1"
  else
    config_file="resources/mocks/success/user/valid_user.json"
  fi

  npm run test:cli -- -p "${config_file}" -m updateUser >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"

  # Check if the result file was created
  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  [ -f "../${file_path}" ]
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"

  # Check if the user was created/updated according to the configuration file
  if [ -n "$2" ]; then
    jsonIn=$(jq -S --arg f "$2" '.user | del(.password, .[$f])' "../${config_file}")
    jsonOut=$(jq -S --arg f "$2" 'del(.[$f])' "../${file_path}")
  else
    jsonIn=$(jq -S '.user | del(.password)' "../${config_file}")
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
if [ ! -d "../shunit2" ] || [ ! -f "../shunit2/shunit2" ]; then
  echo "Missing or noninstalled shUnit2 test framework."
  exit 1
fi

# shellcheck disable=1091
. ../shunit2/shunit2
