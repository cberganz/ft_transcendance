import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

export default function useToken() {
	const [isTokenValidated, setIsTokenValidated] = useState('loading');

	useEffect(() => {
		axios.get("http://localhost:3000/auth/validate", { withCredentials: true })
			.then((response: AxiosResponse) => {
				if (response.status === 200) {
					setIsTokenValidated('valid'); // in case there is no token
					return ;
				}
				setIsTokenValidated('invalid')
			})
			.catch(() => setIsTokenValidated('invalid'))
	}, [])

	return (isTokenValidated)
}