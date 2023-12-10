import { env } from '$env/dynamic/public';

const { PUBLIC_API_URL = 'http://localhost:3001/api' } = env;

export async function registerParticipant(name: string) {
	try {
		const request = await fetch(`${PUBLIC_API_URL}/participants`, {
			headers: {
				'content-type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({ name })
		});

		if (request.status !== 201) {
			throw new Error(`Unexpected status code: ${request.status}`);
		}

		const responseBody = await request.json();

		return responseBody;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to register participant!');
	}
}

export async function fetchParticipants(query: Record<string, any>) {
	try {
    const url = new URL(`${PUBLIC_API_URL}/participants`);
    url.search = new URLSearchParams(query).toString();
		const request = await fetch(url, {
			headers: {
				accept: 'application/json'
			}
		});

		if (request.status !== 200) {
			throw new Error(`Unexpected status code: ${request.status}`);
		}

		const responseBody = await request.json();

		return responseBody;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to fetch participant!');
	}
}
