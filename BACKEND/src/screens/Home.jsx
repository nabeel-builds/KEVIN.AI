import React, { useEffect, useState } from 'react'
import { UserContext } from '../context/user.context'
import { useContext } from 'react'
import axios from '../config/axios.js'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const { user } = useContext(UserContext)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [project, setProject] = useState([])

  const navigate = useNavigate()

  const deleteProject = async (e, projectId) => {
    e.stopPropagation()
    try {
      await axios.delete(`/projects/delete/${projectId}`)
      setProject(prev => prev.filter(p => p._id !== projectId))
    } catch (err) {
      console.log(err)
    }
  }

  async function createProject(e) {
    e.preventDefault()



    try {
      const res = await axios.post('/projects/create', { name: projectName })
      setIsModalOpen(false)
      setProject(prev => [res.data, ...prev])
    } catch (err) {
      console.log(err)
    }


  }



  useEffect(() => {

    const fetchProjects = async () => {
      try {
        const res = await axios.get('/projects/all')
        setProject(res.data.projects)
      } catch (err) {
        console.log(err)
      }
    }

    fetchProjects()

  }, [])


  return (
    <main className='p-4'>

      <div className="projects flex flex-wrap gap-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="project p-4 border border-slate-300 rounded-md cursor-pointer">
          New Project
          <i className="ri-link ml-2"></i>
        </button>

        {
          project.map((project) => (
            <div key={project._id}
              onClick={() => {
                navigate(`/project`, {
                  state: { project }
                })
              }}
              className="project flex flex-col gap-2 cursor-pointer p-4 border border-slate-300 rounded-md min-w-52 hover:bg-slate-200 relative">

              <div className='flex justify-between'> <h2
                className='font-semibold'
              >{project.name}</h2><button
                onClick={(e) => {
                  deleteProject(e, project._id)
                }}
                className='hover:bg-red-200 p-1 rounded-full px-2 cursor-pointer transition-all'><i className="ri-delete-bin-fill"></i></button></div>

              <div className="flex gap-2">
                <p> <small> <i className="ri-user-line"></i> Collaborators</small> :</p>
                {project.users.length}
              </div>

            </div>
          ))
        }

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10">

            {/* Title */}
            <h2 className="text-white text-2xl font-semibold mb-1">Create New Project</h2>
            <p className="text-gray-400 text-sm mb-6">Enter a name for your new project</p>

            <form onSubmit={createProject}>

              {/* Input */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Project Name</label>
                <input
               
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  type="text"
                  placeholder="My awesome project"
                  className="w-full bg-[#2a2a2a] text-white placeholder-gray-500 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg text-sm cursor-pointer text-gray-300 bg-white/10 hover:bg-white/15 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg text-sm cursor-pointer text-black bg-white/90 hover:bg-white/70 text-black font-medium transition"
                >
                  Create
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </main>
  )
}

export default Home