'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import classNames from 'classnames';
import {
  Button,
  AppBar,
  Toolbar,
  CssBaseline,
  TextField,
  Chip,
  Box,
  Drawer,
  MenuList,
} from '@mui/material';
import { FaBars, FaCheck, FaEllipsisH } from 'react-icons/fa';
import RootTheme from './theme';
import dateToStr from './dateUtil';

function useTodosState() {
  const [todos, setTodos] = React.useState([]);
  const lastTodoIdRef = React.useRef(0);

  const addTodo = (newContent) => {
    const id = ++lastTodoIdRef.current;

    const newTodo = {
      id,
      content: newContent,
      regDate: dateToStr(new Date()),
    };
    setTodos((todos) => [newTodo, ...todos]);
  };

  const removeTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id != id);
    setTodos(newTodos);
  };

  const modifyTodo = (id, content) => {
    const newTodos = todos.map((todo) => (todo.id != id ? todo : { ...todo, content }));
    setTodos(newTodos);
  };

  return {
    todos,
    addTodo,
    removeTodo,
    modifyTodo,
  };
}

const NewTodoForm = ({ todosState }) => {
  const onSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    form.content.value = form.content.value.trim();

    if (form.content.value.length == 0) {
      alert('할 일 써');
      form.content.focus();
      return;
    }

    todosState.addTodo(form.content.value);
    form.content.value = '';
    form.content.focus();
  };

  return (
    <>
      <form onSubmit={(e) => onSubmit(e)}>
        <TextField
          minRows={3}
          maxRows={10}
          multiline
          name="content"
          autoComplete="off"
          label="할 일 써"
        />
        <Button variant="contained" className="tw-font-bold" type="submit">
          추가
        </Button>
      </form>
    </>
  );
};

const TodoListItem = ({ todo, index }) => {
  const [checked, setChecked] = React.useState(false);

  const handleCheck = () => {
    setChecked(!checked);
  };

  return (
    <>
      <li key={todo.id}>
        <div className="tw-flex tw-flex-col tw-gap-2 tw-mt-3">
          <div className="tw-flex tw-gap-x-2 tw-font-bold">
            <Chip className="tw-pt-[3px]" label={`번호 : ${todo.id}`} variant="outlined" />
            <Chip
              className="tw-pt-[3px]"
              label={`날짜 : ${todo.regDate}`}
              variant="outlined"
              color="primary"
            />
          </div>
          <div className="tw-rounded-[10px] tw-shadow tw-flex tw-text-[14px] tw-min-h-[80px]">
            <Button
              className="tw-flex-shrink-0 tw-rounded-[10px_0_0_10px]"
              color="inherit"
              onClick={handleCheck}>
              <FaCheck
                className={classNames(
                  'tw-text-3xl',
                  {
                    'tw-text-[--mui-color-primary-main]': checked,
                  },
                  { 'tw-text-[#dcdcdc]': !checked },
                )}
              />
            </Button>
            <div className="tw-bg-[#dcdcdc] tw-w-[2px] tw-h-[60px] tw-self-center"></div>
            <div
              className={`tw-bg-blue-300 tw-flex tw-items-center tw-p-3 tw-flex-grow hover:tw-text-[--mui-color-primary-main] tw-whitespace-pre-wrap tw-leading-relaxed tw-break-words ${checked && 'tw-line-through'}`}>
              {todo.content}
            </div>
          </div>
        </div>
      </li>
    </>
  );
};

const TodoList = ({ todosState }) => {
  return (
    <>
      <Drawer anchor="{bottom}" open={false} onClose={() => {}}>
        <div className="tw-p-[30px] tw-flex tw-gap-x-[5px]">
          <div>수정</div>
          <div>삭제</div>
        </div>
      </Drawer>
      할 일 갯수 : {todosState.todos.length}
      <nav>
        <ul>
          {todosState.todos.map((todo, index) => (
            <TodoListItem key={todo.id} todo={todo} index={index} />
          ))}
        </ul>
      </nav>
    </>
  );
};

function App() {
  const todosState = useTodosState(); // 리액트 커스텀 훅

  React.useEffect(() => {
    todosState.addTodo('스쿼트\n런지');
    todosState.addTodo('벤치');
    todosState.addTodo('데드');
  }, []);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <div className="tw-flex-1">
            <FaBars onClick={() => setOpen(true)} className="tw-cursor-pointer" />
          </div>
          <div className="logo-box">
            <a href="/" className="tw-font-bold">
              TODO!
            </a>
          </div>
          <div className="tw-flex-1 tw-flex tw-justify-end">
            <a href="/write">글쓰기</a>
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <NewTodoForm todosState={todosState} />
      <TodoList todosState={todosState} />
    </>
  );
}

export default function themeApp() {
  const theme = RootTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}
