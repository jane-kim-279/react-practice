import './App.css';
import Header from './component/Header';
import TodoEditor from './component/TodoEditor';
import TodoList from './component/TodoList';
import TestComp from './component/TestComp';
import React, { useReducer, useRef, useCallback, useMemo } from 'react';

export const TodoStateContext = React.createContext();
export const TodoDispatchContext = React.createContext();

const mockTodo = [
    {
        id: 0,
        isDone: false,
        content: 'React 공부하기',
        createdDate: new Date().getTime(),
    },
    {
        id: 1,
        isDone: false,
        content: '빨래 널기',
        createdDate: new Date().getTime(),
    },
    {
        id: 2,
        isDone: false,
        content: '식당 예약하기',
        createdDate: new Date().getTime(),
    },
];

function todoReducer(state, action) {
    switch (action.type) {
        case 'CREATE': {
            return [action.newItem, ...state];
        }
        case 'UPDATE': {
            return state.map((it) =>
                it.id === action.targetId ? { ...it, isDone: !it.isDone } : it,
            );
        }
        case 'DELETE': {
            return state.filter((it) => it.id !== action.targetId);
        }
        default:
            return state;
    }
}

function App() {
    const idRef = useRef(3);
    // const [todo, setTodo] = useState(mockTodo);
    const [todo, todoDispatch] = useReducer(todoReducer, mockTodo);
    const onCreate = (content) => {
        todoDispatch({
            type: 'CREATE',
            newItem: {
                id: idRef.current,
                content,
                isDone: false,
                createdDate: new Date().getTime(),
            },
        });
        // const newItem = {
        //     id: idRef.current,
        //     content,
        //     isDone: false,
        //     createdDate: new Date().getTime(),
        // };
        // setTodo([newItem, ...todo]);
        idRef.current += 1;
    };

    const onUpdate = (targetId) => {
        todoDispatch({
            type: 'UPDATE',
            targetId,
        });
        // setTodo(
        //     todo.map((it) =>
        //         it.id === targetId ? { ...it, isDone: !it.isDone } : it,
        //     ),
        // );
    };

    const onDelete = (targetId) => {
        todoDispatch({
            type: 'DELETE',
            targetId,
        });
        // setTodo(todo.filter((it) => it.id !== targetId)); // 체크하지 않은 아이템만 return
    };
    const memoizedDispatches = useMemo(() => {
        return { onCreate, onUpdate, onDelete };
    }, []);
    return (
        <div className="App">
            <TestComp />
            <Header />
            <TodoStateContext.Provider value={{ todo }}>
                <TodoDispatchContext.Provider value={memoizedDispatches}>
                    <TodoEditor />
                    <TodoList />
                </TodoDispatchContext.Provider>
            </TodoStateContext.Provider>
        </div>
    );
}

export default App;
