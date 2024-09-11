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

import { DateTime, Duration } from 'luxon';
import { Page } from 'playwright';

export function defineDuration(
  startDate: DateTime,
  endDate: DateTime
): Duration {
  return endDate.diff(startDate, 'minutes');
}

/**
 *
 * @param startDate Data de início do contest
 * @param page Elemento Página do Playwright
 * @param duration Duração do contest
 * @param tolerance Tolêrancia para a data a ser definida
 * @param inputField Seletor CSS do campo de data
 * @param field Valor do campo de data
 */
export async function fillDateField(
  startDate: DateTime,
  page: Page,
  duration: Duration,
  tolerance: number,
  inputField: string,
  field?: string
): Promise<void> {
  if (field !== undefined) {
    const stopAnsweringDate = DateTime.fromFormat(field, 'yyyy-MM-dd HH:mm');
    const stopAnsweringDuration = defineDuration(startDate, stopAnsweringDate);
    await page
      .locator(inputField)
      .fill(stopAnsweringDuration.minutes.toString());
  } else {
    const stopAnsweringDuration =
      duration.minutes > tolerance
        ? duration.minus(Duration.fromObject({ minutes: tolerance }))
        : duration;
    await page
      .locator(inputField)
      .fill(stopAnsweringDuration.minutes.toString());
  }
}
