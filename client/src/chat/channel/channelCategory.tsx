import { ChannelItem, DialogChannelItem } from './channelItem';
import '../chat.css'

export function DMChannels(props: any) {
  return (
    <span>
    {
        props.state.joinedChans.map((chan: any) => (
              <div key={chan.id}>
              {chan.type === 'dm' && chan.members[0].login === props.state.user.login ? ChannelItem(chan, chan.members[1].login, chan.members[1].avatar, props) : null}
              {chan.type === 'dm' && chan.members[1].login === props.state.user.login ? ChannelItem(chan, chan.members[0].login, chan.members[0].avatar, props) : null}
              </div>
      ))
    }
    </span>
  );
}

export function JoinedChannels(props: any) {
  return (
    <span>
    {
        props.state.joinedChans.map((chan: any) => (
              <div key={chan.id}>
              {chan.type === 'dm' ? null : ChannelItem(chan, chan.name, "", props)}
              </div>
      ))
    }
    </span>
  );
}

export function AllChannels(props: any) {

  return (
    <div>
    {
        props.state.notJoinedChans.map((chan: any) => (
          <div key={chan.id}>
              <DialogChannelItem chan={chan} chanName={chan.name} props={props} />
           </div>
      ))
    }
    </div>
  );
}

export default function showChannelItems(type: string, props: any) {
    switch (type) {
    case 'dm' :
      return DMChannels(props)
    case 'joined' :
      return JoinedChannels(props)
    case 'all' :
      return AllChannels(props)
    default :
      return
  }

}