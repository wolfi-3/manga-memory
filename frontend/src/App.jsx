import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [mangaList, setMangaList] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/reads')
      .then((response) => response.json())
      .then((data) => setMangaList(data))
      .catch((error) => console.error('Failed to fetch reads:', error))
  }, [])

  const filteredManga = mangaList.filter((manga) =>
    manga.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddManga = () => {
  if (!newTitle.trim()) {
    return
  }

  fetch('http://127.0.0.1:8000/reads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: newTitle.trim(),
      current_chapter: 0,
      status: 'reading',
      notes: '',
    }),
  })
    .then((response) => response.json())
    .then(() => {
      return fetch('http://127.0.0.1:8000/reads')
    })
    .then((response) => response.json())
    .then((data) => {
      setMangaList(data)
      setNewTitle('')
      setShowAddForm(false)
    })
    .catch((error) => console.error('Failed to add manga:', error))
}

const deleteManga = (id, title) => {
  if (!window.confirm(`Delete "${title}"?`)) {
    return
  }

  fetch(`http://127.0.0.1:8000/reads/${id}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then(() => {
      setMangaList((prevList) => prevList.filter((manga) => manga.id !== id))
    })
    .catch((error) => console.error('Failed to delete manga:', error))
}

const updateChapter = (id, currentChapter) => {
  fetch(`http://127.0.0.1:8000/reads/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ current_chapter: currentChapter + 1 }),
  })
    .then((response) => response.json())
    .then(() => {
      setMangaList((prevList) =>
        prevList.map((manga) =>
          manga.id === id
            ? { ...manga, current_chapter: currentChapter + 1 }
            : manga
        )
      )
    })
    .catch((error) => console.error('Failed to update chapter:', error))
}

  return (
    <div className="app">
      <h1>My Reading List</h1>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search and discovery..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <button onClick={() => setShowAddForm(true)}>
          + Add New
        </button>
      </div>

      {/* 👇 ADD THE FORM HERE */}
      {showAddForm && (
        <div className="add-form">
          <input
            type="text"
            placeholder="Manga title"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
          />

          <button onClick={handleAddManga}>
            Add Manga
          </button>

          <button onClick={() => setShowAddForm(false)}>
            Cancel
          </button>
        </div>
      )}


      {/* 👇 MANGA LIST COMES AFTER THE FORM */}
      <div className="manga-list">
        {filteredManga.map((manga) => (
          <div className="manga-card" key={manga.id}>
            <h2>{manga.title}</h2>
            <p>Last read: Chap {manga.current_chapter}</p>
            <span>{manga.last_read}</span>
            <button onClick={() => updateChapter(manga.id, manga.current_chapter)}>
               +1 Chapter
            </button>
            <button onClick={() => deleteManga(manga.id, manga.title)}>
                Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
