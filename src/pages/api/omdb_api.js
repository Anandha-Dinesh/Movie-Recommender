const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

export async function omdb_api(movie) {
	try {
		let URL = `http://www.omdbapi.com/?t=${encodeURIComponent(movie).replace(
			/%20/g,
			"+"
		)}&plot=full&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`;
		const response = await axios.get(URL);
		if (response.status == 200) {
			return response.data;
		} else throw error;
	} catch (error) {
		console.log(error);
	}
}
