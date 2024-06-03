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
oneTimeSetUp() {
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

testCreateUserMissingPathArgument() {
  npm run test:cli -- -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_ARGS $ret_code
}

testCreateUserMissingMethodArgument() {
  config_file="resources/mocks/success/user/valid_user.json"
  npm run test:cli -- -p "${config_file}" >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_ARGS $ret_code
}

testCreateUserInvalidPathArgument() {
  config_file="resources/mocks/fake.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_ARGS $ret_code
}

testCreateUserInvalidMethodArgument() {
  config_file="resources/mocks/success/user/valid_user.json"
  npm run test:cli -- -p "${config_file}" -m createUserFake >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_ARGS $ret_code
}

testCreateUserMissingConfigData() {
  config_file="resources/mocks/fail/setup/missing_config.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserMissingBocaUrl() {
  config_file="resources/mocks/fail/setup/missing_url.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserMissingResultFilePath() {
  config_file="resources/mocks/success/setup/missing_result_file_path_admin.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code
}

testCreateUserInvalidBocaUrl() {
  config_file="resources/mocks/fail/setup/invalid_url.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserInvalidResultFilePath() {
  config_file="resources/mocks/fail/setup/invalid_result_file_path.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code

  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  ret_code=`[ -f "${file_path}" ] && echo $RET_SUCCESS || echo $RET_INVALID_CONFIG`
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserIncorrectBocaUrl() {
  config_file="resources/mocks/fail/setup/incorrect_url.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserIncorrectResultFilePath() {
  config_file="resources/mocks/fail/setup/incorrect_result_file_path.json"
  npm run test:cli -- -p "${config_file}" -m createContest >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserMissingLoginData() {
  config_file="resources/mocks/fail/login/missing_login.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserMissingUsername() {
  config_file="resources/mocks/fail/login/missing_username.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserMissingPassword() {
  config_file="resources/mocks/fail/login/missing_password.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserInvalidUsername() {
  config_file="resources/mocks/fail/login/invalid_username.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserInvalidPassword() {
  config_file="resources/mocks/fail/login/invalid_password.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserIncorrectUsername() {
  config_file="resources/mocks/fail/login/incorrect_username.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserIncorrectPassword() {
  config_file="resources/mocks/fail/login/incorrect_password.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserMissingUserData() {
  config_file="resources/mocks/fail/user/missing_user.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserMissingSite() {
  config_file="resources/mocks/success/user/missing_site.json"
  field="userSiteNumber"
  testCreateValidUser $config_file $field
}

testCreateUserMissingId() {
  config_file="resources/mocks/fail/user/missing_id.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserMissingUsername() {
  config_file="resources/mocks/fail/user/missing_username.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserMissingIcpc() {
  config_file="resources/mocks/success/user/missing_icpc.json"
  field="userIcpcId"
  testCreateValidUser $config_file $field
}

testCreateUserMissingType() {
  config_file="resources/mocks/success/user/missing_type.json"
  field="userType"
  testCreateValidUser $config_file $field
}

testCreateUserMissingEnabled() {
  config_file="resources/mocks/success/user/missing_enabled.json"
  field="userEnabled"
  testCreateValidUser $config_file $field
}

testCreateUserMissingMultilogin() {
  config_file="resources/mocks/success/user/missing_multilogin.json"
  field="userMultiLogin"
  testCreateValidUser $config_file $field
}

testCreateUserMissingFullname() {
  config_file="resources/mocks/success/user/missing_fullname.json"
  field="userFullName"
  testCreateValidUser $config_file $field
}

testCreateUserMissingDesc() {
  config_file="resources/mocks/success/user/missing_desc.json"
  field="userDesc"
  testCreateValidUser $config_file $field
}

testCreateUserMissingIP() {
  config_file="resources/mocks/success/user/missing_ip.json"
  field="userIp"
  testCreateValidUser $config_file $field
}

testCreateUserMissingUserPassword() {
  config_file="resources/mocks/success/user/missing_password.json"
  field="userPassword"
  testCreateValidUser $config_file $field
}

testCreateUserMissingChangePass() {
  config_file="resources/mocks/success/user/missing_change_pass.json"
  field="userChangePass"
  testCreateValidUser $config_file $field
}

testCreateUserInvalidSite() {
  config_file="resources/mocks/fail/user/invalid_site.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserInvalidId() {
  config_file="resources/mocks/fail/user/invalid_id.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserInvalidUsername() {
  config_file="resources/mocks/fail/user/invalid_username.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserInvalidIcpc() {
  config_file="resources/mocks/fail/user/invalid_icpc.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserInvalidType() {
  config_file="resources/mocks/fail/user/invalid_type.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserInvalidEnabled() {
  config_file="resources/mocks/fail/user/invalid_enabled.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserInvalidMultilogin() {
  config_file="resources/mocks/fail/user/invalid_multilogin.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserInvalidFullname() {
  config_file="resources/mocks/fail/user/invalid_fullname.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserInvalidDesc() {
  config_file="resources/mocks/fail/user/invalid_desc.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserInvalidIP() {
  config_file="resources/mocks/fail/user/invalid_ip.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserInvalidUserPassword() {
  config_file="resources/mocks/fail/user/invalid_password.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserInvalidChangePass() {
  config_file="resources/mocks/fail/user/invalid_change_pass.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserIncorrectType() {
  config_file="resources/mocks/fail/user/incorrect_type.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserIncorrectEnabled() {
  config_file="resources/mocks/fail/user/incorrect_enabled.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserIncorrectMultilogin() {
  config_file="resources/mocks/fail/user/incorrect_multilogin.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateUserIncorrectChangePass() {
  config_file="resources/mocks/fail/user/incorrect_change_pass.json"
  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_INVALID_CONFIG $ret_code
}

testCreateValidUser() {
  if [ -n "$1" ];
  then
    config_file="$1"
  else
    config_file="resources/mocks/success/user/valid_user.json"
  fi

  npm run test:cli -- -p "${config_file}" -m createUser >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code

  # Check if the result file was created
  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  [ -f "../${file_path}" ]
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code

  # Check if the created/updated user has a valid id
  jq -e '.userSiteNumber != null and .userSiteNumber != "" and .userNumber != null and .userNumber != ""' "../${file_path}" >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code

  # Check if the user was created/updated according to the configuration file
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
