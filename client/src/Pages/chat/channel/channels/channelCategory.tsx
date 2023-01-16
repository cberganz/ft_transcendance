import { ChannelItem, NotJoinedChanItem } from './channelItem';
import '../../chat.css'

function getAllChans(props: any, chanArray: any, joined: boolean) {
  return (
    <div>
    {
        chanArray.map((chan: any) => (
          <div key={chan.id}>
            {joined ? ChannelItem(chan, props): <NotJoinedChanItem chan={chan} props={props} />}
          </div>
      ))
    }
    </div>
  );
}

export default function showChannelItems(type: String, props: any) {    
  switch (type) {
    case 'dm' :
      return getAllChans(props, props.state.joinedChans.filter((chan: any) => chan.type === 'dm'), true);
    case 'joined' :
      return getAllChans(props, props.state.joinedChans.filter((chan: any) => chan.type !== 'dm'), true);
    case 'all' :
      return getAllChans(props, props.state.notJoinedChans, false);
    default :
      return
  }

}