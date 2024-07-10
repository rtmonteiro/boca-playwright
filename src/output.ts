// ========================================================================
// Copyright Universidade Federal do Espirito Santo (Ufes)
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
//
// This program is released under license GNU GPL v3+ license.
//
// ========================================================================

import * as fs from 'fs';
import { type Contest } from './data/contest';
import { type Answer } from './data/answer';
import { type Language } from './data/language';
import { type Problem } from './data/problem';
import { type Site } from './data/site';
import { type User } from './data/user';

export class Output {
  private static instance: Output | null = null;
  result: string;
  isActive: boolean = false;

  constructor() {
    this.result = '';
  }

  public static getInstance() {
    if (Output.instance === null) {
      Output.instance = new Output();
    }

    return Output.instance;
  }

  setResult(
    result:
      | Contest
      | Contest[]
      | Answer
      | Answer[]
      | Language
      | Language[]
      | Problem
      | Problem[]
      | Site
      | Site[]
      | User
      | User[]
  ) {
    this.result = JSON.stringify(result, null, 2);
  }

  getResult() {
    return this.result;
  }

  writeFile(path: string) {
    // Write the output to a file
    fs.writeFileSync(path, this.result, { encoding: 'utf-8' });
  }
}
