import React from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup } from '@mui/material';
import { getFieldLabel } from '../../../utils';

function HeaderMenu() {
  return (
    <ButtonGroup variant="text" aria-label="text button group" color="primary">
      <Button>
        <Link to="/home/internships">
          {getFieldLabel('header.menu.button.internships')}
        </Link>
      </Button>
      <Button>
        <Link to="/home/candidates">
          {getFieldLabel('header.menu.button.allcandidates')}
        </Link>
      </Button>
    </ButtonGroup>
  );
}

export default HeaderMenu;
