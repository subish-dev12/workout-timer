import { useState, memo, useEffect, useCallback } from "react";
import clickSound from "./ClickSound.m4a";

function Calculator({ workouts, allowSound }) {
  const [number, setNumber] = useState(workouts.at(0).numExercises);
  const [sets, setSets] = useState(3);
  const [speed, setSpeed] = useState(90);
  const [durationBreak, setDurationBreak] = useState(5);
  const [duration, setDuration] = useState(0);

  // const duration = (number * sets * speed) / 60 + (sets - 1) * durationBreak;

  const playSound = useCallback(
    function () {
      if (!allowSound) return; //since allowSound is a reactive value it must be included inside the dependency array
      const sound = new Audio(clickSound);
      sound.play();
    },
    [allowSound]
  );
  //playsound function gets recreated everytime the dependecy (allowsound) changes.
  //so when you toggle the speaker icon the playsound function is recreated and the sound is played that's one problem
  //also another problem is that when you increase/decrease the duration and when you toggle the speaker icon the duration gets back to what it was before inc/decrease. try yourself.
  useEffect(
    function () {
      setDuration((number * sets * speed) / 60 + (sets - 1) * durationBreak);
      playSound();
    },
    [number, sets, speed, durationBreak, playSound]
  );

  function handleInc() {
    setDuration((duration) => Math.floor(duration) + 1); //rounding down
    playSound();
  }

  function handleDec() {
    setDuration((duration) => (duration > 1 ? Math.ceil(duration) - 1 : 0)); //rounding up
    playSound();
  }
  const mins = Math.floor(duration);
  const seconds = (duration - mins) * 60;
  return (
    <>
      <form>
        <div>
          <label>Type of workout</label>
          <select value={number} onChange={(e) => setNumber(+e.target.value)}>
            {workouts.map((workout) => (
              <option value={workout.numExercises} key={workout.name}>
                {workout.name} ({workout.numExercises} exercises)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>How many sets?</label>
          <input
            type="range"
            min="1"
            max="5"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            // setDuration(
            //   (number * sets * speed) / 60 + (sets - 1) * durationBrea
            //if we dont use useEffect then we have to use setter function in all input elements.
          />
          <span>{sets}</span>
        </div>
        <div>
          <label>How fast are you?</label>
          <input
            type="range"
            min="30"
            max="180"
            step="30"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          />
          <span>{speed} sec/exercise</span>
        </div>
        <div>
          <label>Break length</label>
          <input
            type="range"
            min="1"
            max="10"
            value={durationBreak}
            onChange={(e) => setDurationBreak(e.target.value)}
          />
          <span>{durationBreak} minutes/break</span>
        </div>
      </form>
      <section>
        <button onClick={handleDec}>–</button>
        <p>
          {mins < 10 && "0"}
          {mins}:{seconds < 10 && "0"}
          {seconds}
        </p>
        <button onClick={handleInc}>+</button>
      </section>
    </>
  );
}

export default memo(Calculator); // memoized component to prevent unnecessary re-renders
