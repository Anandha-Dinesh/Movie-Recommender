import Head from "next/head";
import {useState} from "react";
import {omdb_api} from "./api/omdb_api";
import {embedder} from "./api/embed";
import {fetch_vectors} from "./api/vector_query";
import {ResponseError} from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";

export default function Home() {
	const [inputValue, setInputValue] = useState("");
	const [galleryItems, setGalleryItems] = useState([]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const movies = await omdb_api(inputValue);
		console.log(movies);
		const reqMovie =
			movies.Title +
			" " +
			movies.Actors +
			" " +
			movies.Genre +
			" " +
			movies.Language +
			" " +
			movies.Plot +
			" " +
			movies.Director;
		const embeddedReqMovie = await embedder(reqMovie);

		const topkMovies = await fetch_vectors(embeddedReqMovie.values);
		// const galleryItems
		const mov_arr = await Promise.all(
			await topkMovies.map(async (movie) => await omdb_api(movie.id))
		);
		let filtered_movies = mov_arr.filter((movie) => {
			return movie.Response === "True";
		});

		const related_movies = filtered_movies.map((movie) => ({
			movie_title: movie.Title,
			movie_poster: movie.Poster,
			movie_link: `https://www.imdb.com/find/?q=${movie.Title}`,
		}));
		setGalleryItems(related_movies);
		setInputValue("");
	};

	return (
		<div className="flex flex-col items-center min-h-screen py-2">
			<Head>
				<title>movie-recommender</title>
			</Head>

			<main className="flex flex-col items-center justify-center flex-1 w-full px-20 text-center">
				<h1 className="text-4xl font-bold mb-4">Movie-Recommender</h1>
				<h4 className="text-lg font-medium mb-4">
					Let&apos;s Find What&apos;s Next
				</h4>
				<form onSubmit={handleSubmit} className="flex items-center mb-8">
					<input
						type="text"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						className="px-4 py-2 text-lg border border-gray-300 rounded-lg text-black"
						placeholder="Enter movie"
					/>
					<button
						type="submit"
						className="mx-4 px-4 py-2 text-lg text-black bg-gray-200 rounded-lg hover:bg-gray-300"
					>
						Submit
					</button>
				</form>
				<div className="flex flex-wrap justify-center gap-4">
					{galleryItems.map((item, index) => (
						<a
							href={item.movie_link}
							key={index}
							className="block w-40 transition-transform transform hover:scale-105"
							target="_blank"
							rel="noopener noreferrer"
						>
							<img
								src={item.movie_poster}
								alt={`Gallery item ${index + 1}`}
								className="w-full h-auto rounded-lg"
							/>
						</a>
					))}
				</div>
			</main>
		</div>
	);
}
