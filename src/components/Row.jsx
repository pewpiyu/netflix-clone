import React, { useState, useEffect } from "react";
// import {Img} from "react-optimized-image";
import cx from 'classnames'
import axios from "../axios"; // alias of instance method in axios component

import styles from "./Row.module.css";
import YouTube from "react-youtube";

const baseImgUrl = "https://image.tmdb.org/t/p/original";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]); // run only once when row loads and dont run again

  const opts = {  // options for react youtube
    width:"100%",
    height:"480px",
    playerVars:{
      autoplay:1,

    }
  };
  const handleClick = async (movie) =>{
    if(trailerUrl){
      setTrailerUrl("");
    }
    else{
      let trailerurl = await axios.get(
        `/movie/${movie.id}/videos?api_key=cac8d346ed40c467f5e2e366e615d061`
      );
      setTrailerUrl(trailerurl.data.results[0]?.key);
    
    }
  }

  return (
    <div className="row">
      {/* title */}
      <h2>{title}</h2>
      <div className={styles.row__posters}>
        {movies.map(
          (
            movie // use this '()' if you want to return jsx in your code
          ) => (
            <img
              onClick={() => handleClick(movie)}
              key={movie.id}
              src={
                baseImgUrl +
                (isLargeRow ? movie.poster_path :  movie.backdrop_path )
              }
              alt={movie.name}
              className={cx(styles.row__poster, (isLargeRow && styles.row__posterLarge))}
            />
          )
        )}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
