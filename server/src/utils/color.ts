// export const getColor = (riskRating: number): string => {
//   switch (riskRating) {
//     case 0:
//       return "#f2f2f2";
//     case 1:
//       return "#cfe9cf";
//     case 2:
//       return "#b4e6b4";
//     case 3:
//       return "#99e399";
//     case 4:
//       return "#7edc7e";
//     case 5:
//       return "#63d963";
//     case 6:
//       return "#ffcc99";
//     case 7:
//       return "#ffb3b3";
//     case 8:
//       return "#ff9999";
//     case 9:
//       return "#ff8080";
//     case 10:
//       return "#ff6666";
//     default:
//       return "#f2f2f2";
//   }
// };

export const getColor = (riskRating: number): string => {
  switch (riskRating) {
    case 1:
      return "#fa0b00";
    case 2:
      return "#ff8400";
    case 3:
      return "#fffc2a";
    case 4:
      return "#48ff04";
    case 5:
      return "#398700";
    default:
      return "#f2f2f2";
  }
};

/*
0 : Very Light Gray : #f2f2f2 : (242, 242, 242)
1 : Soft Green : #cfe9cf : (207, 233, 207)
2 : Light Green : #b4e6b4 : (180, 230, 180)
3 : Pale Green : #99e399 : (153, 227, 153)
4 : Soft Lime : #7edc7e : (126, 220, 126)
5 : Light Lime : #63d963 : (99, 217, 99)
6 : Pastel Yellow : #ffcc99 : (255, 204, 153)
7 : Peach : #ffb3b3 : (255, 179, 179)
8 : Soft Red : #ff9999 : (255, 153, 153)
9 : Light Red : #ff8080 : (255, 128, 128)
10 : Pale Red : #ff6666 : (255, 102, 102)
*/

/*
1 : "Excellent" : #398700
2 : "Safe" : #48ff04 
3 : "Neutral" : #fffc2a
4 : "Poor" : #ff8400
5 : "Not Safe+" : #fa0b00
*/
