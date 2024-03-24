interface GameBox {
    aliasTesera: string | null;
    id: number;
    idBgg: number | null;
    idTesera: number | null; 
    linkBgg: string | null;
    linkTesera: string | null;
    photoUrl: string | null;
    playersGood: number[] | null;
    playersMax: number | null;
    playersMin: number | null;
    playtimeAvg: number | null;
    playtimeMax: number | null;
    playtimeMin: number | null;
    ratingBgg: number | null;
    ratingTesera: number | null;
    title: string;
    titles: Array<string> | null;
    year: number | null;
  }

  interface Club {
    id: string;
    title: string;
    urlName: string;
  }
  
  interface ClubCollection {
    clubId: string;
    gameBoxId: number;
    id: number;
  }
  
  interface ClubInfo {
    clubId: string;
    textHtml: string;
  }

  interface Gathering {
    clubId: string;
    date: string;
    description: string;
    id: number;
    location: string;
    time: string;
    title: string;
  }
  