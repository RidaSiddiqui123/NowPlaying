
import '../cssFiles/mediaCardsSection.css'
import '../cssFiles/styles.css'
import {useEffect, useState} from "react";
import ProviderSection from './providerSection';
import Pagination from './Pagination';
import defaultPoster from "/public/default_poster.jpg";
import { useSearchParams, useNavigate } from 'react-router-dom';

function mediaCardsSection ({link, pageDesc}) {
    
    const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
    const [allElements, setAllElements] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [media, setMedia] = useState('');
    const [contentType, setContentType] = useState("details");
    const [providers, setProviders] = useState({buyRent: [], stream: [], fallback: ""});
    const navigate = useNavigate();
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [postsPerPage, setPostsPerPage] = useState(20);
    const breakpoint = 768
    const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);
    const [isLoading, setIsLoading] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [isSortVisible, setIsSortVisible] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(() => {
    const pageFromURL = parseInt(searchParams.get("page"));
    return pageFromURL > 0 ? pageFromURL : 1;
    });

    const sortFromURL = searchParams.get("sort");
    const [sortBy, setSortBy] = useState(sortFromURL || "Popular");

    useEffect (() => {
        const pageFromURL = parseInt(searchParams.get("page"));
        if (pageFromURL > 0 && pageFromURL !== currentPage) {
            setCurrentPage(pageFromURL);

        }
    }, [searchParams]);

    const updatePage = (pageNum) => {
        setCurrentPage(pageNum);
        searchParams.set("page", pageNum);
        setSearchParams(searchParams);
      };

    const fetchMovies = async (url) => {
        
        setIsLoading(true);
        setShowSpinner(false);

        const timeout = setTimeout(() => {
            setShowSpinner(true);
        }, 500);

    
        try {
            
            let filteredMovies
            if (pageDesc === "searchResults") {

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
                console.log("allmovies")
                console.log(allMovies);
                filteredMovies = allMovies.filter(movie => movie.media_type === "tv" || movie.media_type === "movie").filter(movie => movie.popularity > 0.5);
            }

            else {
                const response = await fetch(url);
                const data = await response.json();
                filteredMovies = data.results.filter(movie => movie.media_type === "tv" || movie.media_type === "movie").sort((a, b) => b.popularity -  a.popularity);

            }

            let sortedMovies 

            if (sortBy === "Latest") {
                sortedMovies  = filteredMovies.sort((a, b) => 
                            new Date(b.release_date || b.first_air_date) - new Date(a.release_date || a.first_air_date));
            }
            else if (sortBy === "Oldest") {
                sortedMovies  = filteredMovies.sort((a, b) => 
                    new Date(a.release_date || a.first_air_date) - new Date(b.release_date || b.first_air_date));
            }
            else {
                sortedMovies = filteredMovies.sort((a, b) => b.popularity - a.popularity);
            }

            console.log(sortedMovies);
            setAllElements(sortedMovies);

        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
          clearTimeout(timeout);
          setIsLoading(false);
          setShowSpinner(false);
        }
    };
    
    useEffect(() => {
        fetchMovies(link);

    }, [link, currentPage, sortBy]);
    
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    
    useEffect(() => {
        if (!isMobile) return;

        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
                setCurrentPage(prev => prev + 1);
            }
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isMobile]);

    //handling click outside of sort-button to close it
    useEffect(() => {
            const handleClickOutside = (e) => {
              if (
                !e.target.closest('.sort-button-content') &&
                !e.target.closest('.sort-button')
              ) {
                setIsSortVisible(false);
              }
            };
          
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
              document.removeEventListener('mousedown', handleClickOutside);
            };
          }, []);
    
    const openPopup = (element) => {
        setMedia(element);
        setIsPopupOpen(true);
    }
    
    const closePopup = () => {
        setIsPopupOpen(false);
        setContentType("details");
    }


    const  handleSortButton = (e, sortType) => {
        e.preventDefault();
        setSortBy(sortType);
        setIsSortVisible(false);
        searchParams.set("sort", sortType);
        if (currentPage > 1) searchParams.set("page", 1);
        setSearchParams(searchParams);
    }
    
    const lastPostIndex = currentPage * postsPerPage;
    const firstPostIndex = lastPostIndex - postsPerPage;
    // const currentPosts = allElements.slice(firstPostIndex, lastPostIndex);
    const currentPosts = isMobile
    ? allElements.slice(0, lastPostIndex)
    : allElements.slice(firstPostIndex, lastPostIndex);
    allElements.slice((currentPage - 1) * postsPerPage, lastPostIndex);

    return (
        <>
        {isLoading && showSpinner && (
            <div className="spinner-container">
                <div className="spinner-div">
                    <div className="spin-animation-icon">
                    </div>
                    
                </div>
            </div>
        )}
        {/* Top Pagination Section */}
        {!isMobile && pageDesc === "searchResults" && (
            <Pagination 
            totalPosts={allElements.length} 
            postsPerPage={postsPerPage} 
            setCurrentPage={updatePage}
            currentPage={currentPage}
            position="top" 
            />
        )}

        {!isLoading && !showSpinner && (
        <div className="sort-section">
            <div className="sort-button-container">
                <button 
                    className="sort-button"
                    onClick={() => setIsSortVisible(!isSortVisible)}
                >
                    {sortBy}
                </button>
                <div className={`sort-button-content ${isSortVisible ? "visible" : ""}`}>
                    <a className = "sort-option top" href="#"
                    onClick = {(e) => { handleSortButton(e, "Popular")}}>Popular</a>
                    <a className = "sort-option middle" href="#"
                    onClick = {(e) => { handleSortButton(e, "Latest")}}>Latest</a>
                    <a className = "sort-option bottom" href="#" 
                    onClick = {(e) => { handleSortButton(e, "Oldest")}}>Oldest</a>
                </div>
            </div>

        </div>
        )}
        
        <section key={currentPage} className="media-grid" >
        {currentPosts.map((element, index) => (
            <div key={index} className="media-card">
                <div className="media-img">
                    <img src = {element.poster_path === null ? defaultPoster : IMG_PATH + element.poster_path} onClick={() => openPopup(element)}></img>
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
                                <img src = {media.poster_path === null ? defaultPoster : IMG_PATH + media.poster_path}></img>
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
                                    <button onClick={() => navigate(`/reviews/${media.media_type}/${media.id}`)}>Reviews</button>
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
    
        {/* Bottom Pagination section */}
        {!isMobile && pageDesc === "searchResults" && (
                <Pagination 
                totalPosts={allElements.length} 
                postsPerPage={postsPerPage} 
                setCurrentPage={updatePage}
                currentPage={currentPage} 
                position="bottom"/>
            )}
            <div style={{height: '50px'}}></div>
        </>
    )
}

export default mediaCardsSection