export const PageHeader = ({ children }) => {
  return (
    <div className="page-header container-fluid">
      <div className="row">{children}</div>
    </div>
  );
};
