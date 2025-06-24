import { useParams} from 'react-router-dom';
import MediaCardsSection from '../components/mediaCardsSection';
import '../cssFiles/styles.css'
import '../cssFiles/resultsSection.css';
function resultsPage() {

    const {query} = useParams();
    const SEARCH_API = "https://api.themoviedb.org/3/search/multi?&api_key=118a416e242696514bbe44e8675550a1&query="
    const pageDesc = "searchResults"
    
    return (
       <div>
        <section>
            <div className="results-section">
                <h1 className="results-title">Results for <span className="query-title">{query}</span></h1>
            </div>
        </section>
       
        <MediaCardsSection key={query} link={SEARCH_API + query} pageDesc={pageDesc} />
       </div>
    )
 }

 export default resultsPage