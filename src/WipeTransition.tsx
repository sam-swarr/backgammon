import cx from "classnames";

import { useAppDispatch, useAppSelector } from "./store/hooks";
import { useEffect } from "react";
import { setWipeTransition } from "./store/wipeTransitionSlice";

const WipeTransition = () => {
  const dispatch = useAppDispatch();
  const [wipeTransition] = useAppSelector((state) => [state.wipeTransition]);

  useEffect(() => {
    if (wipeTransition) {
      setTimeout(() => {
        dispatch(setWipeTransition(false));
      }, 200);
    }
  }, [dispatch, wipeTransition]);

  return (
    <div>
      <div className={cx({ "Wipe-transition": wipeTransition })} />
      <div className={cx({ "Wipe-fade": wipeTransition })} />
    </div>
  );
};

export default WipeTransition;
