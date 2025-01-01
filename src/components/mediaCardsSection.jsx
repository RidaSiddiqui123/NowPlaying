
import '../cssFiles/mediaCardsSection.css'
import '../cssFiles/styles.css'
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";

import ProviderSection from './providerSection';
import Pagination from './Pagination';

function mediaCardsSection ({link, pageDesc}) {
    
    const API_LINK = "https://api.themoviedb.org/3/trending/all/week?api_key=118a416e242696514bbe44e8675550a1&page=1language=en-US";  
    const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
    const LOGO_PATH = "https://image.tmdb.org/t/p/w1280";
    const SEARCH_API = "https://api.themoviedb.org/3/search/multi?&api_key=118a416e242696514bbe44e8675550a1&query="
    const WATCH_PROVIDER_LINK_1 = "https://api.themoviedb.org/3/movie/";
    const WATCH_PROVIDER_LINK_2 = "/watch/providers?api_key=118a416e242696514bbe44e8675550a1";
    const WATCH_PROVIDER_LINK_TV_1 = "https://api.themoviedb.org/3/tv/";
  
    const [allElements, setAllElements] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [media, setMedia] = useState('');
    const [contentType, setContentType] = useState("details");
    const [providers, setProviders] = useState({buyRent: [], stream: [], fallback: ""});
    const navigate = useNavigate();
    const [selectedMedia, setSelectedMedia] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(20);
  

    const fetchMovies = async (url) => {
        
        try {
            
            
            if (pageDesc === "searchResults") {
                // const response = await fetch(url);
                // const data = await response.json();

                let page = 1;
                let allMovies = [];
    
                while (true) {
                    const response = await fetch(`${url}&page=${page}`);
                    const data = await response.json();
    
                    // console.log(data.results);
                    if (data.results && data.results.length > 0) {
                        allMovies = [...allMovies, ...data.results];
                    }
                    else {
                        break;
                    }
                    
                    page++;
    
                }
                
                const sortedMovies = allMovies.filter(movie => movie.popularity > 5).sort((a, b) => b.popularity - a.popularity);
                setAllElements(sortedMovies);

            }

            else {

                const response = await fetch(url);
                const data = await response.json();

                console.log(data.results);
                setAllElements(data.results);

            }



            // let page = 1;
            // let allMovies = [];

            // while (true) {
            //     const response = await fetch(`${url}&page=${page}`);
            //     const data = await response.json();

            //     // console.log(data.results);
            //     if (data.results && data.results.length > 0) {
            //         allMovies = [...allMovies, ...data.results];
            //     }
            //     else {
            //         break;
            //     }
                
            //     page++;

            // }

            // console.log("almovie")
            // console.log(allMovies);
            // const sortedMovies = allMovies.filter(movie => movie.popularity > 5).sort((a, b) => b.popularity - a.popularity);
            // console.log("sorted");
            // console.log(sortedMovies);
            // setAllElements(sortedMovies);
        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
          
        }
    };
    
    useEffect(() => {
        fetchMovies(link);
    }, [link, currentPage]);
    
    
    const openPopup = (element) => {
        setMedia(element);
        setIsPopupOpen(true);
    }
    
    const closePopup = () => {
        setIsPopupOpen(false);
        setContentType("details");
        // setProviders({
        //     buyRent: [],
        //     stream: [],
        //     fallback: "",
        // });
    }
  
  //iterate through all pages and put in a list, then filter through that lise to only keep popularity above 50, and sort to get most popular first

    const lastPostIndex = currentPage * postsPerPage;
    const firstPostIndex = lastPostIndex - postsPerPage;

    const currentPosts = allElements.slice(firstPostIndex, lastPostIndex);

    return (
        <>
        
        <section key={currentPage} className="media-grid" >
        {currentPosts.map((element, index) => (
            <div key={index} className="media-card">
                <div className="media-img">
                    <img src = {IMG_PATH + element.poster_path} onClick={() => openPopup(element)}></img>
                </div>
                <div className="media-title-container">
                    <h3 className="media-title">{element.name || element.title}</h3>     
                </div>
                
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
                                    <button onClick={() => {setContentType("whereToWatch"); setSelectedMedia({id: media.id, type: media.media_type})}}>Where to Watch</button>
                                    <button>Reviews</button>

                            </div>
                        </div>
                    )}

                    {contentType === "whereToWatch" && (

                        <ProviderSection
                            mediaId = {selectedMedia.id}
                            mediaType = {selectedMedia.type}
                            setContentType = {setContentType}
                            />
                    )}

                </div>

            </div>
        )}
 
      </section>
      {pageDesc === "searchResults" && (
            <Pagination 
            totalPosts={allElements.length} 
            postsPerPage={postsPerPage} 
            setCurrentPage={setCurrentPage}
            currentPage={currentPage} />
        )}
        <div style={{height: '50px'}}>

        </div>
      </>
    )
    
}

export default mediaCardsSection