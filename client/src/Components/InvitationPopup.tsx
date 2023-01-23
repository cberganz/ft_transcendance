import { Alert } from '@mui/material';
import useInvitation from '../Hooks/useInvitation';

const InvitationPopup = () => {
	const { isOpen } = useInvitation();

	if (isOpen) {
		return (
			<Alert
				severity={'warning'}
				sx={{
				position: 'absolute',
				right: 0,
				top  : 0,
				width: '100%',
				zIndex: 10,
				}}
			>
				{"test"}
			</Alert>
		);
	}
	else {
		return <></>;
	}
};

export default InvitationPopup;