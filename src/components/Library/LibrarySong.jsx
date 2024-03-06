/* eslint-disable react/prop-types */

const LibrarySong = ({
  name,
  artist,
  cover,
  id,
  active,
  songSelectHandler,
}) => {
  return (
    <div
      onClick={() => songSelectHandler(id)}
      className={`library-song ${active ? "selected" : ""}`}
    >
      <img src={cover} alt="" id={id} />
      <div className="song-description">
        <h3>{name}</h3>
        <h4>{artist}</h4>
      </div>
    </div>
  );
};

export default LibrarySong;
