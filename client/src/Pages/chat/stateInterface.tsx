export interface ChatState {
    actualUser: actualUser,
    joinedChans: any,
    notJoinedChans: any,
    openedConversation: any
}

export interface actualUser {
    user: any,
    openedConvID: number
}    

export interface Channel {
  id:        number,
  owner:     User,
  ownerId:   number,
  title:     String,
  members:   User[],
  type:      String,
  password:  String,
  admin:     User[],
  Message:   Message[],
  blacklist: Blacklist[],
}

export interface Message {
    id:        number,
    channel?:  Channel,
    channelId: number,
    author:    User,
    authorId:  number,
    date?:      Date,
    content:   String,
}





export interface User {
    id:          number,
    login:       String,
    username:    String,
    avatar:      String,
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
    type:      String,
    date:      Date,
    delay:     number,
    channel:   Channel,
    channelId: number,
    creator:   User,
    creatorId: number,
  }
  