
import EditTripPage from '@/app/components/EditTripPage';

interface MyPageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({
    params,
}: MyPageProps) {
    const {id} = await params;
    return <EditTripPage id={id} />;
}
