export interface ChatState {
    messages: Message[],
    actualUser: actualUser,
    joinedChans: Channel[],
    notJoinedChans: Channel[],
    openedConversation: Message[],
}

export interface actualUser {
    user: User,
    openedConvID: number
}    

export interface User {
    id:          number,
    login:       string,
    username:    string,
    avatar:      string,
    friends:     Friendship[],
    blacklisted: Blacklist[],
    messages:    Message[],
    channels:    Channel[],
    admin_of:    Channel[],
    p1_games:    Game[],
    p2_games:    Game[],
    friendship:  Friendship[],
    blacklist:   Blacklist[]
  }
  
export interface Channel {
    id:        number,
    title:     string,
    members:   User[],
    type:      string,
    password:  string,
    admin:     User[],
    Message:   Message[],
    blacklist: Blacklist[],
}
  
export interface Game {
    id:            number,
    player1:       User,
    player1Id:     number,
    player2:       User,
    player2Id:     number,
    player1_score: number,
    player2_score: number,
    winner:        number,
    date:          Date,
}
  
export interface Message {
    id:        number,
    channel:   Channel,
    channelId: number,
    author:    User,
    authorId:  number,
    date:      Date,
    content:   string,
}
  
export interface Friendship {
    id:       number,
    user1:    User,
    user1_id: number,
    user2:    User,
    user2_id: number,
    date:     Date,
    approved: Boolean,
}
  
export interface Blacklist {
    id:        number,
    target:    User,
    target_id: number,
    type:      string,
    date:      Date,
    delay:     number,
    channel:   Channel,
    channelId: number,
    creator:   User,
    creatorId: number,
  }
  