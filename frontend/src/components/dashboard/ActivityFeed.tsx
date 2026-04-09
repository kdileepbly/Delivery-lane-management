import type { Activity } from "../../types";

export function ActivityFeed({ activities }: { activities: Activity[] }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Activity</p>
          <h3>Recent collaboration trail</h3>
        </div>
      </div>
      <div className="activity-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-dot" />
            <div>
              <p>
                <strong>{activity.actor_name}</strong> {activity.verb} <strong>{activity.target}</strong>
              </p>
              <span>{new Date(activity.created_at).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
