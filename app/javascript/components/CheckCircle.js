export const CheckCircle = ({ id, checked, onChange }) => {
  let className = 'bi';
  if (checked) {
    className += ' bi-check-circle-fill';
  } else {
    className += ' bi-circle';
  }
  return (
    <>
      <input type="checkbox" className="btn-check" id={id} checked={checked} onChange={onChange} />
      <label className="btn" htmlFor={id}>
        <i className={className}></i>
      </label>
    </>
  );
};
