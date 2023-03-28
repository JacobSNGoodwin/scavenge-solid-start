import { Component, createEffect, Show } from 'solid-js';

type ConfirmationModalProps = {
  isOpen: boolean;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmationModal: Component<ConfirmationModalProps> = (props) => {
  return (
    <Show when={props.isOpen}>
      <div class="z-50 fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
        <div class="absolute bg-white p-4 rounded-xl drop-shadow-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96">
          <div class="text-center font-semibold mb-6">{props.message}</div>
          <div class="flex justify-around my-2">
            <button
              class="w-full mx-1 bg-gray-100 hover:bg-opacity-70 rounded-lg"
              onClick={props.onCancel}
            >
              Cancel
            </button>
            <button
              class="p-2 w-full mx-1 bg-red-700 hover:bg-red-600 text-white rounded-lg"
              onClick={props.onConfirm}
            >
              {props.confirmText ?? 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default ConfirmationModal;
