import { ChannelItem, DialogChannelItem } from './channelItem';
import { getProfile } from '../../utils';
import '../../chat.css'

export function DMChannels(props: any) {
  return (
    <span>
    {
        props.state.joinedChans?.map((chan: any) => (
              <div key={chan.id}>
              {chan.type === 'dm' && chan.members[0].id === props.state.actualUser.user.id ? 
                ChannelItem(chan, String(getProfile(props.state.userList, chan.members[1].id)?.username), String(getProfile(props.state.userList, chan.members[1].id)?.avatar), props) 
                : null}
              {chan.type === 'dm' && chan.members[1].id === props.state.actualUser.user.id ? 
                ChannelItem(chan, String(getProfile(props.state.userList, chan.members[0].id)?.username), String(getProfile(props.state.userList, chan.members[0].id)?.avatar), props) : null}
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
        props.state.joinedChans?.map((chan: any) => (
              <div key={chan.id}>
              {chan.type === 'dm' ? null : ChannelItem(chan, chan.title, "", props)}
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
        props.state.notJoinedChans?.map((chan: any) => (
          <div key={chan.id}>
              <DialogChannelItem chan={chan} chanName={chan.title} props={props} />
           </div>
      ))
    }
    </div>
  );
}

export default function showChannelItems(type: String, props: any) {    
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