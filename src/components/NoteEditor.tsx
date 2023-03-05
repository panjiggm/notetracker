import { FC, useState } from "react"

import CodeMirror from "@uiw/react-codemirror"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { languages } from "@codemirror/language-data"

interface NoteEditorProps {
  onSave: (title: string, content: string) => void
}

export const NoteEditor = ({ onSave }: NoteEditorProps) => {
  const [code, setCode] = useState<string>("")
  const [title, setTilte] = useState<string>("")

  return (
    <div className="card mt-5 border border-gray-200 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          <input
            type='text'
            placeholder="Note Title"
            className="input input-lg input-primary w-full font-bold"
            value={title}
            onChange={(e) => setTilte(e.currentTarget.value)}
          />
        </h2>
        <CodeMirror
          value={code}
          width="500px"
          height="30vh"
          minWidth="100%"
          minHeight="30vh"
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages })
          ]}
          onChange={(value) => setCode(value)}
          className='border border-gray-300'
        />
      </div>
      <div className="card-actions justify-end">
        <button
          className="btn btn-primary"
          onClick={() => {
            onSave({
              title,
              content: code
            })
            setTilte('')
            setCode('')
          }}
          disabled={title?.trim().length === 0 || code?.trim().length === 0}
        >
          Save
        </button>
      </div>
    </div>
  )
}