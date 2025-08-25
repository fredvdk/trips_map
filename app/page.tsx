
import HomePageBody from './components/homePage';


export default function Home() {

  return (

    <div className="grid grid-rows-[0px_1fr_0px] min-h-screen pb-10 pr-10 sm:p-10 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 sm:items-start">

        <HomePageBody />
      </main>
    </div>

  );
}
