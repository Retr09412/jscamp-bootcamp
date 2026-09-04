import { lazy, Suspense } from 'react';
import { Route, Routes } from "react-router";
import { Footer } from "./components/Footer.jsx";
import { Header } from "./components/Header.jsx";

// Paginas

const SearchPage =  lazy( () => import("./pages/Search.jsx") );   
const HomePage =  lazy( () => import("./pages/Home.jsx") );  
const NotFoundPage =  lazy( () => import("./pages/404.jsx") );
const DetailPage =  lazy( () => import("./pages/Detail.jsx") );



function App() {
  return (
    <>
    <div className = "jobs-search">
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path = "/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </Suspense>
      <Footer />
    </div>
    </>
  )
}

export default App
