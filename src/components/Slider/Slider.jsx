import './Slider.css';

const Slider = ({ min = 0, max = 100, value, onChange, ...props }) => {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <input
      type="range"
      className="slider"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      style={{
        '--slider-progress': `${progress}%`
      }}
      {...props}
    />
  );
};

export default Slider;
