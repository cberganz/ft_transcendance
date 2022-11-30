import { ChatState, Channel } from "./stateInterface"

export function getChan(id: number, state: ChatState) {
    for (const chan of state.joinedChans) {
      if (chan.id === id)
        return chan
    }
  }

export function userIsInChan(chan: Channel, userId: number) {
    if (chan.members === undefined)
      return (false)
    for (let user of chan.members) {
      if (user.id === userId)
        return (true)
    }
    return (false)
}

export function sortChannels(chans: Channel[]) {
    chans.sort(function(a: any, b: any) {
        var c, d;
        if (b.Message?.length === 0)
            c = b.id
        else
            c = new Date(b.Message[b.Message.length - 1].date).getTime()
        if (a.Message.length === 0)
            d = a.id;
        else
            d = new Date(a.Message[a.Message.length - 1].date).getTime()
        return c - d;
    });
  }