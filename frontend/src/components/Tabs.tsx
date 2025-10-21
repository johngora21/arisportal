import React from 'react';

export type TabsProps = {
  items: string[];
  activeIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
};

export const Tabs: React.FC<TabsProps> = ({ items, activeIndex = 0, onChange, className }) => {
  const [current, setCurrent] = React.useState<number>(activeIndex);

  React.useEffect(() => {
    setCurrent(activeIndex);
  }, [activeIndex]);

  const handleSelect = (idx: number) => {
    setCurrent(idx);
    if (onChange) onChange(idx);
  };

  return (
    <div className={"mc-tabs" + (className ? " " + className : "")}
         role="tablist" aria-label="Tabs">
      {items.map((label, idx) => (
        <button
          key={label}
          role="tab"
          aria-selected={current === idx}
          className={current === idx ? 'mc-tab mc-tab--active' : 'mc-tab'}
          onClick={() => handleSelect(idx)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;


