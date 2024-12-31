import {useState} from 'react';
import '../App.css'
import '../styles.css'
import { useNavigate } from 'react-router-dom';

function navbar() {

    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("searched for:")
        console.log(query);
        navigate(`/results/${query}`);
    }

    return (
        <section className="search-bar-navbar">
        <div className="navbar-container">
            <a>Now Playing</a>
            <button>Login</button>
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
                </form>
            </div>
        </div>
      </section>
    )
 }

 export default navbar