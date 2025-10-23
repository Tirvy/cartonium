import type { PhasesResponse, CompetitionBloodBowl, RosterResponse, TeamBloodBowl } from "./types";
import dataStorage from './storage';

const leagueName = process.env.NUXT_BOT_BLOODBOWL_LEAGUE || ''

export async function getCurrentWeekNumber(): Promise<number> {
    const fixturesCached = await dataStorage.getItem<{ data: CompetitionBloodBowl[] }>('fixtures');
    if (fixturesCached && fixturesCached.data?.length) {
        return fixturesCached.data.findIndex(item => {
            return item.matches.some(match => !match.scoreResume)
        });
    }
    return 0;
}

export async function updateFixtures() {
    dataStorage.setItem<{ data: CompetitionBloodBowl[] }>('fixtures', { data: [] });
    await getCurrentFixtures();
    return;
}

async function fetchFixtures() {
    const response = await $fetch<PhasesResponse>(`https://tourplay.net/api/tournament/${leagueName}/phases?type=COACH`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en",
            "content-type": "application/json",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            "Referer": `https://tourplay.net/en/blood-bowl/${leagueName}/scores`,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
    });

    const competitionInfo = responseToCompetition(response);
    dataStorage.setItem<{ data: CompetitionBloodBowl[] }>('fixtures', { data: competitionInfo });
}

export async function getCurrentFixtures(weekNumber?: number): Promise<CompetitionBloodBowl> {
    let fixturesCached = await dataStorage.getItem<{ data: CompetitionBloodBowl[] }>('fixtures');
    if (!fixturesCached || !fixturesCached.data) {
        await fetchFixtures();
        fixturesCached = await dataStorage.getItem<{ data: CompetitionBloodBowl[] }>('fixtures');
    }

    if (weekNumber === undefined) {
        weekNumber = await getCurrentWeekNumber();
    }

    if (!fixturesCached || !fixturesCached.data) {
        throw 'no fixtures'
    }
    return fixturesCached.data[weekNumber];
}

export async function getAllFixtures(): Promise<CompetitionBloodBowl[]> {
    const fixturesCached = await dataStorage.getItem<{ data: CompetitionBloodBowl[] }>('fixtures');
    if (fixturesCached && fixturesCached.data) {
        return fixturesCached.data;
    }

    await getCurrentFixtures(0);
    const fixturesCachedTrue = await dataStorage.getItem<{ data: CompetitionBloodBowl[] }>('fixtures') as { data: CompetitionBloodBowl[] };
    return fixturesCachedTrue.data;
}

export function getLeagueLink() {
    return `https://tourplay.net/en/blood-bowl/${leagueName}/scores`
}

function responseToCompetition(phaseData: PhasesResponse): CompetitionBloodBowl[] {
    const seasonId = Math.max(...Object.keys(phaseData).map(e => +e));
    const seasonData = phaseData[seasonId];
    return seasonData.rounds.map(roundData => {
        const groupData = roundData.groups[0];
        return {
            matches: groupData.matches.map(match => {
                return {
                    roundNumber: roundData.roundNumber,
                    matchId: match.matchId,
                    scoreResume: match.scoreResume,
                    teamLocal: teamFromResponse(match.rosterLocal),
                    teamVisitor: teamFromResponse(match.rosterVisitor),
                }
            })
        }
    })
}

function teamFromResponse(roster: RosterResponse): TeamBloodBowl {
    return {
        teamName: roster.teamName,
        teamRace: roster.teamRace,
        userNameToShow: roster.inscription.player.userNameToShow,
    }
}