import { FunctionComponent } from 'react';

type SubmitMoveButtonProps = {
  canSubmit: boolean,
  submitButtonHandler: Function,
};

const SubmitMoveButton: FunctionComponent<SubmitMoveButtonProps> = ({
  canSubmit,
  submitButtonHandler,
}: SubmitMoveButtonProps) => {
  return (
    <div className={"Submit-button-wrapper"}>
      <div
        className={"Submit-button"}
        hidden={!canSubmit}
        onClick={() => {submitButtonHandler()}} />
    </div>
  );
}

export default SubmitMoveButton;
