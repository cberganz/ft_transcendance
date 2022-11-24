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

export let cdine = {
    id:          0,
    login:       "cdine",
    username:    "cdine",
    avatar:      "https://i.guim.co.uk/img/media/08312799ce07993294b1cd2e135a0f00e3455c42/0_0_6720_4480/master/6720.jpg?width=620&quality=85&dpr=1&s=none",
    friends:     [],
    blacklisted: [],
    messages:    [],
    channels:    [],
    admin_of:    [],
    p1_games:    [],
    p2_games:    [],
    friendship:  [],
    blacklist:   []
}