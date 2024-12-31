
import '../App.css'
import '../styles.css'
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';



function mediaCardsSection ({link}) {
    
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
  

    const fetchMovies = async (url) => {
        
        try {
            // const API_LINK = "https://api.themoviedb.org/3/trending/all/week?api_key=118a416e242696514bbe44e8675550a1&page=1language=en-US";
            const response = await fetch(url);
            const data = await response.json();
            setAllElements(data.results.sort((a, b) => b.popularity - a.popularity)); // Save movies in state
            console.log(data.results);
        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
          
        }
    };
    
    useEffect(() => {
        
    
        fetchMovies(link);
    
        
    }, [link]);
    
    const fetchProviders = async (id, media_type) => {
        try {
            let provider_link
            if (media_type == "tv") {
                provider_link = WATCH_PROVIDER_LINK_TV_1 + id + WATCH_PROVIDER_LINK_2;
            }
            else if (media_type == "movie") {
                provider_link = WATCH_PROVIDER_LINK_1 + id + WATCH_PROVIDER_LINK_2; 
            }
            const response = await fetch(provider_link);
            const data = await response.json();
            
            const providers = data.results?.US || [];
            console.log(providers);
            const rent = providers?.rent || [];
            const buy = providers?.buy || [];
            const stream = providers?.flatrate || [];
    
            console.log(rent);
            console.log(buy);
            console.log(stream);

            const commonOptions =  rent.filter(({provider_id}) => buy.some((e) => e.provider_id === provider_id))
            const diffOptions = rent.filter(({provider_id}) => !buy.some((e) => e.provider_id === provider_id))
    
            const buyRent = commonOptions.concat(diffOptions);
    
            console.log("buyRent")
            console.log(buyRent);
    
            setProviders ({
                buyRent, 
                stream,
                fallback: buyRent.length === 0 && stream.length === 0 ? "Now Playing Near You" : ""
            })
        }
        catch(error) {
            console.error("Error fetching providers");
        }
        // go through all the options and filter and put it inside probably an array buy/rent, stream, playing in theatre near you
    
    }
    
    const openPopup = (element) => {
        setMedia(element);
        setIsPopupOpen(true);
    }
    
    const closePopup = () => {
        setIsPopupOpen(false);
        setContentType("details");
        setProviders({
            buyRent: [],
            stream: [],
            fallback: "",
        });
    }
    
    const closeWatchPopup = () => {
        setContentType("details");
        setProviders({
            buyRent: [],
            stream: [],
            fallback: "",
        });
    }



    return (
        <section className="media-grid" >
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

                        // <ProviderSection />
                        // have provider section something like that
                        // on button send contentType and media to function, that function setContentType
                        
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
 
      </section>
    )
    
}

export default mediaCardsSection