import { Service } from '@/components/AddOrder/RegionsServices';

export type existingRegions =
  | 'ALL'
  | 'NSW'
  | 'VIC'
  | 'QLD'
  | 'SA'
  | 'WA'
  | 'TAS'
  | 'ACT'
  | 'NT';

export enum ExistingRegions {
  ALL = 'ALL',
  NSW = 'NSW',
  VIC = 'VIC',
  QLD = 'QLD',
  SA = 'SA',
  WA = 'WA',
  TAS = 'TAS',
  ACT = 'ACT',
  NT = 'NT',
}

export interface Region {
  region: ExistingRegions;
  maxResultsBeforeWarning?: number,
  warningMessage?: string,
  services: Service[];
}

export const topSectionProductCodes = [
  // 'RPTNATOWN',
  'SATITLE',
  'ACTCT',
  'TASFT',
  'TASSTADR',
  'NTCT',
  'ACTA',
  'ACTP',
  'ACTVF',
  'LANVOLFO',
  'DNRQPTIT',
  /* 'RT',
  'LPISA',
  'DNRTIT',
  'DNRQPROP',
  'SATITLEDTLS',
  'SASTADR',
  'SAPLANS',
  'SATITLEOWNER',
  'WACTL',
  'WASTRADR',
  'WAON', */
];

export const renderByClientSide = [
  'LANCROWN',
];

export const getRegionsSelectorData = {
  SA: {
    register: ['CT', 'CL', 'CR'],
    planParcelSearchPlanType: [
      'Deposited Plan',
      'Community Plan',
      'Filed Plan',
      'Hundred Plan',
      'Road Plan',
      'Strata Plan',
      'Township Plan',
    ],
    planType: [
      'Community Plan',
      'Crown Survey Field Book',
      'Deposited Plan',
      'DR Docker Plan',
      'Drawer Plan',
      'Filed Plan',
      'GRO Plan',
      'Hundred Plan',
      'LTO A Plan',
      'LTO B Plan',
      'LTO C Plan',
      'Miscellaneous Survey Record',
      'Parliamentary Plan',
      'Pastoral Field Book',
      'Plot',
      'PM Tracing',
      'Rack Plan',
      'Road Plan',
      'SD Docket Plan',
      'SM Locality Plan',
      'Strata Plan',
      'Survey Graphic Index',
      'Township Plan',
      'Tube Plan',
    ],
  },
  ALL: {
    reason: [
      'Conveyancing',
      'Historical research',
      'Land development',
      'Land management',
      'Government services',
      'Credit check',
      'Due dilligence',
      'Litigation',
      'Real Estate proposal',
      'Financing',
      'Other',
    ],
  },
  NSW: {
    reason: [
      'Conveyancing',
      'Historical research',
      'Land development',
      'Land management',
      'Government services',
      'Credit check',
      'Due dilligence',
      'Litigation',
      'Real Estate proposal',
      'Financing',
      'Other',
    ],
  },
  ACT: {
    district: [
      'Acton',
      'Ainslie',
      'Amaroo',
      'Aranda',
      'Banks',
      'Barton',
      'Beard',
      'Belconnen',
      'Bonner',
      'Bonython',
      'Braddon',
      'Bruce',
      'Calwell',
      'Campbell',
      'Canberra Airport',
      'Capital Hill',
      'Casey',
      'Chapman',
      'Charnwood',
      'Chifley',
      'Chisholm',
      'City',
      'Conder',
      'Cook',
      'Coombs',
      'Crace',
      'Curtin',
      'Deakin',
      'Denman Prospect',
      'Dickson',
      'Downer',
      'Duffy',
      'Dunlop',
      'Evatt',
      'Fadden',
      'Farrer',
      'Fisher',
      'Florey',
      'Flynn',
      'Forde',
      'Forrest',
      'Franklin',
      'Fraser',
      'Fyshwick',
      'Garran',
      'Gilmore',
      'Giralang',
      'Gordon',
      'Gowrie',
      'Greenway',
      'Griffith',
      'Gungahlin',
      'Hackett',
      'Hall',
      'Harrison',
      'Hawker',
      'Higgins',
      'Holder',
      'Holt',
      'Hughes',
      'Hume',
      'Isaacs',
      'Isabella Plains',
      'Jacka',
      'Kaleen',
      'Kambah',
      'Kingston',
      'Latham',
      'Lawson',
      'Lyneham',
      'Lyons',
      'Macarthur',
      'Macgregor',
      'Macnamara',
      'Macquarie',
      'Mawson',
      'McKellar',
      'Melba',
      'Mitchell',
      'Molonglo',
      'Monash',
      'Moncrieff',
      'Narrabundah',
      'Ngunnawal',
      'Nicholls',
      'Oaks Estate',
      'OConnor',
      'OMalley',
      'Oxley',
      'Page',
      'Palmerston',
      'Parkes',
      'Pearce',
      'Phillip',
      'Pialligo',
      'Red Hill',
      'Reid',
      'Richardson',
      'Rivett',
      'Russell',
      'Scullin',
      'Spence',
      'Stirling',
      'Strathnairn',
      'Symonston',
      'Taylor',
      'Tharwa',
      'Theodore',
      'Throsby',
      'Torrens',
      'Turner',
      'Uriarra VillageH',
      'Wanniassa',
      'Waramanga',
      'Watson',
      'Weetangera',
      'Weston',
      'Whitlam',
      'Wright',
      'Yarralumla',
    ],
  },
  VIC: {
    municipality: ['Alpine', 'Ararat', 'Ballarat', 'Banyule', 'Bass Coast', 'Baw Baw', 'Bayside', 'Benalla', 'Boroondara', 'Brimbank', 'Buloke', 'Campaspe', 'Cardinia', 'Casey', 'Central Goldfields', 'Colac Otway', 'Corangamite', 'Darebin', 'Docklands Authority', 'East Gippsland', 'Frankston', 'French Island', 'Gannawarra', 'Glen Eira', 'Glenelg', 'Golden Plains', 'Greater Bendigo', 'Greater Dandenong', 'Greater Geelong', 'Greater Shepparton', 'Hepburn', 'Hindmarsh', 'Hobsons Bay', 'Horsham', 'Hume', 'Indigo', 'Kingston', 'Knox', 'Latrobe', 'Loddon', 'Macedon Ranges', 'Manningham', 'Mansfield', 'Maribyrnong', 'Maroondah', 'Melbourne', 'Melton', 'Mildura', 'Mitchell', 'Moira', 'Monash', 'Moonee Valley', 'Moorabool', 'Moreland', 'Mornington Peninsula', 'Mount Alexander', 'Moyne', 'Murrindindi', 'Nillumbik', 'Northern Grampians', 'Port Phillip', 'Pyrenees', 'Queenscliffe', 'South Gippsland', 'Southern Grampians', 'Stonnington', 'Strathbogie', 'Surf Coast', 'Swan Hill', 'Towong', 'Wangaratta', 'Warrnambool', 'Wellington', 'West Wimmera', 'Whitehorse', 'Whittlesea', 'Wodonga', 'Wyndham', 'Yarra', 'Yarra Ranges', 'Yarriambiack'],
    parish: ['Parish', 'Acheron', 'Addington', 'Adzar', 'Adjie', 'Aire', 'Albacutya', 'Alberton East', 'at Alberton Parish of Alberton East', 'Alberton West', 'Alexandra', 'Allambee', 'Allambee East', 'Amherst', 'Amphitheatre', 'Anakie', 'Angahook', 'Angora', 'Annuello', 'Annya', 'Arapiles', 'Ararat', 'Arbuckle', 'Arcadia', 'Archdale', 'Ardno', 'Ardonachie', 'Areegra', 'Argyle', 'Ascot', 'Ashens', 'Audley', 'Avenel', 'Avoca', 'Awonga', 'Axedale', 'Baangal', 'Baawang', 'Babatchio', 'Bael Bael', 'Bagshot', 'Bahgallah', 'Bailieston', 'Bairnsdale', 'at Raymond Island Parish of Bairnsdale', 'Ballan', 'Ballangeich', 'Ballapur', 'Ballarat', 'Ballark', 'Ballendella', 'Balliang', 'Balloong', 'Ballyrogan', 'Balmattum', 'Balmoral', 'Balnarring', 'Balrook', 'Balrootan', 'Bamawm', 'Bambadin', 'Bambra', 'Bamganie', 'Banangal', 'Bangerang', 'Banu Bonyit', 'Banyarmbite', 'Banyena', 'Banyenong', 'Barambogie', 'Baranduda', 'Barchan', 'Barga', 'Baring', 'Baring North', 'Baringhup', 'Barkly', 'Barmah', 'Barnawartha North', 'Barnawartha South', 'Barnoolut', 'Barongarook', 'Barp', 'Barrakee', 'Barramunga', 'Barrarbool', 'Barroworn', 'Barwidgee', 'Barwite', 'Barwo', 'Barwon Downs', 'Barwongemoong', 'Batchica', 'Batyik', 'Baulkamaugh', 'Baw Baw', 'Baynton', 'Bealiba', 'Beaufort', 'Beckworth', 'Beear', 'Beechworth', 'Beek Beek', 'Beenak', 'Beerik', 'Beethang', 'Beewar', 'Belfast', 'at Port Fairy Parish of Belfast', 'Bellarine', 'Bellaura', 'Bellellen', 'Beloka', 'Belvoir West', 'Bemboka', 'Bemm', 'Benalla', 'Benambra', 'Benayeo', 'Bendock', 'Benetook', 'Bengworden', 'Bengworden South', 'Benjeroop', 'Beolite', 'Bepcha', 'Beremboke', 'Berontha', 'Berrimal', 'Berringa', 'Berringama', 'Berriwillock', 'Berrmarr', 'Berrook', 'Berwick', 'Bessiebelle', 'Bet Bet', 'Bete Bolong North', 'Bete Bolong South', 'Betka', 'Beulah', 'Beyal', 'Bidwell', 'Big Billy', 'Big Desert', 'Bil-Bil-Wyt', 'Billabong', 'Billian', 'Billiminah', 'Bilpah', 'Bimbourie', 'Bindi', 'Binginwarri', 'Bingo-Munjie', 'Bingo-Munjie North', 'Bingo-Munjie South', 'Binnican', 'Binnuc', 'Birregun', 'Birregurra', 'Bitchigal', 'Bitterang', 'Bittern', 'Blackwood', 'Bochara', 'Boga', 'Bogalara', 'Bogong North', 'Bogong South', 'Boho', 'Boigbeat', 'Boikerbert', 'Boinka', 'Bolaira', 'Bolangum', 'Bolerch', 'Bolga', 'Bollinda', 'Bolwarra', 'Bonang', 'Bondi', 'Bonegilla', 'Bonn', 'Bontherambo', 'Boodyarn', 'Boola Boloke', 'Boola Boola', 'Boole Poole', 'Boolungal', 'Boomahnoomoonah', 'Boonah', 'Boonahwah', 'Boonderoot', 'Booran', 'Boorgunyah', 'Boorhaman', 'Boorlee', 'Boorolite', 'Boorong', 'Boorongie', 'Booroopki', 'Boorpool', 'Boorpuk', 'Boort', 'Boosey', 'Bootahpool', 'Boramboram', 'Boreang East', 'Boreang West', 'Borhoneyghurk', 'Borodomanin', 'Boroka', 'Boroondara', 'City of Hawthorn Parish of Boroondara', 'Borriyalloak', 'Borung', 'Boulka', 'Bourka', 'Boweya', 'Bow-Worrung', 'Bradford', 'Bralak', 'Bramburra', 'Bramby', 'Branjee', 'Brankeet', 'Branxholme', 'Brenanah', 'Brewster', 'Briagolong', 'Bridgewater', 'Bright', 'Brimboal', 'Brimbonga', 'Brim Brim', 'Brimin', 'Brindat', 'Bringalbart', 'Brit Brit', 'Broadford', 'Broadlands', 'Broadwater', 'Brockie', 'Bruarong', 'Brucknell', 'Bruk Bruk', 'Bruthen', 'Buangor', 'Buchan', 'Buckenderra', 'Buckeran Yarrack', 'Buckland', 'Buckrabanyule', 'Budgee Budgee', 'Budgeree', 'Budgerum East', 'Budgerum West', 'Bulart', 'Bulban', 'Bulga', 'Bulgaback', 'Bulgana', 'Bulla Bulla', 'Bullamalk', 'Bullanbul', 'Bullarook', 'Bullarto', 'Bullawin', 'Bulleen', 'Bullengarook', 'Bullioh', 'Bullumwaal', 'Bullung', 'Bumbang', 'Bumberrah', 'Bundalaguah', 'Bundalong', 'Bundara-Munjie', 'Bundowra', 'Bungal', 'Bungalally', 'Bungamero', 'Bunganail', 'Bungaree', 'Bung Bong', 'Bungeeltap', 'Bungeet', 'Bungil', 'Bungil East', 'Bunguluke', 'Bungywarr', 'Buninyong', 'at Scotchmans Parish of Buninyong', 'Bunnugal', 'Bunurouk', 'Bunyip', 'Buragwonduc', 'Burgoyne', 'Burke', 'Burnell', 'Burnewang', 'Burra', 'Burrah Burrah', 'Burramboot', 'Burramboot East', 'Burramine', 'Burrong North', 'Burrong South', 'Burrowye', 'Burrumbeep', 'Burrumbeet', 'Burrum Burrum', 'Burrungabugge', 'Burtwarrah', 'Burupga', 'Butgulla', 'Buttlejorrk', 'Buxton', 'Byaduk', 'Byambynee', 'Byanga', 'Byawatha', 'Byjuke', 'Bylands', 'Cabanandra', 'Calivil', 'Callawadda', 'Callignee', 'Cambacanya', 'Cambatong', 'Campaspe', 'Campbelltown', 'Canabore', 'Caniambo', 'Cannie', 'Cannum', 'Cantala', 'Carag Carag', 'Caralulup', 'Caramballuc North', 'Caramballuc South', 'Caramut', 'Caramut South', 'Carapooee', 'Carapooee West', 'Carapook', 'Carapugna', 'Carboor', 'Carchap', 'Cardigan', 'Cargerie', 'Carina', 'Carisbrook', 'Carlsruhe', 'Carlyle', 'Carneek', 'Carngham', 'Carool', 'Carori', 'Carpendeit', 'Carrah', 'Carrajung', 'Carrak', 'Carraragarmungee', 'Carron', 'Carrung-e-murnong', 'Carruno', 'Carwarp', 'Carwarp West', 'Casterton', 'Castle Donnington', 'Castlemaine', 'Catiabrim', 'Cavendish', 'Changue', 'Changue East', 'Charam', 'Charlton East', 'Charlton West', 'Chatsworth', 'Chatsworth West', 'Chepstowe', 'Cherrington', 'Chewton', 'Chillingollah', 'Chilpin', 'Chiltern', 'Chiltern West', 'Chinaman Flat', 'Chinangin', 'Chintin', 'Chiprick', 'Clarendon', 'Clarkesdale', 'Clonbinane', 'Clonleigh', 'Clunes', 'Cobaw', 'Cobbannah', 'Cobboboonee', 'Cobon', 'Cobra Killuc', 'Cobram', 'Cobungra', 'Cocamba', 'Cocomah', 'Cocoroc', 'Codrington', 'Cohuna', 'Coimadai', 'Colac', 'Colac Colac', 'Colbinabbin', 'Coleraine', 'Coliban', 'Colignan', 'Colongulac', 'Colquhoun', 'Colquhoun East', 'Colquhoun North', 'Colvinsby', 'Combienbar', 'Commeralghip', 'Concongella', 'Concongella South', 'Condah', 'Conewarre', 'Conga Wonga', 'Congupna', 'Connangorach', 'Connewarren', 'Connewirrecoo', 'Cooack', 'Cooaggalah', 'Coolebarghurk', 'Coolumbooka', 'Coolungoolun', 'Coolungubra', 'Cooma', 'Coomboona', 'Coongulla', 'Coongulmerang', 'Coonimur', 'Coonooer East', 'Coonooer West', 'Coopracambra', 'Cooramook', 'Cooriejong', 'Coornburt', 'Coornmill', 'Cooroopajerrup', 'Copi Plains', 'Corack', 'Corack East', 'Coradjil', 'Corangamite', 'Corea', 'Corindhap', 'Corinella', 'Corio', 'Cornella', 'Corop', 'Corryong', 'Costerfield', 'Cowa', 'Coynallan', 'Craigie', 'Cranbourne', 'Cressy', 'Creswick', 'Cronomby', 'Crookayan', 'Crosbie', 'Crowlands', 'Croxton East', 'Croxton West', 'Cudgewa', 'Cundare', 'Curlip', 'Curracurt', 'Currawa', 'Curtayne', 'Curyo', 'Cut-paw-paw', 'City of Footscray Parish of Cut-Paw-Paw', 'City of Footscray at Yarraville Parish of Cut-Paw-Paw', 'at West Footscray Parish of Cut-Paw-Paw', 'at Yarraville Parish of Cut-Paw-Paw', 'Daahl', 'Daalko', 'Dahwedarre', 'Dalyenong', 'Dandenong', 'Dandongadale', 'Danyo', 'Darbalang', 'Dargalong', 'Dargile', 'Dargo', 'Darkbonee', 'Darlingford', 'Darlington', 'Darlington West', 'Darnum', 'Darragan', 'Darraweit Guim', 'Darriman', 'Darriwil', 'Dartagook', 'Dartella', 'Dartmoor', 'Dattuck', 'Dean', 'Deddick', 'Dederang', 'Delatite', 'Dellicknora', 'Denison', 'Dennying', 'Derby', 'Dereel', 'Dergholm', 'Dering', 'Derndang', 'Derril', 'Derrimut', 'Detarka', 'Deutgam', 'Devenish', 'Devon', 'Dewrang', 'Digby', 'Diggorra', 'Dimboola', 'Ding-a-ding', 'Dingee', 'Dinyarrak', 'Djerriwarrh', 'Doboobetic', 'Doledrook', 'Dollin', 'Donald', 'Doodwuk', 'Dooen', 'Dookie', 'Doolam', 'Doomburrim', 'Dopewora', 'Dorchap', 'Doroq', 'Doutta Galla', 'at Essendon Parish of Doutta Galla', 'City of Essendon Parish of Doutta Galla', 'at Hawstead Parish of Doutta Galla', 'Dowling Forest', 'Drajurk', 'Dreeite', 'Drik Drik', 'Dropmore', 'Drouin East', 'Drouin West', 'Drumanure', 'Drumborg', 'Drumdlemara', 'Drummond', 'Drung Drung', 'Duchembegarra', 'Duddo', 'Dueran', 'Dueran East', 'Dulungalong', 'Dumbalk', 'Dunbulbalane', 'Duneed', 'Dunkeld', 'Dunmore', 'Dunmunkle', 'Dunnawalla', 'Dunneworthy', 'Dunolly', 'Durdidwarrah', 'Durndal', 'Durong', 'Echuca North', 'Echuca South', 'Ecklin', 'Eddington', 'Edenhope', 'Edgecombe', 'Edi', 'Egerton', 'Eglinton', 'Eildon', 'Eilyar', 'El Dorado', 'Elingamite', 'Ellerslie', 'Ellesmere', 'Elliminyt', 'Ellinging', 'Elmore', 'Elphinstone', 'Emberton', 'Enano', 'Enfield', 'Enochs Point', 'Ensay', 'Enuc', 'Eppalock', 'Ercildoun', 'Errinundra', 'Estcourt', 'Ettrick', 'Eucambene', 'Eumana', 'Eumemmerring', 'Eumeralla', 'Eurambeen', 'Eurandelong', 'Eureka', 'Euroa', 'Eversley', 'Everton', 'Faraday', 'Fingal', 'Flinders', 'Flowerdale', 'Forbes', 'Framlingham East', 'Framlingham West', 'Franklin', 'Frankston', 'Freeburgh', 'French Island', 'Fryers', 'Fumina', 'Fumina North', 'Gaalanungah', 'Gabo', 'Galaquil', 'Galick', 'Galla', 'Galpunga', 'Gama', 'Gampola', 'Gannawarra', 'Ganoo Ganoo', 'Garratanbunell', 'Garvoc', 'Gatum Gatum', 'Gayfield', 'Geelengla', 'Geera', 'Geerak', 'Gelantipy East', 'Gelantipy West', 'Gellibrand', 'Gembrook', 'Gerahmin', 'Gerangamete', 'Gerang Gerung', 'Gherang Gherang', 'Gheringhap', 'Ghin Ghin', 'Gibbo', 'Giffard', 'Gillingall', 'Gillum', 'Gimpa', 'Ginap', 'Gingimrick', 'Ginquam', 'Girgarre', 'Girgarre East', 'Gisborne', 'Glenaladale', 'Glenalbyn', 'Glenaroua', 'Glenaulin', 'Glenburnie', 'Glencoe', 'Glencoe South', 'Glendale', 'Glendaruel', 'Glendhu', 'Glenelg', 'Glengower', 'Glenhope', 'Glenlogie', 'Glenloth', 'Glenlyon', 'Glenmaggie', 'Glenmona', 'Glenmore', 'Glenorchy', 'Glenormiston', 'Glenpatrick', 'Glenrowen', 'Glenwatts', 'Glynwylln', 'Gnarkeet', 'Gnarr', 'Gnarwarre', 'Gnarwee', 'Gobarup', 'Gobur', 'Goldie', 'Golton Golton', 'Gonzaga', 'Goolengook', 'Goomalibee', 'Goonegul', 'Goongee', 'Goongerah', 'Goon Nure', 'Gooramadda', 'Goorambat', 'Gooram Gooram Gong', 'Goornong', 'Gorae', 'Goroke', 'Gorong', 'Gorrinn', 'Gorrockburkghap', 'Gorya', 'Goulburn', 'Gowangardie', 'Gowar', 'Goyura', 'Gracedale', 'Graham', 'Granton', 'Granya', 'Grassdale', 'Gredgwin', 'Greenhills', 'Greensborough', 'Gre Gre', 'Greta', 'Gringegalgona', 'Gritjurk', 'Gruyere', 'Guildford', 'Gunamalary', 'Gunbower', 'Gunbower West', 'Gundowring', 'Gungarlan', 'Gunyah Gunyah', 'Gutchu', 'Guttamurra', 'Gymbowen', 'Haddon', 'Hamilton North', 'Hamilton South', 'Harcourt', 'Harrietville', 'Harrow', 'Havelock', 'Hawkestone', 'Hayanmi', 'Hazelwood', 'Heathcote', 'Helendoite', 'Hensley', 'Hesse', 'Hexham East', 'Hexham West', 'Heywood', 'Hilgay', 'Hindmarsh', 'Hinno-Munjie', 'Holcombe', 'Holden', 'Holey Plains', 'Homerton', 'Horsham', 'Hotham', 'Hotspur', 'Howitt Plains', 'Howqua', 'Howqua West', 'Huntly', 'Illawarra', 'Indi', 'Ingeegoodbee', 'Inglewood', 'Irrewarra', 'Irrewillipe', 'Jallakin', 'Jallukar', 'Jalur', 'Jamieson', 'Jancourt', 'Janiember East', 'Janiember West', 'Jan Juc', 'Jarklan', 'Jeeralang', 'Jeetho', 'Jeetho West', 'Jeffcott', 'Jellalabad', 'Jemba', 'Jennawarra', 'Jeparit', 'Jerrywarook', 'Jeruk', 'Jika Jika', 'City of Brunswick Parish of Jika Jika', 'at Carlton Parish of Jika Jika', 'at Clifton Hill City of Collingwood Parish of Jika Jika', 'City of Northcote Parish of Jika Jika', 'at North Fitzroy Parish of Jika Jika', 'at North Melbourne Parish of Jika Jika', 'at Parkville Parish of Jika Jika', 'City of Richmond Parish of Jika Jika', 'at Royal Park Parish of Jika Jika', 'West of Royal Park Parish of Jika Jika', 'Jil Jil', 'Jilpanger', 'Jilwain', 'Jinderboine', 'Jindivick', 'Jingallala', 'Jinjellic', 'Jirnkee', 'Jirrah', 'Joel Joel', 'Joop', 'Jumbuk', 'Jumbunna', 'Jumbunna East', 'Jung Jung', 'Jungkum', 'Kaanglang', 'Kaarimba', 'Kadnook', 'Kaerwut', 'Kaladbro', 'Kalingur', 'Kalkallo', 'Kalkee', 'Kalk Kalk', 'Kallery', 'Kalpienung', 'Kalymna', 'Kamarooka', 'Kanawalla', 'Kanawinka', 'Kancobin', 'Kaneira', 'Kangderaar', 'Kangerong', 'Kangertong', 'Kaniva', 'Kanyapella', 'Kapong', 'Karabeal', 'Karadoc', 'Karawah', 'Karawinna', 'Kariah', 'Karlo', 'Karnak', 'Karngun', 'Karrabumet', 'Karramomus', 'Karup Karup', 'Karween', 'Karyrie', 'Katamatite', 'Katandra', 'at Katandra West Parish of Katandra', 'Kattyoong', 'Katunga', 'Katyil', 'Kay', 'Keelangie', 'Keelbundora', 'Keilambete', 'Kelfeera', 'Kellalac', 'Kenmare', 'Kentbruck', 'Kerang', 'Kergunyah', 'Kergunyah North', 'Kerrie', 'Kerrisdale', 'Kerrit Bareet', 'Kevington', 'Kewell East', 'Kewell West', 'Kia', 'Kialla', 'Kianeek', 'Kiata', 'Killara', 'Killawarra', 'Killingworth', 'Kilnoorat', 'Kimbolton', 'Kinabulla', 'Kinglake', 'Kingower', 'Kinimakatka', 'Kinkella', 'Kinypanial', 'Kiora', 'Kirkella', 'Kirkenong', 'Kirrak', 'Knaawing', 'Knockwood', 'Knowsley', 'Knowsley East', 'Kobyboyn', 'Koetong', 'Koimbo', 'Koleya', 'Kolora', 'Konardin', 'Kongbool', 'Kongwak', 'Konnepra', 'Konong Wootong', 'Kooem', 'Koola', 'Koolomert', 'Koomberar', 'Koonda', 'Koonika', 'Koonik Koonik', 'Kooragan', 'Koorangie', 'Kooreh', 'Koorkab', 'Kooroc', 'Koorool', 'Koorooman', 'Kooroon', 'Koort-koort-nong', 'Koo-wee-rup', 'Koo-wee-rup East', 'Korkuperrimul', 'Kornong', 'Koro-Ganeit', 'Koroit', 'Korong', 'Kororoit', 'Korrak Korrak', 'Korumburra', 'Korweinguboora', 'Kosciusko', 'Kotupna', 'Kout Narin', 'Kowat', 'Koyuga', 'Krambruk', 'Kuark', 'Kulk', 'Kulkyne', 'Kulwin', 'Kunat Kunat', 'Kurdgweechee', 'Kurnbrunin', 'Kurnwill', 'Kurraca', 'Kurting', 'Kuruc-a-ruc', 'Kyabram', 'Kyabram East', 'Kybeyan', 'Laanecoorie', 'Laang', 'Laceby', 'Laen', 'Lah-arum', 'Lake Lake Wollard', 'Lalbert', 'Lalkaldarno', 'Lal Lal', 'Lallat', 'Lambruk', 'Lancefield', 'Landsborough', 'Langi-Ghiran', 'Langi-kal-kal', 'Langi Logan', 'Langkoop', 'Lang Lang', 'Lang Lang East', 'Langley', 'Langulac', 'Langwarrin', 'Langwornor', 'Lara', 'Larneebunyah', 'Larundel', 'La Trobe', 'Lauraville', 'Lauriston', 'Lawaluk', 'Lawloit', 'Lazarini', 'Leaghur', 'Ledcourt', 'Leeor', 'Leichardt', 'Leongatha', 'Lexington', 'Lexton', 'Lianiduck', 'Licola', 'Licola North', 'Ligar', 'Lillicur', 'Lillimur', 'Lilliput', 'Lillirie', 'Lima', 'Linlithgow', 'Linton', 'Liparoo', 'Lismore', 'Little Billy', 'Livingstone', 'Lochiel', 'Lockwood', 'Loddon', 'Lodge Park', 'Longerenong', 'Longford', 'Longwarry', 'Longwood', 'Loomat', 'Loongelaat', 'Lorne', 'Lorquon', 'Lowan', 'Lowry', 'Loyola', 'Loy Yang', 'Ludrik-Munjie', 'Lurg', 'Lyell', 'Lynchfield', 'Lyndhurst', 'Macarthur', 'Macedon', 'Macorna', 'Maffra', 'Magdala', 'Magdala South', 'Mageppa', 'Magorra', 'Maharatta', 'Mahkwallok', 'Mahrong', 'Maindample', 'Maintongoon', 'Majorlock', 'Malakoff', 'Malanganee', 'Maldon', 'Malkara', 'Mallacoota', 'Mallanbool', 'Malloren', 'Mambourin', 'Mamengoroock', 'Manangatang', 'Manango', 'Mandurang', 'Maneroo', 'Mangalore', 'Mannibadar', 'Manpy', 'Mansfield', 'Manya', 'Maramingo', 'Mardan', 'Margooya', 'Maribyrnong', 'Marida Yallock', 'Marlbed', 'Marlooh', 'Marma', 'Marmal', 'Marnoo', 'Marong', 'Marraweeny', 'Marroo', 'Maryborough', 'Maryvale', 'Matlock', 'Matong', 'Matong North', 'Meatian', 'Meeniyan', 'Meerai', 'Meereek', 'Meering', 'Meering West', 'Meerlieu', 'Melbourne North', 'Melbourne South', 'at Elwood Parish of Melbourne South', 'City of Port Melbourne Parish of Melbourne South', 'at St. Kilda Parish of Melbourne South', 'City of South Melbourne Parish of Melbourne South', 'at South Yarra Parish of Melbourne South', 'Mellick-Munjie', 'Mellier', 'Mepunga', 'Meran', 'Merbein', 'Meredith', 'Meringur', 'Merino', 'Merriang', 'Merrijig', 'Merrimu', 'Merrinee', 'Merrymbuela', 'Merton', 'Metcalfe', 'Mickleham', 'Miepoll', 'Mildura', 'at Red Cliffs Parish of Mildura', 'Millewa', 'Milloo', 'Milmed', 'Minapre', 'Mincha', 'Mincha West', 'Mindai', 'Minhamite', 'Minimay', 'Mininera', 'Minjah', 'Minjah North', 'Minook', 'Minto', 'Miowera', 'Mirampiram', 'Mirboo', 'Mirboo South', 'Mirimbah', 'Mirkoo', 'Mirnee', 'Mirranatwa', 'Mitchell', 'Mitiamo', 'Mitta Mitta', 'Mittyack', 'Mittyan', 'Moah', 'Moallaack', 'Mocamboro', 'Mockinya', 'Modewarre', 'Moe', 'Moglonemby', 'Mohican', 'Moira', 'Mokanger', 'Mokepilly', 'Mokoan', 'Molesworth', 'Moliagul', 'Molka', 'Mologa', 'Monbulk', 'Monda', 'Monea North', 'Monea South', 'Monegeetta', 'Monivae', 'Monomak', 'Moolap', 'Moolerr', 'Moolort', 'Moolpah', 'Moomowroong', 'Moondarra', 'Moonip', 'Moonkan', 'Moonlight', 'Moora', 'Moorabbin', 'Mooradoranook', 'Mooralla', 'Moorarbool East', 'Moorarbool West', 'Moorbanool', 'Mooree', 'Moormbool East', 'Moormbool West', 'Moormurng', 'Moornapa', 'Moorngag', 'Moorooduc', 'Mooroolbark', 'Mooroopna', 'Mooroopna West', 'Moorpanyal', 'Moortworra', 'Moorwinstowe', 'Moranding', 'Morang', 'Moranghurk', 'Moray', 'Mordialloc', 'City of Mordialloc Parish of Mordialloc', 'Morea', 'Moreep', 'Morekana', 'Morkalla', 'Morockdong', 'Moroka', 'Morrl Morrl', 'Mortat', 'Mortchup', 'Mortlake', 'Mostyn', 'Mount Cole', 'Mournpoul', 'Moutajup', 'Mouyong', 'Mouzie', 'Mowamba', 'Moyangul', 'Moyhu', 'Moyreisk', 'Moyston', 'Moyston West', 'Muckleford', 'Mudgeegonga', 'Mulcra', 'Mulgrave', 'Mullagong', 'Mullawye', 'Mullindolingong', 'Mullroo', 'Mullungdung', 'Mumbannar', 'Mumbel', 'Mundoona', 'Muntham', 'Murchison', 'Murchison North', 'Murdeduke', 'Murgheboluc', 'Murlong', 'Murmungee', 'Murndal', 'Murnungin', 'Murrabit', 'Murrabit West', 'Murramurrangbong', 'Murrandarra', 'Murrawong', 'Murrindal East', 'Murrindal West', 'Murrindindi', 'Murrnroong', 'Murroon', 'Murrungowar', 'Murtcaim', 'Muryrtym', 'Muskerry', 'Myall', 'Myamyn', 'Myaring', 'Myrniong', 'Myrrhee', 'Myrtleford', 'Mysia', 'Nagwarry', 'Nalangil', 'Nanapundah', 'Nandemarriman', 'Nangana', 'Nangeela', 'Nanimia', 'Nanneella', 'Nanowie', 'Napier', 'Nap-nap-marra', 'Nappa', 'Nar-be-thong', 'Narbourac', 'Nareeb Nareeb', 'Nariel', 'Naringaningalook', 'Naringhil North', 'Naringhil South', 'Narioka', 'Narmbool', 'Nar-nar-goon', 'Narracan', 'Narracan South', 'Narrang', 'Narraport', 'Narrawaturk', 'Narrawong', 'Narree Worran', 'Narrewillock', 'Narrobuk', 'Narrobuk North', 'Narrung', 'Nateyip', 'Natimuk', 'Natte Murrang', 'Natteyallock', 'Navarre', 'Nayook', 'Nayook West', 'Neereman', 'Neerim', 'Neerim East', 'Neilborough', 'Nekeeya', 'Nenandie', 'Nepean', 'Nerick', 'Nerran', 'Nerrena', 'Nerring', 'at Eaglehawk Parish of Nerring', 'Nerrin Nerrin', 'Neuarpur', 'Newham', 'Newlingrook', 'Newmerella', 'Ngallo', 'Niagaroon', 'Nillahcootie', 'Nillumbik', 'Nindoo', 'Ni Ni', 'Ninnie', 'Ninyeunook', 'Nirranda', 'Nolan', 'Noojee', 'Noojee East', 'Noonga', 'Noorilim', 'Noorinbee', 'Noorongong', 'Norong', 'Northwood', 'Nowa Nowa', 'Nowa Nowa South', 'Nowie', 'Nowingi', 'Nowyeo', 'Noyong', 'Nulkwyne', 'Nullan', 'Nullawarre', 'Nullawil', 'Numbie-Munjie', 'Numbruk', 'Nunawading', 'at Box Hill Parish of Nunawading', 'Nungal', 'Nungatta', 'Nunniong', 'Nuntin', 'Nurcoung', 'Nurnurnemal', 'Nurong', 'Nurrabiel', 'Nyallo', 'Nyang', 'Nypo', 'Nyrraby', 'Olangolah', 'Olney', 'Omeo', 'Ondit', 'Onyim', 'Orbost', 'Orbost East', 'Otway', 'Ouyen', 'Oxley', 'Paaratte', 'Paignie', 'Painswick', 'Pakenham', 'Pallarang', 'Palpara', 'Panbulla', 'Panmure', 'Pannoobamawm', 'Pannoomilloo', 'Panyule', 'Panyyabyr', 'Paraparap', 'Parrie Yalloak', 'Parupa', 'Parwan', 'Patchewollock', 'Patchewollock North', 'Patho', 'Pawbymbyr', 'Paywit', 'at Queenscliff Parish of Paywit', 'Peechelba', 'Peechember', 'Pelluebla', 'Pendyk Pendyk', 'Pengana', 'Pental Island', 'Perenna', 'Perrit Perrit', 'Phillip Island', 'at Cowes Parish of Phillip Island', 'Piambie', 'Piangil', 'Piangil West', 'Picola', 'Pier-Millan', 'Pigick', 'Pine Lodge', 'Pines', 'Pinnak', 'Pinnibar', 'Pircarra', 'Pirro', 'Pirron Yaloak', 'Poliah North', 'Poliah South', 'Polisbet', 'Pomborneit', 'Pompapiel', 'Pom Pom', 'Pomponderoo', 'Poorneet', 'Poowong', 'Poowong East', 'Porepunkah', 'Portland', 'Powlett', 'Prahran', 'Parish of Prahran at Caulfield', 'Parish of Prahran East of Elsternwick', 'at Elwood Parish of Prahran', 'at Elsternwick Parish of Prahran', 'Parish of Prahran at Gardiner', 'Pranjip', 'Prooinga', 'Propodollah', 'Puckapunyal', 'Puebla', 'Pullut', 'Purdeet', 'Purdeet East', 'Purgagoolah', 'Purnim', 'Purnya', 'Purrumbete North', 'Purrumbete South', 'Pyalong', 'Pywheitjorrk', 'Quag-Munjie', 'Quambatook', 'Quamby', 'Quamby North', 'Quantong', 'Queenstown', 'Raak', 'Raglan', 'Raglan West', 'Rathscar', 'Ravenswood', 'Redbank', 'Red Bluff', 'Redcastle', 'Redesdale', 'Redruth', 'Reynard', 'Riachella', 'Rich Avon East', 'Rich Avon West', 'Ringwood', 'Rochester', 'Rochester West', 'Rochford', 'Rodborough', 'Rosedale', 'Roseneath', 'Rothesay', 'Ruffy', 'Runnymede', 'Rupanyup', 'St. Arnaud', 'St. Clair', 'St. Helens', 'St. James', 'St. Margaret', 'Sale', 'Salisbury', 'Salisbury West', 'Samaria', 'Sandford', 'Sandhurst', 'at Bendigo Parish of Sandhurst', 'at Eaglehawk Parish of Sandhurst', 'Sandon', 'Sargood', 'Sarsfield', 'Scarsdale', 'Scoresby', 'Seacombe', 'Sedgwick', 'Seymour', 'Shadforth', 'Shelbourne', 'Shelford', 'Shelford West', 'Shepparton', 'Sherwood', 'Shirley', 'Skipton', 'Smeaton', 'Smythesdale', 'Snake Island', 'Spinifex', 'Springfield', 'Spring Hill', 'Spring Plains', 'Stander', 'Stanley', 'Stawell', 'Steavenson', 'Stewarton', 'Stradbroke', 'Strangways', 'Stratford', 'Strathbogie', 'Strathfieldsaye', 'Strathmerton', 'Streatham', 'Struan', 'Suggan Buggan', 'Sunday Island', 'Sunset', 'Sutton', 'Sutton Grange', 'Swanwater', 'Switzerland', 'Taaraak', 'Tabbara', 'Tabberabbera', 'Tabilk', 'Taggerty', 'Tahara', 'Talambe', 'Talgarno', 'Talgitcha', 'Tallageira', 'Tallandoon', 'Tallang', 'Tallangallook', 'Tallangatta', 'Tallangoork', 'Tallarook', 'Tallygaroopna', 'Tambo', 'Tamboon', 'Tamboritha', 'Taminick', 'Tamleugh', 'Tandarook', 'Tandarra', 'Tangambalanga', 'Tanjil', 'Tanjil East', 'Taparoo', 'Taponga', 'Tara', 'Tarcombe', 'Taripta', 'Tarkeeth', 'Tarldarn', 'Tarnagulla', 'Tarneit', 'Tarragal', 'Tarranginnie', 'Tarrango', 'Tarranyurk', 'Tarra Tarra', 'Tarrawarra', 'Tarrawarra North', 'Tarrawingee', 'Tarrayoukyan', 'Tarrengower', 'Tarwin', 'Tarwin South', 'Tatong', 'Tatonga', 'Tatyoon', 'Tawanga', 'Tchirree', 'Tchuterr', 'Teddywaddy', 'Telangatuk', 'Telbit', 'Telbit West', 'Terang', 'Terlite-Munjie', 'Terrappee', 'Terrick Terrick East', 'Terrick Terrick West', 'Terrinallum', 'Thalia', 'Tharanbegga', 'Theddora', 'Thologolong', 'Thorkidaan', 'Thornley', 'Thornton', 'Thowgla', 'Thurra', 'Tiega', 'Tildesley East', 'Tildesley West', 'Timbarra', 'Timberoo', 'Timboon', 'Timmering', 'Tinamba', 'Tingaringy', 'Tintaldra', 'Tittybong', 'Toltol', 'Tongala', 'Tongaro', 'Tong Bong', 'Tonghi', 'Tongio-Munjie East', 'Tongio-Munjie West', 'Tonimbuk', 'Tonimbuk East', 'Tooan', 'Tooborac', 'Toolamba', 'Toolamba West', 'Toolang', 'Tooliorook', 'Toolka', 'Toolleen', 'Toolome', 'Toolondo', 'Toolongrook', 'Tooloy', 'Toombon', 'Toombullup', 'Toombullup North', 'Toonambool', 'Toongabbie North', 'Toongabbie South', 'Toonginbooka', 'Toonyarak', 'Toora', 'Toorak', 'Toorongo', 'Too-rour', 'Toorourrong', 'Toort', 'Torbreck', 'Tottington', 'Tourello', 'Towamba', 'Towan', 'Towaninny', 'Towanway', 'Towma', 'Towong', 'Traawool', 'Tragowel', 'Traralgon', 'Trawalla', 'Trentham', 'Trewalla', 'Truganina', 'Tubbut', 'Tulillah', 'Tullamarine', 'Tullich', 'Tullyvea', 'Tunart', 'Tungie', 'Turandurey', 'Turkeeth', 'Turoar', 'Turrumberry', 'Turrumberry North', 'Tutegong', 'Tutye', 'Tyabb', 'Tyagook', 'Tyalla', 'Tyamoonya', 'Tyar', 'Tyenna', 'Tyirra', 'Tylden', 'Tyntynder', 'Tyntynder North', 'Tyntynder West', 'Tyrendarra', 'Tyrrell', 'Ultima', 'Ulupna', 'Undera', 'Underbool', 'Undowah', 'Upotipotpon', 'Urangara', 'Vectis East', 'Vite Vite', 'Waaia', 'Waanyarra', 'Waarre', 'Wabba', 'Wabdallah', 'Wabonga', 'Wabonga South', 'Wa-de-lock', 'Wagant', 'Waggarandall', 'Wagra', 'Wahring', 'Wail', 'Waitchie', 'Walhalla', 'Walhalla East', 'Wallaby', 'Wallagoot', 'Wallaloo', 'Wallan Wallan', 'Walla Walla', 'Wallinduc', 'Wallowa', 'Wallpolla', 'Wallup', 'Walmer', 'Walpa', 'Walpamunda', 'Walpeup', 'Walwa', 'Wamba', 'Wanalta', 'Wandiligong', 'Wandin Yallock', 'Wando', 'Wandown', 'Wangarabell', 'Wangaratta North', 'Wangaratta South', 'Wangerrip', 'Wangie', 'Wangoom', 'Wannaeue', 'at Rosebud Parish of Wannaeue', 'Wanurp', 'Wanwandyra', 'Wanwin', 'Wappan', 'Waranga', 'Waratah', 'Waratah North', 'Warburton', 'Wareek', 'Wargan', 'Warina', 'Warmur', 'Warngar', 'Warrabkook', 'Warracbarunah', 'Warracknabeal', 'Warragamba', 'Warragul', 'Warrain', 'Warrak', 'Warrambat', 'Warrambine', 'Warrandyte', 'Warranook', 'Warraquil', 'Warra Warra', 'Warrayure', 'Warreen', 'Warrenbayne', 'Warrenheip', 'Warrenmang', 'Warrimoo', 'Warrion', 'Warrock', 'Warrong', 'Warrowitue', 'Wartook', 'Warung', 'Wataepoolan', 'Watchegatcheca', 'Watchem', 'Watchupga', 'Wategat', 'Watgania', 'Watgania West', 'Wathe', 'Watta Wella', 'Wat Wat', 'Wau Wauka', 'Wau Wauka West', 'Waygara', 'Wedderburne', 'Weeaproinah', 'Weecurra', 'Weeragua', 'Weerangourt', 'Weering', 'Wehla', 'Wellsford', 'Welshpool', 'Welumla', 'Wemen', 'Wensleydale', 'Wentworth', 'Wermatong', 'Werrap', 'Werribee', 'Werrigar', 'Werrikoo', 'Werrimull', 'Weston', 'Wewin', 'Whanregarwen', 'Wharparilla', 'Whirily', 'Whirrakee', 'Whitfield', 'Whitfield South', 'Whoorel', 'Whorouly', 'Whroo', 'Wiall', 'Wibenduck', 'Wickliffe North', 'Wickliffe South', 'Wilgul North', 'Wilgul South', 'Wilhelmina', 'Wilkin', 'Wilkur', 'Willah', 'Willam', 'Willangie', 'Willatook', 'Willaura', 'Willenabrina', 'Willoby', 'Willowmavin', 'Wills', 'Willung', 'Will-will-rook', 'Windermere', 'Windarra', 'Windham', 'Wingan', 'Wingeel', 'Wing Wing', 'Winiam', 'Winjallok', 'Winnambool', 'Winnindoo', 'Winteriga', 'Winton', 'Winyar', 'Winyayung', 'Wirchilleba', 'Wiridjil', 'Wirmbirchip', 'Wirmbool', 'Wirrate', 'Wirrbibial', 'Witchipool', 'Woatwoara', 'Wodonga', 'Wollert', 'Wollonaby', 'Wombat', 'Wombelano', 'Wondoomarook', 'Wongan', 'Wongarra', 'Wonga Wonga', 'Wonga Wonga South', 'Wongungarra', 'Wonnangatta', 'Wonthaggi', 'Wonthaggi North', 'Wonwondah', 'Wonwron', 'Wonyip', 'Woodbourne', 'Woodend', 'Woodnaggerak', 'Woodside', 'Woodstock', 'Woohlpooer', 'Wookurkook', 'Woolamai', 'Woolenook', 'Woolsthorpe', 'Woolwoola', 'Woongulmerang East', 'Woongulmerang West', 'Woorak', 'Woorarra', 'Woorinen', 'Wooriwyrite', 'Woori Yallock', 'Woornack', 'Woorndoo', 'Woornyalook', 'Wooronook', 'Woorragee', 'Woorragee North', 'Woosang', 'Wooundellah', 'Wooyoot', 'Woraigworm', 'Woranga', 'Wormangal', 'Wormbete', 'Worooa', 'Worrough', 'Worrowing', 'Wortongie', 'Wrathung', 'Wrixon', 'Wuk Wuk', 'Wulla Wullock', 'Wurdi-Youang', 'Wurrin', 'Wurrook', 'Wurruk Wurruk', 'Wurutwun', 'Wyangil', 'Wycheproof', 'Wychitella', 'Wyeeboo', 'Wyelangta', 'Wymlet', 'Wyperfeld', 'Wytwallan', 'Wytwarrone', 'Wyuna', 'Wy-Yung', 'Yaapeet', 'Yabba', 'Yabba Yabba', 'Yackandandah', 'Yalca', 'Yalimba', 'Yalimba East', 'Yallakar', 'Yalla-y-poora', 'Yallock', 'Yallook', 'Yallum', 'Yalmy', 'Yaloak', 'Yalong', 'Yalong South', 'Yambuk', 'Yambulla', 'Yanac-a-yanac', 'Yanakie', 'Yanakie South', 'Yandoit', 'Yangardook', 'Yangerahwill', 'Yangery', 'Yangoura', 'Yanipy', 'Yannathan', 'Yan Yan Gurt', 'Yan Yean', 'Yarak', 'Yaramba', 'Yarck', 'Yarima', 'Yarpturk', 'Yarraberb', 'Yarragon', 'Yarram Yarram', 'Yarramyljup', 'Yarrangook', 'Yarrara', 'Yarrawonga', 'Yarrayne', 'Yarrock', 'Yarrowalla', 'Yarrowee', 'Yarroweyah', 'Yatchaw East', 'Yatchaw West', 'Yatmerone', 'Yat Nat', 'Yatpool', 'Yaugher', 'Yea', 'Yearinga', 'Yeerik', 'Yeerung', 'Yehrip', 'Yellangip', 'Yelta', 'Yelwell', 'Yeo', 'Yering', 'Yertoo', 'Yeth-youang', 'Yeungroon', 'Yielima', 'Yinnar', 'Yonduk', 'Youanmite', 'Youarang', 'Youarrabuk', 'Youpayang', 'Youpella', 'Yowang', 'Yulecart', 'Yungera', 'Yuonga', 'Yuppeckiar', 'Yuroke'],
    township: ['Township', 'Aberfeldy', 'Acheron', 'Ailsa', 'Albacutya', 'Alberton', 'Alexandra', 'Allan"s Flat', 'Alma', 'Amherst', 'Amphitheatre', 'Anglesea', 'Annuello', 'Antwerp', 'Apollo Bay', 'Apsley', 'Arapiles', 'Ararat', 'Archdale', 'Arnold', 'Ascot', 'Aubrey', 'Avenel', 'Avoca', 'Axedale', 'Bacchus Marsh', 'Baddaginnie', 'Bairnsdale', 'Baker', 'Ballan', 'Ballarat', 'Ballarat East', 'Ballarat North', 'Balliang', 'Ballyrogan', 'Balmoral', 'Balnarring Beach', 'Bambill', 'Bangerang', 'Bannerton', 'Bannockburn', 'Banyena', 'Baringhup', 'Barkly', 'Barkstead', 'Barmah', 'Barnawartha', 'Barrakee', 'Barrapoort', 'Barringo', 'Barrys Reef', 'Barwon Downs', 'Barwon Heads', 'Bass', 'Bathumi', 'Bealiba', 'Bearii', 'Bear"s Lagoon', 'Beaufort', 'Beazleys Bridge', 'Beeac', 'Beechworth', 'Beenak', 'Beetoomba', 'Bellbrae', 'Bemm', 'Benalla', 'Benambra', 'Bendoc', 'Benetook', 'Bengworden', 'Benjeroop', 'Bennison', 'Berringa', 'Berringama', 'Berriwillock', 'Berrybank', 'Berwick', 'Bet Bet', 'Bethanga', 'Betley', 'Beulah', 'Beveridge', 'Bingo-Munjie North', 'Birchip', 'Birregurra', 'Blackwarry', 'Blackwood', 'Blakeville', 'Bocca Flat', 'Boigbeat', 'Boileau', 'Boinka', 'Bolton', 'Bolwarrah', 'Bonang', 'Bonnie Doon', 'Boolarra', 'Boolite', 'Boonoonar', 'Boorgunyah', 'Booroopki', 'Boort', 'Borung', 'Bowenvale', 'Branxholme', 'Braybrook', 'Breamlea', 'Briagolong', 'Bridgewater', 'Bright', 'Brim', 'Britannia Creek', 'Broadford', 'Broadmeadows', 'Bromley', 'Brookville', 'Broomfield', 'Broughton', 'Bruarong', 'Bruthen', 'Buangor', 'Buchan', 'Buckrabanyule', 'Buffalo', 'Bulla', 'Bullarto', 'Bullarto South', 'Bullumwaal', 'Buln Buln', 'Bunbartha', 'Bundalong', 'Bung Bong', 'Bungeet', 'Buninyong', 'Bunyip', 'Burke"s Flat', 'Burrereo', 'Burwood', 'Bushfield', 'Byaduk', 'Byaduk North', 'Callawadda', 'Callignee', 'Cambrian Hill', 'Campbell"s Creek', 'Campbelltown', 'Camperdown', 'Cann River', 'Cape Clear', 'Caramut', 'Carapooee', 'Carapook', 'Cargerie', 'Carisbrook', 'Carlsruhe', 'Carlyle', 'Carngham', 'Carrajung', 'Carwarp', 'Cashel', 'Cassilis', 'Casterton', 'Castlemaine', 'Castle Point', 'Cavendish', 'Charlton', 'Chatsworth', 'Chepstowe', 'Cherokee', 'Cheshunt', 'Chetwynd', 'Childers', 'Chiltern', 'Chinkapook', 'Clarendon', 'Clear Lake', 'Club Terrace', 'Clunes', 'Coalville', 'Cobden', 'Cobram', 'Coburg', 'Cocamba', 'Cockatoo', 'Cohuna', 'Colac', 'Colbinabbin', 'Coleraine', 'Comoora', 'Congupna Road', 'Cooma', 'Coonooer', 'Cooper"s Creek', 'Cope Cope', 'Corack', 'Cora Lynn', 'Corindhap', 'Corinella', 'Corop', 'Corryong', 'Costerfield', 'Cowa', 'Cowangie', 'Cowes', 'Cowwarr', 'Craigie', 'Cranbourne', 'Cravensville', 'Creek View', 'Cressy', 'Creswick', 'Crib Point', 'Crossover', 'Crowlands', 'Cudgee', 'Culgoa', 'Cullulleraine', 'Cunninghame', 'Curyo', 'Dalhousie', 'Dandenong', 'Danyo', 'Dargo', 'Darlimurla', 'Darlingford', 'Darlington', 'Darnum', 'Darraweit Guim', 'Dartmoor', 'Dartmouth', 'Daylesford', 'Daylesford West', 'Deddick', 'Dederang', 'Dennington', 'Deptford', 'Dereel', 'Dergholm', 'Derrinallum', 'Devenish West', 'Devon', 'Diamond Creek', 'Diapur', 'Digby', 'Dimboola', 'Dollar', 'Donald', 'Dooen', 'Douglas', 'Drik Drik', 'Dromana', 'Drouin', 'Dry Diggings', 'Drysdale', 'Dunbulbalane', 'Dunkeld', 'Dunolly', 'Durham', 'Durham Lead', 'Durham Ox', 'East Cunninghame', 'East Murchison', 'Echuca', 'Echuca', 'Echuca', 'Echuca West', 'Eddington', 'Edenhope', 'Edi', 'Egerton', 'Eilyar', 'Elaine', 'Elaine North', 'Eldorado', 'Elingamite North', 'Ellam', 'Ellerslie', 'Elmhurst', 'Elmore', 'Elphinstone', 'Eltham', 'Emerald', 'Emu', 'Ensay', 'Epping', 'Epsom', 'Eskdale', 'Eurack', 'Euroa', 'Evansford', 'Everton', 'Fernbank', 'Fernihurst', 'Flinders', 'Flynn', 'Flynn"s Creek Upper', 'Forrest', 'Foster', 'Fosterville', 'Foxhow', 'Framlingham', 'Franklinford', 'Frankston', 'Freeburgh', 'Fryerstown', 'Furnell', 'Fyansford', 'Galah', 'Garfield', 'Garibaldi', 'Garvoc', 'Gavan Duffy', 'Geelong', 'Gelantipy', 'Gellibrand', 'Gerangamete', 'Gerang Gerung', 'Ghin Ghin', 'Giffard', 'Gipsy Point', 'Girgarre', 'Gisborne', 'Glanville', 'Geln Dart', 'Glengower', 'Glenlyon', 'Glenmaggie', 'Glenorchy', 'Glenrowen', 'Glenthompson', 'Glen Wills', 'Gobur', 'Golden Lake', 'Goldsborough', 'Goon Nure', 'Gooramadda', 'Goornong', 'Gooroc', 'Gordon', 'Gormandale', 'Goroke', 'Goschen', 'Gould', 'Gowar', 'Gowar East', 'Goyura', 'Granite Flat', 'Grant', 'Granton', 'Grantville', 'Granya', 'Graytown', 'Great Western', 'Greendale', 'Green Gully', 'Green"s Creek', 'Gre Gre', 'Grenville', 'Greta', 'Greta West', 'Guildford', 'Gunbower', 'Gunyah Gunyah', 'Haddon', 'Haines', 'Hamilton', 'Happy Valley', 'Harcourt', 'Harrietville', 'Harrow', 'Hastings', 'Hattah', 'Hawkesdale', 'Healesville', 'Heathcote', 'Heatherlie', 'Hedley', 'Heidelberg', 'Hepburn', 'Hexham', 'Heyfield', 'Heywood', 'Hinno-Munjie', 'Hoddle', 'Hollinwood', 'Homebush', 'Hopetoun', 'Horsham', 'Hotspur', 'Howqua', 'Huntly', 'Iguana Creek', 'Inglewood', 'Inverleigh', 'Inverloch', 'Irrewillipe', 'Jamieson', 'Jam Jerrup', 'Jarrott', 'Jeeralang Junction', 'Jerro', 'Johnsonville', 'Kalimna', 'Kalkallo', 'Kangaroo Flat', 'Kaniva', 'Karabeal', 'Karawinna', 'Kardella', 'Karnak', 'Karween', 'Katamatite', 'Katandra', 'Keilor', 'Kerang', 'Kewell', 'Kialla West', 'Kiamal', 'Kiata', 'Kilcunda', 'Kilmany', 'Kilmore', 'Kinglake Central', 'Kinglake East', 'Kingower', 'Kirkstall', 'Koetong', 'Kooloonong', 'Koondrook', 'Koonoomoo', 'Koonwarra', 'Koorooman', 'Kooyoora', 'Korokubeal', 'Korong Vale', 'Korumburra', 'Koyuga', 'Kulwin', 'Kurraca', 'Kyabram', 'Kyneton', 'Laanecoorie', 'Laang', 'Lah', 'Lake Boga', 'Lake Bolac', 'Lake Charm', 'Lake Rowan', 'Lakes Entrance', 'Lal Lal', 'Lamplough', 'Lancefield', 'Landsborough', 'Lara', 'Launching Place', 'Lauriston', 'Lawloit', 'Lawrence', 'Learmonth', 'Leichardt', 'Leonards Hill', 'Leongatha', 'Lethbridge', 'Lexton', 'Lillimur', 'Lillimur South', 'Lilydale', 'Linga', 'Linton', 'Lismore', 'Little River', 'Llanelly', 'Lockington', 'Locksley', 'Lockwood', 'Longerenong', 'Longford', 'Longwarry', 'Longwood', 'Lorne', 'Lorquon', 'Lower Emu', 'Lower Homebush', 'Lubeck', 'Lucknow', 'Lyons', 'Lyonville', 'Macarthur', 'Macedon', 'Mackinnon"s Bridge', 'Mafeking', 'Maffra', 'Maindample', 'Majorca', 'Maldon', 'Mallacoota', 'Malmsbury', 'Manangatang', 'Mandurang', 'Mangalore', 'Manorina', 'Mansfield', 'Marengo', 'Maribyrnong', 'Marlo', 'Marnoo', 'Marong', 'Maroona', 'Marungi', 'Maryborough', 'Marysville', 'Mathiesons', 'Matlock', 'Maude', 'Meeniyan', 'Melbourne', 'at East Melbourne City of Melbourne Parish of Melbourne North', 'at West Melbourne City of Melbourne Parish of Melbourne North', 'City of Melbourne Parish of Melbourne North', 'City of Melbourne Parish of Melbourne South', 'Melton', 'Merbein', 'Meredith', 'Meringo', 'Meringur', 'Merino', 'Merricks', 'Merrijig', 'Merrinee', 'Merton', 'Metcalfe', 'Metung', 'Mia Mia', 'Middle Creek', 'Miepoll', 'Milltown', 'Miners Rest', 'Minimay', 'Minyip', 'Miralie', 'Miram', 'Mirboo', 'Mirboo North', 'Mitchellstown', 'Mitta Mitta', 'Mittyack', 'Modewarre', 'Moe', 'Molesworth', 'Moliagul', 'Molyullah', 'Monbulk', 'Moonambel', 'Moorilim', 'Mooroopna', 'Morkalla', 'Mornington', 'Morrisons', 'Mortlake', 'Morwell', 'Mossiface', 'Moyston', 'Muckatah', 'Mudgeegonga', 'Mumbannar', 'Munro', 'Murchison', 'Murrabit', 'Murra Warra', 'Murrayville', 'Murrungowar', 'Murtoa', 'Myrniong', 'Myrtleford', 'Mystic Park', 'Nagambie', 'Nalinga', 'Nandaly', 'Napoleons', 'Narbethong', 'Nariel', 'Narrawong', 'Nathalia', 'Natimuk', 'Natte Yallock', 'Natya', 'Navarre', 'Neerim', 'Neilborough', 'Nelson', 'Nerrina', 'Netherby', 'Neuarpur', 'Newbridge', 'Newbury', 'Newhaven', 'Newlyn North', 'Newmerella', 'Newry', 'Newstead', 'Nhill', 'Nilma', 'Ni Ni', 'Ninyeunook', 'Nirranda', 'Noojee', 'Noradjuha', 'Norong', 'Northcote', 'Township adjoining the City of Northcote Parish of Jika Jika', 'Nowa Nowa', 'Nowingi', 'Nullawil', 'Numurkah', 'Nungurner', 'Nuntin', 'Nurrabiel', 'Nyah', 'Nyah West', 'Nyora', 'Oakleigh', 'Old Longwood', 'Olinda', 'Omeo', 'Orbost', 'Orford', 'Osborne', 'Ouyen', 'Oxley', 'Pakenham', 'Panitya', 'Panmure', 'Panton Hill', 'Paynesville', 'Peechelba', 'Penshurst', 'Percydale', 'Peterborough', 'Pheasant Creek', 'Piangil', 'Pier-Millan', 'Pigeon Ponds', 'Pimpinio', 'Pira', 'Piries', 'Pirlta', 'Pirron Yallock', 'Pitfield', 'Pitfield Plains', 'Pollard', 'Poowong', 'Porepunkah', 'Port Albert', 'Portarlington', 'Port Campbell', 'Port Fairy', 'Port Franklin', 'Portland', 'Port Welshpool', 'Powelltown', 'Princetown', 'Pullut', 'Pura Pura', 'Purdeet', 'Pyalong', 'Pyramid Hill', 'Quambatook', 'Queenscliff', 'Queenstown', 'Raglan', 'Rainbow', 'Ravenswood', 'Raymond Island', 'Raywood', 'Redbank', 'Redcastle', 'Redesdale', 'Red Hill South', 'Reedy Creek', 'Rheola', 'Rhyll', 'Riddell', 'Ringwood', 'Robinvale', 'Rochester', 'Rokeby', 'Rokewood', 'Romsey', 'Rosebud', 'Rosedale', 'Rossbridge', 'Rowsley', 'Ruffy', 'Runnymede', 'Rupanyup', 'Rushworth', 'Rutherglen', 'Rye', 'St. Arnaud', 'St. Clair', 'St. Leonards', 'Sale', 'Salisbury', 'Sandford', 'Sandy Point', 'San Remo', 'Sarsfield', 'Scott"s Creek', 'Seacombe', 'Sea Lake', 'Seaspray', 'Seaton', 'Sebastian', 'Sebastopol', 'Serpentine', 'Serviceton', 'Seville', 'Seymour', 'Shelford', 'Shepparton', 'Shirley', 'Shoreham', 'Skene"s Creek', 'Skipton', 'Skye', 'Smeaton', 'Smith"s Gully', 'Smythesdale', 'Sorrento', 'South Bannockburn', 'South Muckleford', 'Speed', 'Spring Hill', 'Springhurst', 'Stanhope', 'Stanley', 'Stawell', 'Steiglitz', 'Stirling', 'Stockyard Hill', 'Stony Creek', 'Stradbroke', 'Stratford', 'Strathallan', 'Strathbogie', 'Strath Creek', 'Strathfieldsaye', 'Streatham', 'Stuartmill', 'Suggan Buggan', 'Sunbury', 'Sunnyside', 'Sutton Grange', 'Swan Hill', 'Swanpool', 'Swan Reach', 'Swift"s Creek', 'Sydenham', 'Tabbara', 'Taggerty', 'Tahara', 'Talbot', 'Tallangallook', 'Tallangatta', 'Tallangatta Valley', 'Tallarook', 'Tamboon', 'Tamboon South', 'Taradale', 'Tarilta', 'Tarkedia', 'Tarnagulla', 'Tarranginnie', 'Tarraville', 'Tarrayoukyan', 'Tarwin', 'Tarwin Lower', 'Tatong', 'Tatonga', 'Tatura', 'Teesdale', 'Telopea Downs', 'Templestowe', 'Tempy', 'Terang', 'Terrick Terrick', 'Terrick Terrick South', 'The Gap', 'Thoona', 'Timboon', 'Timor', 'Tolmie', 'Tongala', 'Tongio-Munjie', 'Tongio West', 'Toolamba', 'Toolangi', 'Toolern Vale', 'Toolleen', 'Toolondo', 'Toombon', 'Toongabbie', 'Torquay', 'Torrita', 'Towaninny', 'Towong', 'Trafalgar', 'Traralgon', 'Trentham', 'Trinita', 'Tungamah', 'Tunstals', 'Tutye', 'Tyaak', 'Tyers', 'Tylden', 'Tynong', 'Tyrendarra', 'Underbool', 'Vaughan', 'Ventnor', 'Violet Town', 'Waaia', 'Waanyarra', 'Wail', 'Walhalla', 'Walkerville', 'Wallace', 'Wallan', 'Walmer', 'Walpeup', 'Wal Wal', 'Wandiligong', 'Wandin Yallock', 'Wando Vale', 'Wangaratta', 'Wannon', 'Warburton', 'Wareek', 'Warneet', 'Warracknabeal', 'Warragul', 'Warrak', 'Warrandyte', 'Warrandyte North', 'Warrayure', 'Warrenheip', 'Warrnambool', 'Watchem', 'Waubra', 'Waygara', 'Wedderburn', 'Wehla', 'Werribee', 'Werrimull', 'Wesburn', 'Westbury', 'Westmere', 'Wharparilla North', 'Whiskey Creek', 'White Hills', 'Whittlesea', 'Whorouly', 'Whroo', 'Wickliffe', 'Wilby', 'Willenabrina', 'Williamstown', 'Willow Grove', 'Willung', 'Winchelsea', 'Wingeel', 'Winslow', 'Winton', 'Winyar', 'Wodonga', 'Wombelano', 'Wonthaggi', 'Wonwondah East', 'Wonwondah North', 'Woodend', 'Woodford', 'Woodside', 'Woodside North', 'Wood"s Point', 'Wood Wood', 'Woolamai', 'Woolsthorpe', 'Woomelang', 'Woorinen South', 'Woorndoo', 'Wooroonook', 'Wunghnu', 'Wurdi Boluc', 'Wurruk', 'Wycheproof', 'Wyelangta', 'Wyuna', 'Yaapeet', 'Yackandandah', 'Yambuk', 'Yanac South', 'Yandoit', 'Yarck', 'Yarragon', 'Yarra Junction', 'Yarrara', 'Yarrawonga', 'Yarto', 'Yatpool', 'Yea', 'Yellingbo', 'Yelta', 'Yendon', 'Yungera', 'Yuppeckiar'],
  },
};

export const doubleVerificationProducts = [
  'SATITLEOWNER',
  'LANSTADDR',
];

export const regionsWithInlineVerification = [
  'WA',
  'NSW',
];

const getRegionsData = (): Region[] => [
  {
    region: ExistingRegions.ALL,
    services: [],
    // services: [
    //   {
    //     name: 'Owner (Individual)',
    //     productId: 'RPTNATOWN',
    //     identifier: 'ALLOI',
    //   },
    //   {
    //     name: 'Owner (Organisation)',
    //     productId: 'RPTNATOWN',
    //     identifier: 'ALLOO',
    //   },
    // ],
  },
  {
    region: ExistingRegions.NSW,
    services: [
      {
        name: 'Title Reference',
        productId: 'INT-NSWTRS',
        identifier: 'HTTRN',
        infotip: 'Use either a lot and plan or a volume-folio reference.\n- For Lot 123 in DP 4567, type 123/4567\n- For Lot 123 in SP 4567, type 123/SP4567\n- For Lot 123 section 45 in DP 678, type 123/45/678\n- For Volume 12345 Folio 234, type 12345-234',
      },
      {
        name: 'Address',
        productId: 'LPISA',
        identifier: 'HTAN',
        infotip: 'This search will provide the current ownership of a property and any registered interests affecting the property.\n\nUse the street number, street name and suburb to find title references associated to an address. Search without using the street type (St, Rd etc.).',
      },
    ],
  },
  {
    region: ExistingRegions.VIC,
    services: [
      {
        name: 'Volume/Folio',
        productId: 'LANVOLFO',
        identifier: 'HTVF',
      },
      {
        name: 'Address',
        productId: 'LANSTADDR',
        identifier: 'HTAV',
      },
      {
        name: 'Lot/Plan or List',
        productId: 'LANLOTPLN',
        identifier: 'HTLPV',
        infotip: 'Search for a property using Lot/Plan or just the Plan Number. Any of these formats will be accepted: \n - PS123456\n - 1/TP123456K\n - RES2/LP123456\n - 1/RP123\n - PS123456M',
      },
    ],
  },
  {
    region: ExistingRegions.QLD,
    services: [
      {
        name: 'Address',
        productId: 'INT-QLDSTRADR',
        identifier: 'HTAQ',
      },
      {
        name: 'Owner (Individual)',
        productId: 'DNRQPROP',
        identifier: 'HTOIQ',
        infotip: 'This search will provide the current ownership of a property and any registered interests affecting the property.\nUse this search to find title references using an owner name. A list of names matching your search criteria will be returned. \n \n Please supply at least the Surname. Names must have at least 3 characters and a \'%\' can be used as a wildcard (example: bro% will search for anything that begins with \'bro\')',
      },
      {
        name: 'Owner (Organisation)',
        productId: 'DNRQPROP',
        identifier: 'HTOOQ',
        infotip: 'This search will provide the current ownership of a property and any registered interests affecting the property. Use this search to find title references using the name of the Company that owns the property. A list of names matching your search criteria will be returned\n\nCompany Name must have at least 3 characters.',
      },
      {
        name: 'Lot/Plan',
        productId: 'DNRQLP',
        identifier: 'HTLPQ',
        infotip: 'Search for a property using Lot/Plan or just the Plan Number. e.g. any of these formats will be accepted:\n - 8/RP601844\n - 8RP601844\n - RP601844\n - 6/CPFY2594\n - 6/FY2594',
      },
    ],
  },
  {
    region: ExistingRegions.SA,
    services: [
      {
        name: 'Volume/Folio',
        productId: 'SATITLE',
        identifier: 'HTVFS',
      },
      {
        name: 'Address',
        productId: 'SASTADR',
        identifier: 'HTAS',
      },
      {
        name: 'Plan/Parcel',
        productId: 'INT-SAPLNPRCLS',
        identifier: 'HTPPS',
      },
      {
        name: 'Owner (Individual)',
        productId: 'SATITLEOWNER',
        identifier: 'HTONSS',
      },
      {
        name: 'Owner (Organisation)',
        productId: 'SATITLEOWNER',
        identifier: 'HTLBOS',
      },
    ],
  },
  {
    region: ExistingRegions.WA,
    maxResultsBeforeWarning: 200,
    warningMessage: 'Your request generated a large number of results. Please refine your search criteria.',
    services: [
      {
        name: 'Title Reference',
        productId: 'INT-WATRS',
        identifier: 'HTTRW',
        infotip: 'Lot Plan does not translate into a Title Reference.\nSample References:\n- For Volume 1234 and Folio 567, type 1234/567\n- For Volume CL202 and Folio 1973, type CL202/1973\n- For Volume 134 and Folio 17A, type 134/17A\n- For Volume LR121 and Folio 33577A, type LR121/33577A',
      },
      {
        name: 'Address',
        productId: 'WASTRADR',
        identifier: 'HTAW',
      },
      {
        name: 'Owner (Individual)',
        productId: 'WAON',
        identifier: 'HTOIW',
      },
      {
        name: 'Owner (Organisation)',
        productId: 'WAON',
        identifier: 'HTOOW',
      },
    ],
  },
  {
    region: ExistingRegions.TAS,
    services: [
      {
        name: 'Volume/Folio',
        productId: 'TASFT',
        identifier: 'HTVFT',
      },
      {
        name: 'Address',
        productId: 'TASSTADR',
        identifier: 'HTAT',
      },
    ],
  },
  {
    region: ExistingRegions.ACT,
    services: [
      {
        name: 'Volume/Folio',
        productId: 'ACTVF',
        identifier: 'HTVFA',
      },
      {
        name: 'Address',
        productId: 'ACTA',
        identifier: 'HTAA',
      },
      {
        name: 'Parcel',
        productId: 'ACTP',
        identifier: 'HTPA',
      },
    ],
  },
  {
    region: ExistingRegions.NT,
    services: [
      {
        name: 'Volume/Folio',
        productId: 'NTCT',
        identifier: 'HTVFN',
      },
      {
        name: 'Lot/Town',
        productId: 'NTCT',
        identifier: 'HTLTN',
      },
      {
        name: 'Property Address',
        productId: 'NTCT',
        identifier: 'HTPAN',
      },
    ],
  },
];

export default getRegionsData;
