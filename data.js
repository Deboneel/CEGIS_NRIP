/* ============================================================
   NRIP report — data layer
   All figures transcribed directly from Deboneel Kundu Partho's
   CEGIS internship report, Chapter 7 (North Rajshahi Irrigation
   Project) and the supporting statistical charts in Ch.3/7.
   ============================================================ */

const NRIP = {};

/* ---------- palette used across charts (mirrors CSS vars) ---------- */
NRIP.colors = {
  clay:   '#8b4a2b',
  clayD:  '#5c3420',
  ochre:  '#d3a95c',
  ochreD: '#b3822f',
  paddy:  '#5c8a5e',
  paddyD: '#3f6b45',
  water:  '#2b6e8f',
  waterL: '#5c9ab5',
  alert:  '#9c3b2e',
  sand:   '#e3c9a0',
  grey:   '#a89d8b',
  blue2:  '#7fb2c9',
  ink:    '#453d31'
};

/* ---------- 7.2.2 statistical analysis (upazila-wise, ha) ---------- */
NRIP.upazilas = ['Chapai Nababganj Sadar','Godagari','Gomastapur','Manda','Nachole','Niamatpur','Paba','Porsha','Tanore'];
NRIP.upazilaDistrict = {
  'Chapai Nababganj Sadar':'Chapainawabganj','Godagari':'Rajshahi','Gomastapur':'Chapainawabganj',
  'Manda':'Naogaon','Nachole':'Chapainawabganj','Niamatpur':'Naogaon','Paba':'Rajshahi',
  'Porsha':'Naogaon','Tanore':'Rajshahi'
};
NRIP.upazilaTotals = [12041,41513,23303,12453,29086,42217,7999,10645,29516];

NRIP.aez = {
  labels: ['High Barind Tract','Level Barind Tract','High Ganges River Floodplain','Lower Purnabhaba Floodplain','Tista Meander Floodplain'],
  values: [113830,40003,17870,2966,1290],
  pct: [64.7,22.7,10.2,1.7,0.7],
  colors: [NRIP.colors.clayD, NRIP.colors.clay, NRIP.colors.paddy, NRIP.colors.blue2, '#e8d24a']
};

NRIP.soilMoisture = {
  labels:['Low','Medium','High','Settlement','Waterbodies','River'],
  values:[122793,7864,32758,9575,2571,372],
  pct:[69.8,4.5,18.6,5.4,1.5,0.2],
  colors:[NRIP.colors.paddy,'#d8dba0',NRIP.colors.ochre,NRIP.colors.grey,NRIP.colors.blue2,NRIP.colors.water],
  byUpazila:[0,3900,600,2200,900,31600,1500,700,1000] // High-moisture ha approx per report chart order not exact; only totals below used
};

NRIP.recession = {
  labels:['Very Early','Normal','Late','Settlement','Extremely Early','Very Late','River','Waterbodies','Early'],
  values:[141210,5995,9336,9575,5107,63,372,2571,1707],
  pct:[80.3,3.4,5.3,5.4,2.9,0.0,0.2,1.5,1.0],
  colors:[NRIP.colors.paddy,'#e8b93f',NRIP.colors.alert,NRIP.colors.grey,NRIP.colors.paddyD,'#c0392b',NRIP.colors.water,NRIP.colors.blue2,'#c9d67a']
};

NRIP.landType = {
  labels:['Highland','Medium Highland','Medium Lowland','Lowland','Settlement','Very Lowland','River','Waterbodies'],
  values:[142561,8411,8568,3400,9575,476,372,2571],
  pct:[81.0,4.8,4.9,1.9,5.4,0.3,0.2,1.5],
  colors:[NRIP.colors.paddyD,NRIP.colors.ochreD,'#bcd08a','#c9b7e8',NRIP.colors.grey,'#7a5230',NRIP.colors.water,NRIP.colors.blue2]
};

NRIP.landform = {
  labels:['Terrace','Valley','Basin','Ridge','Settlement','Waterbodies','Charland','River'],
  values:[110473,30576,14468,7911,9575,2571,14,372],
  pct:[62.8,17.4,8.2,4.5,5.4,1.5,0.0,0.2],
  colors:[NRIP.colors.ochre,'#bcd08a','#c9b7e8',NRIP.colors.clayD,NRIP.colors.grey,NRIP.colors.blue2,'#e8d24a',NRIP.colors.water]
};

NRIP.drainage = {
  labels:['Imperfectly Drained','Poorly Drained','Settlement','Waterbodies','Moderately Well Drained','River'],
  values:[148051,14747,9575,2571,618,372],
  pct:[84.2,8.4,5.4,1.5,0.4,0.2],
  colors:[NRIP.colors.ochre,NRIP.colors.blue2,NRIP.colors.grey,NRIP.colors.water,'#9bc23c',NRIP.colors.waterL]
};

NRIP.texture = {
  labels:['Clay Loam','Loam','Clay','Silty Loam','Settlement','Waterbodies','Sand','River'],
  values:[89769,58678,13133,1823,9575,2571,14,372],
  pct:[51.0,33.4,7.5,1.0,5.4,1.5,0.0,0.2],
  colors:[NRIP.colors.clayD,NRIP.colors.ochre,NRIP.colors.clay,'#d7d871',NRIP.colors.grey,NRIP.colors.blue2,'#efe4c8',NRIP.colors.water]
};

/* ---------- 7.3 cropping & production ---------- */
NRIP.cropping = {
  seasonLabels:['Kharif-I (Mar–Jun)','Kharif-II (Jul–Oct)','Rabi (Nov–Feb)'],
  totalCroppedHa: 566347,
  riceHa: 330026,
  nonRiceHa: 236321,
  totalProdT: 3486019,
  riceProdT: 1176308,
  nonRiceProdT: 2309711,
  boroHa: 115429,
  boroProdT: 484802,
  boroCostPerHa: [14000,20000],
  otherCostPerHa: [4000,8000]
};

/* ---------- 7.4 irrigation infrastructure ---------- */
NRIP.irrigationSource = {
  labels:['Deep Tube Well (DTW)','Shallow Tube Well (STW)','Low Lift Pump (LLP)'],
  values:[61.7,28.4,9.9],
  colors:[NRIP.colors.alert,NRIP.colors.paddy,NRIP.colors.water]
};
NRIP.wellCounts = { dtw:3954, stw:23188, totalTubewells:4215 /* per text: 4,215 tube wells total is DTW figure context; kept as reported */ };
NRIP.power = {
  labels:['Electricity','Diesel'],
  values:[80.5,19.5],
  colors:[NRIP.colors.paddy, NRIP.colors.alert]
};

/* Fig 7.8c — irrigated area (ha) by method (DTW/STW/LLP) per upazila (from chart) */
NRIP.methodByUpazila = {
  labels:['Chapai Nawabganj Sadar','Godagari','Gomastapur','Manda','Nachole','Niamatpur','Paba','Porsha','Tanore'],
  dtw:  [7000, 32000, 16000, 15800, 13500, 16800, 16200, 9000, 20000],
  stw:  [15800, 3800, 6600, 5700, 6800, 16000, 7800, 6300, 3800],
  llp:  [5100, 1000, 5600, 4000, 200, 400, 4400, 1800, 1500]
};

/* ---------- 7.5 AquaCrop soil hydraulic properties ---------- */
NRIP.soilProps = [
  { soil:'Clay',       sat:55, fc:54, wp:39, taw:150, ksat:35 },
  { soil:'Clay Loam',  sat:50, fc:39, wp:23, taw:160, ksat:125 },
  { soil:'Loam',       sat:46, fc:31, wp:15, taw:160, ksat:500 },
  { soil:'Silty Loam', sat:46, fc:33, wp:13, taw:200, ksat:575 },
  { soil:'Sandy Loam', sat:41, fc:22, wp:10, taw:120, ksat:1200 }
];
NRIP.soilColors = {
  'Clay': NRIP.colors.water,
  'Clay Loam': NRIP.colors.alert,
  'Loam': NRIP.colors.paddy,
  'Silty Loam': NRIP.colors.ochreD,
  'Sandy Loam': '#7a5cc4'
};

/* ---------- 7.6 climate change summary table (Boro rice, clay loam) ---------- */
NRIP.climate = {
  rows:[
    { v:'Mean Yield (ton/ha)', hist:6.517, nf:7.666, ff:8.623, pnf:'+17.6%', pff:'+32.3%' },
    { v:'Maximum Yield (ton/ha)', hist:7.114, nf:8.104, ff:8.827, pnf:'+13.9%', pff:'+24.1%' },
    { v:'Minimum Yield (ton/ha)', hist:6.014, nf:7.268, ff:8.310, pnf:'+20.9%', pff:'+38.2%' },
    { v:'Standard Deviation (ton/ha)', hist:0.327, nf:0.256, ff:0.160, pnf:'-21.6%', pff:'-50.9%', inv:true },
    { v:'Coefficient of Variation (%)', hist:5.01, nf:3.34, ff:1.86, pnf:'-33.3%', pff:'-62.9%', inv:true },
    { v:'Mean Biomass (ton/ha)', hist:13.033, nf:15.333, ff:17.246, pnf:'+17.6%', pff:'+32.3%' },
    { v:'Mean Seasonal ET (mm)', hist:490.6, nf:484.5, ff:499.3, pnf:'-1.3%', pff:'+1.8%' },
    { v:'Mean Irrigation (mm)', hist:407.8, nf:411.4, ff:424.8, pnf:'+0.9%', pff:'+4.2%' },
    { v:'Mean Water Productivity (kg/m³)', hist:1.350, nf:1.631, ff:1.810, pnf:'+20.9%', pff:'+34.1%' }
  ]
};
NRIP.climateYield = { hist:6.517, nf:7.666, ff:8.623 };
NRIP.climateCV = { hist:5.01, nf:3.34, ff:1.86 };
NRIP.climateWP = { hist:1.350, nf:1.631, ff:1.810 };
NRIP.climateIrrET = { irrig:[407.8,411.4,424.8], eto:[490.6,484.5,499.3] };

/* ---------- mitigation options (from report, "Mitigation and Alternatives") ---------- */
NRIP.mitigations = [
  { title:'Alternate Wetting & Drying (AWD)', tag:'Direct lever', text:'Cuts pumping volume without cutting yield. The primary fix for the groundwater-stressed clay zones — already active practice, just needs targeted expansion.' },
  { title:'Surface-water augmentation', tag:'Where feasible', text:'Rubber dams and floating pumps cut groundwater dependence wherever a perennial river sits close enough to use. Not an option everywhere in the Barind interior.' },
  { title:'Groundwater zoning & extraction limits', tag:'Policy lever', text:'Needed exactly where Boro production and water-table depth both run deepest — Rajshahi and Rangpur pattern repeated locally at Niamatpur / Godagari.' },
  { title:'Shift some Boro area to Rabi crops', tag:'Area-side fix', text:'Wheat, maize, mustard, pulses use far less dry-season water. Most useful where irrigation cost already outweighs what farmers get back.' },
  { title:'Buried / fita pipe conveyance', tag:'Efficiency fix', text:'Cuts conveyance losses versus open earthen channels without changing what\'s grown — a cheaper, faster win than scheduling changes alone.' }
];
