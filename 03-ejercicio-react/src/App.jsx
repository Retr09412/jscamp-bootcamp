import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";

// Paginas
import {SearchPage} from "./pages/Search.jsx"
import {HomePage} from "./pages/Home.jsx"
import { NotFoundPage } from "./pages/404.jsx";

import { Route } from "./components/Route.jsx";

function App() {
  return (
    <>
    <div className = "jobs-search">
      <Header />
      <Route path = "/" component={HomePage} />
      <Route path="/search" component={SearchPage} />
      <Route error={true} component={NotFoundPage} />
      <Footer />
    </div>
    </>
  )
}

export default App
