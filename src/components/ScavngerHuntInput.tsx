import { Component, createSignal } from 'solid-js';

type ScavengerHuntInputProps = {
  onSubmit: (title: string) => void;
  disabled: boolean;
};

const ScavengerHuntInput: Component<ScavengerHuntInputProps> = ({
  onSubmit,
  disabled,
}) => {
  let titleInput: HTMLInputElement | undefined;
  const [error, setError] = createSignal('');

  const handleSubmit = () => {
    if (!titleInput?.value.length) {
      setError('Please include a title');
      return;
    }

    onSubmit(titleInput?.value);
    titleInput.value = '';
  };

  // TODO - add error and red text
  return (
    <>
      <div class="flex justify-between items-end mx-auto my-4 max-w-md">
        <input
          ref={titleInput}
          disabled={disabled}
          type="text"
          class="h-10 focus:outline-none flex-grow text-lg px-2 border-b-2 border-sky-700"
          placeholder="New Title"
          onKeyDown={({ key, currentTarget }) => {
            if (key === 'Enter') {
              handleSubmit();
            }
          }}
        >
          <span></span>
        </input>
        <button
          class="h-10 ml-2 bg-sky-500 hover:bg-sky-700 text-white rounded-md px-4 py-2"
          disabled={disabled}
          onClick={() => handleSubmit()}
        >
          Add
        </button>
      </div>
      <p class="text-red-600 text-center">{error()}</p>
    </>
  );
};

export default ScavengerHuntInput;
