import { useAppSelector } from "./store/hooks";

const DoublingCube = () => {
  const [doublingCubeData] = useAppSelector((state) => [state.doublingCube]);

  if (!doublingCubeData.enabled) {
    return null;
  }

  return (
    <div className={"Doubling-cube"}>
      <div className={"Doubling-cube-value-wrapper"}>
        {doublingCubeData.gameStakes}
      </div>
    </div>
  );
};

export default DoublingCube;
