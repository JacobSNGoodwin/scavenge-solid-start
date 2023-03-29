import { Component, createSignal, Show } from 'solid-js';
import ClearIcon from '~icons/mdi/clear-circle';
import EditIcon from '~icons/material-symbols/edit-square-rounded';
import CheckIcon from '~icons/material-symbols/check-circle';
import { CheckBuilder } from 'drizzle-orm/sqlite-core';

type EditableTitleProps = {
  title: string;
  onSave: (newTitle: string) => void;
};

const EditableTitle: Component<EditableTitleProps> = (props) => {
  let titleInput: HTMLInputElement | undefined;
  const [isEditing, setIsEditing] = createSignal(false);
  const [error, setError] = createSignal('');

  const handleSaveTitle = () => {
    console.log('the titleInput value', titleInput?.value);
    if (!titleInput?.value.length) {
      setError('Please include a title');
      return;
    }

    props.onSave(titleInput?.value);
    setIsEditing(false);
  };

  return (
    <Show
      when={isEditing()}
      fallback={
        <div class="my-4 flex justify-center items-center">
          <h1 class="mx-2 text-4xl text-sky-700 font-thin uppercase">
            {props.title}
          </h1>
          <button class="mx-2" onClick={[setIsEditing, true]}>
            <EditIcon class="text-2xl text-gray-600 hover:text-gray-400" />
          </button>
        </div>
      }
    >
      <>
        <div class="my-4 flex justify-between items-center ">
          <div class="flex-1 w-full">
            <input
              ref={titleInput}
              class="focus:outline-none text-3xl text-gray-700 font-thin border-b-sky-700 border-b-2 p-2 w-full"
              value={props.title}
            />
          </div>
          <div class="ml-2">
            <button class="mx-2" onClick={[setIsEditing, false]}>
              <ClearIcon class="text-2xl text-red-700 hover:text-red-500" />
            </button>
            <button class="mx-2" onClick={() => handleSaveTitle()}>
              <CheckIcon class="text-2xl text-sky-700 hover:text-sky-500" />
            </button>
          </div>
        </div>
        <p class="text-red-600">{error()}</p>
      </>
    </Show>
  );
};

export default EditableTitle;
