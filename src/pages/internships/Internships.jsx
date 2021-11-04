import React from 'react';
import {
  Container,
  Box,
  Typography,
  IconButton,
  Grid,
  Button,
} from '@mui/material';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import FilterListIcon from '@mui/icons-material/FilterList';
import './Internships.sass';
import { getFieldLabel } from '../../utils';
import { InternshipCard} from '../../components';
import { internshipsMocks } from '../../mocks/internshipInfo.json';

export const Internships = () => (
  <Container fixed maxWidth="1400px">
    <Box 
      display="flex" 
      flexDirection="column"
      marginTop="20px">
      <Box className="internshipMenu">
          <Typography
            variant="h1"
            component="div"
            fontSize="35px"
            color="text"
            marginLeft="30px"
          >
            {getFieldLabel('internships.title')}
          </Typography>
          <Box
            width="280px"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <IconButton>
              <ManageSearchIcon fontSize="large" />
            </IconButton>
            <IconButton>
              <FilterListIcon fontSize="large" />
            </IconButton>
            <Button variant="outlined" size="small">
              {getFieldLabel('internships.button.add.program')}
            </Button>
          </Box>
      </Box>
      <Box>
        <Grid container spacing={3}>
          {internshipsMocks.map((internshipItem) => (
          <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
            <InternshipCard key={internshipItem.id} data={internshipItem} />
          </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  </Container>
);

export default Internships;
