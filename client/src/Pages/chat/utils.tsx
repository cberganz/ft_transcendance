import { ChatState, Channel } from "./stateInterface"

export function getChan(id: number, state: ChatState) {
    for (const chan of state.joinedChans) {
      if (chan.id === id)
        return chan
    }
  }

export function userIsInChan(chan: Channel, state: ChatState) {
    if (chan.members === undefined)
      return (false)
    for (let user of chan.members) {
      if (user.login === state.actualUser.user.login)
        return (true)
    }
    return (false)
}

export function sortChannels(chans: Channel[]) {
    chans.sort(function(a: any, b: any) {
      var c = new Date(b.Message[b.Message.length - 1].date).getTime()
      var d = new Date(a.Message[a.Message.length - 1].date).getTime()
      return c - d;
    });
  }