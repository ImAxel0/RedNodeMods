import "../App.css";

const Searchbar = ({ onValueChange }) => {
  return (
    <div className="search-block">
      <form>
        <input
          onChange={(e) => onValueChange(e.target.value)}
          className="search-bar"
          type="text"
          placeholder="Mod search..."
        />
      </form>
    </div>
  );
};

export default Searchbar;
