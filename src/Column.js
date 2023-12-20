import styled from 'styled-components'
import Task from './Task'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { useState } from 'react'

const Container = styled.div`
    margin: 8px;
    border: 1px solid lightgrey;
    border-radius: 4px;
    width: 220px;
    height: 100%;
`

const Handle = styled.div`
    width: 20px;
    height: 20px;
    background-color: orange;
    border-radius: 4px;
    margin-right: 8px;
    cursor: grab;
`

const TitleInput = styled.input`
    padding: 10px;
    font-size: inherit;
    border: none;
    background-color: transparent;
    outline: none;
    width: 75%;
`

const TaskList = styled.div`
    padding: 8px;
    transition: background-color 0.2s ease;
    background-color: ${(props) =>
        props.isDraggingOver ? 'lightblue' : 'white'};
`

const CreateTask = styled.div`
    padding: 8px;
    border: 1px solid lightgrey;
    border-radius: 4px;
    height: 100%;
    display: flex;
`

const Input = styled.input`
    // padding: 10px;
    font-size: inherit;
    border: none;
    background-color: transparent;
    outline: none;
    width: 75%;
`

const Button = styled.button`
    cursor: pointer;
`

function Column({ column, tasks, index, state, setState }) {
    const [title, setTitle] = useState(column.title)
    const [newTask, setNewTask] = useState('')

    return (
        <Draggable draggableId={column.id} index={index}>
            {(provided) => (
                <Container {...provided.draggableProps} ref={provided.innerRef}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#aeaeaeae',
                        }}
                    >
                        <TitleInput
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value)
                            }}
                            onBlur={() => {
                                // Update the state with the new title
                                setState((prevState) => ({
                                    ...prevState,
                                    columns: {
                                        ...prevState.columns,
                                        [column.id]: {
                                            ...prevState.columns[column.id],
                                            title: title,
                                        },
                                    },
                                }))
                            }}
                        />
                        <Handle {...provided.dragHandleProps} />
                    </div>

                    <Droppable droppableId={column.id} type="task">
                        {(provided, snapshot) => (
                            <TaskList
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                isDraggingOver={snapshot.isDraggingOver}
                            >
                                {tasks.map((task, i) => (
                                    <Task
                                        key={task.id}
                                        task={task}
                                        index={i}
                                        state={state}
                                        setState={setState}
                                    />
                                ))}
                                {provided.placeholder}
                                <CreateTask>
                                    <Input
                                        placeholder="New Task..."
                                        onChange={(e) => {
                                            setNewTask(e.target.value)
                                        }}
                                    />
                                    {/* La del chat, pero lo hice sin chat jeje */}
                                    <Button
                                        onClick={(e) => {
                                            if (newTask === '') return

                                            const i =
                                                Object.keys(state.tasks)
                                                    .length + 1
                                            const taskId = `task-${i}`

                                            const newTaskObj = {
                                                id: taskId,
                                                content: newTask,
                                            }

                                            const newState = {
                                                ...state,
                                                tasks: {
                                                    ...state.tasks,
                                                    [taskId]: newTaskObj,
                                                },
                                            }

                                            column.taskIds.push(taskId)

                                            console.log(newState, column)

                                            setState(newState)
                                        }}
                                    >
                                        Create
                                    </Button>
                                </CreateTask>
                            </TaskList>
                        )}
                    </Droppable>
                </Container>
            )}
        </Draggable>
    )
}

export default Column

{
    /**

Mi version

<Button
    onClick={(e) => {
        if (newTask === '') return

        const i =
            Object.keys(state.tasks).length + 1
            const taskId = `task-${i}`

                                            

                                            const newState = {
                                                ...state,
                                                tasks: {
                                                    ...state.tasks,
                                                    [taskId]: newTaskObj,
                                                },
                                            }

                                            column.taskIds.push(taskId)

                                            console.log(newState, column)

                                            setState(newState)
                                        }}
                                    >
                                        Create
                                    </Button>

*/
}
