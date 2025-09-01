
import HomePageBody from './components/homePage';


export default function Home() {

  return (

    <div className="container mx-auto p-4">
      <main className="">
        <nav className="mb-8 bg-gray-200 p-4 rounded-lg">
          <ul className="flex space-x-4">
            <li>menu</li>
            <li>about</li>
            <li>contact</li>
            <li>login</li>
            <li>signup</li>
          </ul>
        </nav>


        <HomePageBody />
      </main>
    </div>

  );
}
