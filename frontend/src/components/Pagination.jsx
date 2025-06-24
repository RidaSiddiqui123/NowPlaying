import React from 'react';
import {useState, useEffect, useRef} from "react";
import '../cssFiles/styles.css';
import '../cssFiles/pagination.css';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowDropDownIcon from '@mui/icons-material/KeyboardArrowDown';


function Pagination({totalPosts, postsPerPage, setCurrentPage, currentPage, position}) {

    let pages = []
    const [isOnePage, setIsOnePage] = useState(true);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const isTop = position === "top";
    const totalPages = Math.ceil(totalPosts/postsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
    }

    useEffect(() => {
        pages.length > 1 ? setIsOnePage(false) : setIsOnePage(true);
        
    }, [pages.length])

    useEffect(() => {
        const handleClickOutside = (e) => {
          if (
            !e.target.closest('.dropdown-content') &&
            !e.target.closest('.dropdown-button')
          ) {
            setIsDropdownVisible(false);
          }
        };
      
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);
    
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
                 {pages.length > 5 ? (
                    <div className="dropdown-container">
                        <button 
                            className="dropdown-button" 
                            onClick={() => setIsDropdownVisible(!isDropdownVisible)}>
                            {currentPage} 
                            <ArrowDropDownIcon className="page-dropdown-icon"/> 
                        </button>
                        <div className={`dropdown-content ${isDropdownVisible ? "visible" : ""} ${isTop ? "top-dropdown" : "bottom-dropdown"}`}>
                            {pages.map((page, index) => (
                                <a href="#" key={index}
                                className={`dropdown-page ${currentPage === page ? "active" : ""}`}
                                onClick = {(e) => {
                                    e.preventDefault();
                                    setCurrentPage(page);
                                    setIsDropdownVisible(false);
                                }}
                                >{page}</a>
                            ))}
                        </div>
                    </div>
                
                 ) : (
                    <>
                    {pages.map((page, index) => (
                        <button 
                            className={`pageButton ${currentPage === page ? "active" : ""}`}
                            key={index} 
                            onClick={() => setCurrentPage(page)}>
                            {page}
                        </button>
                    ))}
                    </>
                 )}
                    
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

export default Pagination

