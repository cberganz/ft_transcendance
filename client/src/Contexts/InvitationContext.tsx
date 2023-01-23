import { createContext, useState } from 'react';

interface InvitationHooksType {
	isOpen: boolean,
}
const initialState: InvitationHooksType = {
	isOpen: false,
};

const InvitationContext = createContext({
	...initialState,
	setInvitation: (isOpen: boolean ) => {(void isOpen)},
});

export const InvitationProvider = ({ children } : any) => {
	const [isOpen, setOpen] = useState(false);

	const setInvitation = (isOpen: boolean ) => {
		setOpen(isOpen);
	};

	return (
		<InvitationContext.Provider
		value={{
			isOpen,
			setInvitation,
		}}
		>
		{children}
		</InvitationContext.Provider>
	);
};

export default InvitationContext;