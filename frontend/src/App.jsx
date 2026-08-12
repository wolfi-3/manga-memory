import { useState } from 'react'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const [mangaList, setMangaList] = useState([
    {
      title: 'Demon Slayer',
      chapter: 120,
      date: 'Aug 11',
    },
    {
      title: 'Chainsaw Man',
      chapter: 87,
      date: 'Aug 10',
    },
    {
      title: 'Spy x Family',
      chapter: 139,
      date: 'Aug 09',
    },
  ])

  const filteredManga = mangaList.filter((manga) =>
    manga.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddManga = () => {
    if (!newTitle.trim()) {
      return
    }

    const newManga = {
      title: newTitle.trim(),
      chapter: 0,
      date: 'Today',
    }

    setMangaList([...mangaList, newManga])
    setNewTitle('')
    setShowAddForm(false)
  }

  const updateChapter = (title) => {
    setMangaList(
      mangaList.map((manga) =>
        manga.title === title
          ? { ...manga, chapter: manga.chapter + 1 }
          : manga
      )
    )
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
          <div className="manga-card" key={manga.title}>
            <h2>{manga.title}</h2>

              <p>Last read: Chap {manga.chapter}</p>

              <span>{manga.date}</span>

              <button onClick={() => updateChapter(manga.title)}>
                +1 Chapter
              </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
