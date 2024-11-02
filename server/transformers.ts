import type { ClubCollection, ClubInfo, Club, GameBox, Gathering, GatheringWithGuests } from '~/types/frontend.js';

// clubs
export function clubFromSupabase(data: any, clubSettingsData: any): Club {
    return {
        id: data.id,
        title: data.title,
        urlName: data.url_name,
        themes: clubSettingsData.themes,
        avatarUrl: clubSettingsData.avatar_url,
        guestCanGatherOwn: clubSettingsData.guest_can_gather_own,
        guestCanReserve: clubSettingsData.guest_can_reserve,
        collectionSearchRating: clubSettingsData.collection_search_rating,
        collectionSearchDuration: clubSettingsData.collection_search_duration,
        collectionSearchPlayers: clubSettingsData.collection_search_players,
        reservationLinks: clubSettingsData.reservation_links || [],
        reservationPhones: clubSettingsData.reservation_phones || [],
        gatheringWarning: clubSettingsData.gathering_warning || '',
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
export function gameBoxFromSupabase(data: Tables<'gameboxes_with_club_id'> | Tables<'gameboxes'>): GameBoxWithClub {
    return {
        aliasTesera: data.alias_tesera || undefined,
        id: data.id,
        idBgg: data.id_bgg || undefined,
        idTesera: data.id_tesera || undefined,
        linkBgg: data.link_bgg || undefined,
        linkTesera: data.link_tesera || undefined,
        photoUrl: data.photo_url || undefined,
        playersGood: data.players_good || undefined,
        playersMax: data.players_max || undefined,
        playersMin: data.players_min || undefined,
        playtimeAvg: data.playtime_avg || undefined,
        playtimeMax: data.playtime_max || undefined,
        playtimeMin: data.playtime_min || undefined,
        ratingBgg: data.rating_bgg || undefined,
        ratingTesera: data.rating_tesera || undefined,
        title: data.title,
        titles: data.titles,
        year: data.year || undefined,
        clubId: 'club_id' in data ? data.club_id : null,
    };
}
export function gameBoxToSupabase(gameBox: GameBoxWithClub): Tables<'gameboxes'> {
    return {
        alias_tesera: gameBox.aliasTesera || null,
        id_bgg: gameBox.idBgg || null,
        id_tesera: gameBox.idTesera || null,
        link_bgg: gameBox.linkBgg || null,
        link_tesera: gameBox.linkTesera || null,
        photo_url: gameBox.photoUrl || null,
        players_good: gameBox.playersGood || null,
        players_max: gameBox.playersMax || null,
        players_min: gameBox.playersMin || null,
        playtime_avg: gameBox.playtimeAvg || null,
        playtime_max: gameBox.playtimeMax || null,
        playtime_min: gameBox.playtimeMin || null,
        rating_bgg: gameBox.ratingBgg || null,
        rating_tesera: gameBox.ratingTesera || null,
        title: gameBox.title,
        titles: gameBox.titles,
        year: gameBox.year || null,
        // If id is null error: 500 column "id" of relation "gameboxes" violates not-null constraint
        // id: gameBox.id, 
    };
}

// gathering
export function gatheringFromSupabase(data: any): Gathering {
    return {
        id: data.id,
        ownerId: data.owner_id,
        startDate: data.start_date,
        commentOwner: data.comment_owner,
        guestsMax: data.guests_max,
        commentClub: data.comment_club,
        clubId: data.club_id,
        tableId: data.table_id,
        ownName: data.own_name,
        gameboxId: data.gamebox_id,
    };
}

export function gatheringWithGuestsFromSupabase(data: any): GatheringWithGuests {
    const userDataSource = data.raw_user_meta_data || data;
    const userData = data.guests_number && {
        title: getName(userDataSource),
        imageUrl: data.avatar_url,
        messageUrl: '',
        totalGuests: data.guests_number,
        id: data.user_id,
        telegramLink: data.telegram_username ? `tg://resolve?domain=${data.telegram_username}` : undefined,
        telegramUsername: data.telegram_username,
    }

    function getName(userData: any): string {
        return userData.first_name || userData.name || userData.full_name || userData.email?.split('@')[0] || 'Unknown';
    }
    return {
        clubId: data.club_id,
        commentClub: data.comment_club,
        commentOwner: data.comment_owner,
        gameboxId: data.gamebox.id,
        gamebox: gameBoxFromSupabase(data.gamebox),
        ownTitle: data.own_name,
        tableId: data.table_id,
        guestsMax: data.guests_max,
        id: data.id,
        ownerId: data.owner_id,
        ownerUser: data.owneruser,
        startDate: data.start_date,
        guests: !!userData ? [userData] : [],
        slotsFilled: data.guests_number || 0,
        ownName: data.own_name,
    };

}

export function tablesFromSupabase(data: any): Table {
    return {
        id: data.id,
        clubId: data.club_id,
        title: data.title,
        description: data.description,
        peopleMax: data.people_max,
    };
}