export interface Trip {
    id: string;
    destination: string;
    state: string;
    from: Date;
    till: Date;
    hotel: string;
    hotelCost: number;
    transportMode: string;
    transportCost: number;
    notes: string;
    status: 'Scheduled' | 'Completed';
    latitude: number;
    longitude: number;
    created: Date;
    updated: Date
}
