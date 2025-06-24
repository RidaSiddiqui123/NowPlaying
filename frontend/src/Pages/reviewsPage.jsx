

import { useParams } from 'react-router-dom';
import {useEffect, useState} from "react";
import Rating from '@mui/material/Rating';
import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ArrowDropDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowDropUpIcon from '@mui/icons-material/KeyboardArrowUp';
import '../cssFiles/styles.css';
import '../cssFiles/reviews.css';
import WriteReviewIcon from '@mui/icons-material/EditNote';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ExitIcon from '@mui/icons-material/Clear';

import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';

import defaultPoster from "/public/default_poster.jpg";


function reviewsPage() {
    
    const {id: mediaId, media_type: mediaType} = useParams();
    const IMG_PATH = "https://image.tmdb.org/t/p/w1280"
    const API_LINK = "https://nowplaying-backend.onrender.com/api/reviews/"; 
    const [allReviews, setAllReviews] = useState(null);
    const [movie, setMovie] = useState("");
    const [isReviewPopupOpen, setIsReviewPopupOpen] = useState();
    const [value, setValue] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [username, setUsername] = useState("");
    const [expandedReviewIds, setExpandedReviewIds] = useState([]);
    const [isSubmitSuccessOpen, setIsSubmitSuccessOpen] = useState(false)
    const [isReviewMissingErrorVisible, setIsReviewMissingErrorVisible] = useState(false);
    const [isReviewLengthErrorVisible, setIsReviewLengthErrorVisible] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(false);
    const navigate = useNavigate();

    const fetchReviews = async (url) => {
        
        try {
            const response = await fetch(url + mediaType + "/" + mediaId);
            const data = await response.json();
            setAllReviews(data)
            console.log("response from reviews movie")
            console.log(data);

        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    useEffect(() => {
    
        console.log(mediaType);
        fetchReviews(API_LINK);

        async function fetchMovie() {
            if (mediaType === "movie") {
                const res = await fetch(`https://api.themoviedb.org/3/movie/${mediaId}?api_key=118a416e242696514bbe44e8675550a1`);
                const data = await res.json();
                setMovie(data);
            }

            else if (mediaType === "tv") {
                const res = await fetch(`https://api.themoviedb.org/3/tv/${mediaId}?api_key=118a416e242696514bbe44e8675550a1`);
                const data = await res.json();
                setMovie(data);
            }
          }
          fetchMovie();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 700) {
                console.log("true")
                setIsButtonVisible(true);
            }
            else {
                setIsButtonVisible(false);
            }
        }
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);


    async function addReview(review, user, rating) {
        //check if either rating was added or review was added, one of these have to be added, or else display message
        console.log("review")

        console.log(review)
        if (review != "" && review.length < 50) {
            setIsReviewMissingErrorVisible(false);
            setIsReviewLengthErrorVisible(true);
        }

        else if (review === "" && rating === 0) {
            setIsReviewMissingErrorVisible(true);
        }

        else {
            setIsReviewPopupOpen(false);        
            setIsSubmitSuccessOpen(true);
            try {
                const res = await fetch(API_LINK + "new", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    }, 
                    body: JSON.stringify({"mediaType": mediaType, "movieId": mediaId , "user": user, "review": review, "rating": rating })
                    //change movieId to mediaId later
            });
    
            if (!res.ok) throw new Error ("Failed to submit review");
    
            const data = await res.json();
            console.log("Review submitted:", data);
            
            } catch (err) {
                console.error("Error:", err);
            }
        }
    }

    const toggleExpand = (id) => {
        setExpandedReviewIds(prev =>
            prev.includes(id) ? prev.filter (i => i !== id) : [...prev, id]
        )
    }
    
    const handleBack = () => {
        navigate(-1);
    }

    if (allReviews === null) {
        return null;
    }

    const reviewsWithRatings = allReviews.filter(review => typeof review.rating === 'number');
    const totalRating = reviewsWithRatings.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = reviewsWithRatings.length > 0 ? totalRating/reviewsWithRatings.length : 0;
    const mainRating = (Math.round(avgRating * 10) / 10).toFixed(1);
    console.log(mainRating)
    const releaseYear = mediaType === "movie" ? movie?.release_date?.split("-")[0] : movie?.first_air_date?.split("-")[0];
    
    console.log(movie);
    const genreArray = movie?.genres;
    console.log(genreArray);
    
    const openReviewPopup = () => {
        setIsReviewPopupOpen(true);
    }

    const closeReviewPopup = () => {
        setIsReviewPopupOpen(false);
        setIsReviewMissingErrorVisible(false);
        setIsReviewLengthErrorVisible(false);
        setValue(0);
    }

    const closeSuccessPage = () => {
        setIsSubmitSuccessOpen(false);
        location.reload();
    }

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'})
    }

  return (
   
        <section className="reviews-page">
            <div className="reviews-page-header">
                <div className="header-buttons-container">
                    <KeyboardBackspaceIcon className="review-page-back-button" onClick={handleBack}/>
                    <button onClick={() => openReviewPopup()}>
                        <WriteReviewIcon
                        className="write-review-icon"/>
                        Write a Review      
                    </button>
                </div>
                <div className="header-info-container">
                    <div className="media-review-img">
                        <img src = {movie.poster_path === null ? defaultPoster : IMG_PATH + movie.poster_path}></img>
                    </div>
                    <div className="media-info-container">
                        <h1 className="media-review-title">{mediaType === "movie" ? movie.title : movie.name}</h1>
                        {releaseYear && 
                            <h2 className="media-review-year">
                                <span>
                                    {releaseYear} 
                                    {movie.number_of_seasons != null ? ` ‧ ${movie.number_of_seasons} ${movie.number_of_seasons > 1 ? `seasons` : `season`}` : `` } 
                                </span>                            
                                <span>
                                    {Array.isArray(genreArray) && genreArray.length >= 2 ? (
                                        ` ‧ ${genreArray[0].name}/${genreArray[1].name}`
                                    ): Array.isArray(genreArray) && genreArray.length === 1 && (
                                        ` ‧ ${genreArray[0].name}`
                                    )}
                                </span>
                            </h2>}
                        
                        <div className="media-rating-container">
                            <Rating className="main-star-rating"
                                name="half-rating-read" 
                                value={mainRating} 
                                precision={0.5} 
                                emptyIcon={<StarIcon sx={{ color: "#131720"}} fontSize="inherit" />}
                                readOnly 
                            />
                            <h2 className="number-rating">{mainRating === "0.0" ? "no ratings given" : mainRating}</h2>
                        </div>
                        <div className="write-review-button-container">
                            <button onClick={() => openReviewPopup()}>
                                <WriteReviewIcon
                                className="write-review-icon"/>
                                Write a Review      
                            </button>
                        </div>
                    </div>
                </div>
            </div>
                   
           <div className="reviews-container">
           {allReviews.filter((review) => review.review?.trim())
            .map((review, index) => {
                const isExpanded = expandedReviewIds.includes(review._id);
                return (
                    <div key={index} className="review-card" id="${review._id}">
                    <div className="review-profile-header">
                        <img
                        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        className="review-profile-img"
                        />
                        <h1 className="review-username">{review.user}</h1>
                    </div>
                    <div>
                        {review.rating && 
                            <Rating 
                            name="half-rating-read" 
                            defaultValue={review.rating} 
                            sx={{fontSize: "15px"}}
                        
                            emptyIcon={<StarIcon sx={{ color: "gray" }} fontSize="inherit" />}
                            // icon={<StarIcon sx={{color: " rgb(195, 4, 4)"}} fontSize="inherit" />}
                            readOnly 
                        />
                        }
                    </div>
                    
                    {review.review.length > 810 ? (
                        <>
                            <p className="review-paragraph">
                                {isExpanded ? review.review : review.review.slice(0, 811)}
                            </p>
                            <div className="expand-review-button-container">
                                <button className="expand-review-button" onClick={() => toggleExpand(review._id)}>
                                    {isExpanded ? (
                                    <>
                                        SEE LESS 
                                        <ArrowDropUpIcon className="expand-icon"/>
                                    </>
                                    ) : (
                                    <>
                                        SEE MORE 
                                        <ArrowDropDownIcon className="expand-icon"/>
                                    </>  
                                    )
                                     }
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="review-paragraph" >{review.review}</p>
                    )} 
                </div>
                )
            })}
           </div>

            <div className={`back-top-button-section ${isButtonVisible ? "visible" : ""}`}>
                <button className="back-top-button" onClick={()=> scrollToTop()}>
                    <ArrowDropUpIcon className="back-top-button-icon"/>
                </button>
            </div>
            
           {isReviewPopupOpen && (
            <div className="review-popup-overlay" onClick={closeReviewPopup}>  
                <div className="review-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="inner-review-popup-div">
                        <div className="review-popup-header">
                            <h1 className="review-popup-title">Writing a Review For</h1>
                            <h2 className="review-popup-movie-title">{mediaType === "movie" ? movie.title : movie.name}</h2>
                        </div>
                        <div className="review-popup-content">
                            <div className="review-profile-header">
                                <img
                                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                className="review-profile-img"
                                />
                                <input type="text" className="review-popup-username" 
                                    id="new_user"
                                    placeholder="username (optional)"
                                    onChange={(e)=> setUsername(e.target.value)} /> 
                            </div>
                            <div className="popup-star-rating-div">
                            <Rating
                                name="simple-uncontrolled"
                                id="new_rating"
                                value={value}
                                sx={{fontSize: "40px"}}
                                emptyIcon={<StarBorderIcon sx={{ color: "rgba(255, 255, 255, 0.86)" }} fontSize="inherit" />}
                                
                                onChange={(event, newValue) => {
                                setValue(newValue);
                                }}
                            />
                            </div>
                            <textarea
                                className="review-textarea"
                                id="new_review"
                                rows={12}
                                placeholder="Leave a review here."
                                onChange={(e)=>setReviewText(e.target.value)}
                                />
                        </div>
                        <div className={`review-popup-button-box ${isReviewMissingErrorVisible || isReviewLengthErrorVisible ? "paddingremoved" : ""} `}>
                                <button onClick={() => closeReviewPopup()}>
                                    Cancel
                                </button>
                                <button onClick={(e) => {
                                    e.stopPropagation()
                                    const user = username.trim() === "" ? "Anonymous" : username;
                                    console.log(user);
                                    // const rating = value > 0 ? value : 0
                                    addReview(reviewText, user, value);}}>
                                        Submit
                                </button> 
                        </div>
                        <div className={`review-error-message-container ${isReviewMissingErrorVisible || isReviewLengthErrorVisible ? "visible" : ""}`}>
                            <p>
                                {isReviewMissingErrorVisible ? (
                                    <>Please enter a review or rating to submit</>
                                ) : isReviewLengthErrorVisible  ? (
                                    <>Review should be at least 50 characters.</>
                                ) : null}
                                </p>
                        </div>
                    </div>
                </div>
            </div>
            )}

            {isSubmitSuccessOpen && (
                <div className="success-page-overlay" onClick={closeSuccessPage}>  
                    <div className="success-page" onClick={(e) => e.stopPropagation()}>
                        <div className="inner-success-page">
                            <div className="success-page-header">
                                <ExitIcon className="exit-icon"
                                onClick={closeSuccessPage}
                               />
                            </div>
                            <div className="success-page-body">
                                <EmojiEventsIcon className="success-icon" />
                                <h1 className="success-heading">Success!</h1>
                                <p className="success-description">Thank you for leaving a review. </p>
                                <p className="success-description">Your review has been successfully submitted.</p>
                            </div>
                        </div>
                    </div>
                </div>
                    )}
        </section>
  )
}

export default reviewsPage
