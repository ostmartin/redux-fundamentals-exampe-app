import {client} from '../../api/client';

const initialState =  [];

export default function todosReducer(state = initialState, action) {
    switch (action.type) {
        case 'todos/todoAdded':
            return [...state, action.payload]
        case 'todos/todoToggled':
            return state.map(todo => {
                        if (todo.id !== action.payload) {
                            return todo;
                        }

                        return {
                            ...todo,
                            completed: !todo.completed
                        };
                    });
        case 'todos/colorSelected':
            const {color, todoId} = action.payload
            return state.map(todo => {
                    if (todo.id === todoId) {
                        return {
                            ...todo,
                            color
                        }
                    }

                    return todo;
                })
        case 'todos/todoDeleted':
            return state.filter(todo => todo.id !== action.payload);
        case 'todos/allCompleted':
            return state.map(todo => {
                return {
                    ...todo,
                    completed: true
                }
            });
        case 'todos/completedCleared':
            return state.map(todo => {
                return {
                    ...todo,
                    completed: false
                }
            });
        case 'todos/todosLoaded':
            return action.payload;
        default:
            return state;
    }
}

export async function fetchTodos(dispatch, getState) {
    const response = await client.get('/fakeApi/todos')
    dispatch({type: 'todos/todosLoaded', payload: response.todos})
}

export function saveNewTodo(text) {
    // And then creates and returns the async thunk function:
    return async function saveNewTodoThunk(dispatch, getState) {
      // ✅ Now we can use the text value and send it to the server
      const initialTodo = { text }
      const response = await client.post('/fakeApi/todos', { todo: initialTodo })
      dispatch({ type: 'todos/todoAdded', payload: response.todo })
    }
}