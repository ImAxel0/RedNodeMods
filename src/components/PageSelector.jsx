const PageSelector = ({ mods, setPageCallback, currPage }) => {
  let pageIndex = 0;

  const setPage = (e) => {
    setPageCallback(e.target.textContent);
  };

  return (
    <div className="page-selector">
      {mods.map(
        (mod, index) =>
          index % 8 == 0 && (
            <button
              style={{
                backgroundColor: currPage == index + 1 ? "white" : "whitesmoke",
              }}
              key={mod.id}
              onClick={(e) => setPage(e)}
            >
              {++pageIndex}
            </button>
          )
      )}
    </div>
  );
};

export default PageSelector;
