const SectionHeader = ({ title, right }: any) => {
  return (
    <div className="ui-section-header">
      <h2 className="ui-title">{title}</h2>
      {right}
    </div>
  );
};

export default SectionHeader;