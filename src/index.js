import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import '@atlaskit/css-reset'

import { DragDropContext } from 'react-beautiful-dnd'

import initialData from './initial-data'
import Column from './Column'

const Container = styled.div`
    display: flex;
`

function App() {
    const [state, setState] = useState(initialData)

    // Esta funcion es la que maneja toda la logica que pasa cuando un evento pasa en el DragDropContext
    function handleDragEnd(result) {
        const { destination, source, draggableId } = result
        // console.log('destino', destination, 'origen', source, 'elemento a insertar', draggableId)

        // Si no hay destino, entonces no hacemos nada
        if (!destination) {
            return
        }

        // Si la modificacion paso en la misma lista pero tambien esta en el mismo indice, no hacemos nada
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return
        }

        // Si la lista cambia de orden
        if (destination.droppableId === source.droppableId) {
            modifySameColumn({
                destination,
                source,
                draggableId,
                state,
                setState,
            })
        }

        // Si movemos elementos de una lista a otra
        if (destination.droppableId !== source.droppableId) {
            modifyTwoColumns({ destination, source, state, setState })
        }
    }

    // Column order va a ser el orden en como se van a mostrar las columnas
    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Container>
                {state.columnOrder.map((columnId, index) => {
                    const column = state.columns[columnId] // columnId es como se llama la columna, como es un objeto, por eso lo accedemos asi. Tomar en cuenta de que NO es un iterador numerico

                    // Para cada columna, vamos a iterar las tareas que tiene, en el orden que estan
                    const tasks = column.taskIds.map(
                        (taskId) => state.tasks[taskId]
                    )

                    // React va a necesitar una key para cada columna, para saber cual es cual
                    // column seria la informacion de la columna
                    // serian las tareas que tiene la columna
                    return (
                        <Column
                            key={column.id}
                            column={column}
                            tasks={tasks}
                            index={index}
                        />
                    )
                })}
            </Container>
        </DragDropContext>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))

function modifySameColumn({
    destination,
    source,
    draggableId,
    state,
    setState,
}) {
    // Consigo la columna que esta 'sufriendo' las modificaciones
    const columnModified = state.columns[source.droppableId]

    // copio su array de tareas, asi no muto el original
    const newTaskIdsArr = Array.from(columnModified.taskIds)

    // Ya que lo tengo, entonces tengo que modificar 2 posiciones:
    // 1. El origen
    // 2. El destino

    // console.log('array antes:', newTaskIdsArr)
    newTaskIdsArr.splice(source.index, 1) // eliminar el index que se esta moviendo
    // console.log('array durante:', newTaskIdsArr)
    newTaskIdsArr.splice(destination.index, 0, draggableId) // reemplazarlo en el index que se esta moviendo
    // console.log('array despues:', newTaskIdsArr, 'draggableId: ', draggableId)

    // Bueno ya que movimos de lugar el objeto, lo que sigue es crear una nueva columna con las modificaciones
    const newColumn = {
        ...columnModified, // le copiamos todas las modificaciones y lo que ya tenia antes
        taskIds: newTaskIdsArr, // le actualizamos el orden de las tareas, que fue lo que hicimos hace rato
    }

    // Ahora que ya tenemos la columna nueva, con las modificaciones adecuadas
    // Pasamos a modificar el estado para que se mire reflejado
    const newState = {
        ...state, // Siempre conservar la informacion pasada
        columns: {
            ...state.columns, // conservamos el orden de las otras columnas
            [newColumn.id]: newColumn, // y agregamos lo nuevo
        },
    }

    setState(newState) //actualizamos el estado para que el usuario pueda ver la modificacion
}

function modifyTwoColumns({ destination, source, state, setState }) {
    // console.log('Estado anterior: ', state)

    // console.log('Esta condicion sucede porque ahora me estoy moviendo entre columnas')

    const sourceColumn = state.columns[source.droppableId]
    const destinationColumn = state.columns[destination.droppableId]

    // console.log(sourceColumn, destinationColumn)

    // Voy a crear una nueva lista para poder modificar la columna del origen

    const editArraySourceColumn = Array.from(sourceColumn.taskIds)
    const elementToInsert = editArraySourceColumn.splice(source.index, 1)[0]

    const editArrayDestinationColumn = Array.from(destinationColumn.taskIds)
    editArrayDestinationColumn.splice(destination.index, 0, elementToInsert)

    // Ya que hice toda la gestion, ahora ocupo copiar las modificaciones y actualizar el estado

    const newSourceColumn = {
        ...sourceColumn,
        taskIds: editArraySourceColumn,
    }

    const newDestinationColumn = {
        ...destinationColumn,
        taskIds: editArrayDestinationColumn,
    }

    // console.log('Nuevas estructuras:', newSourceColumn, newDestinationColumn)

    const newState = {
        ...state,
        columns: {
            ...state.columns,
            [newSourceColumn.id]: newSourceColumn,
            [newDestinationColumn.id]: newDestinationColumn,
        },
    }

    // console.log('Nuevo estado:', newState)

    setState(newState)
}

// Bueno ahora si vamos con la parte de react-beautiful-dnd
// ahorita vamos a hacer que el orden de las tareas sea dinamico, es decir, que se pueda cambiar el orden de las tareas

// react-beautiful-dnd se compone en  3 partes:

// 1. <DragDropContext /> es el componente que envuelve todo lo que va a tener funciona de drag and drop. Aqui van a estar los Droppables y los Dragables
// Este componente tiene 3 callbacks
// onDragStart: se llama cuando se empieza a arrastrar un elemento
// onDragUpdate: se llama cuando se esta arrastrando un elemento, osea cuando esta pasando en vivo
// onDragEnd: se llama cuando se suelta un elemento arrastrado. (obligatorio en todo caso)

// Es toda tu responsabilidad el manejo de la informacion con react-beatiful-dnd, todo lo que querras hacer lo tenes que definir en la funcion onDragEnd. Todo comportamiento deseado tiene que ser dicho explicitamente en esta funcion

// 2. <Droppable /> es el componente que permite que un elemento dragable se pueda soltar en el
// ocupa que su hijo sea una funcion que devuelva un componente de React. provided es un objeto que trae propiedades para darle funcionalidades de dropeo al componente
// se ocupa ponerle:
// {...provided.droppableProps} // Le estamos dando la habilidad de que se pueda dropear
// ref={provided.innerRef} // innerRef sirve para que se pueda llevar un control, es como el key
// {provided.placeholder} // Esto se ocupa para que halla un pequeño espacio para que se puedan dropear draggables, aumenta el tamaño, tiene que ser obligatoriamente un hijo del elemento que estas convirtiendo en un Droppable

// 3. <Dragable /> es el componente que permite que un elemento se pueda arrastrar hacia un droppable
// Igual que el droppable, ocupa que su hijo sea una funcion que devuelva un componente de React. provided es un objeto que trae propiedades para darle funcionalidades de arrastre al componente
// se ocupa ponerle:
// {...provided.draggableProps} // Le estamos dando la habilidad de que se pueda arrastrar
// {...provided.dragHandleProps} // Le estamos dando la habilidad de que se pueda arrastrar desde cualquier parte del componente
// ref={provided.innerRef} // innerRef sirve para que se pueda llevar un control, es como el key
// draggableId // es un string que identifica a un dragable dentro de un DragDropContext. Osea todo elemento dragable tiene que tener un id unico dentro de un DragDropContext, asi si tenemos multiples, ya sabemos cual es cual
// index // es un numero que identifica el orden en el que se va a mostrar el elemento dragable
