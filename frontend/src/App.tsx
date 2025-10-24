import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';

interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
}

const App = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => { fetchTasks(); }, []);

    const fetchTasks = async () => {
        const res = await axios.get<Task[]>('/api/tasks'); // optional: type the response
        setTasks(res.data);
    };

    return (
        <div className="container mx-auto p-4">
            <TaskForm onTaskAdded={fetchTasks} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {tasks.map(task => <TaskCard key={task.id} task={task} onDone={fetchTasks} />)}
            </div>
        </div>
    );
};

export default App;
