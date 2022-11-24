  export let openedConversation = [
    {
      "id": 1,
      "channel": {"id": 1, "type": "dm"},
      "author": {"avatar": "https://i.guim.co.uk/img/media/08312799ce07993294b1cd2e135a0f00e3455c42/0_0_6720_4480/master/6720.jpg?width=620&quality=85&dpr=1&s=none", "login": "cdine"},
      "date": "10/10/22",
      "content": "Hello",
    },
    {
      "id": 2,
      "channel": {"id": 1, "type": "dm"},
      "author": {"avatar": "https://leclaireur.fnac.com/wp-content/uploads/2022/08/superman.jpg", "login": "rbicanic"},
      "date": "10/10/22",
      "content": "Yo man",
    },
  ]
  
  // openedConvID === -1 quand rien ouvert
  export let user  = {"avatar": "https://i.guim.co.uk/img/media/08312799ce07993294b1cd2e135a0f00e3455c42/0_0_6720_4480/master/6720.jpg?width=620&quality=85&dpr=1&s=none", "login": "cdine", "openedConvID": -1}

  export let channelCategories = [
      {
        type: 'dm', 
        name: 'Private messages',
        panel: 'panel1'
      }, 
      {
        type: 'joined', 
        name: 'Joined Channels',
        panel: 'panel2'
      }, 
      {
        type: 'all', 
        name: 'All Channels',
        panel: 'panel3'
      }, 
    ]
  
  export let joinedChans = [
    {
      "id": 1,
      "name": "rbicanic",
      "members": [
        { "avatar": "https://i.guim.co.uk/img/media/08312799ce07993294b1cd2e135a0f00e3455c42/0_0_6720_4480/master/6720.jpg?width=620&quality=85&dpr=1&s=none","login": "cdine"},
        { "avatar": "https://leclaireur.fnac.com/wp-content/uploads/2022/08/superman.jpg","login": "rbicanic"},
      ],
      "type": "dm",
      "password": "",
      // "admin": [],
      // "blacklist": [],
      // "mutelist": [],
      "owner": "",
    },
    {
      "id": 2,
      "name": "Chonky cats lovers",
      "members": [
        { "avatar": "https://i.guim.co.uk/img/media/08312799ce07993294b1cd2e135a0f00e3455c42/0_0_6720_4480/master/6720.jpg?width=620&quality=85&dpr=1&s=none","login": "cdine"},
        { "avatar": "https://leclaireur.fnac.com/wp-content/uploads/2022/08/superman.jpg","login": "rbicanic"},
      ],
      "type": "private",
      "password": "lol",
      // "admin": [
      //   { "avatar": "https://i.guim.co.uk/img/media/08312799ce07993294b1cd2e135a0f00e3455c42/0_0_6720_4480/master/6720.jpg?width=620&quality=85&dpr=1&s=none","login": "cdine"},
      //   { "avatar": "https://leclaireur.fnac.com/wp-content/uploads/2022/08/superman.jpg","login": "rbicanic"},
      // ],
      // "blacklist": [],
      // "mutelist": [],
      "owner": "cdine",
    },
    {
      "id": 3,
      "name": "Doggo lovers",
      "members": [
        { "avatar": "https://i.guim.co.uk/img/media/08312799ce07993294b1cd2e135a0f00e3455c42/0_0_6720_4480/master/6720.jpg?width=620&quality=85&dpr=1&s=none","login": "cdine"},
        { "avatar": "https://leclaireur.fnac.com/wp-content/uploads/2022/08/superman.jpg","login": "rbicanic"},
      ],
      "type": "public",
      "password": "",
      // "admin": [
      //   { "avatar": "https://i.guim.co.uk/img/media/08312799ce07993294b1cd2e135a0f00e3455c42/0_0_6720_4480/master/6720.jpg?width=620&quality=85&dpr=1&s=none","login": "cdine"},
      //   { "avatar": "https://leclaireur.fnac.com/wp-content/uploads/2022/08/superman.jpg","login": "rbicanic"},
      // ],
      // "blacklist": [],
      // "mutelist": [],
      "owner": "cdine",
    },
  ]

  export let notJoinedChans = [
    {
      "id": 4,
      "name": "Cat haters",
      "members": [
        { "avatar": "https://leclaireur.fnac.com/wp-content/uploads/2022/08/superman.jpg","login": "rbicanic"},
      ],
      "type": "public",
      "password": "",
      // "admin": [],
      // "blacklist": [],
      // "mutelist": [],
      "owner": "rbicanic",
    },
    {
      "id": 5,
      "name": "Chonky cats haters",
      "members": [
        { "avatar": "https://leclaireur.fnac.com/wp-content/uploads/2022/08/superman.jpg","login": "rbicanic"},
      ],
      "type": "private",
      "password": "lol",
      // "admin": [
      //   { "avatar": "https://leclaireur.fnac.com/wp-content/uploads/2022/08/superman.jpg","login": "rbicanic"},
      // ],
      // "blacklist": [],
      // "mutelist": [],
      "owner": "rbicanic",
    },
  ]

  // get all msgs except private chans
  export let messages = [
    {
      "id": 1,
      "channel": {"id": 1, "type": "dm"},
      "author": {"avatar": "https://i.guim.co.uk/img/media/08312799ce07993294b1cd2e135a0f00e3455c42/0_0_6720_4480/master/6720.jpg?width=620&quality=85&dpr=1&s=none", "login": "cdine"},
      "date": "10/10/22",
      "content": "Hello",
    },
    {
      "id": 2,
      "channel": {"id": 1, "type": "dm"},
      "author": {"avatar": "https://leclaireur.fnac.com/wp-content/uploads/2022/08/superman.jpg", "login": "rbicanic"},
      "date": "10/10/22",
      "content": "Yo man",
    },
    {
      "id": 3,
      "channel": {"id": 2, "type": "private"},
      "author": {"avatar": "https://leclaireur.fnac.com/wp-content/uploads/2022/08/superman.jpg", "login": "rbicanic"},
      "date": "10/10/22",
      "content": "Love a big chonk",
    },
    {
      "id": 4,
      "channel": {"id": 2, "type": "private"},
      "author": {"avatar": "https://leclaireur.fnac.com/wp-content/uploads/2022/08/superman.jpg", "login": "rbicanic"},
      "date": "10/10/22",
      "content": "Damn right i do",
    },
    {
      "id": 5,
      "channel": {"id": 3, "type": "public"},
      "author": {"avatar": "https://i.guim.co.uk/img/media/08312799ce07993294b1cd2e135a0f00e3455c42/0_0_6720_4480/master/6720.jpg?width=620&quality=85&dpr=1&s=none", "login": "cdine"},
      "date": "10/10/22",
      "content": "Who love dogs?",
    },
    {
      "id": 6,
      "channel": {"id": 3, "type": "public"},
      "author": {"avatar": "https://leclaireur.fnac.com/wp-content/uploads/2022/08/superman.jpg", "login": "rbicanic"},
      "date": "10/10/22",
      "content": "Love good doggos",
    },
    {
      "id": 7,
      "channel": {"id": 4, "type": "public"},
      "author": {"avatar": "https://leclaireur.fnac.com/wp-content/uploads/2022/08/superman.jpg", "login": "rbicanic"},
      "date": "10/10/22",
      "content": "I FUCKING HATE CATS",
    },
  ]

