import React from 'react';
import { Box, Button } from '@chakra-ui/react';

interface PaginationProps {
  currentPage?: number;
  onFirstPage?: () => void;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  onLastPage?: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  onFirstPage,
  onPreviousPage,
  onNextPage,
  onLastPage,
}) => {
  return (
    <Box display="flex" alignItems="center" gap={2}>
      {onFirstPage && (
        <Button onClick={onFirstPage} aria-label="First Page">
          |&lt;&lt;
        </Button>
      )}
      {onPreviousPage && (
        <Button onClick={onPreviousPage} aria-label="Previous Page">
          &lt;
        </Button>
      )}
      {currentPage !== undefined && (
        <Box as="span" aria-label="Current Page">
          {currentPage}
        </Box>
      )}
      {onNextPage && (
        <Button onClick={onNextPage} aria-label="Next Page">
          &gt;
        </Button>
      )}
      {onLastPage && (
        <Button onClick={onLastPage} aria-label="Last Page">
          &gt;&gt;|
        </Button>
      )}
    </Box>
  );
};

export default Pagination;
