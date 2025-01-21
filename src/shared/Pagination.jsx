import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
   currentPage,
   totalPages,
   onPageChange,
   className = "",
   showFirstLast = false,
   showPageNumbers = false,
   maxPageNumbers = 5,
}) => {
   const renderPageNumbers = () => {
      const pageNumbers = [];
      const startPage = Math.max(
         1,
         currentPage - Math.floor(maxPageNumbers / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

      for (let i = startPage; i <= endPage; i++) {
         pageNumbers.push(
            <Button
               key={i}
               variant={i === currentPage ? "default" : "outline"}
               size='icon'
               onClick={() => onPageChange(i)}>
               {i}
            </Button>
         );
      }

      return pageNumbers;
   };

   return (
      <div
         className={`flex justify-center items-center space-x-2 ${className}`}>
         {showFirstLast && (
            <Button
               variant='outline'
               size='icon'
               onClick={() => onPageChange(1)}
               disabled={currentPage === 1}>
               <ChevronLeft className='h-4 w-4' />
               <ChevronLeft className='h-4 w-4 -ml-2' />
            </Button>
         )}
         <Button
            variant='outline'
            size='icon'
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}>
            <ChevronLeft className='h-4 w-4' />
         </Button>
         {showPageNumbers && renderPageNumbers()}
         {!showPageNumbers && (
            <span className='text-sm'>
               Page {currentPage} of {totalPages}
            </span>
         )}
         <Button
            variant='outline'
            size='icon'
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}>
            <ChevronRight className='h-4 w-4' />
         </Button>
         {showFirstLast && (
            <Button
               variant='outline'
               size='icon'
               onClick={() => onPageChange(totalPages)}
               disabled={currentPage === totalPages}>
               <ChevronRight className='h-4 w-4' />
               <ChevronRight className='h-4 w-4 -ml-2' />
            </Button>
         )}
      </div>
   );
};

export default Pagination;
