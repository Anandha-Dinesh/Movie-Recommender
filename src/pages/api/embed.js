// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const {GoogleGenerativeAI} = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY);

const model = genAI.getGenerativeModel({model: "text-embedding-004"});

const embedder = async (text) => {
	try {
		let str = JSON.stringify(text);
		const str1 = str.length > 10000 ? str.slice(0, 9000) : str;
		const result = await model.embedContent(str1);
		return result.embedding;
	} catch (error) {
		// console.log(error);
	}
};

module.exports = {embedder};
