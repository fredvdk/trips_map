'use client';

import { Box, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from './components/layout';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridSlotProps,
  ToolbarButton,
  Toolbar,
} from '@mui/x-data-grid';
import 'mapbox-gl/dist/mapbox-gl.css';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { randomId } from '@mui/x-data-grid-generator';

import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./components/map'), {
  ssr: false, // very important
});

const mapbox_accesstoken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

import { deleteTrip } from './tripService';
import {useRouter} from 'next/navigation';

export default function Home() {
  const [rows, setRows] = useState<GridRowModel[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

const router = useRouter();

  useEffect(() => {
    console.log('Getting all trips');
    fetch('/api/trips')
      .then((res) => res.json())
      .then((data) => setRows(data));
  }, []);

  const handleEditClick = (id: GridRowId) => () => {
    router.push(`/${id}/edit`)
  };

  //ADD ROW
  const handleNewRow = async () => {
    const id = randomId();
    const now = new Date();
    const oneMonthLater = new Date(now);
    oneMonthLater.setMonth(now.getMonth() + 1);

    const trip = {
      id: id,
      destination: '',
      from: oneMonthLater.toISOString(),
      till: oneMonthLater.toISOString(),
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
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit },
      }));
    } catch (error) {
      console.log('Error creating new trip ' + error);
    }
  };

  //DELETE ROW
  const handleDelete = async (id: { id: string }) => {
    await deleteTrip(id.id);
    setRows((prevRows) => prevRows.filter((row) => row.id !== id.id));
    console.log('Deleted row ' + id.id);
  };

  //UPDATE ROW
  const processRowUpdate = async (updatedRow: GridRowModel) => {
    const latLon = await getLatLon(updatedRow.destination);
    if (latLon == null) return;
    updatedRow.latitude = latLon.latitude;
    updatedRow.longitude = latLon.longitude;
    try {
      await fetch('/api/trips', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: updatedRow.id,
          trip: updatedRow,
        }),
      });
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === updatedRow.id ? { ...updatedRow } : row
        )
      );
      console.log('Updated row:', updatedRow);
    } catch (error) {
      console.error('Error in processRowUpdate:', error);
    }
    return updatedRow;
  };

  const processRowUpdateError = (error: unknown) =>
    console.log(JSON.stringify(error));

  const handleRowModesModelChange = (newModel: GridRowModesModel) => {
    setRowModesModel(newModel);
  };

  const getLatLon = async (place: string) => {
    let latLon = null;
    try {
      const response = await fetch(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${place}&access_token=${mapbox_accesstoken}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      latLon = data.features[0].properties.coordinates;
      return latLon;
    } catch (error) {
      console.error('Error getting latlon:', error);
      return { latitude: 0, longitude: 0 };
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'destination',
      headerName: 'Destination',
      width: 150,
      editable: true,
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
    { field: 'hotel', headerName: 'Hotel', width: 150, editable: true },
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
          onClick={() => handleDelete({ id: id as number })}
          color="inherit"
        />,
      ],
    },
  ];

  function EditToolbar(props: GridSlotProps['toolbar']) {
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
    <Layout>
      <div className="grid grid-rows-[0px_1fr_0px] min-h-screen pb-10 pr-10 sm:p-10 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 sm:items-start">
          <h1 className="text-4xl font-extrabold text-center tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            USA trips
          </h1>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <DynamicMap trips={rows} />
            <div className="w-screen h-[200vh]">
              <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={processRowUpdateError}
                onRowClick={(params) => router.push(`/${params.id}/edit`)}
                slots={{ toolbar: EditToolbar }}
                slotProps={{
                  toolbar: { setRows, setRowModesModel },
                }}
                showToolbar
              />
            </div>
          </Box>
        </main>
      </div>
    </Layout>
  );
}
