

import '../App.css'
import '../styles.css'
import {useEffect, useState} from "react";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


function providerSection({mediaId, mediaType, setContentType}) {
    const API_LINK = "https://api.themoviedb.org/3/trending/all/week?api_key=118a416e242696514bbe44e8675550a1&page=1language=en-US";  
    const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
    const LOGO_PATH = "https://image.tmdb.org/t/p/w1280";
    const SEARCH_API = "https://api.themoviedb.org/3/search/multi?&api_key=118a416e242696514bbe44e8675550a1&query="
    const WATCH_PROVIDER_LINK_1 = "https://api.themoviedb.org/3/movie/";
    const WATCH_PROVIDER_LINK_2 = "/watch/providers?api_key=118a416e242696514bbe44e8675550a1";
    const WATCH_PROVIDER_LINK_TV_1 = "https://api.themoviedb.org/3/tv/";

    const [providers, setProviders] = useState({buyRent: [], stream: [], fallback: ""});

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

    useEffect(() => {
        fetchProviders(mediaId, mediaType);
    }, [mediaId, mediaType]);

    const closeWatchPopup = () => {
        setContentType("details");
        setProviders({
            buyRent: [],
            stream: [],
            fallback: "",
        });
    }

    return (
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
    )

}

export default providerSection
