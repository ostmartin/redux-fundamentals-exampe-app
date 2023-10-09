import { createSelector, createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import {client} from '../../api/client';
import { StatusFilters } from '../filters/filtersSlice';

const todosAdapter = createEntityAdapter()

const initialState = todosAdapter.getInitialState({
  status: 'idle'
})

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await client.get('/fakeApi/todos');
  return response.todos;
})

export const saveNewTodo = createAsyncThunk('todos/saveNewTodo', async text => {
  const initialTodo = { text }
  const response = await client.post('/fakeApi/todos', { todo: initialTodo })
  return response.todo
})

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded(state, action){
      const todo = action.payload;
      state.entities[todo.id] = todo;
    },
    todoToggled(state, action) {
      const todoId = action.payload;
      const todo = state.entities[todoId];
      todo.completed = !todo.completed;
    },
    todoColorSelected: {
      reducer(state, action) {
        const {color, todoId} = action.payload;
        const todo = state.entities[todoId];
        todo.color = color;
      },
      prepare(todoId, color) {
        return {
          payload: { todoId, color }
        }
      }
    },
    todoDeleted: todosAdapter.removeOne,
    todosAllCompleted(state, action) {
      Object.values(state.entities).forEach(todo => {
        todo.completed = true;
      })
    },
    todosClearCompleted(state, action) {
      const completedIds = Object.values(state.entities)
        .filter(todo => todo.completed)
        .map(todo => todo.id)
      todosAdapter.removeMany(state, completedIds)
    },
    todosLoading(state, action) {
      state.status = 'loading';
    },
    todosLoaded(state, action) {
      const newEntities = {};
      action.payload.forEach(todo => {
        newEntities[todo.id] = todo;
      })
      state.entities = newEntities;
      state.status = 'idle';
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        todosAdapter.setAll(state, action.payload)
        state.status = 'idle'
      })
      .addCase(saveNewTodo.fulfilled, todosAdapter.addOne)
  }
})

export const { selectAll: selectTodos, selectById: selectTodoById } =
  todosAdapter.getSelectors(state => state.todos)

export const selectFilteredTodos = createSelector(
    selectTodos,
    state => state.filters,
    (todos, filters) => {
        const { status, colors } = filters;
        const showAllCompletions = status === StatusFilters.All;
        
        if (showAllCompletions && colors.length === 0) {
            return todos;
        }
    
        const completedStatus = status === StatusFilters.Completed;
    
        return todos.filter(todo => {
            const statusMatches = showAllCompletions || todo.completed === completedStatus;
            const colorMatches = colors.length === 0 || colors.includes(todo.color);
            return statusMatches && colorMatches;
          })
    }
)
  
export const selectFilteredTodoIds = createSelector(
    selectFilteredTodos,
    filteredTodos => filteredTodos.map(todo => todo.id)
)

export const {
  todosAllCompleted,
  todosClearCompleted,
  todoAdded,
  todoColorSelected,
  todoDeleted,
  todoToggled,
  todosLoaded,
  todosLoading,
} = todosSlice.actions;

export default todosSlice.reducer;