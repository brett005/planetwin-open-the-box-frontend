const config = {
  error: null,
  debug: true,
  cdn: '/',
  api: {
    // post gameId
    prize: 'http://localhost:3000',
    username: 'http://localhost:3000'
  },
  images: {
    'bg-landscape': 'images/bg.png',
    'bg-portrait': 'images/portrait_image.jpg',
    box: 'images/box.png',
    fog: 'images/fog.png',
    'box-top': 'images/box-top.png',
    'box-bottom': 'images/box-bottom.png',
    'box-top-half': 'images/open_half.png',
    balls: [
      'images/basketball.png',
      'images/soccer.png',
      'images/football.png',
      'images/tennis.png',
      'images/baseball.png'
    ]
  },
  texts: {
    link: 'lorem ipsum',
    title: 'Lorem Ipsum dolor sit amet connectur',
    subtitle: '',
    terms: `<p style="text-align:center; font-weight: bold"> Lorem Ipsum </p> </p></p>
            Lorem ipsum dolor sit amet </br>
            lorem <br/>
            Terms and Condition
            <p style="text-align:center; font-weight: bold"> Terms & Conditions </p> </p></p>
            `,
    winMessage: '<p>NON HAI</br> <b>VINTO</b></p>'
  },
  href: 'http://google.com',
  footer: ''
};

const Config = window.config || config;

if (Config.cdn) {
  Object.keys(Config.images).forEach(key => {
    if (typeof Config.images[key] === 'string') {
      Config.images[key] = Config.cdn + Config.images[key];
    } else {
      Object.keys(Config.images[key]).forEach(key2 => {
        Config.images[key][key2] = Config.cdn + Config.images[key][key2];
      });
    }
  });
}

const find = key => {
  let pointer = Config;
  key = key.split('.');
  while (key[0]) {
    pointer = pointer[key.shift()];
  }
  return pointer;
};

const set = (key, value) => {
  let pointer = Config;
  key = key.split('.');
  while (key[1]) {
    pointer = pointer[key.shift()];
  }
  pointer[key[0]] = value;
};

Config.set = set;
Config.get = find;

export default Config;
