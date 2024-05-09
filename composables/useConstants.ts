const columns = [
  'title',
  'titles',
  'aliasTesera',
  'id',
  'idBgg',
  'idTesera',
  'linkBgg',
  'linkTesera',
  'photoUrl',
  'playersGood',
  'playersMax',
  'playersMin',
  'playtimeAvg',
  'playtimeMax',
  'playtimeMin',
  'ratingBgg',
  'ratingTesera',
  'year'
];

const constants: {[key: string]: any} = { columns };

export const useConstants = (key: string): any => {
  return constants[key];
}
