import React, { useState, useEffect } from "react";
import "./App.css";

// ------------------------------------------------------------

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("notes")) {
      setNotes(JSON.parse(localStorage.getItem("notes")));
    } else {
      localStorage.setItem("notes", JSON.stringify([]));
    }
  }, []);

  useEffect(() => {
    if (validationErrors.length !== 0) {
      setTimeout(() => {
        setValidationErrors([]);
      }, 3000);
    }
  }, [validationErrors]);

  const saveToLocalstorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const validate = () => {
    const validationErrors = [];
    let passed = true;
    if (!title) {
      validationErrors.push("الرجاء إدخال عنوان الملاحظة!");
      passed = false;
    }
    if (!content) {
      validationErrors.push("الرجاء إدخال محتوى الملاحظة!");
      passed = false;
    }
    setValidationErrors(validationErrors);
    return passed;
  };

  // ------------------------------------------------------------

  const add_Button = () => {
    setCreate(true);
  };

  const save_Note = () => {
    if (!validate()) return;
    const newNote = { id: new Date(), title: title, content: content };
    const updatedNotes = [...notes, newNote];
    saveToLocalstorage("notes", updatedNotes);
    setNotes(updatedNotes);
    setCreate(false);
    setEdit(false);
    setSelectedNote(newNote.id);
    setTitle("");
    setContent("");
  };

  const edit_Note = () => {
    if (!validate()) return;
    const updatedNotes = [...notes];
    const noteToEdit = updatedNotes.findIndex(
      (note) => note.id === selectedNote
    );
    updatedNotes[noteToEdit] = {
      id: selectedNote,
      title: title,
      content: content,
    };
    saveToLocalstorage("notes", updatedNotes);
    setNotes(updatedNotes);
    setEdit(false);
    setTitle("");
    setContent("");
  };

  const cancle_Note = () => {
    const note = { id: new Date(), title: title, content: content };
    setCreate(false);
    setEdit(false);
    setTitle("");
    setContent("");
  };

  const edit_Button = () => {
    const note = notes.find((note) => note.id === selectedNote);
    setEdit(true);
    setTitle(note.title);
    setContent(note.content);
  };

  const delete_Button = () => {
    const updatedNotes = [...notes];
    const deletedNote = updatedNotes.findIndex(
      (note) => note.id === selectedNote
    );
    updatedNotes.splice(deletedNote, 1);
    saveToLocalstorage("notes", updatedNotes);
    setNotes(updatedNotes);
    setSelectedNote(null);
    setEdit(false);
  };

  // ------------------------------------------------------------

  const newNoteSection = () => {
    return (
      <div>
        {create ? <h2>إضافة ملاحظة جديدة</h2> : <h2>تعديل ملاحظة</h2>}
        <div>
          <input
            type="text"
            name="title"
            className="form-input mb-30"
            placeholder="العنوان"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            rows="10"
            name="content"
            className="form-input"
            placeholder="النص"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {!create ? (
            <a href="#" className="button green" onClick={edit_Note}>
              تعديل
            </a>
          ) : (
            <a href="#" className="button green" onClick={save_Note}>
              حفظ
            </a>
          )}
          <> </>
          <a href="#" className="button red" onClick={cancle_Note}>
            إلغاء
          </a>
        </div>
      </div>
    );
  };

  const previewNoteSection = () => {
    if (notes.length === 0) {
      return <h2 className="center">لا يوجد ملاحظات</h2>;
    }
    if (!selectedNote) {
      return <h2 className="center">الرجاء اختيار ملاحظة</h2>;
    }
    const note = notes.find((note) => note.id === selectedNote);
    return (
      <div>
        <div className="note-operations">
          <a href="#" onClick={edit_Button}>
            <i className="fa fa-pencil-alt" />
          </a>
          <a href="#" onClick={delete_Button}>
            <i className="fa fa-trash" />
          </a>
        </div>
        <div>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </div>
      </div>
    );
  };

  // ------------------------------------------------------------

  return (
    <div className="App">
      <div className="notes-section">
        <ul className="notes-list">
          {notes.map((note) => {
            return (
              <li
                key={note.id}
                className={`note-item ${selectedNote === note.id && "active"}`}
                onClick={() => setSelectedNote(note.id)}
              >
                {note.title}
              </li>
            );
          })}
        </ul>

        <button
          className={create || edit ? "add-btn2" : "add-btn"}
          onClick={add_Button}
        >
          +
        </button>
      </div>

      <div className="preview-section">
        {create || edit ? newNoteSection() : previewNoteSection()}
      </div>

      {validationErrors.length !== 0 && (
        <div className="alert-container">
          <ul>
            {validationErrors.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------

export default App;
