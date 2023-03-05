import { useState } from "react"
import { api, type RouterOutputs } from "@/utils/api"
import { useSession } from "next-auth/react"
import { NoteEditor } from "./NoteEditor"
import { NoteCard } from "./NoteCard"

type Topic = RouterOutputs["topic"]["getAll"][0]

export const Content: React.FC = () => {
  const { data: sessionData } = useSession()

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)

  const { data: topics, refetch: refetchTopics } = api.topic.getAll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedTopic(selectedTopic ?? data[0] ?? null)
      }
    }
  )

  const createTopic = api.topic.create.useMutation({
    onSuccess: () => {
      refetchTopics()
    }
  })

  const { data: notes, refetch: refetchNotes } = api.note.getAll.useQuery(
    {
      topicId: selectedTopic?.id ?? ""
    },
    {
      enabled: sessionData?.user !== undefined && selectedTopic !== null,
    }
  )

  const createNote = api.note.create.useMutation({
    onSuccess: () => {
      void refetchNotes()
    }
  })

  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      refetchNotes()
    }
  })

  return (
    <div className="grid grid-cols-4 gap-2 mx-5 mt-5">
      <div className="px-2">
        <ul className="menu rounded-box w-56 p-2 bg-base-100">
          {topics?.map((topic) => (
            <li key={topic.id}>
              <a 
                href="#"
                onClick={e => {
                  e.preventDefault()
                  setSelectedTopic(topic)
                }}
              >
                {topic.title}
              </a>
            </li>
          ))}
        </ul>
        <div className="divider"></div>
        <input 
          type='text' 
          placeholder="New Topic" 
          className="input input-bordered input-sm w-full" 
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              createTopic.mutate({
                title: e.currentTarget.value
              })
              e.currentTarget.value = ""
            }
          }}
        />
      </div>
      <div className="col-span-3">
        <div>
          {notes?.map((note) => (
            <NoteCard note={note} onDelete={() => deleteNote.mutate({ id: note.id })} />
          ))}
        </div>
        <NoteEditor onSave={({ title, content }) => {
          createNote.mutate({
            title,
            content,
            topicId: selectedTopic?.id ?? ""
          })
        }} />
      </div>
    </div>
  )
}