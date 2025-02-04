import React from 'react';
import { Rating, Box } from '@mui/material';

const StarFormatter = ({ value }) =>
  !value ? (
    <Box>{value}</Box>
  ) : (
    <Rating
      className="starFormatterWrapper"
      name="read-only"
      defaultValue={value}
      max={4}
      readOnly
    />
  );

export default StarFormatter;
