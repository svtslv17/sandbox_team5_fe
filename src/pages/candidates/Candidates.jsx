import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Popper,
  Input,
  Stack,
  Button,
} from '@mui/material';
import { ManageSearch, Send } from '@mui/icons-material';
import dayjs from 'dayjs';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { tableFields } from '../../constants';
import { getFieldLabel } from '../../utils';
import { fetchCandidateList, updateCandidateStatusById } from '../../store/commands';
import { LinkFormatter } from '../../components';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const Candidates = () => {
  const [gridApi, setGridApi] = useState();
  const [anchorEl, setAnchorEl] = useState();
  const [isDisabledButtonSend, setIsDisabledButtonSend] = useState(true);
  const [isDisabledButtonAddToWork, setIsDisabledButtonAddToWork] = useState(true);
  const open = !!anchorEl;
  const { id } = useParams();

  const listOfCandidates = useSelector((state) => state.candidates.candidates);

  const dispatch = useDispatch();
  const requestBody = {
    pageSize: 10,
    pageNumber: 1,
    internshipId: id,
  };

  useEffect(() => {
    dispatch(fetchCandidateList(requestBody));
  }, []);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  };

  const onColumnVisible = () => {
    gridApi.sizeColumnsToFit();
  };

  const reformatCandidates = (candidates) => candidates.map((candidate) => {
    const newObj = { ...candidate };
    newObj.fullName = `${candidate.firstName} ${candidate.lastName}`;
    newObj.registrationDate = dayjs(`${candidate.registrationDate}`).format(
      'DD.MM.YYYY',
    );
    return newObj;
  });


  const newListOfCandidates = reformatCandidates(listOfCandidates);

  const onButtonExport = () => {
    gridApi.exportDataAsExcel();
  };

  const getRowNodeId = (data) => data.id;

  const onRowSelected = (event) => {
    const rowSelected = event.node.isSelected();
    if (rowSelected) {
      setIsDisabledButtonSend(false);
      setIsDisabledButtonAddToWork(false);
    } else {
      setIsDisabledButtonSend(true);
      setIsDisabledButtonAddToWork(true);
    }
  };

  const addToWork = () => {
    const selectedRow = gridApi.getSelectedRows();
    const candidateId = selectedRow && selectedRow.map((item) => item.id);
    dispatch(updateCandidateStatusById(1, candidateId));
    setIsDisabledButtonSend(true);
    setIsDisabledButtonAddToWork(true);
  };

  return (
    <Box padding="1%" width="100%" height="100%">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        paddingTop="10px"
        paddingBottom="10px"
      >
        <Typography variant="h4" component="div" gutterBottom color="#222">
          {getFieldLabel('candidates.internship.name')}
        </Typography>
        <Box display="flex" alignItems="center">
          <Box marginRight="15px">
            <IconButton onClick={handleClick}>
              <ManageSearch fontSize="large" />
            </IconButton>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button onClick={() => onButtonExport()} variant="outlined">
              {getFieldLabel('candidates.button.exportToExcel')}
            </Button>
            <Button variant="outlined" endIcon={<Send />} disabled={isDisabledButtonSend}>
              {getFieldLabel('candidates.button.send')}
            </Button>
            <Button onClick={() => addToWork()} variant="outlined" disabled={isDisabledButtonAddToWork}>
              {getFieldLabel('candidates.button.addToWork')}
            </Button>
          </Stack>
          <Popper open={open} anchorEl={anchorEl} placement="left">
            <Input placeholder={getFieldLabel('common.search')} />
          </Popper>
        </Box>
      </Box>
      <Box className="ag-theme-alpine" width="100%" height="calc(100% - 50px)">
        <AgGridReact
          getRowNodeId={getRowNodeId}
          frameworkComponents={{
            linkFormatter: LinkFormatter,
          }}
          onRowSelected={onRowSelected}
          suppressRowClickSelection
          rowData={newListOfCandidates}
          onColumnVisible={onColumnVisible}
          // onSelectionChanged={onSelectionChanged}
          enableCellChangeFlash
          debug
          animateRows
          onGridReady={onGridReady}
          rowSelection="multiple"
          pagination
          paginationPageSize="10"
          sideBar={{
            toolPanels: [
              {
                id: 'columns',
                labelDefault: 'Columns',
                labelKey: 'columns',
                iconKey: 'columns',
                toolPanel: 'agColumnsToolPanel',
              },
              {
                id: 'filters',
                labelDefault: 'Filters',
                labelKey: 'filters',
                iconKey: 'filter',
                toolPanel: 'agFiltersToolPanel',
              },
            ],
            position: 'left',
          }}
        >
          <AgGridColumn
            field="fullName"
            sortable
            filter
            checkboxSelection
            resizable
            headerCheckboxSelection
            suppressSizeToFit
            minWidth={250}
            cellRenderer="linkFormatter"
          />
          {tableFields.map((field) => (
            <AgGridColumn
              field={field}
              headerName={getFieldLabel(`candidates.table.${field}`)}
              key={field}
              sortable
              filter
              resizable
            />
          ))}
        </AgGridReact>
      </Box>
    </Box>
  );
};

export default Candidates;
