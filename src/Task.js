import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'
import { useState } from 'react'

const Container = styled.div`
    border: 1px solid lightgrey;
    border-radius: 2px;
    padding: 15px 0px 15px 10px;
    margin-bottom: 8px;
    background-color: ${(props) => (props.isDragging ? 'lightgreen' : 'white')};
    display: flex;
    align-items: center;
`

const Input = styled.input`
    // padding: 10px;
    font-size: inherit;
    border: none;
    background-color: transparent;
    outline: none;
    width: 75%;
`

const Handle = styled.div`
    width: 20px;
    height: 20px;
    background-color: orange;
    border-radius: 100%;
    margin-right: 10px;
    cursor: grab;
`

function Task({ task, index, state, setState }) {
    const [content, setContent] = useState(task.content)

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <Container
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    isDragging={snapshot.isDragging}
                    {...provided.dragHandleProps}
                >
                    <Handle {...provided.dragHandleProps} />
                    {/* Con {...provided.dragHandleProps} es para darle habilidades para agarrar. Si queres que se pueda agarrar desde un lugar especifico, le tenes que agregar esto al elemento. Y solo ahi tiene que estar */}
                    <Input
                        value={content}
                        onChange={(e) => {
                            const newContent = e.target.value
                            setContent(newContent)

                            // Update the state with the new content
                            setState((prevState) => ({
                                ...prevState,
                                tasks: {
                                    ...prevState.tasks,
                                    [task.id]: {
                                        ...prevState.tasks[task.id],
                                        content: newContent,
                                    },
                                },
                            }))
                        }}
                    />
                </Container>
            )}
        </Draggable>
    )
}

export default Task

// Las tareas van a tener la habilidad de ser arrastradas, asi que van a ser Dragables
