export interface SiteModel {
    id?: number;
    name: string;
    startDate: string;
    endDate: string;
    runs: number;
    tasks: number;
    chiefUsername: string;
    active: boolean;
    autoEnd: boolean;
    globalScore?: number;
    autoJudge?: boolean;
    scoreLevel?: number;
    globalScoreboard?: number;
}