import React, { useState } from 'react';
import { Box, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import listOfCandidates from '../../mocks/listOfCandidates.json';
import { tableFields } from '../../constants';
import { getFieldLabel } from '../../utils';

const Candidates = () => {
  const [gridApi, setGridApi] = useState();
  const onFirstDataRendered = (params) => {
    const columnsIds = params.columnApi
      .getAllColumns()
      .map((column) => column.colId);
    params.columnApi.autoSizeColumns(columnsIds);
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    params.api.setRowData(listOfCandidates);
  };

  const onPageSizeChanged = (newPageSize) => {
    const { value } = newPageSize.target;
    gridApi.paginationSetPageSize(Number(value));
  };

  const paginationNumberFormatter = (params) =>
    `[${params.value.toLocaleString()}]`;

  return (
    <Box>
      <Box width="80px" marginBottom="5px" marginTop="30px">
        <FormControl fullWidth variant="filled">
          <InputLabel>{getFieldLabel('candidates.form.inputLabel')}</InputLabel>
          <Select defaultValue="10" label="10" onChange={onPageSizeChanged}>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box className="ag-theme-alpine" width="1500px">
        <AgGridReact
          onFirstDataRendered={onFirstDataRendered}
          animateRows
          onGridReady={onGridReady}
          rowSelection="multiple"
          domLayout="print"
          pagination
          paginationPageSize="10"
          paginationNumberFormatter={paginationNumberFormatter}
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
          }}
        >
          <AgGridColumn
            field="fullName"
            sortable
            filter
            checkboxSelection
            resizable
            headerCheckboxSelection
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
