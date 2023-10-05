import {DateTime} from "luxon";

export function defineDurationInMinutes(startDate: DateTime, endDate: DateTime): number {
    return endDate.diff(startDate, 'minutes').minutes;
}