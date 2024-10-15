/* eslint-disable linebreak-style */
// renderer used to setup the symbolizaton of the housing layers

const  subregionRenderer = {
    type: 'simple',
    symbol: {
        type: "simple-fill",  // autocasts as new SimpleFillSymbol()
        color: null,
        style: "solid",
        outline: {  // autocasts as new SimpleLineSymbol()
          color: [222, 45, 38, .9],
          width: 1
        }
    }
}


// const subregionRenderer = {
//     type: 'unique-value',
//     legendOptions: {
//         title: 'County',
//     },
//     field: 'MPO',
//     uniqueValueInfos: [
//         {
//             value: '',
//             label: 'WFRC',
//             symbol: {
//                 type: 'simple-fill',
//                 color: null,
//                 outline: {
//                     color: [222, 45, 38, 1],
//                     width: 2,
//                 },
//             },
//         },
//         {
//             value: 'WFRC-Box Elder',
//             label: 'WFRC-Box Elder',
//             symbol: {
//                 type: 'simple-fill',
//                 color: null,
//                 outline: {
//                     color: [222, 45, 38, 1],
//                     width: 2,
//                 },
//             },
//         },
//         {
//             value: 'MAG',
//             label: 'MAG',
//             symbol: {
//                 type: 'simple-fill',
//                 color: null,
//                 outline: {
//                     color: [222, 45, 38, 1],
//                     width: 2,
//                 },
//             },
//         },
//     ],
// };

