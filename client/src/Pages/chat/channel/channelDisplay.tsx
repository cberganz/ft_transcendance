import * as React from 'react';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import showChannelItems from './channelCategory';
import { ChatProps } from '../stateInterface'

let channelCategories = [
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


function Channel(name: String, panel: String, type: String, props: any) {
  const [expanded, setExpanded] = React.useState<String | false>(false);

  const handleChange =
    (panel: String) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
      <Accordion key={panel.valueOf()} expanded={expanded === panel} onChange={handleChange(panel)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={panel + "bh-content"}
          id={panel + "bh-header"}
        >
          <Typography sx={{ width: '100%', flexShrink: 0 }} component="span">
            <b>{name}</b>
          </Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ padding: '0px'}}>
          <Typography component="span">
            {type === 'dm' ? showChannelItems('dm', props) : null}
            {type === 'joined' ? showChannelItems('joined', props) : null}
            {type === 'all' ? showChannelItems('all', props) : null}
          </Typography>
        </AccordionDetails>
      </Accordion>
  );
}

export default function ChannelDisplay(props: any) {
	return (
		<div>
				{channelCategories.map((category) => (
            Channel(category.name, category.panel, category.type, props)
				))}
		</div>
	)
}