export interface MatchDataToSheet {
    matchId: number,
    round: number,
    Local: string,
    Visitor: string,
    result: VoteVariants
}

export interface TelegramChatData {
    chatId: number,
    tourplayName: string,
    meta: any,
    isAdmin: boolean
}

export interface MatchBloodBowl {
    roundNumber: number,
    matchId: number,
    scoreResume: {
        totalScoreLocal: number,
        totalScoreVisitor: number,
        winner: TeamPosition
    } | undefined,
    teamLocal: TeamBloodBowl
    teamVisitor: TeamBloodBowl
}

export interface CompetitionBloodBowl {
    matches: MatchBloodBowl[]
}

export interface TeamBloodBowl {
    teamName: string,
    teamRace: string,
    userNameToShow: string,
}

export interface PhasesResponse {
    [competition_id: string]: {
        state: number,
        rounds: {
            roundNumber: number,
            roundProgresion: {
                totalCount: number,
                finishedCount: number
            }
            groups: {
                name: string,
                matches: {
                    matchId: number,
                    scoreResume: {
                        totalScoreLocal: number,
                        totalScoreVisitor: number,
                        winner: TeamPosition
                    } | undefined,
                    rosterLocal: RosterResponse,
                    rosterVisitor: RosterResponse,
                }[]
            }[]
        }[]
    }
}

export interface RosterResponse {
    teamName: string,
    teamRace: string,
    inscription: {
        player: {
            userNameToShow: string
        }
    }
}

export interface BloodBowlVote {
    chatId: number,
    matchId: number,
    choise: VoteVariants,
    date: number
}

export type TeamPosition = "Local" | "Visitor"
export type VoteVariants = "Local" | "Visitor" | "draw" | undefined

export type HashedVotes = {
    [chatId: number]: {
        [matchId: number]: VoteVariants
    }
}