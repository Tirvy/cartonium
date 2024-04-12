import type { ClubCollection, ClubInfo, Club, GameBox, Gathering } from '~/types/frontend.js';

// clubs
export function clubFromSupabase(data: any): Club {
    return {
        id: data.id,
        title: data.title,
        urlName: data.url_name
    };
}

// clubCollections 
export function clubCollectionFromSupabase(data: any): ClubCollection {
    return {
        clubId: data.club_id,
        gameBoxId: data.game_box_id,
        id: data.id
    };
}

// clubInfo
export function clubInfoFromSupabase(data: any): ClubInfo {
    return {
        clubId: data.club_id,
        textHtml: data.text_html
    };
}

// gameBox
export function gameBoxFromSupabase(data: any): GameBox {
    return {
        aliasTesera: data.alias_tesera,
        id: data.id,
        idBgg: data.id_bgg,
        idTesera: data.id_tesera,
        linkBgg: data.link_bgg,
        linkTesera: data.link_tesera,
        photoUrl: data.photo_url,
        playersGood: data.players_good,
        playersMax: data.players_max,
        playersMin: data.players_min,
        playtimeAvg: data.playtime_avg,
        playtimeMax: data.playtime_max,
        playtimeMin: data.playtime_min,
        ratingBgg: data.rating_bgg,
        ratingTesera: data.rating_tesera,
        title: data.title,
        titles: data.titles,
        year: data.year
    };
}

// gathering
export function gatheringFromSupabase(data: any): Gathering {
    return {
        clubId: data.club_id,
        commentClub: data.comment_club,
        commentOwner: data.comment_owner,
        contact: data.contact,
        guestsMax: data.guests_max,
        id: data.id,
        owner: data.owner,
        startDate: data.start_date,
    };
}
