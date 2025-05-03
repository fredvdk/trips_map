const deleteTrip = async (id: string) => {
  try {
    await fetch('/api/trips', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({"id": id}),
    });
    console.log('Row deleted ');
  } catch (err) {
    console.error('Delete failed:', err);
  }
};

const getAllTrips = async () => {
  console.log('Getting all trips');
  return (await fetch('/api/trips')).json();
};

export { deleteTrip, getAllTrips };
