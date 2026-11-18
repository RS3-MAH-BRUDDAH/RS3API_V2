// Seed dataset. Figures are factory/launch figures (PS, Nm, 0-100 km/h, km/h). Verify before publishing.
const g = (slug, model, code, from, to, bodies, engine, ps, nm, s, kmh, trans, notes = '') =>
  ({ slug, model, code, from, to, bodies, engine, ps, nm, s, kmh, trans, notes });

const models = [
  ['rs2', 'RS 2 Avant'], ['rs3', 'RS 3'], ['rs4', 'RS 4'], ['rs5', 'RS 5'], ['rs6', 'RS 6'],
  ['rs7', 'RS 7'], ['rs-q3', 'RS Q3'], ['rs-q8', 'RS Q8'], ['rs-e-tron-gt', 'RS e-tron GT'], ['rs-tt', 'RS TT'],
];

const generations = [
  g('rs2-avant', 'rs2', '81 (B4)', 1994, 1995, ['avant'], '2.2 L 20v turbo inline-5', 315, 410, 4.8, 262, '6-speed manual', 'Developed with Porsche; 2,891 built.'),
  g('rs3-8p', 'rs3', '8P', 2011, 2012, ['sportback'], '2.5 TFSI inline-5', 340, 450, 4.6, 250, '7-speed S tronic'),
  g('rs3-8v', 'rs3', '8V', 2015, 2020, ['sportback', 'sedan'], '2.5 TFSI inline-5', 367, 465, 4.3, 250, '7-speed S tronic', 'Sedan from 2017; facelift 2017 raised output to 400 PS.'),
  g('rs3-8y', 'rs3', '8Y', 2021, null, ['sportback', 'sedan'], '2.5 TFSI inline-5', 400, 500, 3.8, 250, '7-speed S tronic', 'RS Torque Splitter.'),
  g('rs4-b5', 'rs4', 'B5', 2000, 2001, ['avant'], '2.7 L twin-turbo V6', 380, 440, 4.9, 250, '6-speed manual', 'Cosworth-developed engine.'),
  g('rs4-b7', 'rs4', 'B7', 2005, 2008, ['avant', 'sedan', 'cabriolet'], '4.2 FSI V8', 420, 430, 4.7, 250, '6-speed manual'),
  g('rs4-b8', 'rs4', 'B8', 2012, 2015, ['avant'], '4.2 FSI V8', 450, 430, 4.7, 250, '7-speed S tronic'),
  g('rs4-b9', 'rs4', 'B9', 2018, 2025, ['avant'], '2.9 TFSI twin-turbo V6', 450, 600, 4.1, 250, '8-speed tiptronic'),
  g('rs5-b8', 'rs5', 'B8', 2010, 2015, ['coupe', 'cabriolet'], '4.2 FSI V8', 450, 430, 4.5, 250, '7-speed S tronic', 'Cabriolet from 2012.'),
  g('rs5-b9', 'rs5', 'B9', 2017, null, ['coupe', 'sportback'], '2.9 TFSI twin-turbo V6', 450, 600, 3.9, 250, '8-speed tiptronic'),
  g('rs6-c5', 'rs6', 'C5', 2002, 2004, ['avant', 'sedan'], '4.2 L twin-turbo V8', 450, 560, 4.7, 250, '5-speed tiptronic'),
  g('rs6-c6', 'rs6', 'C6', 2008, 2010, ['avant'], '5.0 TFSI twin-turbo V10', 580, 650, 4.5, 250, '6-speed tiptronic', 'Lamborghini-derived V10.'),
  g('rs6-c7', 'rs6', 'C7', 2013, 2018, ['avant'], '4.0 TFSI twin-turbo V8', 560, 700, 3.9, 250, '8-speed tiptronic'),
  g('rs6-c8', 'rs6', 'C8', 2019, null, ['avant'], '4.0 TFSI twin-turbo V8 (mild hybrid)', 600, 800, 3.6, 250, '8-speed tiptronic'),
  g('rs7-4g', 'rs7', '4G', 2013, 2018, ['sportback'], '4.0 TFSI twin-turbo V8', 560, 700, 3.9, 250, '8-speed tiptronic'),
  g('rs7-4k', 'rs7', '4K', 2019, null, ['sportback'], '4.0 TFSI twin-turbo V8 (mild hybrid)', 600, 800, 3.6, 250, '8-speed tiptronic'),
  g('rs-q3-8u', 'rs-q3', '8U', 2013, 2018, ['suv'], '2.5 TFSI inline-5', 310, 420, 5.2, 250, '7-speed S tronic'),
  g('rs-q3-f3', 'rs-q3', 'F3', 2019, null, ['suv', 'sportback'], '2.5 TFSI inline-5', 400, 480, 4.5, 250, '7-speed S tronic'),
  g('rs-q8-4m', 'rs-q8', '4M', 2020, null, ['suv'], '4.0 TFSI twin-turbo V8 (mild hybrid)', 600, 800, 3.8, 250, '8-speed tiptronic'),
  g('rs-e-tron-gt', 'rs-e-tron-gt', 'FW', 2021, null, ['gran-turismo'], 'Dual-motor electric', 646, 830, 3.3, 250, '2-speed', 'Figures are with overboost (598 PS without).'),
  g('rs-tt-8j', 'rs-tt', '8J', 2009, 2014, ['coupe', 'roadster'], '2.5 TFSI inline-5', 340, 450, 4.6, 250, '6-speed manual / 7-speed S tronic'),
  g('rs-tt-8s', 'rs-tt', '8S', 2016, 2023, ['coupe', 'roadster'], '2.5 TFSI inline-5', 400, 480, 3.7, 250, '7-speed S tronic'),
];

// [generation, name, from, to, ps, nm, notes]
const variants = [
  ['rs3-8v', 'RS 3 Performance Edition', 2019, 2019, 407, 480, 'Limited edition.'],
  ['rs3-8y', 'RS 3 Performance Edition', 2022, 2022, 407, 500, 'Limited to 300 units, 300 km/h top speed.'],
  ['rs4-b9', 'RS 4 Competition', 2022, 2025, 450, 600, 'Chassis and styling upgrades.'],
  ['rs4-b9', 'RS 4 Competition plus', 2023, 2025, 450, 600, ''],
  ['rs5-b9', 'RS 5 Competition', 2022, null, 450, 600, ''],
  ['rs5-b9', 'RS 5 Competition plus', 2023, null, 450, 600, ''],
  ['rs6-c5', 'RS 6 plus', 2004, 2004, 480, 560, 'Top speed limited to 280 km/h.'],
  ['rs6-c7', 'RS 6 Avant performance', 2015, 2018, 605, 750, ''],
  ['rs6-c8', 'RS 6 Avant performance', 2023, null, 630, 850, ''],
  ['rs6-c8', 'RS 6 Avant GT', 2024, 2024, 630, 850, 'Limited to 660 units.'],
  ['rs7-4g', 'RS 7 Sportback performance', 2015, 2018, 605, 750, ''],
  ['rs7-4k', 'RS 7 Sportback performance', 2023, null, 630, 850, ''],
  ['rs-q3-8u', 'RS Q3 performance', 2015, 2018, 367, 465, '0-100 km/h in 4.8 s.'],
  ['rs-q8-4m', 'RS Q8 performance', 2024, null, 640, 850, ''],
  ['rs-e-tron-gt', 'RS e-tron GT performance', 2025, null, 925, 1027, '0-100 km/h in 2.5 s.'],
  ['rs-tt-8j', 'TT RS plus', 2012, 2014, 360, 465, ''],
];

// [name, finish, code (null = verify), available from, available to]
// Availability is indicative; a colour is linked to every generation whose years overlap.
const colours = [
  ['Brilliant Black', 'solid', 'LY9B', 1994, null],
  ['Ibis White', 'solid', 'LY9C', 2005, null],
  ['Nardo Grey', 'solid', 'LY7C', 2013, null],
  ['Vegas Yellow', 'solid', null, 2015, 2020],
  ['Python Yellow', 'solid', null, 2021, null],
  ['Mythos Black', 'metallic', 'LZ9Y', 2008, null],
  ['Glacier White', 'metallic', 'LS9R', 2009, null],
  ['Florett Silver', 'metallic', 'LY7W', 2008, 2025],
  ['Navarra Blue', 'metallic', null, 2012, 2023],
  ['Sonoma Green', 'metallic', null, 2020, null],
  ['Tango Red', 'metallic', null, 2020, null],
  ['Kyalami Green', 'metallic', null, 2021, null],
  ['Daytona Grey', 'pearl', 'LZ7S', 2008, null],
  ['Misano Red', 'pearl', null, 2005, null],
  ['Nogaro Blue', 'pearl', null, 1994, 2025],
];

module.exports = { models, generations, variants, colours };
