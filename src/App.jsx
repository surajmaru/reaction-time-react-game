import { useEffect, useState } from 'react'
import './App.css'
// import "rombo-motion/dist/rombo-motion.css";


function App() {
  const [count, setCount] = useState("Click Below");
  const [showBtn, setShowBtn] = useState(false);
  const [isGreen, setIsGreen] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);

  const [times, setTimes] = useState(() => {
    const saved = localStorage.getItem("reactionTimes");
    return saved ? JSON.parse(saved) : [];
  });

  function handleClick(){
    setShowBtn(true);
    setReactionTime(null);
    setIsGreen(false);

    document.body.style.backgroundColor = "red";


    let current = 3;
    setCount(current);
    

    const interval = setInterval(() => {
      current--;

      if(current === 0){
        clearInterval(interval);
        setCount("Be Ready...");
        startReactionTimer();
      } else {
        setCount(current);
      }
    }, 1000);
  }

  function startReactionTimer(){
    const delay = Math.random() * (15000 - 3000) + 3000;

    setTimeout(() => {
      document.body.style.backgroundColor = "green";
      setIsGreen(true);
      setCount("GO!!");
      setStartTime(Date.now());
    }, delay);
  } 

  function handleReaction(){
    if(!isGreen){
      alert("Too soon!");
      return;
    }

    const clickTime = Date.now();
    const reaction = clickTime - startTime;
    console.log(reaction);

    setTimes(prev => {
    const newTimes = [...prev, reaction]
    localStorage.setItem("reactionTimes", JSON.stringify(newTimes));
    return newTimes;
    });

    setReactionTime(reaction);
    setShowBtn(false);
    setIsGreen(false);  

    {reaction > 300 ? setCount("lol, you slow") : setCount("you da real Flash⚡")}

    document.body.style.backgroundColor = "#242424";
  }

  // get top 3
  const top3 = [...times].sort((a,b) => a - b).slice(0,3);

  // clear local storage
  function clearScores(){
    localStorage.clear();
    setTimes([]);
  }

  // playable with space key too.
  useEffect(() => {
    function handleKey(e){
      if(e.code === "Space") handleReaction();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isGreen,startTime]);

  return (
    <>
    <div className='flex flex-col gap-20 items-center'>

    <h1 className='font-extrabold text-yellow-700 motion-preset-blur-left block motion-delay-[2400ms]'>Check your reaction time!</h1>

    <div className='text-4xl font-bold animate-pulse motion-preset-blur-left block motion-delay-[2600ms]'>{count}</div>

    <div className='flex flex-col items-center gap-10'>

    {!showBtn ? <button className='motion-preset-blur-left block motion-delay-[2800ms] b1 max-w-max' onClick={handleClick}>START</button>: ""}
    

    {showBtn &&
    <button className=' b1 max-w-max' onClick={handleReaction}>Click as soon as the screen turns Green!!</button>
    }

    {reactionTime && (<p className='text-xl motion-preset-blur-left block motion-delay-[3000ms]'> Your reaction time was: {reactionTime}ms</p>)}

    </div>

    </div>



    {top3.length > 0 && (
      <div className="mt-6 bg-indigo-950 border pt-10 pb-10 rounded-2xl motion-preset-blur-left block motion-delay-[3200ms]">
        <h2 className="text-xl mb-5 font-bold">🏆 Top 3 Reactions</h2>
        <ol>
          {top3.map((time, index) => (
            <li key={index}>{index + 1}: {time} ms</li>
          ))}
        </ol>
      </div>
      )}


      {times.length > 0 ? <button className="px-2 py-2 bg-red-500 text-white rounded mt-5 motion-preset-blur-left motion-delay-[3400ms]" onClick={clearScores}>Reset Scores</button> : ""}


<div className='flex justify-start mt-20'>
      <p className=''>By suraj...</p>
</div>
    </>
  )
}

export default App
