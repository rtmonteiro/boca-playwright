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
export RET_LANGUAGE_ERROR=17

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
  return "${ret_code}"
}

# It will be called before each test is run.
setUp() {
  # Check if language exists. If it does, delete it.
  config_file="resources/mocks/success/language/valid_language.json"
  npm run test:cli -- -p "${config_file}" -m getLanguage >/dev/null 2>&1
  ret_code=$?
  if [ "${ret_code}" = "${RET_SUCCESS}" ]; then
    npm run test:cli -- -p "${config_file}" -m deleteLanguage >/dev/null 2>&1
    ret_code=$?
  else
    ret_code="${RET_SUCCESS}"
  fi
  [ -f "./result.json" ] && rm "./result.json"
  return "${ret_code}"
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

testCreateLanguageMissingPathArgument() {
  npm run test:cli -- -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testCreateLanguageMissingMethodArgument() {
  config_file="resources/mocks/success/language/valid_language.json"
  npm run test:cli -- -p "${config_file}" >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testCreateLanguageIncorrectPathArgument() {
  config_file="resources/mocks/fake.json"
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testCreateLanguageIncorrectMethodArgument() {
  config_file="resources/mocks/success/language/valid_language.json"
  npm run test:cli -- -p "${config_file}" -m createLanguageFake >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_ARGS_VALIDATION}" "${ret_code}"
}

testCreateLanguageMissingConfigData() {
  config_file="resources/mocks/fail/setup/missing_config.json"
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateLanguageMissingBocaUrl() {
  config_file="resources/mocks/fail/setup/missing_url.json"
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateLanguageMissingResultFilePath() {
  config_file="resources/mocks/success/setup/missing_result_file_path_admin.json"
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"
}

testCreateLanguageInvalidBocaUrl() {
  config_file="resources/mocks/fail/setup/invalid_url.json"
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateLanguageInvalidResultFilePath() {
  config_file="resources/mocks/fail/setup/invalid_result_file_path.json"
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"

  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  ret_code=$([ -f "${file_path}" ] && echo "${RET_SUCCESS}" || echo "${RET_CONFIG_VALIDATION}")
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateLanguageIncorrectBocaUrl() {
  config_file="resources/mocks/fail/setup/incorrect_url.json"
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateLanguageIncorrectResultFilePath() {
  config_file="resources/mocks/fail/setup/incorrect_result_file_path.json"
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateLanguageMissingLoginData() {
  config_file="resources/mocks/fail/login/missing_login.json"
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateLanguageMissingUsername() {
  config_file="resources/mocks/fail/login/missing_username.json"
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateLanguageMissingPassword() {
  config_file="resources/mocks/fail/login/missing_password.json"
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateLanguageInvalidUsername() {
  config_file="resources/mocks/fail/login/invalid_username.json"
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateLanguageInvalidPassword() {
  config_file="resources/mocks/fail/login/invalid_password.json"
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateLanguageIncorrectUsername() {
  config_file="resources/mocks/fail/login/incorrect_username.json"
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateLanguageIncorrectPassword() {
  config_file="resources/mocks/fail/login/incorrect_password.json"
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateLanguageMissingLanguageData() {
  config_file="resources/mocks/fail/language/missing_language.json"
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateLanguageMissingId() {
  config_file="resources/mocks/fail/language/missing_id.json"
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateLanguageMissingName() {
  config_file="resources/mocks/fail/language/missing_name.json"
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateLanguageMissingExtension() {
  config_file="resources/mocks/success/language/missing_extension.json"
  field="extension"
  testCreateValidLanguage "${config_file}" "${field}"
}

testCreateLanguageInvalidId() {
  config_file="resources/mocks/fail/language/invalid_id.json"
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateLanguageInvalidName() {
  config_file="resources/mocks/fail/language/invalid_name.json"
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateLanguageInvalidExtension() {
  config_file="resources/mocks/fail/language/invalid_extension.json"
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_CONFIG_VALIDATION}" "${ret_code}"
}

testCreateLanguageIncorrectId() {
  config_file="resources/mocks/success/language/valid_language.json"
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  # ID already in use
  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_LANGUAGE_ERROR}" "${ret_code}"
}

testCreateValidLanguage() {
  if [ -n "$1" ]; then
    config_file="$1"
  else
    config_file="resources/mocks/success/language/valid_language.json"
  fi

  npm run test:cli -- -p "${config_file}" -m createLanguage >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"

  # Check if the result file was created
  file_path=$(jq -r '.config.resultFilePath' "../${config_file}")
  [ -f "../${file_path}" ]
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"

  # Check if the created language has a valid id
  jq -e '.id != null and .id != ""' "../${file_path}" >/dev/null 2>&1
  ret_code=$?
  assertEquals "${RET_SUCCESS}" "${ret_code}"

  # Check if the language was created according to the configuration file
  if [ -n "$2" ]; then
    jsonIn=$(jq -S --arg f "$2" '.language | del(.[$f])' "../${config_file}")
    jsonOut=$(jq -S --arg f "$2" 'del(.[$f])' "../${file_path}")
  else
    jsonIn=$(jq -S '.language' "../${config_file}")
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
