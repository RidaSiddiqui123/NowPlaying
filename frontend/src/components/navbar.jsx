import {useState, useRef} from 'react';
import '../cssFiles/navbar.css'
import '../cssFiles/styles.css'
import { useNavigate } from 'react-router-dom';

function navbar() {

    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log("searched for:")
        // console.log(query);
        //if search is empty do nothing 
        if (!query.trim()) return;
        navigate(`/results/${query}`);
        setQuery("");   
    }

    const handleClear = () => {
        setQuery("");
    }

    return (
        <section className="search-bar-navbar">
            <div className="navbar-container">
                <button onClick={() => navigate(`/`)}>NOW PLAYING</button>
                <div className="search-container">
                    <form role="search" id="form" onSubmit = {handleSubmit}>
                        <input 
                            type="search" 
                            id="query" 
                            autoComplete = "off" 
                            name="q"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)} 
                            placeholder="Search..."/>
                            {query.length > 0 && 
                                <button type="button" className="clear-button" onClick={handleClear}>✕</button>
                            }  
                    </form>
                </div>
            </div>
        </section>
    )
 }

 export default navbar