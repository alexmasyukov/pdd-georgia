import React from 'react';
import { Box, Button, Select, MenuItem, FormControl, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PER_PAGE_OPTIONS } from '@utils/constants';

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
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="body2">
          Вопросов на странице:
        </Typography>
        <FormControl size="small">
          <Select
            value={perPage}
            onChange={handlePerPageChange}
          >
            {PER_PAGE_OPTIONS.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          startIcon={<ChevronLeft size={18} />}
        >
          Назад
        </Button>

        <Typography>
          Страница {currentPage} из {totalPages}
        </Typography>

        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          endIcon={<ChevronRight size={18} />}
        >
          Вперед
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" textAlign="center">
        Всего вопросов: {totalItems}
      </Typography>
    </Box>
  );
};

export default Pagination;