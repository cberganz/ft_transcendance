import { useState, useEffect } from 'react';

export default function useToken() {
	function getToken() {
		return localStorage.getItem('access_token');
	}
	const [isTokenValidated, setIsTokenValidated] = useState('loading');

	useEffect(() => {
		const access_token = getToken();
		if (!access_token)
		{
			localStorage.clear();
			setIsTokenValidated('invalid')
			return ;
		}
		fetch('http://localhost:3000/auth/validate', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + access_token
			}
		})
		.then((data) => {
			if (data.status !== 401) {
				setIsTokenValidated('valid'); // in case there is no token
				return ;
			}
			localStorage.clear();
			setIsTokenValidated('invalid')
		})
	}, [])

	return (isTokenValidated)
}