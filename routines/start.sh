#!/bin/bash

# Create contest
create_contest() {
    # Add your code here to create the contest
    node build/index.js -p resources/mocks/success/contest/valid_contest.json -m createContest
}

# Insert users
insert_users() {
    # Add your code here to insert users into the contest
    node build/index.js -p resources/mocks/success/user/valid_users.json -m importUsers
}

# Insert problems
insert_problem() {
    # Add your code here to insert problems into the contest
    node build/index.js -p resources/mocks/success/problem/valid_problem.json -m createProblem
}

# Main script
# npm run build
# create_contest
# insert_users
insert_problem
