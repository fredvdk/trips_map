'use client'

import { Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModesModel,
  ToolbarButton,
  Toolbar,
} from '@mui/x-data-grid';
import 'mapbox-gl/dist/mapbox-gl.css';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { randomId } from '@mui/x-data-grid-generator';
import { deleteTrip } from '../tripService';
import { useRouter } from 'next/navigation';
import { Trip } from '../models/Trip';


interface GridTableProps {
  trips: Trip[];
}

export default function GridTable({ trips }: GridTableProps){

  const [rows, setRows] = useState<Trip[]>(trips);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  useEffect(() => {
    setRows(trips);
  }, [trips]);

  const router = useRouter();

  const handleEditClick = (id: GridRowId) => () => {
    router.push(`/${id}/edit`)
  };

  //ADD ROW
  const handleNewRow = async () => {
    const id = randomId();
    const now = new Date();
    const oneMonthLater = new Date(now);
    oneMonthLater.setMonth(now.getMonth() + 1);

    const trip: Trip = {
      id: id,
      destination: '',
      from: oneMonthLater,
      till: oneMonthLater,
      latitude: 36.8506, // Virginia Beach as default location
      longitude: -75.9779,
      status: 'Scheduled',
      hotel: '',
      hotelCost: 0,
      transportMode: '',
      transportCost: 0,
      notes: '',
    };

    try {
      await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trip }),
      });
      console.log('Trip created ' + trip);
      setRows((oldRows) => [...oldRows, trip]);

      router.push(`/${id}/edit`)
    } catch (error) {
      console.log('Error creating new trip ' + error);
    }
  };

  // DELETE ROW with confirmation
  const handleDelete = async (id: GridRowId) => {
    const confirmed = window.confirm("Are you sure you want to delete this trip?");
    if (!confirmed) return;

    try {
      await deleteTrip(id.toString());
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      console.log("Deleted row " + id);
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };



  const handleRowModesModelChange = (newModel: GridRowModesModel) => {
    setRowModesModel(newModel);
  };


  const columns: GridColDef[] = [
    {
      field: 'destination',
      headerName: 'Destination',
      width: 250,
      editable: true
    },
    {
      field: 'from',
      headerName: 'From',
      width: 150,
      editable: true,
      type: 'date',
      valueGetter: (value) => (value ? new Date(value) : null),
    },
    {
      field: 'till',
      headerName: 'Till',
      width: 150,
      editable: true,
      type: 'date',
      valueGetter: (value) => (value ? new Date(value) : null),
    },
    /*  { field: 'hotel', headerName: 'Hotel', width: 150, editable: true},
     {
       field: 'hotelCost',
       headerName: 'Hotel Cost',
       width: 50,
       editable: true,
     }, 
     {
       field: 'transportMode',
       headerName: 'Transport',
       width: 50,
       editable: true,
     },
     {
       field: 'transportCost',
       headerName: 'Transport Cost',
       width: 50,
       editable: true,
     },
     { field: 'notes', headerName: 'Notes', width: 150, editable: true },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Completed', 'Scheduled'],
    },*/
    {
      field: 'created',
      headerName: 'Created',
      width: 100,
      editable: true,
      type: 'date',
      valueGetter: (value) => (value ? new Date(value) : null),
    },
    {
      field: 'updated',
      headerName: 'Updated',
      width: 100,
      editable: true,
      type: 'date',
      valueGetter: (value) => (value ? new Date(value) : null),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => [
        <GridActionsCellItem
          key={`edit-${id}`}
          icon={<EditIcon />}
          label="Edit"
          className="textPrimary"
          onClick={handleEditClick(id)}
          color="inherit"
        />,
        <GridActionsCellItem
          key={`delete-${id}`}
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(id)}
          color="inherit"
        />,
      ],
    }
  ];

  function EditToolbar() {
    return (
      <Toolbar>
        <Tooltip title="Add record">
          <ToolbarButton onClick={handleNewRow}>
            <AddIcon fontSize="small" />
          </ToolbarButton>
        </Tooltip>
      </Toolbar>
    );
  }

  return ( 
            <div className="" id="table">
              <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowClick={(params) => router.push(`/${params.id}/edit`)}
                slots={{ toolbar: EditToolbar }}
                slotProps={{
                  toolbar: { setRows, setRowModesModel },
                }}
                showToolbar
              />
            </div>
  )
}