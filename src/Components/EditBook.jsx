import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, updateData] = useState({
    title: "",
    isbn: "",
    numberOfCopies: "",
    author: "",
    userId: localStorage.getItem("userid"),
    imagePath: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");

  // ✅ Fetch existing book details
  useEffect(() => {
    axios.get(`http://localhost:8080/api/books/${id}`)
      .then((response) => {
        const book = response.data.data;
        updateData({
          title: book.title,
          isbn: book.isbn,
          numberOfCopies: book.numberOfCopies,
          author: book.author,
          userId: localStorage.getItem("userid"),
          imagePath: book.imagePath,
        });
      })
      .catch((err) => setError(err.message || "Failed to load book"));
  }, [id]);

  // ✅ Handle image preview
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  // ✅ Handle image input
  function handleFileChange(e) {
    setSelectedFile(e.target.files[0]);
  }

  // ✅ Form submission with validation
  const handleEditBook = async (e) => {
    e.preventDefault();

    if (
      !data.title ||
      !data.isbn ||
      !data.author ||
      !data.numberOfCopies ||
      data.numberOfCopies <= 0
    ) {
      toast.error("Please fill in all required fields properly!");
      return;
    }

    const formData = new FormData();
    formData.append("book", new Blob([JSON.stringify(data)], { type: "application/json" }));
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      const response = await fetch(`http://localhost:8080/api/books/edit/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        toast.success("Book updated successfully!");
        setTimeout(() => navigate("/books"), 1500);
      } else {
        toast.error("Failed to update book!");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      <div className="editbook-container mx-auto mt-5 w-50 p-5 shadow rounded">
        <h1 className="editbook-title display-6 mb-4 text-center">Edit Book</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <form className="d-flex flex-column gap-3" onSubmit={handleEditBook}>
          {/* Title */}
          <div>
            <label className="fw-semibold small">
              Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Enter book title"
              value={data.title}
              onChange={(e) => updateData({ ...data, title: e.target.value })}
              required
            />
          </div>

          {/* ISBN */}
          <div>
            <label className="fw-semibold small">
              ISBN <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Enter ISBN"
              value={data.isbn}
              onChange={(e) => updateData({ ...data, isbn: e.target.value })}
              required
            />
          </div>

          {/* Copies */}
          <div>
            <label className="fw-semibold small">
              Number of Copies <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className="form-control form-control-sm"
              placeholder="Enter number of copies"
              value={data.numberOfCopies}
              onChange={(e) =>
                updateData({
                  ...data,
                  numberOfCopies: Math.max(1, Number(e.target.value)),
                })
              }
              required
              min="1"
            />
          </div>

          {/* Author */}
          <div>
            <label className="fw-semibold small">
              Author Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Enter author name"
              value={data.author}
              onChange={(e) => updateData({ ...data, author: e.target.value })}
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="fw-semibold small">
              Book Cover Image <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              className="form-control form-control-sm"
              onChange={handleFileChange}
            />
          </div>

          {/* Image Preview */}
          <div className="mt-2 text-center">
            <img
              src={
                previewUrl ||
                (data.imagePath
                  ? `http://localhost:8080${data.imagePath}`
                  : "/default-image.png")
              }
              alt="Book Cover Preview"
              height="180"
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-dark btn-sm align-self-center px-4 mt-3"
          >
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
};
