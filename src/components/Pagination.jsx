import React from 'react';
import {useState, useEffect} from "react";
import '../cssFiles/styles.css';
import '../cssFiles/pagination.css';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

function Pagination({totalPosts, postsPerPage, setCurrentPage, currentPage}) {

    let pages = []
    const [isOnePage, setIsOnePage] = useState(true);

    const totalPages = Math.ceil(totalPosts/postsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
    }

    useEffect(() => {
        if (pages.length > 1) {
            setIsOnePage(false);
        }
        else {
            setIsOnePage(true);
        }
    }, [pages.length])
    

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <section className="pagination-section">
        {isOnePage === false && (
            <div className="pagination-button-section">
                <button 
                    className="pageDirectionButton" 
                    onClick={handlePrev}
                    disabled = {currentPage === 1}>
                    <NavigateBeforeIcon/>
                </button>
                <div className="pages-button-section">
                    {pages.map((page, index) => (
                        <button 
                            className={`pageButton ${currentPage === page ? "active" : ""}`}
                            key={index} 
                            onClick={() => setCurrentPage(page)}>
                            {page}
                        </button>
                    ))}
                </div>
                <button 
                    className="pageDirectionButton" 
                    onClick={handleNext}
                    disabled={currentPage === totalPages}>
                    <NavigateNextIcon
                    />
                </button>
            
            </div>
        )}
        </section>
        
    )
}

//if page-1 exists in pages
//if page+1 exists in pages
// have a button next: onClick setCurrent page (page+1)
// have a button prev: onClick setCurrent page (page-1)

export default Pagination

// {pageDesc === "searchResults" && (
//     <Pagination 
//     totalPosts={allElements.length} 
//     postsPerPage={postsPerPage} 
//     setCurrentPage={setCurrentPage} />
// )}
