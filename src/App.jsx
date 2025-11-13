import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import { AddBook } from './Components/AddBook';
import { BookList } from './Components/BookList';
import { EditBook } from './Components/EditBook';
import { Login } from './Components/Login';
import { ShowBook } from './Components/ShowBook';
import { SignUp } from './Components/SignUp';
import { UserList } from './Components/UserList';
import { LoginProvider } from './Context/LoginContext';
import { Home } from './Components/Home';
import { ProtectedRoute } from './ProtectedComponent/ProtectedRoute';
import { Navbar } from './Components/Navbar';
import { Borrowed } from './Components/Borrowed';
import { ProfileUser } from './Components/ProfileUser';
import { ShowUser } from './Components/ShowUser';
import { ShowPDF } from './Components/ShowPDF';
import { pdfjs } from 'react-pdf';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  return (
    <div>
      <BrowserRouter>
        <LoginProvider>
          <Navbar />
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />

            <Route element={<ProtectedRoute />}>
              <Route path='/home' element={<Home />} />
              <Route path='/books' element={<BookList />} />
              <Route path='/borrowed' element={<Borrowed />} />
              <Route path='/showpdf/:id' element={<ShowPDF />} />
              <Route path='/addbook' element={<AddBook />} />
              <Route path='/book/:id' element={<ShowBook />} />
              <Route path='/edit/:id' element={<EditBook />} />
              <Route path='/userlist' element={<UserList />} />
              <Route path='/userlist/user/:id' element={<ShowUser />} />
              <Route path='/profile' element={<ProfileUser />} />
            </Route>
          </Routes>

          {/* ✅ Global toast container (visible on all pages) */}
          <ToastContainer
            position="top-right"
            autoClose={7000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            theme="colored"
          />
        </LoginProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
