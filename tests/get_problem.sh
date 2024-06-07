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
export RET_PROBLEM_ERROR=15

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
  # Create a valid problem.
  if [ $ret_code = $RET_SUCCESS ];
  then
    config_file="resources/mocks/success/problem/valid_problem.json"
    npm run test:cli -- -p "${config_file}" -m createProblem >/dev/null 2>&1;
    ret_code=$?
    return $ret_code
  fi
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

testGetProblemMissingPathArgument() {
  npm run test:cli -- -m getProblem >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_ARGS_VALIDATION $ret_code
}

testGetProblemMissingMethodArgument() {
  config_file="resources/mocks/success/problem/valid_problem.json"
  npm run test:cli -- -p "${config_file}" >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_ARGS_VALIDATION $ret_code
}

testGetProblemIncorrectPathArgument() {
  config_file="resources/mocks/fake.json"
  npm run test:cli -- -p "${config_file}" -m getProblem >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_ARGS_VALIDATION $ret_code
}

testGetProblemIncorrectMethodArgument() {
  config_file="resources/mocks/success/problem/valid_problem.json"
  npm run test:cli -- -p "${config_file}" -m getProblemFake >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_ARGS_VALIDATION $ret_code
}

testGetProblemMissingConfigData() {
  config_file="resources/mocks/fail/setup/missing_config.json"
  npm run test:cli -- -p "${config_file}" -m getProblem >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetProblemMissingBocaUrl() {
  config_file="resources/mocks/fail/setup/missing_url.json"
  npm run test:cli -- -p "${config_file}" -m getProblem >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetProblemMissingResultFilePath() {
  config_file="resources/mocks/success/setup/missing_result_file_path_admin.json"
  npm run test:cli -- -p "${config_file}" -m getProblem >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code
}

testGetProblemInvalidBocaUrl() {
  config_file="resources/mocks/fail/setup/invalid_url.json"
  npm run test:cli -- -p "${config_file}" -m getProblem >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetProblemInvalidResultFilePath() {
  config_file="resources/mocks/fail/setup/invalid_result_file_path.json"
  npm run test:cli -- -p "${config_file}" -m getProblem >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code

  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  ret_code=`[ -f "${file_path}" ] && echo $RET_SUCCESS || echo $RET_CONFIG_VALIDATION`
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetProblemIncorrectBocaUrl() {
  config_file="resources/mocks/fail/setup/incorrect_url.json"
  npm run test:cli -- -p "${config_file}" -m getProblem >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetProblemIncorrectResultFilePath() {
  config_file="resources/mocks/fail/setup/incorrect_result_file_path.json"
  npm run test:cli -- -p "${config_file}" -m getProblem >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetProblemMissingLoginData() {
  config_file="resources/mocks/fail/login/missing_login.json"
  npm run test:cli -- -p "${config_file}" -m getProblem >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetProblemMissingUsername() {
  config_file="resources/mocks/fail/login/missing_username.json"
  npm run test:cli -- -p "${config_file}" -m getProblem >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetProblemMissingPassword() {
  config_file="resources/mocks/fail/login/missing_password.json"
  npm run test:cli -- -p "${config_file}" -m getProblem >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetProblemInvalidUsername() {
  config_file="resources/mocks/fail/login/invalid_username.json"
  npm run test:cli -- -p "${config_file}" -m getProblem >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetProblemInvalidPassword() {
  config_file="resources/mocks/fail/login/invalid_password.json"
  npm run test:cli -- -p "${config_file}" -m getProblem >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetProblemIncorrectUsername() {
  config_file="resources/mocks/fail/login/incorrect_username.json"
  npm run test:cli -- -p "${config_file}" -m getProblem >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetProblemIncorrectPassword() {
  config_file="resources/mocks/fail/login/incorrect_password.json"
  npm run test:cli -- -p "${config_file}" -m getProblem >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetProblemMissingProblemData() {
  config_file="resources/mocks/fail/problem/missing_problem.json"
  npm run test:cli -- -p "${config_file}" -m getProblem >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetProblemMissingId() {
  config_file="resources/mocks/fail/problem/missing_id.json"
  npm run test:cli -- -p "${config_file}" -m getProblem >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetProblemInvalidId() {
  config_file="resources/mocks/fail/problem/invalid_id.json"
  npm run test:cli -- -p "${config_file}" -m getProblem >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_CONFIG_VALIDATION $ret_code
}

testGetProblemIncorrectId() {
  config_file="resources/mocks/fail/problem/incorrect_id.json"
  npm run test:cli -- -p "${config_file}" -m getProblem >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_PROBLEM_ERROR $ret_code
}

testGetValidProblem() {
  config_file="resources/mocks/success/problem/valid_problem.json"
  npm run test:cli -- -p "${config_file}" -m getProblem >/dev/null 2>&1;
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code

  # Check if the result file was created
  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  [ -f "../${file_path}" ]
  ret_code=$?
  assertEquals $RET_SUCCESS $ret_code

  # Check if the returned problem has the same id of the configuration file
  jsonIn=$(jq -S -r '.problem | .id' "../${config_file}")
  jsonOut=$(jq -S -r '.id' "../${file_path}")
  [ "$jsonIn" = "$jsonOut" -o "$jsonIn(deleted)" = "$jsonOut" ]
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
