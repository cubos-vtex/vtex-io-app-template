import getRepositoriesByOrg from './getRepositoriesByOrg'
import tasks from './tasks'
import tasksId from './tasks/:id'

export default {
  // Get GitHub repositories by a given organization
  getRepositoriesByOrg,

  // Tasks CRUD
  tasks,
  tasksId,
}
