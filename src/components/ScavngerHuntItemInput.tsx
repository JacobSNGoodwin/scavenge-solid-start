import { Component, createSignal } from 'solid-js';

type ScavengerHuntItemInputProps = {
  onSubmit: (title: string, value: number) => void;
  disabled: boolean;
};

const ScavengerHuntItemInput: Component<ScavengerHuntItemInputProps> = ({
  onSubmit,
  disabled,
}) => {
  let titleInput: HTMLInputElement | undefined;
  let weightInput: HTMLInputElement | undefined;

  const [error, setError] = createSignal('');

  const handleSubmit = () => {
    if (!titleInput?.value.length) {
      setError('Please include a title');
      return;
    }

    if (!weightInput?.value.length) {
      setError('Please include a weight');
      return;
    }

    const weightInputParsed = parseFloat(weightInput?.value ?? '');
    const isInvalidType =
      !Number.isInteger(weightInputParsed) || isNaN(weightInputParsed);
    const isInvalidValue = weightInputParsed < 1 || weightInputParsed > 5;

    if (isInvalidType || isInvalidValue) {
      setError('Weight must be integer from 1 to 5');
      return;
    }

    onSubmit(titleInput.value, weightInputParsed);
    titleInput.value = '';
    weightInput.value = '';
    titleInput.focus();
    setError('');
  };

  return (
    <div class="my-12">
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
        <input
          ref={weightInput}
          disabled={disabled}
          type="number"
          step="1"
          min="1"
          max="5"
          class="h-10 focus:outline-none flex-grow text-lg px-2 border-b-2 border-sky-700"
          placeholder="1 to 5"
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
    </div>
  );
};

export default ScavengerHuntItemInput;
