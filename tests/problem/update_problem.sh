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
export RET_PROBLEM_ERROR=19

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
  # Check if problem exists. If not, create it.
  config_file="resources/mocks/success/problem/valid_problem.json"
  $cmd -- -p "${config_file}" -m getProblem >/dev/null 2>&1
  ret_code=$?
  if [ "${ret_code}" != "${RET_SUCCESS}" ]; then
    $cmd -- -p "${config_file}" -m createProblem >/dev/null 2>&1
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

testUpdateProblemMissingPathArgument() {
  $cmd -- -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testUpdateProblemMissingMethodArgument() {
  config_file="resources/mocks/success/problem/valid_problem.json"
  $cmd -- -p "${config_file}" >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testUpdateProblemIncorrectPathArgument() {
  config_file="resources/mocks/fake.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testUpdateProblemIncorrectMethodArgument() {
  config_file="resources/mocks/success/problem/valid_problem.json"
  $cmd -- -p "${config_file}" -m updateProblemFake >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testUpdateProblemMissingConfigData() {
  config_file="resources/mocks/fail/setup/missing_config.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemMissingBocaUrl() {
  config_file="resources/mocks/fail/setup/missing_url.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemMissingResultFilePath() {
  config_file="resources/mocks/success/setup/missing_result_file_path_admin.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"
}

testUpdateProblemInvalidBocaUrl() {
  config_file="resources/mocks/fail/setup/invalid_url.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemInvalidResultFilePath() {
  config_file="resources/mocks/fail/setup/invalid_result_file_path.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"

  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  ret_code=$([ -f "${file_path}" ] && echo "${RET_SUCCESS}" || echo "${RET_CONFIG_VALIDATION}")
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemIncorrectBocaUrl() {
  config_file="resources/mocks/fail/setup/incorrect_url.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemIncorrectResultFilePath() {
  config_file="resources/mocks/fail/setup/incorrect_result_file_path.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemMissingLoginData() {
  config_file="resources/mocks/fail/login/missing_login.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemMissingUsername() {
  config_file="resources/mocks/fail/login/missing_username.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemMissingPassword() {
  config_file="resources/mocks/fail/login/missing_password.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemInvalidUsername() {
  config_file="resources/mocks/fail/login/invalid_username.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemInvalidPassword() {
  config_file="resources/mocks/fail/login/invalid_password.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemIncorrectUsername() {
  config_file="resources/mocks/fail/login/incorrect_username.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemIncorrectPassword() {
  config_file="resources/mocks/fail/login/incorrect_password.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemMissingProblemData() {
  config_file="resources/mocks/fail/problem/missing_problem.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemMissingId() {
  config_file="resources/mocks/fail/problem/missing_id.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemMissingName() {
  config_file="resources/mocks/fail/problem/missing_name.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemMissingProblemFilePath() {
  config_file="resources/mocks/fail/problem/missing_problem_file_path.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemMissingColorName() {
  config_file="resources/mocks/success/problem/missing_color_name.json"
  field="colorName"
  testUpdateValidProblem "${config_file}" "${field}"
}

testUpdateProblemMissingColorCode() {
  config_file="resources/mocks/success/problem/missing_color_code.json"
  field="colorCode"
  testUpdateValidProblem "${config_file}" "${field}"
}

testUpdateProblemInvalidId() {
  config_file="resources/mocks/fail/problem/invalid_id.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemInvalidName() {
  config_file="resources/mocks/fail/problem/invalid_name.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemInvalidProblemFilePath() {
  config_file="resources/mocks/fail/problem/invalid_problem_file_path.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemInvalidColorName() {
  config_file="resources/mocks/fail/problem/invalid_color_name.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemInvalidColorCode() {
  config_file="resources/mocks/fail/problem/invalid_color_code.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemIncorrectId() {
  config_file="resources/mocks/fail/problem/incorrect_id.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_PROBLEM_ERROR}" "${ret_code}"
}

testUpdateProblemIncorrectProblemFilePath() {
  config_file="resources/mocks/fail/problem/incorrect_problem_file_path.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemIncorrectColorCode() {
  config_file="resources/mocks/fail/problem/incorrect_color_code.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testUpdateProblemOnlyColorName() {
  config_file="resources/mocks/success/problem/only_color_name.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"
}

testUpdateProblemOnlyColorCode() {
  config_file="resources/mocks/success/problem/only_color_code.json"
  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"
}

testUpdateValidProblem() {
  if [ -n "$1" ]; then
    config_file="$1"
  else
    config_file="resources/mocks/success/problem/valid_problem.json"
  fi

  $cmd -- -p "${config_file}" -m updateProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"

  # Check if the result file was created
  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  [ -f "../${file_path}" ]
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"

  # Check if the problem was updated according to the configuration file
  if [ -n "$2" ]; then
    jsonIn=$(jq -S --arg f "$2" '.problem | del(.[$f], .filePath, .downloadDescFile, .downloadPckgFile, .downloadDir)' "../${config_file}")
    jsonOut=$(jq -S --arg f "$2" 'del(.filePath, .isEnabled, .[$f])' "../${file_path}")
  else
    jsonIn=$(jq -S '.problem | del(.filePath, .downloadDescFile, .downloadPckgFile, .downloadDir)' "../${config_file}")
    jsonOut=$(jq -S 'del(.filePath, .isEnabled)' "../${file_path}")
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
if [ ! -d "/opt/shunit2" ] || [ ! -f "/opt/shunit2/shunit2" ]; then
  echo "Missing or noninstalled shUnit2 test framework."
  exit 1
fi

# shellcheck disable=1091
. /opt/shunit2/shunit2
