import { ResultFunction } from "../../helpers/utils"
import { ReturnStatus } from "../../types/generic"

class Task {

    public getAllTasks() {
        return ResultFunction(
            true,
            'All tasks',
            200,
            ReturnStatus.OK,
            null
        )
    }
}

export default Task