import React, {useReducer, useRef, useEffect, useState} from 'react'
import Link from 'next/link'
let slides = []

const Slides = ({searchByText, countrySearchTerm, userBlogs = []}) => {
	const [filterByCountry, setFilterByCountry] = useState('')
	const [fetchedUserBlogs, setFetchedUserBlogs] = useState([])

	useEffect(() => {
		slides = userBlogs
		setFetchedUserBlogs(userBlogs)
		setFilterByCountry(countrySearchTerm)
		//! filter vid klick på land från navbar. skickat från dashboard component
	}, [searchByText, countrySearchTerm, userBlogs])
	const [state, dispatch] = useReducer(slidesReducer, initialState);

	let filteredBlogs = fetchedUserBlogs?.filter((post) => {
		const postLocationData = post.postLocationData || {};
		const country = (postLocationData.country || '').toLowerCase();
		const state = (postLocationData.state || '').toLowerCase();
		const city = (postLocationData.city || '').toLowerCase();
		const postTitle = (post.postTitle || '').toLowerCase();
		const postContent = (post.postContent || '').toLowerCase();
		const wasApiOffline = postLocationData.wasApiOffline || false; // Default to false if not defined

		// Check if there's a search query (searchByText) and it's not empty
		const isSearching = searchByText.trim() !== '';

		// Check for filterByCountry, and if it's not empty, filter by country
		if (filterByCountry.trim()) {
			return country.includes(filterByCountry.toLowerCase());
		}

		// Check if there's a search query
		if (isSearching) {
			return (
				country.includes(searchByText.toLowerCase()) ||
				state.includes(searchByText.toLowerCase()) ||
				city.includes(searchByText.toLowerCase()) ||
				postTitle.includes(searchByText.toLowerCase()) ||
				wasApiOffline && postTitle.includes(searchByText.toLowerCase()) ||
				wasApiOffline && postContent.includes(searchByText.toLowerCase())
			);
		}

		// Show all posts when not searching
		return true;
	});

	return (
		<div className="slides">
			<button className={filteredBlogs.length === 0 ? 'visibilityHidden' : ''} onClick={() => dispatch({ type: "NEXT" })}>‹</button>

			{[...filteredBlogs, ...filteredBlogs, ...filteredBlogs].map((slide, i) => {
			let offset = filteredBlogs.length + (state.slideIndex - i);
			return <Slide slide={slide} offset={offset} key={i} />;
			})}
			
			<button className={filteredBlogs.length === 0 ? 'visibilityHidden' : ''} onClick={() => dispatch({ type: "PREV" })}>›</button>
		</div>
	);
}
	const initialState = {
		slideIndex: 0
	};

	const Slide = ({ slide, offset }) => {
	const active = offset === 0 ? true : null;
	const ref = useTilt(active);

	return (
		
		<Link as={`/user/posts/singlepost/${slide.slug}`} href={`/user/posts/singlepost?slug=${slide.slug}`}>
			<div
				ref={ref}
				className="slide"
				data-active={active}
				style={{
					"--offset": offset,
					"--dir": offset === 0 ? 0 : offset > 0 ? 1 : -1
				}}
			>
				<div
					className="slideBackground"
					style={{
						backgroundImage: `url('${slide.imgURL ? slide.imgURL : 'https://firebasestorage.googleapis.com/v0/b/dark-traveling-marshmallow.appspot.com/o/defaultData%2Fpexels-beth-easton-2433985.jpg?alt=media&token=e9ef12ed-0b53-4d6e-86a6-eb8a1775f048'}')`
					}}
				/>
				<div
					className="slideContent"
					style={{
						backgroundImage: `url('${slide.imgURL ? slide.imgURL : 'https://firebasestorage.googleapis.com/v0/b/dark-traveling-marshmallow.appspot.com/o/defaultData%2Fpexels-beth-easton-2433985.jpg?alt=media&token=e9ef12ed-0b53-4d6e-86a6-eb8a1775f048'}')`
					}}
				>
					<div className="slideContentInner white-text">
						<h2 className="slideTitle">{slide.postTitle || 'No title'}</h2>
						<h3 className="slideSubtitle">{slide.postLocationData.country || 'Secret location'}</h3>
						<div>
							<p className="slideDescription">{slide?.postMood}</p>
							<p className="slideDescription"> {slide?.postWeatherData?.weatherUser}</p>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
	}

	const useTilt = (active) => {
		const ref = useRef(null);

		useEffect(() => {
			if (!ref.current || !active) {
				return;
			}

			const state = {
				rect: undefined,
				mouseX: undefined,
				mouseY: undefined
			};

			let el = ref.current;

			const handleMouseMove = (e) => {
				if (!el) {
					return;
				}
				if (!state.rect) {
					state.rect = el.getBoundingClientRect();
				}
				state.mouseX = e.clientX;
				state.mouseY = e.clientY;
				const px = (state.mouseX - state.rect.left) / state.rect.width;
				const py = (state.mouseY - state.rect.top) / state.rect.height;

				el.style.setProperty("--px", px);
				el.style.setProperty("--py", py);
			};

			el.addEventListener("mousemove", handleMouseMove);

			return () => {
				el.removeEventListener("mousemove", handleMouseMove);
			};
		}, [active]);

		return ref;
	}


	const slidesReducer = (state, event) => {
		if (event.type === "NEXT") {
			return {
				...state,
				slideIndex: (state.slideIndex + 1) % slides.length
			};
		}
		if (event.type === "PREV") {
			return {
				...state,
				slideIndex:
					state.slideIndex === 0 ? slides.length - 1 : state.slideIndex - 1
			};
		}
	};

export default Slides
