// Default "Getting Around" content — mirrors FALLBACK_CATEGORIES in the customer
// app (Frontend/src/Pages/GettingAround.jsx). The public page keeps its own copy
// as a fallback; this copy SEEDS the admin editor so the owner sees the real,
// current content to edit instead of a blank form. Once the owner saves, the
// site_content row (key: getting_around) becomes what the public page merges on top.
//
// IMPORTANT: each category must keep its `key` — the public page matches admin
// overrides to its built-in categories by this key (tourism, food, nightlife,
// atm, supermarkets, fuel, markets). Editing titles/items is safe; don't drop keys.
export const DEFAULT_GETTING_AROUND = [
  {
    key: 'tourism',
    title: 'Tourism, Play & Games',
    items: [
      { name: 'Olumo Rock (historical sightseeing point)', time: '15-17 mins', link: 'https://www.google.com/maps/place/Olumo+Rock+Tourist+Centre/data=!4m2!3m1!1s0x0:0x8b3b657ec52d6ca2?sa=X&ved=1t:2428&ictx=111' },
      { name: 'Nike Art Gallery (same location as Olumo Rock)', time: '15-17 mins', link: 'https://www.google.com/maps/place/Olumo+Rock+Tourist+Centre/data=!4m2!3m1!1s0x0:0x8b3b657ec52d6ca2?sa=X&ved=1t:2428&ictx=111' },
      { name: 'Kuti Heritage Museum, Isabo (Ransome-Kuti family-focused)', time: '15-17 mins', link: 'https://www.google.com/maps/place/The+Kuti+Heritage+Museum/data=!4m2!3m1!1s0x0:0xbf071edbaf512766?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'OOPL Wildlife Park (mini-zoo experience for kids and adults)', time: '19-22 mins', link: 'https://www.google.com/maps/place/OOPL+WILDLIFE+PARK/data=!4m2!3m1!1s0x0:0xd56fd816953819c9?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'OOPL Rounda Fun Spot (play options for kids)', time: '16-21 mins', link: 'https://www.google.com/maps/place/OOPL+Rounda+Fun+Spot/data=!4m2!3m1!1s0x0:0x444ed0adf08f927a?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'Adonis Plaza Paintball and Games (multiple games options)', time: '21-25 mins', link: 'https://www.google.com/maps/place/Muda+Lawal+Stadium/data=!4m2!3m1!1s0x0:0xaf0350ccb7acbb9a?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'Funsation Games & Entertainment, Oke-Ilewo', time: '13-15 mins', link: 'https://www.google.com/maps/place/Funsation+Games+and+Entertainment+Center/data=!4m2!3m1!1s0x0:0x3be61307be257838?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'FoodCo Akin-Olugbade Social Centre (kids play area)', time: '8 mins', link: 'https://www.google.com/maps/place/FoodCo+Akin-Olugbade+Social+Centre/data=!4m2!3m1!1s0x0:0x6bdaa90f7fdcf79?sa=X&ved=1t:2428&ictx=111' },
      { name: 'OOPL Cinemas, Oke-Mosan', time: '19-23 mins', link: 'https://www.google.com/maps/place/OOPL+Cinemas/data=!4m2!3m1!1s0x0:0x9dbe344ed6f63164?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'OOPL Aje Place Cinemas & Lounge, Panseke', time: '13 mins', link: 'https://www.google.com/maps/place/OOPL+Aje+Place+Cinemas+%26+Lounge/data=!4m2!3m1!1s0x0:0x59afe40419450c3c?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'Centenary Hall, Ake (historical sight)', time: '15 mins', link: 'https://www.google.com/maps/place/Centenary+Hall-+Abeokuta/data=!4m2!3m1!1s0x0:0x7283ef228c31d42?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'Alake Palace Ground (historic seat of the Alake of Egbaland)', time: '18 mins', link: 'https://www.google.com/maps/place/Alake+Palace+Ground/data=!4m2!3m1!1s0x0:0xd1648f6fc8d87370?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'Adire Mall, Itoku (for different styles and prints of adire)', time: '15 mins', link: 'https://www.google.com/maps/place/Adire+Mall,+Itoku/data=!4m2!3m1!1s0x0:0x638c56a3be4b135a?sa=X&ved=1t:2428&hl=en&ictx=111' },
    ],
  },
  {
    key: 'food',
    title: 'Food & Dining',
    items: [
      { name: 'Burger King Oke-Ilewo (fast food)', time: '13 mins', link: 'https://www.google.com/maps/place/burger+king+oke+ilewo+abeokuta/data=!4m2!3m1!1s0x103a4d0000e34531:0x9ac7dd5f0c7b75a?sa=X&ved=1t:242&hl=en&ictx=111' },
      { name: 'SUPERFOODS Oke-Ilewo (fast food)', time: '11 mins', link: 'https://www.google.com/maps/place/SUPERFOODS+Abeokuta/data=!4m2!3m1!1s0x103a4c7175ee7779:0x9957b6fe87e92e1b?sa=X&ved=1t:242&ictx=111' },
      { name: "Domino's Pizza Abeokuta", time: '10 mins', link: 'https://www.google.com/maps/place/Dominos+Pizza+Abeokuta/data=!4m2!3m1!1s0x0:0xdc5f00b31973f0c9?sa=X&ved=1t:2428&ictx=111' },
      { name: 'Sweet Sensation Oke-Ilewo (fast food)', time: '12 mins', link: 'https://www.google.com/maps/place/Sweet+Sensation+(Abeokuta)/data=!4m2!3m1!1s0x0:0x8cd34ac69aab5f16?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'WokCity Restaurant Oke-Ilewo (multiple options)', time: '12 mins', link: 'https://www.google.com/maps/place/WokCity+Restaurant+Ibara+Abeokuta/data=!4m2!3m1!1s0x0:0xb709d11ef8207105?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'CHOW TOWN Adigbe (Rice, Pasta/Noodles & Sandwiches)', time: '19 mins', link: 'https://www.google.com/maps/place/CHOW+TOWN/data=!4m2!3m1!1s0x0:0x427a1b74f8a94ed?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'Halaga Restaurant Ope Oluwa Ita Oshin (local food)', time: '8 mins', link: 'https://www.google.com/maps/place/Halaga+Restaurant/data=!4m2!3m1!1s0x0:0x9a6509df71cf0f88?sa=X&ved=1t:2428&ictx=111' },
      { name: 'South Kitchen & Lounge Ibara Housing (fine dining)', time: '18-20 mins', link: 'https://www.google.com/maps/place/south+kitchen+and+lounge+abeokuta/data=!4m2!3m1!1s0x103a4be7c6c2d9c3:0xe1a17fc0472294e8?sa=X&ved=1t:242&hl=en&ictx=111' },
      { name: 'Royal Mandarin Restaurant Ibara Housing (fine dining)', time: '17 mins', link: 'https://www.google.com/maps/place/Royal+mandarin+restaurant/data=!4m2!3m1!1s0x0:0xa1d3a9f9d17f2ac8?sa=X&ved=1t:2428&hl=en&ictx=111' },
    ],
  },
  {
    key: 'nightlife',
    title: 'Night Life (Clubs)',
    items: [
      { name: 'Quench Nightlife (Quarry Imperial Hotel)', time: '11 mins', link: 'https://www.google.com/maps/place/quench+nightlife+abeokuta/data=!4m2!3m1!1s0x103a4dc17cf414cd:0x6845d81057ea6494?sa=X&ved=1t:242&ictx=111' },
      { name: 'BarCode Lounge (off Quarry Road)', time: '11 mins', link: 'https://www.google.com/maps/place/BarCode+lounge+Abk/data=!4m2!3m1!1s0x0:0xea0cd2b3fe2b895a?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'Red Dot Club (Ita Eko)', time: '10 mins', link: 'https://www.google.com/maps/place/Red+Dot+Club/data=!4m2!3m1!1s0x0:0xc116546d5d76f268?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'XO RestoBar (off Akin Olugbade Road)', time: '9 mins', link: 'https://www.google.com/maps/place/XO+RestoBar/data=!4m2!3m1!1s0x0:0xe3ae6a313f8f9c2e?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'Elysium Oasis (Onikolobo area)', time: '11 mins', link: 'https://www.google.com/maps/place/Elysium+Oasis/data=!4m2!3m1!1s0x0:0x6d6d212934fdff56?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'The South Club (Leme/NNPC area)', time: '16 mins', link: 'https://www.google.com/maps/place/The+South+Club/data=!4m2!3m1!1s0x0:0xe629a4c03e6104be?sa=X&ved=1t:2428&ictx=111' },
    ],
  },
  {
    key: 'atm',
    title: 'ATM Options',
    items: [
      { name: 'WEMA Bank ATM (Lafenwa)', time: '9 mins', link: 'https://www.google.com/maps/place/Wema+Bank+-+Lafenwa/data=!4m2!3m1!1s0x0:0x13b83cbf747dac66?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'Polaris Bank ATM (Oke-Ilewo/Ibara)', time: '12 mins', link: 'https://www.google.com/maps/place/Polaris+Bank+Limited/data=!4m2!3m1!1s0x0:0x1bb152198e5f5cc6?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'UBA ATM (Ita-Eko)', time: '10 mins', link: 'https://www.google.com/maps/place/United+Bank+for+Africa/data=!4m2!3m1!1s0x0:0xae29cb562e06f62a?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'GTB ATM (IBB Boulevard)', time: '12 mins', link: 'https://www.google.com/maps/place/Guaranty+Trust+Bank+PLC+Kuto+Abeokuta/data=!4m2!3m1!1s0x0:0x2637eef8f199847d?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'Access Bank ATM (Oke-Ilewo)', time: '13 mins', link: 'https://www.google.com/maps/place/Access+Bank+Plc+Oke+Ilewo+Branch/data=!4m2!3m1!1s0x0:0xa4440a234118d531?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'FCMB ATM (Oke-Ilewo)', time: '11 mins', link: 'https://www.google.com/maps/place/FCMB+Abeokuta+Branch/data=!4m2!3m1!1s0x0:0x38132a8454f02dd9?sa=X&ved=1t:2428&hl=en&ictx=111' },
    ],
  },
  {
    key: 'supermarkets',
    title: 'Grocery Stores/Supermarkets',
    items: [
      { name: 'FoodCo Supermarket Akin Olugbade', time: '8 mins', link: 'https://www.google.com/maps/place/FoodCo+Akin-Olugbade+Social+Centre/data=!4m2!3m1!1s0x0:0x6bdaa90f7fdcf79?sa=X&ved=1t:2428&ictx=111' },
      { name: 'Justrite Superstore Lafenwa', time: '8 mins', link: 'https://www.google.com/maps/place/Justrite+Superstores+lafenwa/data=!4m2!3m1!1s0x0:0x9fe704b6f24bdae3?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'Justrite Superstore Ibara', time: '13 mins', link: 'https://www.google.com/maps/place/Justrite+Superstore+Ibara,+Abeokuta/data=!4m2!3m1!1s0x0:0x6055edc019c82d83?sa=X&ved=1t:2428&ictx=111' },
      { name: 'Bestdeal Supermarket Oke-Ilewo', time: '13 mins', link: 'https://www.google.com/maps/place/Bestdeal+Supermarket+Oke-ilewo/data=!4m2!3m1!1s0x0:0x283605172c635e8a?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'Shalom Megastores Oke-Ilewo', time: '13 mins', link: 'https://www.google.com/maps/place/shalom+mega+stores+oke-ilewo+abeokuta/data=!4m2!3m1!1s0x103a4c77f6b6b327:0x6ee76a5b7168a8da?sa=X&ved=1t:242&hl=en&ictx=111' },
    ],
  },
  {
    key: 'fuel',
    title: 'Filling Stations',
    items: [
      { name: 'Bovas Filling Station (along Ita-Oshin road)', time: '6 mins', link: 'https://www.google.com/maps/place/Bovas+Filling+Station/data=!4m2!3m1!1s0x0:0x5d102ab52a106ede?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'NNPC Filling Station (Ita-Oshin)', time: '6 mins', link: 'https://www.google.com/maps/place/NNPC+-+Ita-Oshin+Filling+Station/data=!4m2!3m1!1s0x0:0xa8ea96058bc51c06?sa=X&ved=1t:2428&hl=en&ictx=111' },
      { name: 'NNPC Filling Station (Akin Olugbade)', time: '9 mins', link: 'https://maps.app.goo.gl/TjkmGocmpnXSpsCdA' },
      { name: 'World Oil Filling Station (Oke-Ilewo)', time: '11 mins', link: 'https://www.google.com/maps/place/World+Oil+Nigeria+Limited/data=!4m2!3m1!1s0x0:0xf28be25caf21c578?sa=X&ved=1t:2428&hl=en&ictx=111' },
    ],
  },
  {
    key: 'markets',
    title: 'Local Markets',
    items: [
      { name: 'Olomore Market', time: '5-6 mins', link: 'https://www.google.com/maps/place/Olomore+Market/data=!4m2!3m1!1s0x0:0x3d667733607ee4c1?sa=X&ved=1t:2428&ictx=111' },
      { name: 'Lafenwa Market', time: '8-10 mins', link: 'https://www.google.com/maps/place/Lafenwa+Market/data=!4m2!3m1!1s0x0:0x82f5b5e9d6fd1459?sa=X&ved=1t:2428&ictx=111' },
      { name: 'Omida Market', time: '12-15 mins', link: 'https://www.google.com/maps/place/Omida+Shopping+Complex+Abeokuta/data=!4m2!3m1!1s0x0:0xcfcbddbb8b59d9bf?sa=X&ved=1t:2428&ictx=111' },
    ],
  },
];
