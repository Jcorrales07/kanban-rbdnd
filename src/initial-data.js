// A react-beautiful-dnd NO le importa como estructuras la data, con tal tenga sentido para vos y sepas lo que estas haciendo. Todo bien.

const initialData = {
    tasks: {
        'task-1': { id: 'task-1', content: 'Take out the garbage' },
        'task-2': { id: 'task-2', content: 'Watch my favorite show' },
        'task-3': { id: 'task-3', content: 'Charge my phone' },
        'task-4': { id: 'task-4', content: 'Cook dinner' },

        'task-5': { id: 'task-5', content: 'Brian Tracy' },
        'task-6': { id: 'task-6', content: 'Luke Belmar' },
        'task-7': { id: 'task-7', content: 'I want to be a Multi-Millionaire' },
        'task-8': { id: 'task-8', content: 'Capital Club' },
    },
    columns: {
        'column-1': {
            id: 'column-1',
            title: 'To do',
            // El orden de los task ids es importante
            taskIds: ['task-1', 'task-2', 'task-3', 'task-4', 'task-5', 'task-6', 'task-7', 'task-8'],
        },
        'column-2': {
            id: 'column-2',
            title: 'Doing',
            // El orden de los task ids es importante
            taskIds: [],
        },
        'column-3': {
            id: 'column-3',
            title: 'Done',
            // El orden de los task ids es importante
            taskIds: [],
        },
    },
    // Facilita el ordenamiento de las columnas
    columnOrder: ['column-1', 'column-2', 'column-3'],
}

export default initialData;