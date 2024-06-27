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
    npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
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

testDownloadProblemPackageMissingPathArgument() {
  npm run test:cli -- -m downloadProblemPackage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testDownloadProblemPackageMissingMethodArgument() {
  config_file="resources/mocks/success/problem/valid_problem.json"
  npm run test:cli -- -p "${config_file}" >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testDownloadProblemPackageIncorrectPathArgument() {
  config_file="resources/mocks/fake.json"
  npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testDownloadProblemPackageIncorrectMethodArgument() {
  config_file="resources/mocks/success/problem/valid_problem.json"
  npm run test:cli -- -p "${config_file}" -m downloadProblemPackageFake >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testDownloadProblemPackageMissingConfigData() {
  config_file="resources/mocks/fail/setup/missing_config.json"
  npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDownloadProblemPackageMissingBocaUrl() {
  config_file="resources/mocks/fail/setup/missing_url.json"
  npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDownloadProblemPackageMissingResultFilePath() {
  config_file="resources/mocks/success/setup/missing_result_file_path_admin.json"
  npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"
}

testDownloadProblemPackageInvalidBocaUrl() {
  config_file="resources/mocks/fail/setup/invalid_url.json"
  npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDownloadProblemPackageInvalidResultFilePath() {
  config_file="resources/mocks/fail/setup/invalid_result_file_path.json"
  npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"

  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  ret_code=$([ -f "${file_path}" ] && echo "${RET_SUCCESS}" || echo "${RET_CONFIG_VALIDATION}")
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDownloadProblemPackageIncorrectBocaUrl() {
  config_file="resources/mocks/fail/setup/incorrect_url.json"
  npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDownloadProblemPackageIncorrectResultFilePath() {
  config_file="resources/mocks/fail/setup/incorrect_result_file_path.json"
  npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDownloadProblemPackageMissingLoginData() {
  config_file="resources/mocks/fail/login/missing_login.json"
  npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDownloadProblemPackageMissingUsername() {
  config_file="resources/mocks/fail/login/missing_username.json"
  npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDownloadProblemPackageMissingPassword() {
  config_file="resources/mocks/fail/login/missing_password.json"
  npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDownloadProblemPackageInvalidUsername() {
  config_file="resources/mocks/fail/login/invalid_username.json"
  npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDownloadProblemPackageInvalidPassword() {
  config_file="resources/mocks/fail/login/invalid_password.json"
  npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDownloadProblemPackageIncorrectUsername() {
  config_file="resources/mocks/fail/login/incorrect_username.json"
  npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDownloadProblemPackageIncorrectPassword() {
  config_file="resources/mocks/fail/login/incorrect_password.json"
  npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDownloadProblemPackageMissingProblemData() {
  config_file="resources/mocks/fail/problem/missing_problem.json"
  npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDownloadProblemPackageMissingId() {
  config_file="resources/mocks/fail/problem/missing_id.json"
  npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDownloadProblemPackageMissingDownloadDir() {
  config_file="resources/mocks/success/problem/missing_download_dir.json"
  testDownloadValidProblemPackage "${config_file}"
}

testDownloadProblemPackageInvalidId() {
  config_file="resources/mocks/fail/problem/invalid_id.json"
  npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDownloadProblemPackageInvalidDownloadDir() {
  config_file="resources/mocks/fail/problem/invalid_download_dir.json"
  npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDownloadProblemPackageIncorrectId() {
  config_file="resources/mocks/fail/problem/incorrect_id.json"
  npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_PROBLEM_ERROR}" "${ret_code}"
}

testDownloadProblemPackageIncorrectDownloadFir() {
  config_file="resources/mocks/fail/problem/incorrect_download_dir.json"
  npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testDownloadValidProblemPackage() {
  if [ -n "$1" ]; then
    config_file="$1"
  else
    config_file="resources/mocks/success/problem/valid_problem.json"
  fi

  npm run test:cli -- -p "${config_file}" -m downloadProblemPackage >/dev/null 2>&1
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

. /opt/shunit2/shunit2
