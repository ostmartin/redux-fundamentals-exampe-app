import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import TodoListItem from './TodoListItem';

const selectTodoIdsWithFilter = (statusFilter, colors) => {
  return (state) => {
    const filteredByColor = filterByColor(state.todos, colors)

    switch (statusFilter) {
      case 'all':
        return filteredByColor.map(todo => todo.id);
      case 'active': {
          const todos = filteredByColor.filter(todo => !todo.completed)

          return todos.map(todo => todo.id);
        }
      case 'completed': {
          const todos = filteredByColor.filter(todo => todo.completed)

          return todos.map(todo => todo.id);
        }
      default:
        return filteredByColor.map(todo => todo.id);
    }
  }
}

const filterByColor = (todos, colors) => {
  if (colors.length === 0) {
    return todos;
  }

  return todos.filter(todo => colors.includes(todo.color));
}

const TodoList = () => {
  const colors = useSelector(state => state.filters.colors, shallowEqual);
  const statusFilter = useSelector(state => state.filters.status, shallowEqual);
  const todoIds = useSelector(selectTodoIdsWithFilter(statusFilter, colors), shallowEqual);

  const renderedListItems = todoIds.map(id => {
    return <TodoListItem key={id} id={id}/>
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList;