import './Notes.css';
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../assets/1.png";
import { useState, useEffect } from 'react';
import axios from 'axios';
import out from "../assets/out.png";
function Notes() {
const [notes, setNotes] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [sortBy, setSortBy] = useState("date");
const [filterUrgency, setFilterUrgency] = useState("All");
const [isHovered, setIsHovered] = useState(false);
const [showOverlay, setShowOverlay] = useState(false);
const [selectedNotes, setSelectedNotes] = useState([]);
const [isEditing, setIsEditing] = useState(false);
const [message, setMessage] = useState("");
const [currentNote, setCurrentNote] = useState({ id: null, title: '', Description: '', urgency: 'Low' });
const navigate = useNavigate();
const token = localStorage.getItem('token');
useEffect(() => {
if (!token) {
navigate('/Login');
} else {
fetchNotes();
}
}, [token]);
const fetchNotes = async () => {
try {
const response = await axios.get('http://127.0.0.1:8000/api/notes', {
headers: { Authorization: `Bearer ${token}` }
});
setNotes(response.data);
} catch (error) {
console.error("Error fetching notes:", error);
}
};
const showMessage = (msg) => {
setMessage(msg);
setTimeout(() => setMessage(""), 3000);
};
const handleLogout = () => {
localStorage.clear();
navigate('/Login');
};
const handleSave = async (e) => {
e.preventDefault();
if (!currentNote.title.trim() || !currentNote.Description.trim()) return;
try {
const payload = { title: currentNote.title, content: currentNote.Description, urgency: currentNote.urgency };
if (isEditing) {
await axios.put(`http://127.0.0.1:8000/api/notes/${currentNote.id}`, payload, {
headers: { Authorization: `Bearer ${token}` }
});
showMessage("Note modified!");
} else {
const response = await axios.post('http://127.0.0.1:8000/api/notes', payload, {
headers: { Authorization: `Bearer ${token}` }
});
setNotes([...notes, response.data]);
showMessage("Note added!");
}
fetchNotes();
setShowOverlay(false);
setIsEditing(false);
setCurrentNote({ id: null, title: '', Description: '', urgency: 'Low' });
} catch (error) {
console.error("Error saving note:", error);
}
};
const toggleSelect = (id) => {
setSelectedNotes(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
};
const deleteSelected = async () => {
if(selectedNotes.length > 0 && window.confirm(`Delete ${selectedNotes.length} notes?`)) {
try {
for (const id of selectedNotes) {
await axios.delete(`http://127.0.0.1:8000/api/notes/${id}`, {
headers: { Authorization: `Bearer ${token}` }
});
}
setNotes(notes.filter(n => !selectedNotes.includes(n.id)));
setSelectedNotes([]);
showMessage("Selection deleted!");
} catch (error) {
console.error("Error deleting notes:", error);
}
}
};
const filterednotes = notes
.filter(note => {
const matchesSearch = (note.title || "").toLowerCase().includes(searchTerm.toLowerCase());
const matchesUrgency = filterUrgency === "All" || note.urgency === filterUrgency;
return matchesSearch && matchesUrgency;
})
.sort((a, b) => {
if (sortBy === "urgency") {
const map = { "High": 1, "Medium": 2, "Low": 3 };
return (map[a.urgency] || 3) - (map[b.urgency] || 3);
}
if (sortBy === "date") {
return new Date(b.created_at) - new Date(a.created_at);
}
return 0;
});
return (
<div className="notes-wrapper">
{message && (
<div style={{position:'fixed', top:'20px', right:'20px', background:'#aaca2c', color:'#000', padding:'10px 20px', borderRadius:'10px', zIndex:2000, fontWeight:'bold', fontFamily:'cursive'}}>
{message}
</div>
)}
{showOverlay && (
<div className="overlay" style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.8)', zIndex:1000, display:'flex', justifyContent:'center', alignItems:'center'}}>
<form className="note-form" onSubmit={handleSave} style={{backgroundColor:'#2a2a2a', padding:'25px', borderRadius:'15px', display:'flex', flexDirection:'column', gap:'15px', width:'320px', border:'2px solid #feffdc'}}>
<h3 style={{color:'white', fontFamily:'cursive', margin:0}}>{isEditing ? "Modify Note" : "New Note"}</h3>
<input type="text" placeholder="Title" value={currentNote.title} required onChange={e => setCurrentNote({...currentNote, title: e.target.value})} style={{padding:'8px', borderRadius:'5px'}}/>
<textarea placeholder="Description" value={currentNote.Description} required onChange={e => setCurrentNote({...currentNote, Description: e.target.value})} style={{padding:'8px', borderRadius:'5px', minHeight:'100px'}}/>
<select value={currentNote.urgency} onChange={e => setCurrentNote({...currentNote, urgency: e.target.value})} style={{padding:'8px', borderRadius:'5px'}}>
<option value="High">High</option>
<option value="Medium">Medium</option>
<option value="Low">Low</option>
</select>
<div style={{display:'flex', gap:'10px'}}>
<button type="submit" style={{flex:1, cursor:'pointer', padding:'10px', borderRadius:'5px', background:'#aaca2c', border:'none', fontWeight:'bold'}}>Save</button>
<button type="button" onClick={() => setShowOverlay(false)} style={{flex:1, cursor:'pointer', padding:'10px', borderRadius:'5px', background:'#c0392b', border:'none', color:'white', fontWeight:'bold'}}>Cancel</button>
</div>
</form>
</div>
)}
<section className="Sidebar">
<div className='Disconnect' onClick={handleLogout} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={{cursor: 'pointer'}}>
<img src={isHovered ? out : Logo} alt='logo' className='logo' />
</div>
<input type="submit" value="+" title="Add Note" onClick={() => {setIsEditing(false); setCurrentNote({id:null, title:'', Description:'', urgency:'Low'}); setShowOverlay(true)}} />
<button className="delete" title="Delete Selected" onClick={deleteSelected} style={{backgroundColor: selectedNotes.length > 0 ? '#e74c3c' : ''}}>-</button>
</section>
<section className="main-area">
<section className='Topbar'>
<header className="top-bar">
<input type="text" placeholder="Search notes by title" className="search-input" onChange={(e) => setSearchTerm(e.target.value)}/>
<div className="sort">
<span>Sort by: </span>
<select onChange={(e) => setSortBy(e.target.value)} className="sort-select">
<option value="date">Date</option>
<option value="urgency">Urgency</option>
</select>
</div>
<div className="filter">
<span>Filter: </span>
<select onChange={(e) => setFilterUrgency(e.target.value)} className="sort-select">
<option value="All">All Priorities</option>
<option value="High">High</option>
<option value="Medium">Medium</option>
<option value="Low">Low</option>
</select>
</div>
</header>
</section>
<section className="note-container">
{filterednotes.map((note) => (
<article key={note.id} className="note" onClick={() => toggleSelect(note.id)} style={{border: selectedNotes.includes(note.id) ? '4px solid #e74c3c' : '3px solid rgb(205, 205, 205)', cursor:'pointer', position:'relative', transform: selectedNotes.includes(note.id) ? 'scale(1.02)' : 'scale(1)'}}>
<div className="note-content">
<div className="note-header">
<h2 className="title">{note.title}</h2>
<span className={`badge ${(note.urgency || 'low').toLowerCase()}`}>{note.urgency || 'Low'}</span>
</div>
<p className="description">{note.content || note.Description}</p>
<div className="edit">
<button className="edit-icon" onClick={(e) => {e.stopPropagation(); setIsEditing(true); setCurrentNote({id: note.id, title: note.title, Description: note.content || note.Description, urgency: note.urgency || 'Low'}); setShowOverlay(true)}}>Edit</button>
</div>
<div className="date"><p className="note-date">Created: {note.created_at ? new Date(note.created_at).toLocaleDateString() : 'N/A'}</p></div>
</div>
</article>
))}
</section>
</section>
</div>
);
}
export default Notes;