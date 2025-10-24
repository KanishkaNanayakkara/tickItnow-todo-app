import axios from "axios";

interface Task { id: number; title: string; description: string; completed: boolean; }
interface Props { task: Task; onDone: () => void; }

const TaskCard = ({ task, onDone }: Props) => {
    const handleDone = async () => {
        await axios.put(`/api/tasks/${task.id}`);
        onDone();
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">{task.title}</h3>
            <p>{task.description}</p>
            <button onClick={handleDone} className="bg-green-500 text-white p-2 rounded mt-2">Done</button>
        </div>
    );
};

export default TaskCard;
