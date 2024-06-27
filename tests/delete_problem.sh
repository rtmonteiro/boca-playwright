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
  # Check if problem exists. If it does not, create it.
  if [ "${ret_code}" = "${RET_SUCCESS}" ]; then
    config_file="resources/mocks/success/problem/valid_problem.json"
    npm run test:cli -- -p "${config_file}" -m getProblem >/dev/null 2>&1
    ret_code=$?
    if [ "${ret_code}" != "${RET_SUCCESS}" ]; then
      npm run test:cli -- -p "${config_file}" -m createProblem >/dev/null 2>&1
      ret_code=$?
    fi
  fi
  return "${ret_code}"
}

# It will be called before each test is run.
setUp() {
  config_file="resources/mocks/success/problem/valid_problem.json"
  npm run test:cli -- -p "${config_file}" -m restoreProblem >/dev/null 2>&1
  ret_code=$?
  [ -f "./result.json" ] && rm "./result.json"
  return "${ret_code}"
}

# It will be called after each test completes.
tearDown() {
  return 0
}

oneTimeTearDown() {
  [ -f "./result.json" ] && rm "./result.json"
  return 0
}

testDeleteProblemMissingPathArgument() {
  npm run test:cli -- -m deleteProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testDeleteProblemMissingMethodArgument() {
  config_file="resources/mocks/success/problem/valid_problem.json"
  npm run test:cli -- -p "${config_file}" >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testDeleteProblemIncorrectPathArgument() {
  config_file="resources/mocks/fake.json"
  npm run test:cli -- -p "${config_file}" -m deleteProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testDeleteProblemIncorrectMethodArgument() {
  config_file="resources/mocks/success/problem/valid_problem.json"
  npm run test:cli -- -p "${config_file}" -m deleteProblemFake >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testDeleteProblemMissingConfigData() {
  config_file="resources/mocks/fail/setup/missing_config.json"
  npm run test:cli -- -p "${config_file}" -m deleteProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDeleteProblemMissingBocaUrl() {
  config_file="resources/mocks/fail/setup/missing_url.json"
  npm run test:cli -- -p "${config_file}" -m deleteProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDeleteProblemMissingResultFilePath() {
  config_file="resources/mocks/success/setup/missing_result_file_path_admin.json"
  npm run test:cli -- -p "${config_file}" -m deleteProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"
}

testDeleteProblemInvalidBocaUrl() {
  config_file="resources/mocks/fail/setup/invalid_url.json"
  npm run test:cli -- -p "${config_file}" -m deleteProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDeleteProblemInvalidResultFilePath() {
  config_file="resources/mocks/fail/setup/invalid_result_file_path.json"
  npm run test:cli -- -p "${config_file}" -m deleteProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"

  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  ret_code=$([ -f "${file_path}" ] && echo "${RET_SUCCESS}" || echo "${RET_CONFIG_VALIDATION}")
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDeleteProblemIncorrectBocaUrl() {
  config_file="resources/mocks/fail/setup/incorrect_url.json"
  npm run test:cli -- -p "${config_file}" -m deleteProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDeleteProblemIncorrectResultFilePath() {
  config_file="resources/mocks/fail/setup/incorrect_result_file_path.json"
  npm run test:cli -- -p "${config_file}" -m deleteProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDeleteProblemMissingLoginData() {
  config_file="resources/mocks/fail/login/missing_login.json"
  npm run test:cli -- -p "${config_file}" -m deleteProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDeleteProblemMissingUsername() {
  config_file="resources/mocks/fail/login/missing_username.json"
  npm run test:cli -- -p "${config_file}" -m deleteProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDeleteProblemMissingPassword() {
  config_file="resources/mocks/fail/login/missing_password.json"
  npm run test:cli -- -p "${config_file}" -m deleteProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDeleteProblemInvalidUsername() {
  config_file="resources/mocks/fail/login/invalid_username.json"
  npm run test:cli -- -p "${config_file}" -m deleteProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDeleteProblemInvalidPassword() {
  config_file="resources/mocks/fail/login/invalid_password.json"
  npm run test:cli -- -p "${config_file}" -m deleteProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDeleteProblemIncorrectUsername() {
  config_file="resources/mocks/fail/login/incorrect_username.json"
  npm run test:cli -- -p "${config_file}" -m deleteProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDeleteProblemIncorrectPassword() {
  config_file="resources/mocks/fail/login/incorrect_password.json"
  npm run test:cli -- -p "${config_file}" -m deleteProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDeleteProblemMissingProblemData() {
  config_file="resources/mocks/fail/problem/missing_problem.json"
  npm run test:cli -- -p "${config_file}" -m deleteProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDeleteProblemMissingId() {
  config_file="resources/mocks/fail/problem/missing_id.json"
  npm run test:cli -- -p "${config_file}" -m deleteProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDeleteProblemInvalidId() {
  config_file="resources/mocks/fail/problem/invalid_id.json"
  npm run test:cli -- -p "${config_file}" -m deleteProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDeleteProblemIncorrectId() {
  config_file="resources/mocks/fail/problem/incorrect_id.json"
  npm run test:cli -- -p "${config_file}" -m deleteProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_PROBLEM_ERROR}" "${ret_code}"
}

testDeleteValidProblem() {
  config_file="resources/mocks/success/problem/valid_problem.json"
  npm run test:cli -- -p "${config_file}" -m deleteProblem >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"

  # Check if the result file was created
  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  [ -f "../${file_path}" ]
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"

  # Check if the returned problem has the same id of the configuration file
  jsonIn=$(jq -S -r '.problem | .id' "../${config_file}")
  jsonOut=$(jq -S -r '.id' "../${file_path}")
  [ "${jsonIn}" = "${jsonOut}" ]
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"

  # Check if the returned problem is disabled
  isEnabled=$(jq -S -r '.isEnabled' "../${file_path}")
  [ "${isEnabled}" = "No" ]
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
