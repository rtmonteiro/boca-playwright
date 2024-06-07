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

npm run build

# Testing contest methods (count: 165)
./activate_contest.sh
./create_contest.sh
./get_contest.sh
./get_contests.sh
./update_contest.sh

# # Testing language methods (count: 92)
# # Use -m updateLanguage as an alternative alias for createLanguage
./create_language.sh
./delete_language.sh
./get_language.sh
./get_languages.sh

# Testing problem methods (count: 98)
# Use -m updateProblem as an alternative alias for createProblem
./create_problem.sh
./delete_problem.sh
./get_problem.sh
./get_problems.sh

# Testing user methods (count: )
# TODO
# ./change_password.sh
# Use -m updateUser as an alternative alias for createUser
./create_user.sh
./delete_user.sh
./get_user.sh
./get_users.sh
./import_users.sh
