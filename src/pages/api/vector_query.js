import {Pinecone} from "@pinecone-database/pinecone";

const pc = new Pinecone({apiKey: process.env.NEXT_PUBLIC_PINECONE_KEY});
const index = pc.index("movie-vectors");

const fetch_vectors = async (vec) => {
	try {
		const queryResponse = await index.namespace().query({
			vector: vec,
			topK: 5,
			includeValues: true,
		});
		return queryResponse.matches;
	} catch (error) {
		return error;
	}
};

module.exports = {fetch_vectors};
