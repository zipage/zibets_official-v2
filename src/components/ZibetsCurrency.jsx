const ZibetsCurrency = ({ amount }) => {
  const formatted = parseFloat(amount).toFixed(2);
  return (
    <span>
      𝓏{formatted}
    </span>
  );
};

export default ZibetsCurrency;
