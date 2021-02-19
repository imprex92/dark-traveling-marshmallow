import React, {useReducer, useRef, useEffect, useState} from 'react'
import Link from 'next/link'
// let filteredBlogs;
const slides = [
	{
	  title: "Machu Picchu",
	  subtitle: "Peru",
	  description: "Adventure is never far away",
	  image:
		"https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
	},
	{
	  title: "Chamonix",
	  subtitle: "France",
	  description: "Let your dreams come true",
	  image:
		"https://images.unsplash.com/photo-1581836499506-4a660b39478a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
	},
	{
	  title: "Mimisa Rocks",
	  subtitle: "Australia",
	  description: "A piece of heaven",
	  image:
		"https://images.unsplash.com/photo-1566522650166-bd8b3e3a2b4b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
	},
	{
	  title: "Four",
	  subtitle: "Australia",
	  description: "A piece of heaven",
	  image:
		"https://images.unsplash.com/flagged/photo-1564918031455-72f4e35ba7a6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
	},
	{
	  title: "Five",
	  subtitle: "Australia",
	  description: "A piece of heaven",
	  image:
		"https://images.unsplash.com/photo-1579130781921-76e18892b57b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
	}
  ];
 
  function useTilt(active) {
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
  
  const initialState = {
	slideIndex: 0
  };
  
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
  
  function Slide({ slide, offset }) {
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
						<p className="slideDescription">{slide?.postMood + ' ' || 'User might be happy '}  {' ' + slide?.postWeather?.userWeather || " Weather is unknown"}</p>
					</div>
				</div>
			</div>
	    </Link>
	);
  }

function Slides({searchByText, countrySearchTerm, userBlogs}) {
	const [filterByCountry, setFilterByCountry] = useState('')
	const [fetchedUserBlogs, setFetchedUserBlogs] = useState([])
	
	useEffect(() => {
		setFetchedUserBlogs(userBlogs)
		setFilterByCountry(countrySearchTerm)
		//! filter vid klick på land från navbar. skickat från dashboard component
	}, [searchByText, countrySearchTerm, userBlogs])
	const [state, dispatch] = useReducer(slidesReducer, initialState);
	
	let filteredBlogs = fetchedUserBlogs?.filter((post) => {
		if(searchByText.trim(' '))
		return 	post.postLocationData.country.toLowerCase().includes(searchByText.toLowerCase()) || 
				post.postLocationData.state.toLowerCase().includes(searchByText.toLowerCase()) ||
				post.postLocationData.city.toLowerCase().includes(searchByText.toLowerCase()) ||
				post.postTitle.toLowerCase().includes(searchByText.toLowerCase())
		if(!filterByCountry.trim(' '))
		return post
		else
		return post.postLocationData.country.toLowerCase().includes(filterByCountry.toLowerCase())
	})

	return (
		<div className="slides">
		  <button onClick={() => dispatch({ type: "PREV" })}>‹</button>
	
		  {[...filteredBlogs, ...filteredBlogs, ...filteredBlogs].map((slide, i) => {
			let offset = filteredBlogs.length + (state.slideIndex - i);
			return <Slide slide={slide} offset={offset} key={i} />;
		  })}
		  
		  <button onClick={() => dispatch({ type: "NEXT" })}>›</button>
		</div>
	  );
  }


export default Slides