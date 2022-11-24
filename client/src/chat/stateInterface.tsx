export interface Message {
    "id": number,
    "channel": {
        "id": number, 
        "type": string
    },
    "author": {
        "avatar": string, 
        "login": string
    },
    "date": string,
    "content": string,
}

export interface User {
    "avatar": string,
    "login": string, 
    "openedConvID": number
}

export interface Chan {
      "id": number,
      "name": string,
      "members": {
        "avatar": string,
        "login": string
      }[],
      "type": string,
      "password": string,
    //   "admin": [],
    //   "blacklist": [],
    //   "mutelist": [],
      "owner": string,
}


export interface ChatState {
    messages: Message[],
    user: User,
    joinedChans: Chan[],
    notJoinedChans: Chan[],
    openedConversation: Message[],
}