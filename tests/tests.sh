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

# Build library
npm run build
# Define library command
cmd="npm run test:cli"

# Testing contest methods (count: 165)
./activate_contest.sh
./create_contest.sh
./get_contest.sh
./get_contests.sh
./update_contest.sh

# Testing answer methods (count: 126)
./create_answer.sh
./delete_answer.sh
./get_answer.sh
./get_answers.sh
./update_answer.sh

# Testing language methods (count: 120)
./create_language.sh
./delete_language.sh
./get_language.sh
./get_languages.sh
./update_language.sh

# Testing problem methods (count: 216)
./create_problem.sh
./delete_problem.sh
./download_problem_desc_file.sh
./download_problem_pckg_file.sh
./get_problem.sh
./get_problems.sh
./restore_problem.sh
./update_problem.sh

# Testing user methods (count: 220)
./create_user.sh
./delete_user.sh
./get_user.sh
./get_users.sh
./import_users.sh
./restore_user.sh
./update_user.sh

# TODO
# ./update_options.sh
