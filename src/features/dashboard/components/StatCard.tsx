interface StatCardProps {
  color: string;
  icon: string;
  value: number;
  label: string;
}

const StatCard = ({ color, icon, value, label }: StatCardProps) => {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color }}>
        <i className={icon}></i>
      </div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
