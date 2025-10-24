import { useState } from 'react';
import axios from 'axios';

interface Props { onTaskAdded: () => void; }

const TaskForm = ({ onTaskAdded }: Props) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.post('/api/tasks', { title, description });
        setTitle(''); setDescription('');
        onTaskAdded();
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title"
                   className="border p-2 mb-2 w-full" />
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description"
                      className="border p-2 mb-2 w-full" />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add</button>
        </form>
    );
};

export default TaskForm;
