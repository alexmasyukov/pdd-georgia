import React from 'react';
import { Box, Button, Select, MenuItem, FormControl, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PER_PAGE_OPTIONS } from '@utils/constants';
import './Pagination.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
  onPerPageChange
}) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePerPageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onPerPageChange(Number(event.target.value));
    onPageChange(1); // Reset to first page when changing items per page
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <Box className="pagination">
      <Box className="pagination__per-page">
        <Typography variant="body2" className="pagination__label">
          Вопросов на странице:
        </Typography>
        <FormControl size="small">
          <Select
            value={perPage}
            onChange={handlePerPageChange}
            className="pagination__select"
          >
            {PER_PAGE_OPTIONS.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box className="pagination__controls">
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          startIcon={<ChevronLeft size={18} />}
          className="pagination__button"
        >
          Назад
        </Button>

        <Typography className="pagination__info">
          Страница {currentPage} из {totalPages}
        </Typography>

        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          endIcon={<ChevronRight size={18} />}
          className="pagination__button"
        >
          Вперед
        </Button>
      </Box>

      <Typography variant="body2" className="pagination__total">
        Всего вопросов: {totalItems}
      </Typography>
    </Box>
  );
};

export default Pagination;