export const SectionHeader = ({ title, children }) => {
  return (
    <div className="section-header d-flex justify-content-between container-fluid">
      <h6 className="display-6">{title}</h6>
      {children}
    </div>
  );
};
