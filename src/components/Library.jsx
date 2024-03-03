/* eslint-disable react/prop-types */

import LibrarySong from "./LibrarySong";

const Library = ({ songs, libraryStatus, songSelectHandler }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
  };

  return (
    <div className={`library ${libraryStatus ? "active-library" : " "}`}>
      <h2>Library</h2>
      <div className="library-songs">
        {songs.map((song) => (
          <div
            key={song.id}
            id={song.id}
            draggable="true"
            onDragStart={handleDragStart}
            style={{
              color: "white",
              cursor: "grab",
            }}
          >
            <LibrarySong
              cover={song.cover}
              name={song.name}
              artist={song.artist}
              active={song.active}
              id={song.id}
              songSelectHandler={songSelectHandler}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
