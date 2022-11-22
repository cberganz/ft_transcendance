function getChan(id: number, props: any) {
  for (let i = 0; i < props.state.joinedChans.length; i++) {
    if (props.state.joinedChans[i].id === id)
      return (props.state.joinedChans[i])
  }
}

export default function ChatHeader(props:any) {
  const chan = getChan(props.state.user.openedConvID, props)
  return (
    <div style={{marginTop: '15px', color: 'black'}}>
      {chan?.name}
    </div>
  )
}