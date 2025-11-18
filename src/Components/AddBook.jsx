import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Categories } from '../utility/Categories';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AddBook = () => {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("");
  const [numberOfCopies, setCopies] = useState('');
  const [author, setAuthor] = useState("");
  const [imagePath, setImagePath] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const bookCategories = Categories;

  const handleAddBook = async (e) => {
    e.preventDefault();

    // ✅ Frontend validation
    if (!title || !isbn || !category || !numberOfCopies || !author || !imagePath) {
      toast.error("Please fill in all required fields and upload the image!");
      return;
    }

    // ✅ Check number of copies
    if (Number(numberOfCopies) <= 0) {
      toast.error("Number of copies must be greater than 0!");
      return;
    }

    const bookDto = {
      title,
      isbn,
      numberOfCopies,
      author,
      category,
      userId: localStorage.getItem("userid"),
    };

    const formData = new FormData();
    formData.append("book", new Blob([JSON.stringify(bookDto)], { type: "application/json" }));
    formData.append("image", imagePath);
    formData.append("pdf", pdfFile);

    try {
      await axios.post("http://localhost:8080/api/books/add", formData);
      toast.success("Book added successfully!");
      setTimeout(() => navigate("/books"), 1500);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add book!");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      <div className="addbook-container mx-auto mt-5 w-50 p-5 rounded shadow">
        <h1 className="addbook-title display-5 mb-4 text-center">Add Book</h1>

        <form className="d-flex flex-column gap-3" onSubmit={handleAddBook}>
          
          {/* Title */}
          <label className="fw-semibold small">
            Book Title <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Enter book title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Category */}
          <label className="fw-semibold small">
            Category <span className="text-danger">*</span>
          </label>
          <select
            value={category}
            className="form-select form-select-sm"
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {bookCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* ISBN */}
          <label className="fw-semibold small">
            ISBN <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Enter ISBN number"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required
          />

          {/* Number of Copies */}
          <label className="fw-semibold small">
            Number of Copies <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="Enter number of copies"
            value={numberOfCopies}
            min="1"
            onChange={(e) => setCopies(e.target.value)}
            required
          />

          {/* Author */}
          <label className="fw-semibold small">
            Author Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Enter author name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />

          {/* 📁 File Upload Fields */}
          <div className="form-group d-flex flex-column gap-1">
            <label htmlFor="imageUpload" className="fw-semibold small">
              Book Cover Image <span className="text-danger">*</span>
            </label>
            <input
              id="imageUpload"
              type="file"
              className="form-control form-control-sm"
              accept="image/*"
              onChange={(e) => setImagePath(e.target.files[0])}
              required
            />
          </div>

          <div className="form-group d-flex flex-column gap-1">
            <label htmlFor="pdfUpload" className="fw-semibold small">
              Book PDF File
            </label>
            <input
              id="pdfUpload"
              type="file"
              className="form-control form-control-sm"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            className="btn btn-dark btn-sm align-self-center px-4 mt-3"
          >
            Add Book
          </button>
        </form>
      </div>
    </>
  );
};
