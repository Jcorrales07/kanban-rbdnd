import styled from 'styled-components'
import Task from './Task'
import { Draggable, Droppable } from 'react-beautiful-dnd'

const Container = styled.div`
    margin: 8px;
    border: 1px solid lightgrey;
    border-radius: 2px;
    width: 220px;
`

const Handle = styled.div`
    width: 20px;
    height: 20px;
    background-color: orange;
    border-radius: 4px;
    margin-right: 8px;
    cursor: grab;
`

const Title = styled.h3`
    padding: 8px;
`
const TaskList = styled.div`
    padding: 8px;
`

function Column({ column, tasks, index }) {
    return (
        // <Draggable draggableId={column.id} index={index}> //Intente hacerlo draggable pero no me funciono
            // {(provided) => (
                <Container
                    // {...provided.draggableProps}
                    // {...provided.dragHandleProps}
                    // ref={provided.innerRef}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Title>{column.title}</Title>
                        <Handle></Handle>
                    </div>

                    <Droppable droppableId={column.id}>
                        {/* Ocupa que su hijo sea una funcion que devuelva un componente de React. provided es un objeto que trae propiedades para darle funcionalidades de dropeo al componente */}

                        {(provided) => (
                            <TaskList
                                /* innerRef sirve para que se pueda llevar un control, es como el key */
                                ref={provided.innerRef}
                                /* Le estamos dando la habilidad de que se pueda dropear */
                                {...provided.droppableProps}
                            >
                                {tasks.map((task, i) => (
                                    <Task
                                        key={task.id}
                                        task={task}
                                        index={i}
                                    ></Task>
                                ))}

                                {/* Esto se ocupa para que halla un pequeño espacio para que se puedan dropear draggables, aumenta el tamaño, tiene que ser olbigatoriamente un hijo del elemento que estas convirtiendo en un Droppable */}

                                {provided.placeholder}
                            </TaskList>
                        )}
                    </Droppable>
                </Container>
            )}
        // </Draggable>
    // )
// }

export default Column

// La columna, como va a ser el lugar en donde se van a dropear las tareas, va a ser un Droppable

// Entonces para que funcione la zona dropeable, la tenemos que envolver con el componente <Droppable />

// Droppable tiene un prop obligatorio que es droppableId, que es un string que identifica a un droppable dentro de un DragDropContext. Osea todo elemento dropeable tiene que tener un id unico dentro de un DragDropContext, asi si tenemos multiples, ya sabemos cual es cual

// El elemento hijo de Droppable tiene que ser una funcion que retorne un componente de React, por que? Porque asi React no tiene que hacer estructuras nuevas sino que se aferra a la estructura que ya definiste en el codigo.

// provided tiene propiedades, una de ellas es droppableProps, que son las propiedades que tenes que pasarle al elemento que va a ser dropeable, en este caso, el <TaskList />
