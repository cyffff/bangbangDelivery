import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Create page numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than or equal to max to show
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(0);
      
      // Calculate start and end of page block
      let start = Math.max(1, currentPage - 1);
      let end = Math.min(start + 2, totalPages - 1);
      
      // Adjust start if end is maxed out
      start = Math.max(1, end - 2);
      
      // Add ellipsis if start is not right after first page
      if (start > 1) {
        pageNumbers.push('...');
      }
      
      // Add pages in the middle block
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if end is not right before last page
      if (end < totalPages - 2) {
        pageNumbers.push('...');
      }
      
      // Always include last page if not already included
      if (end !== totalPages - 1) {
        pageNumbers.push(totalPages - 1);
      }
    }
    
    return pageNumbers;
  };
  
  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center my-6">
      <nav className="flex items-center">
        <button
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className={`mx-1 px-3 py-1 rounded-md border ${
            currentPage === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          Previous
        </button>
        
        {pageNumbers.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="mx-1 px-2 py-1 text-gray-500">...</span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(page as number)}
              className={`mx-1 px-3 py-1 rounded-md border ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {(page as number) + 1}
            </button>
          )
        ))}
        
        <button
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage === totalPages - 1}
          className={`mx-1 px-3 py-1 rounded-md border ${
            currentPage === totalPages - 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          Next
        </button>
      </nav>
    </div>
  );
};

export default Pagination; 