import { useState } from 'react'
import './App.css'
import { useIndexFilesOnly } from './hooks'
import MdView from './MdView'

function App() {
  const postListings = useIndexFilesOnly("posts/index.json")
  const [selected, setSelected] = useState('')
  const onSelect = (e: React.ChangeEvent) => {
    if (e.target !== undefined) {
      const sel = e.target as HTMLSelectElement
      if (sel.value !== undefined) {
        setSelected(sel.value)
      }
    }
  }

  return (
    <>
      <h1>vite-plugin-indexify</h1>
      <div className="card">
        <select defaultValue={''} onChange={onSelect}>
          <option value={''}></option>
          {postListings.map((listitem) => <option value={listitem} key={listitem}>{listitem}</option>)}
        </select>
        {selected.length > 0 ? <h3>Showing {selected}</h3> : null}
        <div>
          {selected.length > 0 ? <MdView path={'posts/' + selected}></MdView> : <div>Pick a post to view</div>}
        </div>
      </div>
      <p className="read-the-docs">
        <a href="https://www.github.com/klm127/vite-plugin-indexify">Check out vite-plugin-indexify</a>
      </p>
    </>
  )
}

export default App
