import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'
import '../cssFiles/styles.css'
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Navbar from '../components/navbar';
import MediaCardsSection from '../components/mediaCardsSection';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

function mainPage() {

    const API_LINK = "https://api.themoviedb.org/3/trending/all/week?api_key=118a416e242696514bbe44e8675550a1&page=1language=en-US"; 
    const pageDesc = "mainPage" 
//   const [count, setCount] = useState(0)
//   const API_LINK = "https://api.themoviedb.org/3/trending/all/week?api_key=118a416e242696514bbe44e8675550a1&page=1language=en-US";  
//   const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
//   const LOGO_PATH = "https://image.tmdb.org/t/p/w1280";
//   const SEARCH_API = "https://api.themoviedb.org/3/search/multi?&api_key=118a416e242696514bbe44e8675550a1&query="
//   const WATCH_PROVIDER_LINK_1 = "https://api.themoviedb.org/3/movie/";
//   const WATCH_PROVIDER_LINK_2 = "/watch/providers?api_key=118a416e242696514bbe44e8675550a1";
//   const WATCH_PROVIDER_LINK_TV_1 = "https://api.themoviedb.org/3/tv/";



// const [allElements, setAllElements] = useState([]);
// const [isPopupOpen, setIsPopupOpen] = useState(false);

// const [media, setMedia] = useState('');

// const [contentType, setContentType] = useState("details");
// const [providers, setProviders] = useState({buyRent: [], stream: [], fallback: ""});
// const [query, setQuery] = useState("");
// const navigate = useNavigate();
// look at thie later
// data.results.sort(({poster_path: a}, {poster_path: b}) => (a === null) - (b === null) || a-b);
// const fetchMovies = async (url) => {
//     try {
//         // const API_LINK = "https://api.themoviedb.org/3/trending/all/week?api_key=118a416e242696514bbe44e8675550a1&page=1language=en-US";
//         const response = await fetch(url);
//         const data = await response.json();
//         setAllElements(data.results); // Save movies in state
//         console.log(data.results);
//     } catch (error) {
//         console.error("Error fetching movies:", error);
//     }
// };

// useEffect(() => {
    

//     fetchMovies(API_LINK);

    
// }, []);

// const fetchProviders = async (id, media_type) => {
//     try {
//         let link
//         if (media_type == "tv") {
//             link = WATCH_PROVIDER_LINK_TV_1 + id + WATCH_PROVIDER_LINK_2;
//         }
//         else if (media_type == "movie") {
//             link = WATCH_PROVIDER_LINK_1 + id + WATCH_PROVIDER_LINK_2; 
//         }
//         const response = await fetch(link);
//         const data = await response.json();
        
//         const providers = data.results?.US || [];
//         console.log(providers);
//         const rent = providers?.rent || [];
//         const buy = providers?.buy || [];
//         const stream = providers?.flatrate || [];

//         console.log(rent);
//         console.log(buy);
//         console.log(stream);





  return (
    <>
   
    
    <Navbar />
    <MediaCardsSection link={API_LINK} pageDesc={pageDesc} />
      {/* <section className="media-grid" >
        {allElements.map((element, index) => (
            <div key={index} className="media-card">
                <div className="media-img">
                    <img src = {IMG_PATH + element.poster_path} onClick={() => openPopup(element)}></img>
                </div>
                <h3 className="media-title">{element.name || element.title}</h3>     
            </div>

        ))}

        {isPopupOpen && (
            <div className="popup-overlay" onClick={closePopup}>
                <div className="popup" onClick={(e) => e.stopPropagation()}>
                    {contentType === "details" && (
                        <div className="inner-popup-div">
                            <div className="popup-img">
                                <img src = {IMG_PATH + media.poster_path}></img>
                            </div>
                            <div className="popup-content">
                                <h1 className="popup-media-title"> 
                                    {media.name || media.title}
                                </h1>
                                <h2 className="media-date"> 
                                    {media.first_air_date ? (
                                        <span>First Air Date: </span> ) : 
                                        media.release_date ? (
                                            <span>Release Date: </span>
                                        ) : (
                                            <span></span>
                                        )}
                                    
                                    <span className="media-date-content">{media.first_air_date || media.release_date} </span>
                                </h2>
                                <div className="overview-content">
                                    <h2 className="overview-title">Overview: </h2>
                                    <p className="overview-description">{media.overview}</p>
                                </div>
                                
                            </div>
                            <div className="popup-button-box">
                                    <button onClick={() => {setContentType("whereToWatch"); fetchProviders(media.id, media.media_type)}}>Where to Watch</button>
                                    <button>Reviews</button>

                            </div>
                        </div>
                    )}

                    {contentType === "whereToWatch" && (
                        
                        <div className="inner-watch-div"> 
                            <ArrowBackIosIcon
                            sx={{fontSize: 15}}
                            onClick={() => closeWatchPopup()}
                           

                            />
                            <div className="providers-container">

                                {providers.buyRent.length > 0 && (
                                    <div className="outer-providers-div">
                                        <div className="providers-div">
                                        <h2 className="providers-title">Buy or Rent</h2>
                                        <div className="providers-grid">
                                            {providers.buyRent.map((provider, index) => (
                                                <div key={index} className="provider-card">
                                                    <img className = "provider_logo" src = {LOGO_PATH + provider.logo_path} title = {provider.provider_name}></img>
                                                </div>
                                            ))}
                                        </div>
                                        </div>
                                    </div>
                                )}

                                {providers.stream.length > 0 && (
                                    <div className="outer-providers-div">
                                        <div className="providers-div">
                                            <h2 className="providers-title">Stream</h2>
                                            <div className="providers-grid">
                                                {providers.stream.map((provider, index) => (
                                                    <div key={index} className="provider-card">
                                                        <img className = "provider_logo" src = {LOGO_PATH + provider.logo_path} title = {provider.provider_name}></img>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {providers.fallback != "" && (
                                    <div className="theatre-div">
                                        <div className="outer-providers-div">
                                            <div className="providers-div">
                                                <h2 className="providers-title">Now Playing in Theatres Near You.</h2>
                                            </div>
                                        </div>
                                    </div>
                                )} 
                            </div>
                        </div>

                    )}

                </div>

            </div>
        )}
 
      </section> */}

    </>
  )
}

export default mainPage
