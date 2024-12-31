import { useParams} from 'react-router-dom';
import Navbar from '../components/navbar';
import MediaCardsSection from '../components/mediaCardsSection';

function resultsPage() {



    const {query} = useParams();
    const SEARCH_API = "https://api.themoviedb.org/3/search/multi?&api_key=118a416e242696514bbe44e8675550a1&query="

    return (
       <div>
      
        <Navbar />
        Showing Results for: 
        <span>{query}</span>
        <MediaCardsSection key={query} link={SEARCH_API + query} />
       </div>
    )
 }

 export default resultsPage