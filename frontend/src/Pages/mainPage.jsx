import '../App.css'
import '../cssFiles/styles.css'
import MediaCardsSection from '../components/mediaCardsSection';

function mainPage() {

    const API_LINK = "https://api.themoviedb.org/3/trending/all/week?api_key=118a416e242696514bbe44e8675550a1&page=1language=en-US"; 
    const pageDesc = "mainPage" 

  return (
    <>
    <MediaCardsSection link={API_LINK} pageDesc={pageDesc} />
    </>
  )
}

export default mainPage
